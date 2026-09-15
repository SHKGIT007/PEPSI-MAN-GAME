import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Canvas Texture generator for exact Cartoon Tree (Image Match)
function getCartoonTreeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Clear background
  ctx.clearRect(0, 0, 512, 512);

  // 1. Roots Base at bottom
  ctx.fillStyle = '#6D3F1B';
  ctx.beginPath();
  ctx.moveTo(170, 470);
  ctx.quadraticCurveTo(256, 420, 342, 470);
  ctx.lineTo(410, 500);
  ctx.lineTo(102, 500);
  ctx.closePath();
  ctx.fill();

  // 2. Trunk with Bark Texture
  ctx.fillStyle = '#834C20';
  ctx.beginPath();
  ctx.moveTo(215, 460);
  ctx.quadraticCurveTo(195, 340, 175, 250);
  ctx.lineTo(337, 250);
  ctx.quadraticCurveTo(317, 340, 297, 460);
  ctx.closePath();
  ctx.fill();

  // Bark Line Shading
  ctx.strokeStyle = '#573010';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(235, 450); ctx.quadraticCurveTo(220, 350, 205, 270);
  ctx.moveTo(277, 450); ctx.quadraticCurveTo(292, 350, 307, 270);
  ctx.stroke();

  // Hollow Tree Knot Hole (matching image)
  ctx.fillStyle = '#3D2008';
  ctx.beginPath();
  ctx.ellipse(256, 370, 16, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#6D3F1B';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 3. Spreading Branches
  ctx.lineWidth = 18;
  ctx.strokeStyle = '#834C20';
  ctx.beginPath();
  ctx.moveTo(215, 270); ctx.quadraticCurveTo(150, 210, 100, 170);
  ctx.moveTo(297, 270); ctx.quadraticCurveTo(362, 210, 412, 170);
  ctx.stroke();

  // 4. Scalloped Lush Green Foliage Cloud Canopy
  const drawCloudPuff = (cx, cy, r, color, outlineColor) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = outlineColor || '#236017';
    ctx.stroke();
  };

  // Base Darker Canopy Layer
  drawCloudPuff(130, 210, 85, '#2D751E', '#1C4E13');
  drawCloudPuff(382, 210, 85, '#2D751E', '#1C4E13');
  drawCloudPuff(256, 220, 95, '#2D751E', '#1C4E13');

  // Middle Main Green Canopy
  drawCloudPuff(170, 150, 90, '#46AA2B', '#276817');
  drawCloudPuff(342, 150, 90, '#46AA2B', '#276817');
  drawCloudPuff(256, 130, 105, '#46AA2B', '#276817');

  // Top Light Green Highlight Puffs (matching reference image)
  drawCloudPuff(256, 85, 80, '#75E048', '#388F1F');
  drawCloudPuff(200, 95, 70, '#86EC59', '#388F1F');
  drawCloudPuff(312, 95, 70, '#86EC59', '#388F1F');

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// --- Cartoon Tree Component ---
function ReferenceCartoonTree({ position, scale = 1 }) {
  const groupRef = useRef();

  // Create texture once in memory
  const treeTexture = useMemo(() => getCartoonTreeTexture(), []);

  // Wind sway animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.z = Math.sin(time * 1.5 + position[2]) * 0.03;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Ground Shadow */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ellipseGeometry args={[2.2, 1.4]} />
        <meshBasicMaterial color="#224422" transparent opacity={0.4} />
      </mesh>

      {/* Front Facing Billboard Sprite */}
      <group ref={groupRef} position={[0, 4.2, 0]}>
        <mesh>
          <planeGeometry args={[7.5, 8.5]} />
          <meshBasicMaterial
            map={treeTexture}
            transparent={true}
            alphaTest={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[7.5, 8.5]} />
          <meshBasicMaterial
            map={treeTexture}
            transparent={true}
            alphaTest={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

export function VillageStage({ zOffset }) {
  const waterRef = useRef();

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.3;
    }
  });

  const { trees, houses, bushes, flowers, fences, rocks } = useMemo(() => {
    const treeList = [];
    const houseList = [];
    const bushList = [];
    const flowerList = [];
    const fenceList = [];
    const rockList = [];

    // Dense lining of Cartoon Trees matching user reference image
    for (let i = 0; i < 26; i++) {
      const z = -i * 8;
      const side = i % 2 === 0 ? -1 : 1;
      const scale = 0.95 + (i % 3) * 0.15;
      treeList.push({ side, xDist: 7.2 + (i % 3) * 0.8, z, scale });
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
        xDist: 5.4 + Math.random() * 0.6,
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

    // Rocks
    for (let i = 0; i < 16; i++) {
      const z = -i * 12 - 5;
      rockList.push({ side: i % 2 === 0 ? -1 : 1, z, scale: 0.6 + Math.random() * 0.5 });
    }

    return { trees: treeList, houses: houseList, bushes: bushList, flowers: flowerList, fences: fenceList, rocks: rockList };
  }, []);

  return (
    <group position={[0, 0, zOffset]}>
      {/* Dirt Running Track */}
      <mesh position={[0, -0.04, -100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.5, 300]} />
        <meshStandardMaterial color="#6E4723" roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Center Tread Lines */}
      {[-2.2, 0, 2.2].map((x, idx) => (
        <mesh key={idx} position={[x, -0.03, -100]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.4, 300]} />
          <meshStandardMaterial color="#543415" roughness={0.95} />
        </mesh>
      ))}

      {/* Track Edge Strips */}
      <mesh position={[-4.8, 0.04, -100]} receiveShadow>
        <boxGeometry args={[0.5, 0.16, 300]} />
        <meshStandardMaterial color="#422910" roughness={0.9} />
      </mesh>
      <mesh position={[4.8, 0.04, -100]} receiveShadow>
        <boxGeometry args={[0.5, 0.16, 300]} />
        <meshStandardMaterial color="#422910" roughness={0.9} />
      </mesh>

      {/* Lush Green Fields */}
      <mesh position={[-60, -0.1, -100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[110, 300]} />
        <meshStandardMaterial color="#3A6B43" roughness={0.8} />
      </mesh>
      <mesh position={[60, -0.1, -100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[110, 300]} />
        <meshStandardMaterial color="#3A6B43" roughness={0.8} />
      </mesh>

      {/* River Stream & Cobblestone Bridge */}
      <group position={[0, 0, -120]}>
        <mesh ref={waterRef} position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[120, 18]} />
          <meshStandardMaterial color="#0080FF" roughness={0.1} metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[10.2, 0.35, 18]} />
          <meshStandardMaterial color="#665544" roughness={0.85} />
        </mesh>
        <mesh position={[-4.9, 0.7, 0]}>
          <boxGeometry args={[0.3, 1.1, 18]} />
          <meshStandardMaterial color="#5C3A21" />
        </mesh>
        <mesh position={[4.9, 0.7, 0]}>
          <boxGeometry args={[0.3, 1.1, 18]} />
          <meshStandardMaterial color="#5C3A21" />
        </mesh>
      </group>

      {/* --- Render Reference Cartoon Trees --- */}
      {trees.map((t, idx) => (
        <ReferenceCartoonTree key={idx} position={[t.side * t.xDist, 0, t.z]} scale={t.scale} />
      ))}

      {/* Bushes */}
      {bushes.map((b, idx) => (
        <mesh key={idx} position={[b.side * b.xDist, 0.5, b.z]} castShadow>
          <sphereGeometry args={[0.8, 8, 8]} />
          <meshStandardMaterial color="#2E8A42" roughness={0.8} />
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

      {/* Cottages */}
      {houses.map((h, idx) => (
        <group key={idx} position={[h.side * 14.5, 0, h.z]} rotation={[0, h.rotY, 0]}>
          <mesh position={[0, 0.4, 0]} receiveShadow>
            <boxGeometry args={[6.4, 0.8, 6.4]} />
            <meshStandardMaterial color="#555555" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[6, 3.5, 6]} />
            <meshStandardMaterial color={h.color} roughness={0.8} />
          </mesh>
          <mesh position={[0, 5.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[5.2, 3.2, 4]} />
            <meshStandardMaterial color="#8B3A2B" roughness={0.85} />
          </mesh>
          <mesh position={[0, 2.6, 3.02]}>
            <boxGeometry args={[1.2, 1.2, 0.1]} />
            <meshBasicMaterial color="#FFCC33" />
          </mesh>
        </group>
      ))}

      {/* Fences */}
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

      {/* Rocks */}
      {rocks.map((r, idx) => (
        <mesh key={idx} position={[r.side * 5.3, 0.4 * r.scale, r.z]} scale={r.scale} castShadow>
          <dodecahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#666666" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
