import React, { useMemo } from 'react';
import * as THREE from 'three';

export function VillageStage({ zOffset }) {
  // Generate random scenery elements once for performance
  const scenery = useMemo(() => {
    const items = [];
    // Village Houses (left and right)
    for (let i = 0; i < 6; i++) {
      const z = -i * 35;
      items.push({ type: 'house', side: -1, z: z - 10, rotY: Math.PI / 6 });
      items.push({ type: 'house', side: 1, z: z - 25, rotY: -Math.PI / 6 });
    }
    // Trees
    for (let i = 0; i < 20; i++) {
      const z = -i * 10;
      items.push({ type: 'tree', side: i % 2 === 0 ? -1 : 1, xDist: 7 + (i % 3), z });
    }
    // Hay bales & fences
    for (let i = 0; i < 10; i++) {
      const z = -i * 20 - 5;
      items.push({ type: 'hay', side: i % 2 === 0 ? -1 : 1, z });
      items.push({ type: 'fence', side: -1, z: z + 2 });
      items.push({ type: 'fence', side: 1, z: z + 2 });
    }
    return items;
  }, []);

  return (
    <group position={[0, 0, zOffset]}>
      {/* Dirt Running Track (Center Path) */}
      <mesh position={[0, -0.05, -100]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 300]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
      </mesh>

      {/* Track Side Wooden Edges */}
      <mesh position={[-4.9, 0.05, -100]}>
        <boxGeometry args={[0.3, 0.2, 300]} />
        <meshStandardMaterial color="#5C3A21" />
      </mesh>
      <mesh position={[4.9, 0.05, -100]}>
        <boxGeometry args={[0.3, 0.2, 300]} />
        <meshStandardMaterial color="#5C3A21" />
      </mesh>

      {/* Surrounding Lush Green Grass Fields */}
      <mesh position={[-60, -0.1, -100]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[110, 300]} />
        <meshStandardMaterial color="#4A7C59" roughness={0.8} />
      </mesh>
      <mesh position={[60, -0.1, -100]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[110, 300]} />
        <meshStandardMaterial color="#4A7C59" roughness={0.8} />
      </mesh>

      {/* River Stream Crossing Bridge at z = -120 */}
      <mesh position={[0, -0.2, -120]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 20]} />
        <meshStandardMaterial color="#1E90FF" roughness={0.1} metalness={0.5} />
      </mesh>
      {/* Wooden Bridge Planks */}
      <mesh position={[0, 0.02, -120]}>
        <boxGeometry args={[10.2, 0.15, 20]} />
        <meshStandardMaterial color="#663300" roughness={0.7} />
      </mesh>

      {/* Scenery Objects */}
      {scenery.map((item, idx) => {
        if (item.type === 'house') {
          const posX = item.side * 14;
          return (
            <group key={idx} position={[posX, 0, item.z]} rotation={[0, item.rotY, 0]}>
              {/* House Base */}
              <mesh position={[0, 2, 0]}>
                <boxGeometry args={[6, 4, 6]} />
                <meshStandardMaterial color="#EEDDCC" roughness={0.8} />
              </mesh>
              {/* Thatched Roof */}
              <mesh position={[0, 5, 0]} rotation={[0, Math.PI / 4, 0]}>
                <coneGeometry args={[5.2, 3, 4]} />
                <meshStandardMaterial color="#A52A2A" roughness={0.9} />
              </mesh>
            </group>
          );
        }

        if (item.type === 'tree') {
          const posX = item.side * item.xDist;
          return (
            <group key={idx} position={[posX, 0, item.z]}>
              {/* Trunk */}
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.3, 0.5, 3]} />
                <meshStandardMaterial color="#5C4033" />
              </mesh>
              {/* Leaf Canopy */}
              <mesh position={[0, 4, 0]}>
                <coneGeometry args={[2.2, 4, 6]} />
                <meshStandardMaterial color="#2E8B57" roughness={0.7} />
              </mesh>
            </group>
          );
        }

        if (item.type === 'hay') {
          const posX = item.side * 6.5;
          return (
            <mesh key={idx} position={[posX, 0.7, item.z]}>
              <cylinderGeometry args={[0.8, 0.8, 1.2, 12]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#DAA520" roughness={0.9} />
            </mesh>
          );
        }

        if (item.type === 'fence') {
          const posX = item.side * 5.2;
          return (
            <mesh key={idx} position={[posX, 0.5, item.z]}>
              <boxGeometry args={[0.15, 1, 4]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          );
        }

        return null;
      })}
    </group>
  );
}
