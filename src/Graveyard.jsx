import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Graveyard() {
  return (
    <Canvas
      camera={{
        position: [0, 5, 10],
        fov: 75,
      }}
    >
      {/* Цвет неба */}
      <color attach="background" args={["#080b0d"]} />

      {/* Освещение */}
      <ambientLight intensity={1} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
      />

      {/* Земля */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#252525" />
      </mesh>

      {/* Тестовое надгробие */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshStandardMaterial color="#777777" />
      </mesh>

      <OrbitControls />
    </Canvas>
  );
}