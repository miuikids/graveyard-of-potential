import { useMemo } from "react";

import {
  CELL_SIZE,
  ROAD_WIDTH,
  verticalRoadX,
  horizontalRoadZ,
} from "../utils/roads";

// Детерминированное случайное число
function random(seed) {
  const value =
    Math.sin(seed * 127.1 + 78.233) * 43758.5453;

  return value - Math.floor(value);
}

// Один участок дорожной сети
function RoadChunk({ chunkX, chunkZ }) {
  const stones = useMemo(() => {
    const result = [];

    const baseX = chunkX * CELL_SIZE;
    const baseZ = chunkZ * CELL_SIZE;

    const step = 1.8;

    // Вертикальная дорожка
    for (let z = baseZ; z < baseZ + CELL_SIZE; z += step) {
      const roadX = verticalRoadX(chunkX, z);

      for (let column = -1; column <= 1; column++) {
        const seed =
          chunkX * 10000 +
          chunkZ * 1000 +
          z * 13 +
          column * 17;

        const variation = random(seed);

        result.push({
          key: `v-${z}-${column}`,

          position: [
            roadX + column * 1.05 +
              (variation - 0.5) * 0.12,
            0.075,
            z + step / 2,
          ],

          rotation: [
            0,
            (variation - 0.5) * 0.08,
            0,
          ],

          color:
            variation > 0.5
              ? "#4c5350"
              : "#3d4643",
        });
      }
    }

    // Горизонтальная дорожка
    for (let x = baseX; x < baseX + CELL_SIZE; x += step) {
      const roadZ = horizontalRoadZ(chunkZ, x);

      for (let column = -1; column <= 1; column++) {
        const seed =
          chunkX * 20000 +
          chunkZ * 2000 +
          x * 19 +
          column * 23;

        const variation = random(seed);

        result.push({
          key: `h-${x}-${column}`,

          position: [
            x + step / 2,
            0.085,
            roadZ + column * 1.05 +
              (variation - 0.5) * 0.12,
          ],

          rotation: [
            0,
            Math.PI / 2 +
              (variation - 0.5) * 0.08,
            0,
          ],

          color:
            variation > 0.5
              ? "#454e4a"
              : "#555d58",
        });
      }
    }

    return result;
  }, [chunkX, chunkZ]);

  return (
    <group>
      {stones.map((stone) => (
        <mesh
          key={stone.key}
          position={stone.position}
          rotation={stone.rotation}
        >
          <boxGeometry
            args={[
              ROAD_WIDTH / 3 - 0.06,
              0.09,
              1.7,
            ]}
          />

          <meshStandardMaterial
            color={stone.color}
            roughness={0.96}
            metalness={0.02}
          />
        </mesh>
      ))}
    </group>
  );
}

// Сеть дорожек вокруг игрока
export default function Path({
  playerPosition = [0, 0, 0],
}) {
  const chunkX = Math.floor(
    playerPosition[0] / CELL_SIZE
  );

  const chunkZ = Math.floor(
    playerPosition[2] / CELL_SIZE
  );

  const chunks = [];

  for (let x = -1; x <= 1; x++) {
    for (let z = -1; z <= 1; z++) {
      chunks.push({
        x: chunkX + x,
        z: chunkZ + z,
      });
    }
  }

  return (
    <group>
      {chunks.map((chunk) => (
        <RoadChunk
          key={`${chunk.x}-${chunk.z}`}
          chunkX={chunk.x}
          chunkZ={chunk.z}
        />
      ))}
    </group>
  );
}