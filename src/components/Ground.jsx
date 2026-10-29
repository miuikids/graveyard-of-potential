import { useMemo } from "react";
import * as THREE from "three";

export default function Ground() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(600, 600, 120, 120);
    geo.rotateX(-Math.PI / 2);

    const positions = geo.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      const height =
        Math.sin(x * 0.12) * Math.cos(z * 0.11) * 0.12 +
        Math.sin(x * 0.38 + z * 0.27) * 0.035;

      positions.setY(i, height);
    }

    positions.needsUpdate = true;

    geo.computeVertexNormals();

    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color="#252d2b"
        roughness={0.88}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}