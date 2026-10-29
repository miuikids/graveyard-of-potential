import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";

export default function Player({ enabled = true }) {
  const { camera } = useThree();

  const keys = useRef({});
  const controls = useRef();

  useEffect(() => {
    camera.position.set(0, 1.75, 6);

    const down = (event) => {
      keys.current[event.code] = true;
    };

    const up = (event) => {
      keys.current[event.code] = false;
    };

    const clear = () => {
      keys.current = {};
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, [camera]);

  useFrame((_, delta) => {
    if (!enabled || !controls.current?.isLocked) return;

    const speed = keys.current.ShiftLeft ? 8 : 4;
    const step = Math.min(delta, 0.05) * speed;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3()
      .crossVectors(forward, new THREE.Vector3(0, 1, 0))
      .normalize();

    if (keys.current.KeyW) {
      camera.position.addScaledVector(forward, step);
    }

    if (keys.current.KeyS) {
      camera.position.addScaledVector(forward, -step);
    }

    if (keys.current.KeyA) {
      camera.position.addScaledVector(right, -step);
    }

    if (keys.current.KeyD) {
      camera.position.addScaledVector(right, step);
    }

    camera.position.y = 1.75;
  });

  return <PointerLockControls ref={controls} enabled={enabled} />;
}