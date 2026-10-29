import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import * as THREE from "three";

import Ground from "./components/Ground";
import Grave from "./components/Grave";
import Player from "./components/Player";
import Path from "./components/Path";
import ProceduralWorld from "./components/ProceduralWorld";
import RainSynth from "./components/RainSynth";
import BuryModal from "./components/BuryModal";

import useUserGraves from "./hooks/useUserGraves";
import useCandles from "./hooks/useCandles";

import { graves } from "./data/graves";
import { CELL_SIZE } from "./utils/roads";

import "./App.css";

// ==========================================
// PLAYER TRACKER
// ==========================================

function PlayerTracker({ onMove }) {
  const { camera } = useThree();
  const lastChunk = useRef("");

  useFrame(() => {
    const x = Math.floor(
      camera.position.x / CELL_SIZE
    );

    const z = Math.floor(
      camera.position.z / CELL_SIZE
    );

    const current = `${x}-${z}`;

    if (current !== lastChunk.current) {
      lastChunk.current = current;
      onMove(camera.position.toArray());
    }
  });

  return null;
}

// ==========================================
// GRAVE INTERACTION
// ==========================================

function GraveInteraction({ onSelect, active }) {
  const { camera, scene } = useThree();

  const raycaster = useRef(new THREE.Raycaster());
  const nearbyRef = useRef(null);

  useFrame(() => {
    if (!active) {
      nearbyRef.current = null;
      return;
    }

    raycaster.current.setFromCamera(
      new THREE.Vector2(0, 0),
      camera
    );

    raycaster.current.far = 4;

    const hits = raycaster.current.intersectObjects(
      scene.children,
      true
    );

    let found = null;

    for (const hit of hits) {
      let object = hit.object;

      while (object) {
        if (object.userData.grave) {
          found = object.userData.grave;
          break;
        }

        object = object.parent;
      }

      if (found) break;
    }

    nearbyRef.current = found;
  });

  useEffect(() => {
    const handleKey = (event) => {
      if (
        event.code === "KeyE" &&
        nearbyRef.current &&
        active
      ) {
        onSelect(nearbyRef.current);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [onSelect, active]);

  return null;
}

// ==========================================
// ORIGINAL GRAVES
// ==========================================

function OriginalGraves({ onSelect, candles }) {
  return graves.map((grave) => (
    <group key={grave.id} userData={{ grave }}>
      <Grave
        grave={grave}
        onSelect={onSelect}
        candleCount={candles[grave.id] || 0}
      />
    </group>
  ));
}

// ==========================================
// USER GRAVES
// ==========================================

function UserGraves({
  graves: userGraves,
  onSelect,
  candles,
}) {
  return userGraves.map((grave, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;

    const positionedGrave = {
      ...grave,
      position: [
        5 + column * 4,
        0,
        -8 - row * 4,
      ],
    };

    return (
      <group
        key={grave.id}
        userData={{ grave: positionedGrave }}
      >
        <Grave
          grave={positionedGrave}
          onSelect={onSelect}
          candleCount={candles[grave.id] || 0}
        />
      </group>
    );
  });
}

// ==========================================
// WORLD
// ==========================================

function World({
  onSelect,
  active,
  userGraves,
  candles,
}) {
  const [playerPosition, setPlayerPosition] =
    useState([0, 0, 0]);

  return (
    <>
      <color attach="background" args={["#252e30"]} />

      <fog attach="fog" args={["#252e30", 18, 85]} />

      <ambientLight
        intensity={1.1}
        color="#b1bec3"
      />

      <hemisphereLight
        args={["#c0cbd0", "#40483f", 1.3]}
      />

      <directionalLight
        position={[-30, 40, 15]}
        intensity={1.4}
        color="#c8d1d3"
      />

      <Ground />

      <Path playerPosition={playerPosition} />

      <OriginalGraves
        onSelect={onSelect}
        candles={candles}
      />

      <ProceduralWorld
        playerPosition={playerPosition}
        onSelect={onSelect}
        candles={candles}
      />

      <UserGraves
        graves={userGraves}
        onSelect={onSelect}
        candles={candles}
      />

      <Player enabled={active} />

      <PlayerTracker onMove={setPlayerPosition} />

      <GraveInteraction
        onSelect={onSelect}
        active={active}
      />
    </>
  );
}

// ==========================================
// APP
// ==========================================

export default function App() {
  const [selectedGrave, setSelectedGrave] =
    useState(null);

  const [buryOpen, setBuryOpen] =
    useState(false);

  const { userGraves, addGrave } =
    useUserGraves();

  const {
    candles,
    lightCandle,
    getCandleCount,
  } = useCandles();

  const handleSelect = useCallback((grave) => {
    document.exitPointerLock?.();
    setSelectedGrave(grave);
  }, []);

  const handleBury = (grave) => {
    addGrave(grave);
    setBuryOpen(false);
  };

  const openBury = () => {
    document.exitPointerLock?.();
    setBuryOpen(true);
  };

  const active = !selectedGrave && !buryOpen;

  return (
    <div className="app">
      <Canvas
        camera={{
          position: [0, 1.75, 6],
          fov: 75,
          near: 0.1,
          far: 180,
        }}
      >
        <World
          onSelect={handleSelect}
          active={active}
          userGraves={userGraves}
          candles={candles}
        />
      </Canvas>

      <div className="site-title">
        THE GRAVEYARD OF POTENTIAL
      </div>

      <div className="site-subtitle">
        Здесь покоится то, что могло бы быть.
      </div>

      {active && <div className="crosshair">+</div>}

      <div className="controls">
        НАЖМИ НА ЭКРАН · WASD — ИДТИ · SHIFT — БЕГ · E — ЧИТАТЬ
      </div>

      <button
        className="bury-button"
        onClick={openBury}
      >
        ⚰ Похоронить идею
      </button>

      {/* Новая лаборатория дождя */}
      <RainSynth />

      {selectedGrave && (
        <div className="grave-overlay">
          <div className="grave-card">
            <div className="rip">R.I.P.</div>

            <h1>{selectedGrave.title}</h1>

            <div className="years">
              {selectedGrave.years}
            </div>

            <p>{selectedGrave.story}</p>

            <div
              style={{
                marginBottom: "25px",
                color: "#b9a17b",
              }}
            >
              🕯 {getCandleCount(selectedGrave.id)} свечей
            </div>

            <button
              onClick={() =>
                lightCandle(selectedGrave.id)
              }
              style={{ marginBottom: "15px" }}
            >
              🕯 Зажечь свечу
            </button>

            <button
              onClick={() =>
                setSelectedGrave(null)
              }
            >
              Вернуться на кладбище
            </button>
          </div>
        </div>
      )}

      {buryOpen && (
        <BuryModal
          onClose={() => setBuryOpen(false)}
          onBury={handleBury}
        />
      )}
    </div>
  );
}