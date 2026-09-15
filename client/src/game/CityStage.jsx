import React, { useMemo } from 'react';
import * as THREE from 'three';

export function CityStage({ zOffset }) {
  const cityScenery = useMemo(() => {
    const items = [];
    // Skyscrapers
    for (let i = 0; i < 12; i++) {
      const z = -i * 25;
      const heightLeft = 20 + Math.random() * 25;
      const heightRight = 20 + Math.random() * 25;
      items.push({ type: 'building', side: -1, z, height: heightLeft, color: i % 2 === 0 ? '#1A1C29' : '#0F172A' });
      items.push({ type: 'building', side: 1, z, height: heightRight, color: i % 2 === 0 ? '#0F172A' : '#1E1B4B' });
    }
    // Street Lamps & Neon Billboards
    for (let i = 0; i < 15; i++) {
      const z = -i * 18;
      items.push({ type: 'lamp', side: i % 2 === 0 ? -1 : 1, z });
      if (i % 3 === 0) {
        items.push({ type: 'billboard', side: i % 2 === 0 ? -1 : 1, z: z - 5 });
      }
    }
    return items;
  }, []);

  return (
    <group position={[0, 0, zOffset]}>
      {/* Asphalt Highway Track */}
      <mesh position={[0, -0.05, -100]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 300]} />
        <meshStandardMaterial color="#1A1A24" roughness={0.5} />
      </mesh>

      {/* Yellow/White Highway Lane Lines */}
      {[-1.6, 1.6].map((xPos, idx) => (
        <group key={idx}>
          {Array.from({ length: 30 }).map((_, i) => (
            <mesh key={i} position={[xPos, 0.01, -i * 10]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.2, 4]} />
              <meshBasicMaterial color="#FFD700" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Sidewalk Curbs */}
      <mesh position={[-5.3, 0.1, -100]}>
        <boxGeometry args={[0.6, 0.3, 300]} />
        <meshStandardMaterial color="#333344" />
      </mesh>
      <mesh position={[5.3, 0.1, -100]}>
        <boxGeometry args={[0.6, 0.3, 300]} />
        <meshStandardMaterial color="#333344" />
      </mesh>

      {/* Scenery Objects */}
      {cityScenery.map((item, idx) => {
        if (item.type === 'building') {
          const posX = item.side * 14;
          return (
            <group key={idx} position={[posX, item.height / 2, item.z]}>
              {/* Building Body */}
              <mesh>
                <boxGeometry args={[10, item.height, 12]} />
                <meshStandardMaterial color={item.color} roughness={0.3} metalness={0.5} />
              </mesh>
              {/* Glowing Neon Window Strips */}
              <mesh position={[item.side * -4.9, 0, 0]}>
                <boxGeometry args={[0.2, item.height - 4, 10]} />
                <meshBasicMaterial color="#00F0FF" />
              </mesh>
            </group>
          );
        }

        if (item.type === 'lamp') {
          const posX = item.side * 5.6;
          return (
            <group key={idx} position={[posX, 0, item.z]}>
              {/* Lamp Post */}
              <mesh position={[0, 2.5, 0]}>
                <cylinderGeometry args={[0.1, 0.15, 5]} />
                <meshStandardMaterial color="#555566" metalness={0.8} />
              </mesh>
              {/* Glowing Lamp Head */}
              <mesh position={[item.side * -0.4, 4.8, 0]}>
                <sphereGeometry args={[0.3, 12, 12]} />
                <meshBasicMaterial color="#FFDD55" />
              </mesh>
            </group>
          );
        }

        if (item.type === 'billboard') {
          const posX = item.side * 8;
          return (
            <group key={idx} position={[posX, 7, item.z]}>
              <mesh>
                <boxGeometry args={[6, 3, 0.4]} />
                <meshStandardMaterial color="#0055FF" emissive="#0022AA" emissiveIntensity={0.8} />
              </mesh>
              {/* Billboard Glowing Pepsi Red stripe */}
              <mesh position={[0, 0, 0.22]}>
                <boxGeometry args={[5.5, 1, 0.1]} />
                <meshBasicMaterial color="#E31B23" />
              </mesh>
            </group>
          );
        }

        return null;
      })}
    </group>
  );
}
