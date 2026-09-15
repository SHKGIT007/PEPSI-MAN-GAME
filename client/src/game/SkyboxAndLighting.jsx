import React, { useMemo } from 'react';
import * as THREE from 'three';

export function SkyboxAndLighting({ stage }) {
  const isCity = stage === 'City';

  // Floating clouds for Village Stage
  const clouds = useMemo(() => {
    const list = [];
    for (let i = 0; i < 18; i++) {
      list.push({
        x: (Math.random() - 0.5) * 140,
        y: 22 + Math.random() * 16,
        z: -Math.random() * 220,
        scale: 1.2 + Math.random() * 1.8
      });
    }
    return list;
  }, []);

  return (
    <>
      {/* Rich Sky Color & Depth Fog */}
      <color attach="background" args={[isCity ? '#060919' : '#599EFF']} />
      <fog attach="fog" args={[isCity ? '#060919' : '#7BB7FF', 25, 170]} />

      {/* Hemisphere Skylight (Vibrant Sky & Ground Ambient bounce) */}
      <hemisphereLight
        skyColor={isCity ? '#1F2942' : '#87CEEB'}
        groundColor={isCity ? '#090D1A' : '#3E6B39'}
        intensity={isCity ? 0.7 : 1.1}
      />

      {/* Main Directional Sun / Spotlight with Soft Shadows */}
      <directionalLight
        position={isCity ? [15, 40, -10] : [30, 60, 35]}
        intensity={isCity ? 1.6 : 1.9}
        color={isCity ? '#00F0FF' : '#FFF2C6'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={220}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Dynamic Fill Accent Light */}
      <directionalLight
        position={[-25, 30, -15]}
        intensity={isCity ? 1.2 : 0.5}
        color={isCity ? '#FF007F' : '#90D5FF'}
      />

      {/* Player Front Key Highlight PointLight */}
      <pointLight position={[0, 4, 3]} intensity={0.8} color={isCity ? '#00F0FF' : '#FFFFFF'} distance={12} />

      {/* Floating 3D Clouds (Village Stage) */}
      {!isCity && clouds.map((c, idx) => (
        <group key={idx} position={[c.x, c.y, c.z]} scale={c.scale}>
          <mesh position={[0, 0, 0]}>
            <dodecahedronGeometry args={[3.2]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
          </mesh>
          <mesh position={[2.2, -0.4, 0]}>
            <dodecahedronGeometry args={[2.4]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
          </mesh>
          <mesh position={[-2.2, -0.3, 0]}>
            <dodecahedronGeometry args={[2.5]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Sun / Moon Spheres */}
      {!isCity ? (
        <mesh position={[45, 55, -160]}>
          <sphereGeometry args={[14, 24, 24]} />
          <meshBasicMaterial color="#FFDD44" />
        </mesh>
      ) : (
        <mesh position={[-40, 50, -160]}>
          <sphereGeometry args={[12, 24, 24]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
      )}
    </>
  );
}
