import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function Collectibles({ collectibles }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate all collectibles continuously
      groupRef.current.children.forEach((child) => {
        child.rotation.y += delta * 3;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {collectibles.map((item) => {
        const laneXMap = { '-1': -2.5, '0': 0, '1': 2.5 };
        const xPos = laneXMap[item.lane] || 0;
        const yPos = item.isFloating ? 2.2 : 0.8; // High floating cans or low cans

        // --- Standard Pepsi Soda Can ---
        if (item.type === 'can') {
          return (
            <group key={item.id} position={[xPos, yPos, item.z]}>
              {/* Soda Can Body */}
              <mesh>
                <cylinderGeometry args={[0.3, 0.3, 0.7, 16]} />
                <meshStandardMaterial color="#0055FF" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Pepsi Red Center Ring */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.31, 0.31, 0.3, 16]} />
                <meshStandardMaterial color="#E31B23" metalness={0.6} roughness={0.3} />
              </mesh>
              {/* Can Top Metallic Lid */}
              <mesh position={[0, 0.36, 0]}>
                <cylinderGeometry args={[0.28, 0.28, 0.04, 16]} />
                <meshStandardMaterial color="#DDDDDD" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
          );
        }

        // --- Golden Boost Can ---
        if (item.type === 'gold_can') {
          return (
            <group key={item.id} position={[xPos, yPos, item.z]}>
              <mesh>
                <cylinderGeometry args={[0.35, 0.35, 0.8, 16]} />
                <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#AA8800" emissiveIntensity={0.5} />
              </mesh>
            </group>
          );
        }

        // --- Shield Drink Power-Up ---
        if (item.type === 'shield') {
          return (
            <group key={item.id} position={[xPos, yPos, item.z]}>
              <mesh>
                <octahedronGeometry args={[0.45]} />
                <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.8} wireframe />
              </mesh>
            </group>
          );
        }

        return null;
      })}
    </group>
  );
}
