import { Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Палитра старого камня
const STONE_COLORS = [
  "#555c57",
  "#62675f",
  "#464d49",
  "#77776d",
  "#505955",
  "#686a62",
];

function hashString(value) {
  return String(value)
    .split("")
    .reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0
    );
}

// Создаём контур старинного памятника
function createStoneShape(type) {
  const shape = new THREE.Shape();

  if (type === "victorian") {
    shape.moveTo(-0.75, 0);

    shape.lineTo(-0.75, 1.65);

    shape.bezierCurveTo(
      -0.75, 2.1,
      -0.35, 2.35,
      0, 2.4
    );

    shape.bezierCurveTo(
      0.35, 2.35,
      0.75, 2.1,
      0.75, 1.65
    );

    shape.lineTo(0.75, 0);
  }

  else if (type === "gothic") {
    shape.moveTo(-0.7, 0);

    shape.lineTo(-0.7, 1.7);

    shape.quadraticCurveTo(
      -0.7, 2.05,
      0, 2.7
    );

    shape.quadraticCurveTo(
      0.7, 2.05,
      0.7, 1.7
    );

    shape.lineTo(0.7, 0);
  }

  else if (type === "broken") {
    shape.moveTo(-0.7, 0);

    shape.lineTo(-0.7, 2.1);

    shape.lineTo(-0.35, 2.25);

    shape.lineTo(-0.15, 2.02);

    shape.lineTo(0.1, 2.2);

    shape.lineTo(0.35, 1.95);

    shape.lineTo(0.7, 2.05);

    shape.lineTo(0.7, 0);
  }

  else {
    shape.moveTo(-0.7, 0);

    shape.lineTo(-0.7, 1.75);

    shape.quadraticCurveTo(
      -0.7, 2.45,
      0, 2.45
    );

    shape.quadraticCurveTo(
      0.7, 2.45,
      0.7, 1.75
    );

    shape.lineTo(0.7, 0);
  }

  shape.closePath();

  return shape;
}

// Объёмная каменная стела
function StoneMonument({ type, color }) {
  const geometry = useMemo(() => {
    const shape = createStoneShape(type);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.055,
      bevelSize: 0.055,
      bevelSegments: 3,
      steps: 1,
      curveSegments: 12,
    });

    geo.translate(0, 0, -0.14);

    return geo;
  }, [type]);

  return (
    <group>
      <mesh
        geometry={geometry}
        position={[0, 0.25, 0]}
        rotation={[
          0,
          0,
          type === "broken" ? 0.07 : 0,
        ]}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.98}
          metalness={0}
        />
      </mesh>

      {/* Нижний каменный постамент */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[1.85, 0.32, 0.8]} />

        <meshStandardMaterial
          color="#3c4440"
          roughness={1}
        />
      </mesh>

      {/* Декоративная ступень */}
      <mesh position={[0, 0.34, 0]}>
        <boxGeometry args={[1.65, 0.12, 0.65]} />

        <meshStandardMaterial
          color={color}
          roughness={1}
        />
      </mesh>
    </group>
  );
}

// Каменный обелиск
function Obelisk({ color }) {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.8, 0.4, 1.1]} />

        <meshStandardMaterial
          color="#3d4541"
          roughness={1}
        />
      </mesh>

      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[1.45, 0.2, 0.9]} />

        <meshStandardMaterial
          color={color}
          roughness={1}
        />
      </mesh>

      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry
          args={[0.28, 0.52, 2.1, 4]}
        />

        <meshStandardMaterial
          color={color}
          roughness={1}
        />
      </mesh>

      <mesh position={[0, 2.85, 0]}>
        <coneGeometry args={[0.4, 0.65, 4]} />

        <meshStandardMaterial
          color={color}
          roughness={1}
        />
      </mesh>

      {/* Мемориальная табличка */}
      <mesh position={[0, 0.72, 0.53]}>
        <boxGeometry args={[1.15, 0.65, 0.08]} />

        <meshStandardMaterial
          color="#333a37"
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

// Низкая мемориальная плита
function MemorialSlab({ color }) {
  return (
    <group>
      <mesh
        position={[0, 0.22, 0]}
        rotation={[-0.12, 0, 0]}
      >
        <boxGeometry args={[1.5, 0.24, 2]} />

        <meshStandardMaterial
          color={color}
          roughness={1}
        />
      </mesh>

      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.7, 0.16, 2.2]} />

        <meshStandardMaterial
          color="#343b37"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

