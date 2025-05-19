import React from "react";
import { db } from "../firebase-init";
import { ref, remove } from "firebase/database";

const ResetButton = () => {
  const handleReset = async () => {
    if (window.confirm("האם אתה בטוח שברצונך לאפס את המשחק?")) {
      await Promise.all([
        remove(ref(db, "players")),
        remove(ref(db, "answers")),
        remove(ref(db, "game"))
      ]);
      alert("✅ המשחק אופס בהצלחה");
    }
  };

  return (
    <div className="container">
      <h2>🔁 איפוס משחק</h2>
      <button onClick={handleReset} style={{ backgroundColor: "#e53935" }}>אפס הכל</button>
    </div>
  );
};

export default ResetButton;
