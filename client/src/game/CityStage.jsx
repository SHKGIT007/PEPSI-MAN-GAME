import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CityStage({ zOffset }) {
  const neonGroupRef = useRef();

  // Pulse neon billboards & streetlights
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    if (neonGroupRef.current) {
      neonGroupRef.current.children.forEach((child, i) => {
        if (child.userData.isNeon) {
          child.material.emissiveIntensity = 0.6 + Math.sin(time * 3 + i) * 0.4;
        }
      });
    }
  });

  const { buildings, lamps, billboards, curbs } = useMemo(() => {
    const bList = [];
    const lList = [];
    const bbList = [];
    const cList = [];

    // Skyscrapers
    for (let i = 0; i < 14; i++) {
      const z = -i * 22;
      const heightL = 22 + Math.random() * 25;
      const heightR = 22 + Math.random() * 25;
      bList.push({ side: -1, z, height: heightL, color: i % 2 === 0 ? '#111526' : '#0B0D19', accent: i % 3 === 0 ? '#00F0FF' : '#FF007F' });
      bList.push({ side: 1, z: z - 10, height: heightR, color: i % 2 === 0 ? '#0B0D19' : '#16192E', accent: i % 3 === 0 ? '#FF007F' : '#00F0FF' });
    }

    // Street Lamps
    for (let i = 0; i < 16; i++) {
      const z = -i * 16;
      lList.push({ side: i % 2 === 0 ? -1 : 1, z });
    }

    // Neon Overhead Billboards
    for (let i = 0; i < 6; i++) {
      const z = -i * 45 - 15;
      bbList.push({ side: i % 2 === 0 ? -1 : 1, z, title: i % 2 === 0 ? 'PEPSI-MAN' : 'COOL REFRESH' });
    }

    // Curb Segments
    for (let i = 0; i < 40; i++) {
      const z = -i * 7.5;
      cList.push({ z, isYellow: i % 2 === 0 });
    }

    return { buildings: bList, lamps: lList, billboards: bbList, curbs: cList };
  }, []);

  return (
    <group position={[0, 0, zOffset]}>
      {/* --- Glossy Asphalt Highway Road --- */}
      <mesh position={[0, -0.04, -100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.6, 300]} />
        <meshStandardMaterial color="#12131C" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* --- Continuous Glowing Neon Highway Edge Strips --- */}
      <mesh position={[-4.75, 0.05, -100]}>
        <boxGeometry args={[0.15, 0.1, 300]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>
      <mesh position={[4.75, 0.05, -100]}>
        <boxGeometry args={[0.15, 0.1, 300]} />
        <meshBasicMaterial color="#FF007F" />
      </mesh>

      {/* --- Dashed Highway Center Markings --- */}
      {[-1.6, 1.6].map((xPos, idx) => (
        <group key={idx}>
          {Array.from({ length: 30 }).map((_, i) => (
            <mesh key={i} position={[xPos, 0.01, -i * 10]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.22, 4.5]} />
              <meshBasicMaterial color="#FFDD00" />
            </mesh>
          ))}
        </group>
      ))}

      {/* --- Alternating Yellow/Black Sidewalk Curbs --- */}
      {curbs.map((c, idx) => (
        <group key={idx}>
          <mesh position={[-5.1, 0.08, c.z]}>
            <boxGeometry args={[0.5, 0.22, 7.5]} />
            <meshStandardMaterial color={c.isYellow ? '#FFD700' : '#222222'} roughness={0.6} />
          </mesh>
          <mesh position={[5.1, 0.08, c.z]}>
            <boxGeometry args={[0.5, 0.22, 7.5]} />
            <meshStandardMaterial color={c.isYellow ? '#FFD700' : '#222222'} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* --- Skyscrapers with Neon Accents --- */}
      <group ref={neonGroupRef}>
        {buildings.map((b, idx) => {
          const posX = b.side * 14.5;
          return (
            <group key={idx} position={[posX, b.height / 2, b.z]}>
              {/* Main Building Structure */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[10.5, b.height, 12]} />
                <meshStandardMaterial color={b.color} roughness={0.4} metalness={0.6} />
              </mesh>

              {/* Vertical Neon Light Ribbon */}
              <mesh position={[b.side * -5.2, 0, 0]} userData={{ isNeon: true }}>
                <boxGeometry args={[0.25, b.height - 2, 8]} />
                <meshStandardMaterial color={b.accent} emissive={b.accent} emissiveIntensity={0.8} />
              </mesh>

              {/* Glowing Rooftop Antenna Beacon */}
              <mesh position={[0, b.height / 2 + 2, 0]}>
                <cylinderGeometry args={[0.08, 0.15, 4]} />
                <meshStandardMaterial color="#888" />
              </mesh>
              <mesh position={[0, b.height / 2 + 4.1, 0]}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshBasicMaterial color="#FF0044" />
              </mesh>
            </group>
          );
        })}

        {/* Street Lamps */}
        {lamps.map((l, idx) => {
          const posX = l.side * 5.5;
          return (
            <group key={idx} position={[posX, 0, l.z]}>
              {/* Lamp Post Pole */}
              <mesh position={[0, 3, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.16, 6]} />
                <meshStandardMaterial color="#444455" metalness={0.9} />
              </mesh>
              {/* Lamp Arm Arc */}
              <mesh position={[l.side * -0.4, 5.8, 0]}>
                <boxGeometry args={[1.2, 0.12, 0.2]} />
                <meshStandardMaterial color="#444455" />
              </mesh>
              {/* Glowing Lamp Head Bulb */}
              <mesh position={[l.side * -0.8, 5.6, 0]} userData={{ isNeon: true }}>
                <sphereGeometry args={[0.32, 12, 12]} />
                <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.9} />
              </mesh>
            </group>
          );
        })}

        {/* Overhead Neon Billboards */}
        {billboards.map((bb, idx) => {
          const posX = bb.side * 8.5;
          return (
            <group key={idx} position={[posX, 8.5, bb.z]}>
              <mesh castShadow>
                <boxGeometry args={[7, 3.5, 0.4]} />
                <meshStandardMaterial color="#0022AA" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Neon Frame */}
              <mesh position={[0, 0, 0.22]} userData={{ isNeon: true }}>
                <boxGeometry args={[6.6, 3.1, 0.08]} />
                <meshStandardMaterial color="#E31B23" emissive="#E31B23" emissiveIntensity={0.8} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
