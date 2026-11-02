import React, { useState, useEffect } from "react";

const STORAGE_KEY = "farmAnimals";

const ANIMAL_TYPES = [
  { value: "корова", label: "Корова" },
  { value: "курица", label: "Курица" },
  { value: "свинья", label: "Свинья" },
];

function loadAnimals() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function clamp(value) {
  return Math.min(100, Math.max(0, value));
}

function FarmSimulator() {
  const [animals, setAnimals] = useState(loadAnimals);
  const [type, setType] = useState(ANIMAL_TYPES[0].value);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(animals));
  }, [animals]);

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const numAge = Number(age);

    if (!trimmedName || age === "" || numAge < 0) {
      alert("Введите имя и корректный возраст");
      return;
    }

    const newAnimal = {
      id: Date.now(),
      type,
      name: trimmedName,
      age: numAge,
      hunger: 50,
    };

    setAnimals((prev) => [...prev, newAnimal]);
    setName("");
    setAge("");
  };

  const handleFeed = (id) => {
    setAnimals((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, hunger: clamp(a.hunger - 20) } : a
      )
    );
  };

  const handleAge = () => {
    setAnimals((prev) =>
      prev.map((a) => ({
        ...a,
        age: a.age + 1,
        hunger: clamp(a.hunger + 15),
      }))
    );
  };

  const handleDelete = (id) => {
    setAnimals((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div>
      <h1>Симулятор живой фермы</h1>

      <h2>Добавить животное</h2>
      <form onSubmit={handleAdd}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {ANIMAL_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>{" "}
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />{" "}
        <input
          type="number"
          placeholder="Возраст"
          min="0"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />{" "}
        <button type="submit">Добавить</button>
      </form>

      <h2>Животные на ферме ({animals.length})</h2>
      <button onClick={handleAge} disabled={animals.length === 0}>
        Пустить время вперёд (состарить всех)
      </button>

      {animals.length === 0 && <p>На ферме пока нет животных.</p>}

  
      {animals.map((animal) => (
        <div
          key={animal.id}
          style={{ display: "block" }}
        >
          <hr />
          <h3>
            {animal.name} ({animal.type})
          </h3>
          <p>Возраст: {animal.age}</p>
          <p>
            Голод: {animal.hunger} / 100{" "}
            <progress value={animal.hunger} max="100" />
          </p>
          <button onClick={() => handleFeed(animal.id)}>Покормить</button>{" "}
          <button onClick={() => handleDelete(animal.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
}

export default FarmSimulator;
