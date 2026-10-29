import { useState } from "react";

const STORAGE_KEY = "graveyard_candles";

function loadCandles() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return {};

    const parsed = JSON.parse(saved);

    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch (error) {
    console.error("Ошибка загрузки свечей:", error);
    return {};
  }
}

export default function useCandles() {
  const [candles, setCandles] = useState(loadCandles);

  const lightCandle = (graveId) => {
    setCandles((previous) => {
      const updated = {
        ...previous,
        [graveId]: (previous[graveId] || 0) + 1,
      };

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error("Ошибка сохранения свечи:", error);
      }

      return updated;
    });
  };

  const getCandleCount = (graveId) => {
    return candles[graveId] || 0;
  };

  return {
    candles,
    lightCandle,
    getCandleCount,
  };
}