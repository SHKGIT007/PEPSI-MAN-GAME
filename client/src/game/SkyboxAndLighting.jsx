import React from 'react';

export function SkyboxAndLighting({ stage }) {
  const isCity = stage === 'City';

  return (
    <>
      {/* Stage Fog for smooth depth clipping */}
      <color attach="background" args={[isCity ? '#080C1B' : '#70B5FF']} />
      <fog attach="fog" args={[isCity ? '#080C1B' : '#70B5FF', 20, 140]} />

      {/* Ambient Light */}
      <ambientLight intensity={isCity ? 0.4 : 0.8} />

      {/* Main Directional Sun / City Spotlight */}
      <directionalLight
        position={isCity ? [10, 30, -20] : [20, 40, 20]}
        intensity={isCity ? 1.2 : 1.5}
        color={isCity ? '#00E5FF' : '#FFF5CC'}
        castShadow
      />

      {/* Secondary Fill Light */}
      <directionalLight
        position={[-15, 20, -10]}
        intensity={isCity ? 0.8 : 0.4}
        color={isCity ? '#FF007F' : '#88CCFF'}
      />
    </>
  );
}
