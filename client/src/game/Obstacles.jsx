import React from 'react';

export function Obstacles({ obstacles }) {
  return (
    <group>
      {obstacles.map((obs) => {
        const laneXMap = { '-1': -2.5, '0': 0, '1': 2.5 };
        const xPos = laneXMap[obs.lane] || 0;

        // --- Low Hurdle (Jump Over) ---
        if (obs.type === 'low_hurdle') {
          return (
            <group key={obs.id} position={[xPos, 0, obs.z]}>
              <mesh position={[0, 0.35, 0]}>
                <boxGeometry args={[2.1, 0.7, 0.3]} />
                <meshStandardMaterial color="#8B4513" roughness={0.7} />
              </mesh>
              {/* Caution stripes */}
              <mesh position={[0, 0.5, 0.16]}>
                <boxGeometry args={[1.8, 0.2, 0.05]} />
                <meshBasicMaterial color="#FFD700" />
              </mesh>
            </group>
          );
        }

        // --- Crate Stack (Full Obstacle - Switch Lane) ---
        if (obs.type === 'crate') {
          return (
            <group key={obs.id} position={[xPos, 0, obs.z]}>
              <mesh position={[0, 0.75, 0]}>
                <boxGeometry args={[1.8, 1.5, 1.5]} />
                <meshStandardMaterial color="#CD853F" roughness={0.8} />
              </mesh>
              {/* Metallic border strap */}
              <mesh position={[0, 0.75, 0]}>
                <boxGeometry args={[1.85, 0.15, 1.55]} />
                <meshStandardMaterial color="#444444" metalness={0.7} />
              </mesh>
            </group>
          );
        }

        // --- High Overhead Banner / Sign (Duck / Slide Under) ---
        if (obs.type === 'high_barrier') {
          return (
            <group key={obs.id} position={[xPos, 0, obs.z]}>
              {/* Support Legs */}
              <mesh position={[-0.9, 1.2, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 2.4]} />
                <meshStandardMaterial color="#666" />
              </mesh>
              <mesh position={[0.9, 1.2, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 2.4]} />
                <meshStandardMaterial color="#666" />
              </mesh>
              {/* Top Banner (Height starts at Y=1.5, clearance underneath is ~1.4) */}
              <mesh position={[0, 1.9, 0]}>
                <boxGeometry args={[2.2, 1.0, 0.2]} />
                <meshStandardMaterial color="#E31B23" roughness={0.3} />
              </mesh>
              <mesh position={[0, 1.9, 0.12]}>
                <boxGeometry args={[1.8, 0.4, 0.05]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
          );
        }

        // --- Traffic Cone / Barrier (City Jump) ---
        if (obs.type === 'traffic_cone') {
          return (
            <group key={obs.id} position={[xPos, 0, obs.z]}>
              <mesh position={[0, 0.4, 0]}>
                <coneGeometry args={[0.45, 0.8, 8]} />
                <meshStandardMaterial color="#FF5500" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.35, 0]}>
                <cylinderGeometry args={[0.3, 0.35, 0.15, 8]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
          );
        }

        // --- City Bus / Van ---
        if (obs.type === 'bus') {
          return (
            <group key={obs.id} position={[xPos, 0, obs.z]}>
              <mesh position={[0, 1.2, 0]}>
                <boxGeometry args={[2.1, 2.4, 4.5]} />
                <meshStandardMaterial color="#0055FF" metalness={0.6} roughness={0.3} />
              </mesh>
              {/* Windshield */}
              <mesh position={[0, 1.5, 2.26]}>
                <boxGeometry args={[1.8, 0.9, 0.1]} />
                <meshBasicMaterial color="#00F0FF" />
              </mesh>
            </group>
          );
        }

        return null;
      })}
    </group>
  );
}
