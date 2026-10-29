import { useState } from "react";

const initialForm = {
  title: "",
  startYear: "",
  endYear: "",
  story: "",
  type: "stone",
};

export default function BuryModal({ onClose, onBury }) {
  const [form, setForm] = useState(initialForm);

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.story.trim()) {
      alert("У каждой идеи должно быть имя и история.");
      return;
    }

    const grave = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      years: `${form.startYear || "????"} — ${
        form.endYear || "????"
      }`,
      story: form.story.trim(),
      type: form.type,
      createdAt: new Date().toISOString(),
    };

    onBury(grave);
  };

  return (
    <div className="grave-overlay">
      <div className="bury-modal">
        <div className="rip">THE LAST GOODBYE</div>

        <h1>Похоронить идею</h1>

        <p className="bury-description">
          Не все мечты должны сбываться.
          <br />
          Некоторые достаточно просто отпустить.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Название идеи
            <input
              type="text"
              maxLength={60}
              placeholder="Например: Моя первая книга"
              value={form.title}
              onChange={(e) =>
                update("title", e.target.value)
              }
              required
            />
          </label>

          <div className="year-row">
            <label>
              Год рождения
              <input
                type="number"
                min="1900"
                max="2100"
                placeholder="2018"
                value={form.startYear}
                onChange={(e) =>
                  update("startYear", e.target.value)
                }
              />
            </label>

            <label>
              Год смерти
              <input
                type="number"
                min="1900"
                max="2100"
                placeholder="2024"
                value={form.endYear}
                onChange={(e) =>
                  update("endYear", e.target.value)
                }
              />
            </label>
          </div>

          <label>
            Что произошло?
            <textarea
              rows={5}
              maxLength={1000}
              placeholder="Расскажи историю этой мечты..."
              value={form.story}
              onChange={(e) =>
                update("story", e.target.value)
              }
              required
            />
          </label>

          <label>
            Форма надгробия
            <select
              value={form.type}
              onChange={(e) =>
                update("type", e.target.value)
              }
            >
              <option value="stone">Каменная плита</option>
              <option value="cross">Крест</option>
              <option value="obelisk">Обелиск</option>
            </select>
          </label>

          <div className="bury-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Я ещё не готов
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              ⚰ Похоронить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}