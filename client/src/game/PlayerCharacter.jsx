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
      targetY = 0.9 + Math.sin(jumpProgress * Math.PI) * 2.2;
    } else if (isSliding) {
      targetY = 0.45;
    }
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 18);

    // Body Tilt when Sliding
    let targetRotX = 0;
    if (isSliding) {
      targetRotX = Math.PI / 3;
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
      if (leftLegRef.current) leftLegRef.current.rotation.x = -0.5;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0.5;
    }

    if (leftArmRef.current && rightArmRef.current && !isSliding) {
      leftArmRef.current.rotation.x = armSwing;
      rightArmRef.current.rotation.x = -armSwing;
    }

    // Shield rotation
    if (shieldRef.current && isShielded) {
      shieldRef.current.rotation.y += delta * 4;
      shieldRef.current.rotation.z += delta * 2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.9, 0]}>
      {/* --- Head Group (Skin tone, Hair, Cap, Sunglasses) --- */}
      <group position={[0, 1.1, 0]}>
        {/* Anime Boy Head */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.34, 16, 16]} />
          <meshStandardMaterial color="#FFE0BD" roughness={0.6} />
        </mesh>

        {/* Dark Hair Tufts */}
        <mesh position={[0, 0.1, 0.15]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.55, 0.25, 0.35]} />
          <meshStandardMaterial color="#2B2B36" roughness={0.8} />
        </mesh>

        {/* --- Backward Blue & White Cap (Matching Image) --- */}
        <group position={[0, 0.12, -0.05]} rotation={[-0.2, 0.4, 0]}>
          {/* Blue Cap Main Crown */}
          <mesh>
            <sphereGeometry args={[0.36, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
            <meshStandardMaterial color="#0055FF" roughness={0.4} />
          </mesh>
          {/* Front White Panel */}
          <mesh position={[0, 0.05, 0.2]}>
            <sphereGeometry args={[0.365, 12, 12, 0, Math.PI * 0.8, 0, Math.PI / 2.2]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
          </mesh>
          {/* Cap Brim / Peak pointing backwards/side */}
          <mesh position={[0, -0.08, -0.3]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.3]} />
            <meshStandardMaterial color="#0044CC" roughness={0.4} />
          </mesh>
        </group>

        {/* --- Cool Black Sunglasses with Cyan Lightning Reflection --- */}
        <group position={[0, 0.02, 0.3]}>
          {/* Glass Lens Frame */}
          <mesh position={[-0.14, 0, 0]}>
            <boxGeometry args={[0.22, 0.14, 0.06]} />
            <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.8} />
          </mesh>
          <mesh position={[0.14, 0, 0]}>
            <boxGeometry args={[0.22, 0.14, 0.06]} />
            <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.8} />
          </mesh>
          {/* Bridge */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.08, 0.04, 0.04]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          {/* Cyan Reflection Streak */}
          <mesh position={[-0.14, 0.02, 0.035]}>
            <boxGeometry args={[0.08, 0.03, 0.01]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
          <mesh position={[0.14, 0.02, 0.035]}>
            <boxGeometry args={[0.08, 0.03, 0.01]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
        </group>
      </group>

      {/* --- Torso (White T-shirt under Blue Denim Dungarees) --- */}
      <group position={[0, 0.45, 0]}>
        {/* Inner White T-shirt */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.66, 0.75, 0.4]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
        </mesh>

        {/* Blue Denim Dungarees / Overalls Body */}
        <mesh position={[0, -0.05, 0.02]}>
          <boxGeometry args={[0.68, 0.58, 0.42]} />
          <meshStandardMaterial color="#0066EE" roughness={0.5} />
        </mesh>

        {/* Dungaree Shoulder Straps */}
        <mesh position={[-0.22, 0.12, 0.02]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.12, 0.48, 0.44]} />
          <meshStandardMaterial color="#0055DD" roughness={0.5} />
        </mesh>
        <mesh position={[0.22, 0.12, 0.02]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.12, 0.48, 0.44]} />
          <meshStandardMaterial color="#0055DD" roughness={0.5} />
        </mesh>

        {/* Metallic Strap Buckle Buttons */}
        <mesh position={[-0.2, 0.15, 0.23]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#DDDDDD" metalness={0.9} />
        </mesh>
        <mesh position={[0.2, 0.15, 0.23]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#DDDDDD" metalness={0.9} />
        </mesh>
      </group>

      {/* --- Left Arm (Sleeve + Skin) --- */}
      <group ref={leftArmRef} position={[-0.42, 0.72, 0]}>
        {/* White T-shirt Short Sleeve */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.22]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Arm Skin */}
        <mesh position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.1, 0.35, 4, 8]} />
          <meshStandardMaterial color="#FFE0BD" roughness={0.6} />
        </mesh>
      </group>

      {/* --- Right Arm (Sleeve + Skin) --- */}
      <group ref={rightArmRef} position={[0.42, 0.72, 0]}>
        {/* White T-shirt Short Sleeve */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.22]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Arm Skin */}
        <mesh position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.1, 0.35, 4, 8]} />
          <meshStandardMaterial color="#FFE0BD" roughness={0.6} />
        </mesh>
      </group>

      {/* --- Left Leg (Blue Denim Jeans + Orange Sneaker) --- */}
      <group ref={leftLegRef} position={[-0.2, 0.05, 0]}>
        {/* Denim Leg Pants */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.5]} />
          <meshStandardMaterial color="#0055EE" roughness={0.5} />
        </mesh>
        {/* Rolled Ankle Cuff */}
        <mesh position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.08]} />
          <meshStandardMaterial color="#88AAFF" roughness={0.6} />
        </mesh>

        {/* Orange Sneaker Shoe */}
        <group position={[0, -0.62, 0.06]}>
          {/* Orange Shoe Body */}
          <mesh>
            <boxGeometry args={[0.22, 0.14, 0.35]} />
            <meshStandardMaterial color="#FF5500" roughness={0.4} />
          </mesh>
          {/* Thick White Sole */}
          <mesh position={[0, -0.07, 0]}>
            <boxGeometry args={[0.24, 0.06, 0.37]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* --- Right Leg (Blue Denim Jeans + Orange Sneaker) --- */}
      <group ref={rightLegRef} position={[0.2, 0.05, 0]}>
        {/* Denim Leg Pants */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.5]} />
          <meshStandardMaterial color="#0055EE" roughness={0.5} />
        </mesh>
        {/* Rolled Ankle Cuff */}
        <mesh position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.08]} />
          <meshStandardMaterial color="#88AAFF" roughness={0.6} />
        </mesh>

        {/* Orange Sneaker Shoe */}
        <group position={[0, -0.62, 0.06]}>
          {/* Orange Shoe Body */}
          <mesh>
            <boxGeometry args={[0.22, 0.14, 0.35]} />
            <meshStandardMaterial color="#FF5500" roughness={0.4} />
          </mesh>
          {/* Thick White Sole */}
          <mesh position={[0, -0.07, 0]}>
            <boxGeometry args={[0.24, 0.06, 0.37]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
        </group>
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