// Свеча
function Candle({ position, index }) {
  const flame = useRef();

  useFrame(({ clock }) => {
    if (!flame.current) return;

    const time = clock.getElapsedTime();

    const flicker =
      1 +
      Math.sin(time * 7 + index) * 0.08 +
      Math.sin(time * 11 + index * 2) * 0.04;

    flame.current.scale.set(
      flicker,
      flicker * 1.2,
      flicker
    );
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry
          args={[0.075, 0.09, 0.28, 8]}
        />

        <meshStandardMaterial
          color="#d4c4a7"
          roughness={0.9}
        />
      </mesh>

      <mesh
        ref={flame}
        position={[0, 0.35, 0]}
      >
        <sphereGeometry args={[0.05, 8, 8]} />

        <meshBasicMaterial color="#ffb65c" />
      </mesh>
    </group>
  );
}

// Главный компонент памятника
export default function Grave({
  grave,
  onSelect,
  candleCount = 0,
}) {
  const seed = hashString(grave.id);

  const color =
    STONE_COLORS[seed % STONE_COLORS.length];

  // Поддерживаем старые типы могил
  const monumentType = useMemo(() => {
    if (grave.type === "obelisk") {
      return "obelisk";
    }

    if (grave.type === "cross") {
      return "gothic";
    }

    if (grave.type === "slab") {
      return "slab";
    }

    if (grave.type === "victorian") {
      return "victorian";
    }

    if (grave.type === "broken") {
      return "broken";
    }

    const variants = [
      "stone",
      "victorian",
      "gothic",
      "broken",
    ];

    return variants[seed % variants.length];
  }, [grave.type, seed]);

  const visibleCandles = Math.min(
    candleCount,
    8
  );

  const rotation = grave.rotation || 0;

  const scale = grave.scale || 1;

  const isObelisk = monumentType === "obelisk";
  const isSlab = monumentType === "slab";

  return (
    <group position={grave.position}>
      {/* Все повороты теперь локальные */}
      <group
        rotation={[0, rotation, 0]}
        scale={scale}
      >
        {isObelisk ? (
          <Obelisk color={color} />
        ) : isSlab ? (
          <MemorialSlab color={color} />
        ) : (
          <StoneMonument
            type={monumentType}
            color={color}
          />
        )}

        {/* Надписи */}
        {!isSlab && (
          <>
            <Text
              position={[
                0,
                isObelisk ? 0.79 : 1.65,
                isObelisk ? 0.585 : 0.23,
              ]}
              fontSize={isObelisk ? 0.1 : 0.13}
              maxWidth={isObelisk ? 1 : 1.15}
              textAlign="center"
              color="#d4d5cd"
              anchorX="center"
              anchorY="middle"
            >
              {grave.title}
            </Text>

            <Text
              position={[
                0,
                isObelisk ? 0.48 : 0.9,
                isObelisk ? 0.585 : 0.23,
              ]}
              fontSize={0.09}
              color="#b8b9af"
              anchorX="center"
            >
              {grave.years}
            </Text>
          </>
        )}

        {isSlab && (
          <Text
            position={[0, 0.38, 0]}
            rotation={[-Math.PI / 2 - 0.12, 0, 0]}
            fontSize={0.13}
            maxWidth={1.2}
            textAlign="center"
            color="#d4d5cd"
          >
            {grave.title}
          </Text>
        )}

        {/* Свечи */}
        {Array.from({
          length: visibleCandles,
        }).map((_, index) => (
          <Candle
            key={index}
            index={index}
            position={[
              (index % 4) * 0.24 - 0.36,
              0.1,
              0.8 +
                Math.floor(index / 4) * 0.25,
            ]}
          />
        ))}

        {visibleCandles > 0 && (
          <pointLight
            position={[0, 0.8, 0.8]}
            intensity={
              0.15 + visibleCandles * 0.05
            }
            distance={2.5}
            color="#ff9944"
          />
        )}

        {/* Область взаимодействия */}
        <mesh
          position={[0, 1.2, 0]}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(grave);
          }}
        >
          <boxGeometry args={[1.9, 2.8, 0.8]} />

          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}