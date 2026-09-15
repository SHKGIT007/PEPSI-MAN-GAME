import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Custom 3D Lush Cartoon Tree (Matching Reference Image) ---
function LushCartoonTree({ position, scale = 1 }) {
  const foliageGroupRef = useRef();

  // Gentle wind swaying animation
  useFrame((state) => {
    if (foliageGroupRef.current) {
      const time = state.clock.elapsedTime;
      foliageGroupRef.current.rotation.z = Math.sin(time * 1.8 + position[2]) * 0.04;
      foliageGroupRef.current.rotation.x = Math.cos(time * 1.2 + position[0]) * 0.03;
    }
  });

  // Generate multi-layer foliage cloud puffs
  const foliagePuffs = useMemo(() => {
    const puffs = [];
    // Top main dome
    puffs.push({ pos: [0, 5.2, 0], radius: 1.8, color: '#66D136' });
    puffs.push({ pos: [0, 5.6, 0.3], radius: 1.5, color: '#7CE643' });

    // Middle Ring Puffs
    const ringColors = ['#4EBD2A', '#66D136', '#3D9E20', '#7CE643'];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radiusOffset = 1.3 + (i % 2) * 0.4;
      const x = Math.cos(angle) * radiusOffset;
      const z = Math.sin(angle) * radiusOffset;
      const y = 4.3 + (i % 3) * 0.3;
      puffs.push({ pos: [x, y, z], radius: 1.3 + Math.random() * 0.4, color: ringColors[i % ringColors.length] });
    }

    // Lower Shadow Canopy Puffs
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + 0.3;
      const x = Math.cos(angle) * 1.6;
      const z = Math.sin(angle) * 1.6;
      puffs.push({ pos: [x, 3.6, z], radius: 1.1 + Math.random() * 0.3, color: '#2B7A18' });
    }

    return puffs;
  }, []);

  return (
    <group position={position} scale={scale}>
      {/* --- Flared Wooden Roots Base --- */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((angle, idx) => (
        <mesh
          key={idx}
          position={[Math.cos(angle) * 0.6, 0.2, Math.sin(angle) * 0.6]}
          rotation={[0.3 * Math.sin(angle), angle, -0.4]}
          castShadow
        >
          <cylinderGeometry args={[0.2, 0.45, 1.2, 8]} />
          <meshStandardMaterial color="#6B4226" roughness={0.85} />
        </mesh>
      ))}

      {/* --- Main Thick Wooden Trunk --- */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.95, 3.4, 10]} />
        <meshStandardMaterial color="#7A4B29" roughness={0.8} />
      </mesh>

      {/* --- Spreading Upper Branches --- */}
      <group position={[0, 3.2, 0]}>
        <mesh position={[-0.6, 0.6, 0.3]} rotation={[0.2, 0, 0.5]} castShadow>
          <cylinderGeometry args={[0.3, 0.45, 1.6, 8]} />
          <meshStandardMaterial color="#7A4B29" roughness={0.8} />
        </mesh>
        <mesh position={[0.6, 0.6, -0.3]} rotation={[-0.2, 0, -0.5]} castShadow>
          <cylinderGeometry args={[0.3, 0.45, 1.6, 8]} />
          <meshStandardMaterial color="#7A4B29" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.7, 0.6]} rotation={[-0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.42, 1.5, 8]} />
          <meshStandardMaterial color="#7A4B29" roughness={0.8} />
        </mesh>
      </group>

      {/* --- Fluffy Cloud-Like Foliage Canopy --- */}
      <group ref={foliageGroupRef}>
        {foliagePuffs.map((puff, idx) => (
          <mesh key={idx} position={puff.pos} castShadow receiveShadow>
            <dodecahedronGeometry args={[puff.radius, 1]} />
            <meshStandardMaterial color={puff.color} roughness={0.65} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function VillageStage({ zOffset }) {
  const waterRef = useRef();

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.3;
    }
  });

  const { trees, houses, bushes, flowers, fences, rocks } = useMemo(() => {
    const treeList = [];
    const houseList = [];
    const bushList = [];
    const flowerList = [];
    const fenceList = [];
    const rockList = [];

    // Dense lining of Lush Cartoon Trees matching user reference!
    for (let i = 0; i < 28; i++) {
      const z = -i * 7.5;
      const side = i % 2 === 0 ? -1 : 1;
      const scale = 0.9 + (i % 3) * 0.15;
      treeList.push({ side, xDist: 6.8 + (i % 3) * 0.7, z, scale });
    }

    // Cottages
    for (let i = 0; i < 7; i++) {
      const z = -i * 30 - 8;
      houseList.push({ side: -1, z, rotY: Math.PI / 5, color: '#F5E6CC' });
      houseList.push({ side: 1, z: z - 12, rotY: -Math.PI / 5, color: '#E8D5B7' });
    }

    // Bushes & Flower Patches
    for (let i = 0; i < 30; i++) {
      const z = -i * 6.5;
      bushList.push({ side: i % 2 === 0 ? -1 : 1, xDist: 5.2 + (i % 2) * 0.5, z });
      flowerList.push({
        side: i % 2 === 0 ? 1 : -1,
        xDist: 5.4 + Math.random() * 0.6,
        z: z - 2,
        color: ['#FF3366', '#FFCC00', '#9933FF', '#00CCFF'][i % 4]
      });
    }

    // Fences
    for (let i = 0; i < 14; i++) {
      const z = -i * 14 - 3;
      fenceList.push({ side: -1, z });
      fenceList.push({ side: 1, z });
    }

    // Rocks
    for (let i = 0; i < 16; i++) {
      const z = -i * 12 - 5;
      rockList.push({ side: i % 2 === 0 ? -1 : 1, z, scale: 0.6 + Math.random() * 0.5 });
    }

    return { trees: treeList, houses: houseList, bushes: bushList, flowers: flowerList, fences: fenceList, rocks: rockList };
  }, []);

  return (
    <group position={[0, 0, zOffset]}>
      {/* Dirt Running Track */}
      <mesh position={[0, -0.04, -100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.5, 300]} />
        <meshStandardMaterial color="#6E4723" roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Center Tread Lines */}
      {[-2.2, 0, 2.2].map((x, idx) => (
        <mesh key={idx} position={[x, -0.03, -100]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.4, 300]} />
          <meshStandardMaterial color="#543415" roughness={0.95} />
        </mesh>
      ))}

      {/* Track Edge Strips */}
      <mesh position={[-4.8, 0.04, -100]} receiveShadow>
        <boxGeometry args={[0.5, 0.16, 300]} />
        <meshStandardMaterial color="#422910" roughness={0.9} />
      </mesh>
      <mesh position={[4.8, 0.04, -100]} receiveShadow>
        <boxGeometry args={[0.5, 0.16, 300]} />
        <meshStandardMaterial color="#422910" roughness={0.9} />
      </mesh>

      {/* Lush Green Fields */}
      <mesh position={[-60, -0.1, -100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[110, 300]} />
        <meshStandardMaterial color="#3A6B43" roughness={0.8} />
      </mesh>
      <mesh position={[60, -0.1, -100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[110, 300]} />
        <meshStandardMaterial color="#3A6B43" roughness={0.8} />
      </mesh>

      {/* River Stream & Cobblestone Bridge */}
      <group position={[0, 0, -120]}>
        <mesh ref={waterRef} position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[120, 18]} />
          <meshStandardMaterial color="#0080FF" roughness={0.1} metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[10.2, 0.35, 18]} />
          <meshStandardMaterial color="#665544" roughness={0.85} />
        </mesh>
        <mesh position={[-4.9, 0.7, 0]}>
          <boxGeometry args={[0.3, 1.1, 18]} />
          <meshStandardMaterial color="#5C3A21" />
        </mesh>
        <mesh position={[4.9, 0.7, 0]}>
          <boxGeometry args={[0.3, 1.1, 18]} />
          <meshStandardMaterial color="#5C3A21" />
        </mesh>
      </group>

      {/* --- Render Lush Cartoon Trees (Matching Reference Image) --- */}
      {trees.map((t, idx) => (
        <LushCartoonTree key={idx} position={[t.side * t.xDist, 0, t.z]} scale={t.scale} />
      ))}

      {/* Bushes */}
      {bushes.map((b, idx) => (
        <mesh key={idx} position={[b.side * b.xDist, 0.5, b.z]} castShadow>
          <sphereGeometry args={[0.8, 8, 8]} />
          <meshStandardMaterial color="#2E8A42" roughness={0.8} />
        </mesh>
      ))}

      {/* Flower Patches */}
      {flowers.map((fl, idx) => (
        <group key={idx} position={[fl.side * fl.xDist, 0.15, fl.z]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.1, 8]} />
            <meshStandardMaterial color="#386641" />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color={fl.color} />
          </mesh>
        </group>
      ))}

      {/* Cottages */}
      {houses.map((h, idx) => (
        <group key={idx} position={[h.side * 14.5, 0, h.z]} rotation={[0, h.rotY, 0]}>
          <mesh position={[0, 0.4, 0]} receiveShadow>
            <boxGeometry args={[6.4, 0.8, 6.4]} />
            <meshStandardMaterial color="#555555" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[6, 3.5, 6]} />
            <meshStandardMaterial color={h.color} roughness={0.8} />
          </mesh>
          <mesh position={[0, 5.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[5.2, 3.2, 4]} />
            <meshStandardMaterial color="#8B3A2B" roughness={0.85} />
          </mesh>
          <mesh position={[0, 2.6, 3.02]}>
            <boxGeometry args={[1.2, 1.2, 0.1]} />
            <meshBasicMaterial color="#FFCC33" />
          </mesh>
        </group>
      ))}

      {/* Fences */}
      {fences.map((f, idx) => (
        <group key={idx} position={[f.side * 5.2, 0, f.z]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[0.15, 1.2, 0.15]} />
            <meshStandardMaterial color="#5C3A21" />
          </mesh>
          <mesh position={[0, 0.4, 1.5]}>
            <cylinderGeometry args={[0.04, 0.04, 3.2]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#8B5A2B" />
          </mesh>
        </group>
      ))}

      {/* Rocks */}
      {rocks.map((r, idx) => (
        <mesh key={idx} position={[r.side * 5.3, 0.4 * r.scale, r.z]} scale={r.scale} castShadow>
          <dodecahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#666666" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
