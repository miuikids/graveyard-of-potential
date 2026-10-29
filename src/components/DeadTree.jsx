import { useMemo } from "react";
import * as THREE from "three";

function Branch({ start, end, radius = 0.1, material }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);

    const direction = new THREE.Vector3().subVectors(b, a);
    const midpoint = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);

    return {
      position: midpoint.toArray(),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.clone().normalize()
      ),
      length: direction.length(),
    };
  }, [start, end]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius * 0.55, radius, length, 7]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default function DeadTree({
  position = [0, 0, 0],
  scale = 1,
}) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#65635b",
        roughness: 1,
      }),
    []
  );

  const branches = useMemo(
    () => [
      [[0, 0, 0], [0.15, 2.5, 0], 0.35],
      [[0.15, 2.5, 0], [-0.1, 5.1, 0.1], 0.24],
      [[-0.1, 5.1, 0.1], [0.25, 7.1, 0], 0.12],

      [[0.1, 3.1, 0], [-1.6, 4.7, 0.3], 0.18],
      [[-1.6, 4.7, 0.3], [-2.4, 5.7, 0.5], 0.09],
      [[-1.6, 4.7, 0.3], [-2.8, 4.9, -0.1], 0.07],

      [[0, 3.8, 0], [1.8, 5.2, -0.2], 0.17],
      [[1.8, 5.2, -0.2], [2.7, 6.3, -0.4], 0.09],
      [[1.8, 5.2, -0.2], [2.9, 5.1, 0.4], 0.07],

      [[-0.1, 5.1, 0], [-1.2, 6.5, 0.4], 0.09],
      [[-0.1, 5.1, 0], [1.1, 6.8, -0.3], 0.09],
    ],
    []
  );

  return (
    <group position={position} scale={scale}>
      {branches.map(([start, end, radius], index) => (
        <Branch
          key={index}
          start={start}
          end={end}
          radius={radius}
          material={material}
        />
      ))}
    </group>
  );
}