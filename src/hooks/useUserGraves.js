import { useState } from "react";

const STORAGE_KEY = "graveyard_user_graves";

function loadGraves() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Ошибка загрузки могил:", error);
    return [];
  }
}

export default function useUserGraves() {
  const [userGraves, setUserGraves] = useState(loadGraves);

  const addGrave = (grave) => {
    setUserGraves((prev) => {
      const updated = [...prev, grave];

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error("Ошибка сохранения могилы:", error);
      }

      return updated;
    });
  };

  return {
    userGraves,
    addGrave,
  };
}