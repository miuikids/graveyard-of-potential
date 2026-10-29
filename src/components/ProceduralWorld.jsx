import { useMemo } from "react";

import Grave from "./Grave";
import DeadTree from "./DeadTree";

import {
  CELL_SIZE,
  canPlaceGrave,
  canPlaceTree,
} from "../utils/roads";

const STORIES = [
  {
    title: "Мой первый роман",
    years: "2015 — 2018",
    story:
      "Я написал 47 страниц. Потом решил, что никому это не будет интересно.",
  },
  {
    title: "Кофейня у моря",
    years: "2019 — 2022",
    story:
      "У меня даже было название. Но я так и не решился оставить работу.",
  },
  {
    title: "Путешествие в Японию",
    years: "2016 — 2024",
    story:
      "Каждый год откладывал деньги. Каждый год находились дела важнее.",
  },
  {
    title: "Научиться рисовать",
    years: "2012 — 2017",
    story:
      "Я купил планшет и нарисовал три картинки. Потом перестал.",
  },
  {
    title: "Группа с друзьями",
    years: "2008 — 2011",
    story:
      "Мы репетировали в гараже. Теперь даже не общаемся.",
  },
  {
    title: "Собственная игра",
    years: "2020 — 2023",
    story:
      "В моей голове она была прекрасной. На компьютере осталась пустая папка.",
  },
  {
    title: "Дом в горах",
    years: "2014 — 2021",
    story:
      "Я представлял утро с видом на горы. Но так и не уехал из города.",
  },
  {
    title: "Признаться ей",
    years: "2011 — 2011",
    story:
      "Я написал сообщение. Потом удалил его.",
  },
  {
    title: "Мой YouTube-канал",
    years: "2017 — 2019",
    story:
      "Я снял первое видео. Мне не понравился собственный голос.",
  },
  {
    title: "Выучить французский",
    years: "2018 — 2022",
    story:
      "Я хотел однажды заказать кофе в Париже на французском.",
  },
  {
    title: "Открыть книжный магазин",
    years: "2013 — 2020",
    story:
      "Маленькое помещение, запах бумаги, музыка. Всё осталось мечтой.",
  },
  {
    title: "Стать фотографом",
    years: "2015 — 2021",
    story:
      "Я видел красоту в обычных вещах. Но боялся показывать свои фотографии.",
  },
  {
    title: "Снять короткометражку",
    years: "2019 — 2020",
    story:
      "Сценарий был готов. Камера тоже. Не хватило смелости.",
  },
  {
    title: "Уехать в другой город",
    years: "2010 — 2023",
    story:
      "Я всё ждал подходящего момента.",
  },
  {
    title: "Создать настольную игру",
    years: "2021 — 2024",
    story:
      "Коробка с карточками до сих пор лежит под кроватью.",
  },
];

function random(seed) {
  const value =
    Math.sin(seed * 127.1 + 78.233) *
    43758.5453;

  return value - Math.floor(value);
}

function generateChunk(chunkX, chunkZ) {
  const graves = [];
  const trees = [];

  const baseX = chunkX * CELL_SIZE;
  const baseZ = chunkZ * CELL_SIZE;

  const monumentTypes = [
    "stone",
    "victorian",
    "gothic",
    "obelisk",
    "broken",
    "slab",
  ];

  // Генерируем памятники
  for (let i = 0; i < 24; i++) {
    const seed =
      chunkX * 100003 +
      chunkZ * 1009 +
      i * 37;

    const x =
      baseX +
      random(seed + 1) * CELL_SIZE;

    const z =
      baseZ +
      random(seed + 2) * CELL_SIZE;

    // Не размещаем могилы на дорожках
    if (!canPlaceGrave(x, z)) {
      continue;
    }

    // Резервируем место для пользовательских могил
    if (
      x > 3 &&
      x < 22 &&
      z < 0 &&
      z > -100
    ) {
      continue;
    }

    const typeIndex = Math.floor(
      random(seed + 3) *
      monumentTypes.length
    );

    const storyIndex = Math.floor(
      random(seed + 4) *
      STORIES.length
    );

    const story = STORIES[storyIndex];

    graves.push({
      id: `procedural-${chunkX}-${chunkZ}-${i}`,

      title: story.title,
      years: story.years,
      story: story.story,

      type: monumentTypes[typeIndex],

      position: [x, 0, z],

      rotation:
        (random(seed + 5) - 0.5) * 0.5,

      scale:
        0.8 + random(seed + 6) * 0.4,
    });
  }

  // Генерируем деревья
  for (let i = 0; i < 5; i++) {
    const seed =
      chunkX * 50021 +
      chunkZ * 3001 +
      i * 29;

    const x =
      baseX +
      random(seed + 7) * CELL_SIZE;

    const z =
      baseZ +
      random(seed + 8) * CELL_SIZE;

    if (!canPlaceTree(x, z)) {
      continue;
    }

    trees.push({
      id: `tree-${chunkX}-${chunkZ}-${i}`,

      position: [x, 0, z],

      scale:
        0.9 + random(seed + 9) * 1.2,
    });
  }

  return {
    graves,
    trees,
  };
}

function Chunk({
  x,
  z,
  onSelect,
  candles,
}) {
  const data = useMemo(
    () => generateChunk(x, z),
    [x, z]
  );

  return (
    <group>
      {data.graves.map((grave) => (
        <group
          key={grave.id}
          userData={{ grave }}
        >
          <Grave
            grave={grave}
            onSelect={onSelect}
            candleCount={
              candles[grave.id] || 0
            }
          />
        </group>
      ))}

      {data.trees.map((tree) => (
        <DeadTree
          key={tree.id}
          position={tree.position}
          scale={tree.scale}
        />
      ))}
    </group>
  );
}

export default function ProceduralWorld({
  playerPosition = [0, 0, 0],
  onSelect,
  candles = {},
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
        <Chunk
          key={`${chunk.x}-${chunk.z}`}
          x={chunk.x}
          z={chunk.z}
          onSelect={onSelect}
          candles={candles}
        />
      ))}
    </group>
  );
}