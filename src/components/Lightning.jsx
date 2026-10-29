import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Lightning() {
  const lightRef = useRef();

  const nextFlash = useRef(5);
  const flashEnd = useRef(0);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;

    const time = clock.getElapsedTime();

    // Начало вспышки
    if (time >= nextFlash.current) {
      lightRef.current.intensity = 7;

      flashEnd.current = time + 0.12;

      nextFlash.current =
        time + 6 + Math.random() * 12;
    }

    // Завершение вспышки
    if (
      flashEnd.current > 0 &&
      time >= flashEnd.current
    ) {
      lightRef.current.intensity = 0;
      flashEnd.current = 0;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 30, -20]}
      intensity={0}
      distance={150}
      color="#b9d9ff"
    />
  );
}