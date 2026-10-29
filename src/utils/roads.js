export const CELL_SIZE = 36;

export const ROAD_WIDTH = 3.2;

// Вертикальные дорожки
export function verticalRoadX(index, z) {
  return (
    index * CELL_SIZE +
    Math.sin(z * 0.035 + index * 1.7) * 2.4
  );
}

// Горизонтальные дорожки
export function horizontalRoadZ(index, x) {
  return (
    index * CELL_SIZE +
    Math.sin(x * 0.035 + index * 1.9) * 2.4
  );
}

// Расстояние до ближайшей дорожки
export function distanceToRoad(x, z) {
  const verticalIndex = Math.round(x / CELL_SIZE);
  const horizontalIndex = Math.round(z / CELL_SIZE);

  let distance = Infinity;

  for (let i = -1; i <= 1; i++) {
    const index = verticalIndex + i;

    const roadX = verticalRoadX(index, z);

    distance = Math.min(
      distance,
      Math.abs(x - roadX)
    );
  }

  for (let i = -1; i <= 1; i++) {
    const index = horizontalIndex + i;

    const roadZ = horizontalRoadZ(index, x);

    distance = Math.min(
      distance,
      Math.abs(z - roadZ)
    );
  }

  return distance;
}

// Размещение памятников
export function canPlaceGrave(x, z) {
  return distanceToRoad(x, z) > ROAD_WIDTH / 2 + 2;
}

// Размещение деревьев
export function canPlaceTree(x, z) {
  return distanceToRoad(x, z) > ROAD_WIDTH / 2 + 4;
}