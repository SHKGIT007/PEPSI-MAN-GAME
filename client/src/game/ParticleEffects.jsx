import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleEffects({ stage, playerPos, speed }) {
  const dustRef = useRef();
  const ambientParticlesRef = useRef();

  // 1. Running Footstep Dust Particles
  const dustCount = 30;
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.2;
      pos[i * 3 + 1] = Math.random() * 0.4;
      pos[i * 3 + 2] = -Math.random() * 6;
    }
    return pos;
  }, [dustCount]);

  // 2. Ambient Fireflies / Cyber Specks
  const ambientCount = 80;
  const ambientPositions = useMemo(() => {
    const pos = new Float32Array(ambientCount * 3);
    for (let i = 0; i < ambientCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = 1 + Math.random() * 12;
      pos[i * 3 + 2] = -Math.random() * 120;
    }
    return pos;
  }, [ambientCount]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Animate Footstep Dust floating backwards
    if (dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array;
      for (let i = 0; i < dustCount; i++) {
        // Move dust backwards along Z
        positions[i * 3 + 2] += delta * speed;
        // Expand slightly on Y
        positions[i * 3 + 1] += delta * 0.5;

        // Reset dust loop
        if (positions[i * 3 + 2] > 2) {
          positions[i * 3] = playerPos.x + (Math.random() - 0.5) * 0.8;
          positions[i * 3 + 1] = 0.1;
          positions[i * 3 + 2] = playerPos.z - Math.random() * 1.5;
        }
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate Ambient Fireflies floating softly
    if (ambientParticlesRef.current) {
      const pos = ambientParticlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < ambientCount; i++) {
        pos[i * 3 + 1] += Math.sin(time * 2 + i) * 0.015;
        pos[i * 3] += Math.cos(time * 1.5 + i) * 0.01;
      }
      ambientParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Running Footstep Dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustCount}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={stage === 'City' ? 0.25 : 0.35}
          color={stage === 'City' ? '#00F0FF' : '#D2B48C'}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>

      {/* Floating Ambient Fireflies / Cyber Specks */}
      <points ref={ambientParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={ambientCount}
            array={ambientPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.4}
          color={stage === 'City' ? '#FF007F' : '#FFFF55'}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
