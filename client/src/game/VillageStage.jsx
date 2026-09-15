import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function VillageStage({ zOffset }) {
  const foliageGroupRef = useRef();
  const waterRef = useRef();

  // Animate leaf swaying in the breeze & flowing river water
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Wind sway for tree leaves
    if (foliageGroupRef.current) {
      foliageGroupRef.current.children.forEach((child, i) => {
        if (child.userData.isLeaves) {
          child.rotation.z = Math.sin(time * 2 + i) * 0.05;
          child.rotation.x = Math.cos(time * 1.5 + i) * 0.04;
        }
      });
    }

    // Animated river water shimmer
    if (waterRef.current) {
      waterRef.current.position.x = Math.sin(time * 1.2) * 0.3;
    }
  });

  // Generate detailed scenery once
  const { trees, houses, bushes, flowers, fences, rocks } = useMemo(() => {
    const treeList = [];
    const houseList = [];
    const bushList = [];
    const flowerList = [];
    const fenceList = [];
    const rockList = [];

    // Detailed Trees (Pine & Oak variations)
    for (let i = 0; i < 24; i++) {
      const z = -i * 8.5;
      const side = i % 2 === 0 ? -1 : 1;
      const type = i % 3 === 0 ? 'oak' : 'pine';
      const scale = 0.85 + Math.random() * 0.4;
      treeList.push({ side, xDist: 6.8 + (i % 4) * 0.8, z, type, scale });
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
        xDist: 5.5 + Math.random(),
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

    // Boulders / Rocks along path edge
    for (let i = 0; i < 16; i++) {
      const z = -i * 12 - 5;
      rockList.push({ side: i % 2 === 0 ? -1 : 1, z, scale: 0.6 + Math.random() * 0.5 });
    }

    return { trees: treeList, houses: houseList, bushes: bushList, flowers: flowerList, fences: fenceList, rocks: rockList };
  }, []);

  return (
    <group position={[0, 0, zOffset]}>
      {/* --- Dirt Running Track with Realistic Rut Grooves --- */}
      <mesh position={[0, -0.04, -100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.5, 300]} />
        <meshStandardMaterial color="#6E4723" roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Dirt Track Center Tread Lines */}
      {[-2.2, 0, 2.2].map((x, idx) => (
        <mesh key={idx} position={[x, -0.03, -100]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.4, 300]} />
          <meshStandardMaterial color="#543415" roughness={0.95} />
        </mesh>
      ))}

      {/* Track Edge Dirt Strips & Grass Border */}
      <mesh position={[-4.8, 0.04, -100]} receiveShadow>
        <boxGeometry args={[0.5, 0.16, 300]} />
        <meshStandardMaterial color="#422910" roughness={0.9} />
      </mesh>
      <mesh position={[4.8, 0.04, -100]} receiveShadow>
        <boxGeometry args={[0.5, 0.16, 300]} />
        <meshStandardMaterial color="#422910" roughness={0.9} />
      </mesh>

      {/* Lush Rolling Grass Fields */}
      <mesh position={[-60, -0.1, -100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[110, 300]} />
        <meshStandardMaterial color="#3A6B43" roughness={0.8} />
      </mesh>
      <mesh position={[60, -0.1, -100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[110, 300]} />
        <meshStandardMaterial color="#3A6B43" roughness={0.8} />
      </mesh>

      {/* --- Animated River Stream & Cobblestone Bridge at z = -120 --- */}
      <group position={[0, 0, -120]}>
        {/* Shimmering Blue River Water */}
        <mesh ref={waterRef} position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[120, 18]} />
          <meshStandardMaterial color="#0080FF" roughness={0.1} metalness={0.6} />
        </mesh>

        {/* Arch Bridge Stone Base */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[10.2, 0.35, 18]} />
          <meshStandardMaterial color="#665544" roughness={0.85} />
        </mesh>
        {/* Bridge Wooden Railings */}
        <mesh position={[-4.9, 0.7, 0]}>
          <boxGeometry args={[0.3, 1.1, 18]} />
          <meshStandardMaterial color="#5C3A21" />
        </mesh>
        <mesh position={[4.9, 0.7, 0]}>
          <boxGeometry args={[0.3, 1.1, 18]} />
          <meshStandardMaterial color="#5C3A21" />
        </mesh>
      </group>

      {/* --- Foliage Group (Trees, Bushes, Flowers) --- */}
      <group ref={foliageGroupRef}>
        {trees.map((t, idx) => {
          const posX = t.side * t.xDist;
          return (
            <group key={idx} position={[posX, 0, t.z]} scale={t.scale}>
              {/* Detailed Tree Trunk */}
              <mesh position={[0, 2, 0]} castShadow>
                <cylinderGeometry args={[0.35, 0.55, 4, 8]} />
                <meshStandardMaterial color="#4A2F1B" roughness={0.9} />
              </mesh>

              {/* Multi-tiered Foliage Canopy */}
              {t.type === 'pine' ? (
                <>
                  <mesh position={[0, 4.2, 0]} userData={{ isLeaves: true }} castShadow>
                    <coneGeometry args={[2.4, 3.2, 8]} />
                    <meshStandardMaterial color="#1E5E3A" roughness={0.7} />
                  </mesh>
                  <mesh position={[0, 5.8, 0]} userData={{ isLeaves: true }} castShadow>
                    <coneGeometry args={[1.9, 2.8, 8]} />
                    <meshStandardMaterial color="#2B7A4C" roughness={0.7} />
                  </mesh>
                  <mesh position={[0, 7.2, 0]} userData={{ isLeaves: true }} castShadow>
                    <coneGeometry args={[1.3, 2.2, 8]} />
                    <meshStandardMaterial color="#38965E" roughness={0.7} />
                  </mesh>
                </>
              ) : (
                /* Oak Tree Round Canopy */
                <group position={[0, 5, 0]} userData={{ isLeaves: true }}>
                  <mesh position={[0, 0, 0]} castShadow>
                    <dodecahedronGeometry args={[2.2]} />
                    <meshStandardMaterial color="#2D7039" roughness={0.6} />
                  </mesh>
                  <mesh position={[-0.8, 0.6, 0.4]} castShadow>
                    <dodecahedronGeometry args={[1.5]} />
                    <meshStandardMaterial color="#3B8A48" roughness={0.6} />
                  </mesh>
                  <mesh position={[0.8, 0.4, -0.4]} castShadow>
                    <dodecahedronGeometry args={[1.6]} />
                    <meshStandardMaterial color="#235E2E" roughness={0.6} />
                  </mesh>
                </group>
              )}
            </group>
          );
        })}

        {/* Bushes */}
        {bushes.map((b, idx) => (
          <mesh key={idx} position={[b.side * b.xDist, 0.5, b.z]} castShadow>
            <sphereGeometry args={[0.8, 8, 8]} />
            <meshStandardMaterial color="#2D6A4F" roughness={0.8} />
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
      </group>

      {/* --- Cottages with Smoke Chimneys & Windows --- */}
      {houses.map((h, idx) => (
        <group key={idx} position={[h.side * 14.5, 0, h.z]} rotation={[0, h.rotY, 0]}>
          {/* Base Stone Foundation */}
          <mesh position={[0, 0.4, 0]} receiveShadow>
            <boxGeometry args={[6.4, 0.8, 6.4]} />
            <meshStandardMaterial color="#555555" roughness={0.9} />
          </mesh>
          {/* Walls */}
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[6, 3.5, 6]} />
            <meshStandardMaterial color={h.color} roughness={0.8} />
          </mesh>
          {/* Thatched Roof */}
          <mesh position={[0, 5.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[5.2, 3.2, 4]} />
            <meshStandardMaterial color="#8B3A2B" roughness={0.85} />
          </mesh>
          {/* Window glowing warm light */}
          <mesh position={[0, 2.6, 3.02]}>
            <boxGeometry args={[1.2, 1.2, 0.1]} />
            <meshBasicMaterial color="#FFCC33" />
          </mesh>
          {/* Chimney */}
          <mesh position={[2, 4.5, -1]} castShadow>
            <boxGeometry args={[0.8, 2.5, 0.8]} />
            <meshStandardMaterial color="#4A4A4A" />
          </mesh>
        </group>
      ))}

      {/* --- Rustic Wooden Fence Posts --- */}
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

      {/* Boulders / Rocks along path */}
      {rocks.map((r, idx) => (
        <mesh key={idx} position={[r.side * 5.3, 0.4 * r.scale, r.z]} scale={r.scale} castShadow>
          <dodecahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#666666" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
