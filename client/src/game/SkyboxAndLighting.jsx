import React, { useMemo } from 'react';
import * as THREE from 'three';

export function SkyboxAndLighting({ stage }) {
  const isCity = stage === 'City';

  // Floating clouds for Village Stage
  const clouds = useMemo(() => {
    const list = [];
    for (let i = 0; i < 15; i++) {
      list.push({
        x: (Math.random() - 0.5) * 120,
        y: 20 + Math.random() * 15,
        z: -Math.random() * 200,
        scale: 1 + Math.random() * 1.5
      });
    }
    return list;
  }, []);

  return (
    <>
      {/* Dynamic Background Sky Color & Atmospheric Fog */}
      <color attach="background" args={[isCity ? '#080C1B' : '#64A5FF']} />
      <fog attach="fog" args={[isCity ? '#080C1B' : '#7EC0FF', 30, 160]} />

      {/* Soft Ambient Light */}
      <ambientLight intensity={isCity ? 0.45 : 0.85} />

      {/* Sun / Key Light with Soft Shadow Casting */}
      <directionalLight
        position={isCity ? [15, 35, -20] : [25, 50, 30]}
        intensity={isCity ? 1.4 : 1.6}
        color={isCity ? '#00F0FF' : '#FFF3D1'}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Cyberpunk Magenta Fill Light for City Stage */}
      {isCity && (
        <directionalLight
          position={[-20, 25, -10]}
          intensity={0.9}
          color="#FF007F"
        />
      )}

      {/* Floating Stylized 3D Clouds (Village Stage) */}
      {!isCity && clouds.map((c, idx) => (
        <group key={idx} position={[c.x, c.y, c.z]} scale={c.scale}>
          <mesh position={[0, 0, 0]}>
            <dodecahedronGeometry args={[3]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
          </mesh>
          <mesh position={[2, -0.5, 0]}>
            <dodecahedronGeometry args={[2.2]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
          </mesh>
          <mesh position={[-2, -0.4, 0]}>
            <dodecahedronGeometry args={[2.4]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Golden Glowing Sun Sphere (Village Stage) */}
      {!isCity && (
        <mesh position={[40, 50, -150]}>
          <sphereGeometry args={[12, 16, 16]} />
          <meshBasicMaterial color="#FFDD44" />
        </mesh>
      )}

      {/* Neon Cyber Moon (City Stage) */}
      {isCity && (
        <mesh position={[-35, 45, -150]}>
          <sphereGeometry args={[10, 16, 16]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
      )}
    </>
  );
}
