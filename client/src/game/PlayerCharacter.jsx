import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function PlayerCharacter({ lane, isJumping, isSliding, jumpProgress, isShielded, speed }) {
  const groupRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const shieldRef = useRef();

  // Target X position based on lane (-1: Left, 0: Center, 1: Right)
  const laneXMap = { '-1': -2.5, '0': 0, '1': 2.5 };
  const targetX = laneXMap[lane] || 0;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth horizontal X lane interpolation
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 15);

    // Vertical Jump Arc (Y position calculation)
    let targetY = 0.9;
    if (isJumping) {
      // Parabolic arc for smooth jump elevation up to ~2.8 units high
      targetY = 0.9 + Math.sin(jumpProgress * Math.PI) * 2.2;
    } else if (isSliding) {
      targetY = 0.45; // Duck down low
    }
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 18);

    // Body Tilt when Sliding or Lane changing
    let targetRotX = 0;
    if (isSliding) {
      targetRotX = Math.PI / 3; // Forward slide angle
    }
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 15);

    // Running animation legs/arms oscillation
    const runTime = state.clock.elapsedTime * (speed * 1.5);
    const legSwing = Math.sin(runTime) * 0.7;
    const armSwing = Math.cos(runTime) * 0.7;

    if (leftLegRef.current && rightLegRef.current && !isJumping && !isSliding) {
      leftLegRef.current.rotation.x = legSwing;
      rightLegRef.current.rotation.x = -legSwing;
    } else if (isJumping) {
      // Tuck legs up slightly during jump
      if (leftLegRef.current) leftLegRef.current.rotation.x = -0.5;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0.5;
    }

    if (leftArmRef.current && rightArmRef.current && !isSliding) {
      leftArmRef.current.rotation.x = armSwing;
      rightArmRef.current.rotation.x = -armSwing;
    }

    // Shield rotation animation
    if (shieldRef.current && isShielded) {
      shieldRef.current.rotation.y += delta * 4;
      shieldRef.current.rotation.z += delta * 2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.9, 0]}>
      {/* --- Torso (Royal Metallic Blue with Silver Trim) --- */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.45]} />
        <meshStandardMaterial color="#0033CC" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Pepsi Chest Emblem Plate */}
      <mesh position={[0, 0.55, 0.23]}>
        <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#E31B23" roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.42, 0.24]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
      </mesh>

      {/* --- Head (Silver Mask & Blue Visor) --- */}
      <group position={[0, 1.05, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Sleek Blue Visor Strip */}
        <mesh position={[0, 0.05, 0.22]}>
          <boxGeometry args={[0.42, 0.12, 0.15]} />
          <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* --- Left Arm --- */}
      <group ref={leftArmRef} position={[-0.45, 0.7, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.1, 0.45, 4, 8]} />
          <meshStandardMaterial color="#0022AA" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* --- Right Arm --- */}
      <group ref={rightArmRef} position={[0.45, 0.7, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.1, 0.45, 4, 8]} />
          <meshStandardMaterial color="#0022AA" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* --- Left Leg --- */}
      <group ref={leftLegRef} position={[-0.22, 0, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.12, 0.55, 4, 8]} />
          <meshStandardMaterial color="#111133" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      {/* --- Right Leg --- */}
      <group ref={rightLegRef} position={[0.22, 0, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.12, 0.55, 4, 8]} />
          <meshStandardMaterial color="#111133" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      {/* --- Invincibility Shield Aura (When Shielded) --- */}
      {isShielded && (
        <mesh ref={shieldRef}>
          <sphereGeometry args={[1.3, 16, 16]} />
          <meshStandardMaterial color="#00F0FF" transparent opacity={0.35} wireframe />
        </mesh>
      )}
    </group>
  );
}
