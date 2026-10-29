import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Rain() {
  const rainRef = useRef();

  const count = 3000;

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      array[i * 3] = (Math.random() - 0.5) * 80;
      array[i * 3 + 1] = Math.random() * 30;
      array[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }

    return array;
  }, []);

  useFrame((_, delta) => {
    if (!rainRef.current) return;

    const positions =
      rainRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= delta * 18;

      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 30;
      }
    }

    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#8fa3ad"
        size={0.035}
        transparent
        opacity={0.5}
      />
    </points>
  );
}