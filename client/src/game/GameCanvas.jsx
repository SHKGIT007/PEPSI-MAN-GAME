import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PlayerCharacter } from './PlayerCharacter';
import { VillageStage } from './VillageStage';
import { CityStage } from './CityStage';
import { Obstacles } from './Obstacles';
import { Collectibles } from './Collectibles';
import { SkyboxAndLighting } from './SkyboxAndLighting';
import { soundManager } from './SoundEngine';
import * as THREE from 'three';

function GameLoop({
  stage,
  isPaused,
  isGameOver,
  onUpdateStats,
  onGameOver,
  lane,
  setLane,
  isJumping,
  setIsJumping,
  jumpProgress,
  setJumpProgress,
  isSliding,
  setIsSliding,
  isShielded,
  setIsShielded
}) {
  const [speed, setSpeed] = useState(14); // Base running speed
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [cansCount, setCansCount] = useState(0);
  const [combo, setCombo] = useState(1);

  // Track & Obstacle lists
  const [obstacles, setObstacles] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [trackZ, setTrackZ] = useState(0);

  const shieldTimerRef = useRef(0);
  const nextSpawnZ = useRef(-30);
  const nextCanZ = useRef(-15);
  const obstacleIdCounter = useRef(1);

  // Lane movement helper
  const handleMoveLeft = useCallback(() => {
    if (isPaused || isGameOver) return;
    setLane((prev) => Math.max(-1, prev - 1));
  }, [isPaused, isGameOver, setLane]);

  const handleMoveRight = useCallback(() => {
    if (isPaused || isGameOver) return;
    setLane((prev) => Math.min(1, prev + 1));
  }, [isPaused, isGameOver, setLane]);

  const handleJump = useCallback(() => {
    if (isPaused || isGameOver || isJumping) return;
    setIsJumping(true);
    setJumpProgress(0);
    soundManager.playJump();
  }, [isPaused, isGameOver, isJumping, setIsJumping, setJumpProgress]);

  const handleSlide = useCallback(() => {
    if (isPaused || isGameOver || isSliding) return;
    setIsSliding(true);
    soundManager.playSlide();
    setTimeout(() => {
      setIsSliding(false);
    }, 800);
  }, [isPaused, isGameOver, isSliding, setIsSliding]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleMoveLeft();
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleMoveRight();
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') handleJump();
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') handleSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMoveLeft, handleMoveRight, handleJump, handleSlide]);

  // Main 60FPS Frame Update
  useFrame((state, delta) => {
    if (isPaused || isGameOver) return;

    // Incremental speed over distance
    const currentSpeed = speed + Math.min(15, distance * 0.005);
    const stepZ = currentSpeed * delta;

    // 1. Distance & Score accumulation
    const newDistance = distance + stepZ * 0.5;
    const newScore = score + Math.floor(stepZ * 2 * combo);
    setDistance(newDistance);
    setScore(newScore);

    onUpdateStats({ distance: Math.floor(newDistance), score: newScore, cans: cansCount, speed: Math.floor(currentSpeed), combo });

    // 2. Jump Arc Update
    if (isJumping) {
      setJumpProgress((prev) => {
        const next = prev + delta * 2.8; // ~0.35s jump duration
        if (next >= 1) {
          setIsJumping(false);
          return 0;
        }
        return next;
      });
    }

    // 3. Shield Timer
    if (isShielded) {
      shieldTimerRef.current -= delta;
      if (shieldTimerRef.current <= 0) {
        setIsShielded(false);
      }
    }

    // 4. Move endless track & items towards camera (+Z direction)
    setTrackZ((prev) => (prev + stepZ) % 100);

    setObstacles((prevObs) =>
      prevObs
        .map((obs) => ({ ...obs, z: obs.z + stepZ }))
        .filter((obs) => obs.z < 10) // Remove passed obstacles
    );

    setCollectibles((prevItems) =>
      prevItems
        .map((item) => ({ ...item, z: item.z + stepZ }))
        .filter((item) => item.z < 10)
    );

    // 5. Spawn new Obstacles dynamically ahead of runner
    if (nextSpawnZ.current > -180) {
      nextSpawnZ.current -= 25 + Math.random() * 20;
      const spawnLane = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1

      let obsType = 'crate';
      if (stage === 'Village') {
        const villageTypes = ['low_hurdle', 'crate', 'high_barrier'];
        obsType = villageTypes[Math.floor(Math.random() * villageTypes.length)];
      } else {
        const cityTypes = ['traffic_cone', 'bus', 'high_barrier'];
        obsType = cityTypes[Math.floor(Math.random() * cityTypes.length)];
      }

      setObstacles((prev) => [
        ...prev,
        { id: obstacleIdCounter.current++, lane: spawnLane, z: nextSpawnZ.current, type: obsType }
      ]);
    } else {
      nextSpawnZ.current += stepZ;
    }

    // 6. Spawn Collectible Cans dynamically
    if (nextCanZ.current > -180) {
      nextCanZ.current -= 15 + Math.random() * 15;
      const canLane = Math.floor(Math.random() * 3) - 1;
      const canRand = Math.random();
      let canType = 'can';
      if (canRand > 0.88) canType = 'shield';
      else if (canRand > 0.75) canType = 'gold_can';

      setCollectibles((prev) => [
        ...prev,
        { id: obstacleIdCounter.current++, lane: canLane, z: nextCanZ.current, type: canType, isFloating: canRand > 0.5 }
      ]);
    } else {
      nextCanZ.current += stepZ;
    }

    // 7. COLLISION DETECTION
    const playerXMap = { '-1': -2.5, '0': 0, '1': 2.5 };
    const pX = playerXMap[lane];
    const pY = isJumping ? 0.9 + Math.sin(jumpProgress * Math.PI) * 2.2 : isSliding ? 0.45 : 0.9;
    const pZ = 0; // Player is fixed at Z=0

    // Check Obstacle collisions
    obstacles.forEach((obs) => {
      const obsX = playerXMap[obs.lane];
      const obsZ = obs.z;

      // Check Z proximity (collision threshold window around Z = 0)
      if (Math.abs(obsZ - pZ) < 1.2 && lane === obs.lane) {
        let isHit = false;

        if (obs.type === 'low_hurdle' || obs.type === 'traffic_cone') {
          // Low obstacle - hit unless player is jumping high (pY > 1.6)
          if (pY < 1.6) isHit = true;
        } else if (obs.type === 'high_barrier') {
          // Overhead banner - hit unless player is sliding low (isSliding or pY < 0.6)
          if (!isSliding) isHit = true;
        } else if (obs.type === 'crate' || obs.type === 'bus') {
          // Solid tall obstacle - hit regardless unless shielded
          isHit = true;
        }

        if (isHit) {
          if (isShielded) {
            // Shield absorbs crash!
            setIsShielded(false);
            soundManager.playPowerup();
            // Remove obstacle
            setObstacles((prev) => prev.filter((o) => o.id !== obs.id));
          } else {
            // GAME OVER CRASH!
            soundManager.playCrash();
            onGameOver({ finalScore: newScore, finalDistance: Math.floor(newDistance), finalCans: cansCount });
          }
        }
      }
    });

    // Check Collectible pickups
    collectibles.forEach((item) => {
      const itemZ = item.z;
      if (Math.abs(itemZ - pZ) < 1.4 && lane === item.lane) {
        // Collect!
        if (item.type === 'can') {
          soundManager.playCanPick();
          setCansCount((c) => c + 1);
          setScore((s) => s + 250);
          setCombo((c) => Math.min(5, c + 0.1));
        } else if (item.type === 'gold_can') {
          soundManager.playCanPick();
          setCansCount((c) => c + 3);
          setScore((s) => s + 1000);
          setSpeed((sp) => Math.min(28, sp + 1));
          setCombo((c) => Math.min(5, c + 0.5));
        } else if (item.type === 'shield') {
          soundManager.playPowerup();
          setIsShielded(true);
          shieldTimerRef.current = 8; // 8 seconds of invincibility
        }

        setCollectibles((prev) => prev.filter((c) => c.id !== item.id));
      }
    });
  });

  return (
    <>
      {/* Dynamic Camera tracking from behind the runner */}
      <perspectiveCamera makeDefault position={[0, 3.2, 5.5]} fov={60} />

      <SkyboxAndLighting stage={stage} />

      {/* 3D Player Pepsi-Man Runner */}
      <PlayerCharacter
        lane={lane}
        isJumping={isJumping}
        isSliding={isSliding}
        jumpProgress={jumpProgress}
        isShielded={isShielded}
        speed={speed}
      />

      {/* Repeating Stage Track segments */}
      {stage === 'Village' ? (
        <>
          <VillageStage zOffset={trackZ} />
          <VillageStage zOffset={trackZ - 100} />
          <VillageStage zOffset={trackZ - 200} />
        </>
      ) : (
        <>
          <CityStage zOffset={trackZ} />
          <CityStage zOffset={trackZ - 100} />
          <CityStage zOffset={trackZ - 200} />
        </>
      )}

      {/* Obstacles & Collectibles in scene */}
      <Obstacles obstacles={obstacles} />
      <Collectibles collectibles={collectibles} />
    </>
  );
}

export function GameCanvas(props) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas shadows camera={{ position: [0, 3.2, 5.5], fov: 60 }}>
        <React.Suspense fallback={null}>
          <GameLoop {...props} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
