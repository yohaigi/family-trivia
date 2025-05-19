import React, { useEffect, useState } from "react";
import { db } from "../firebase-init";
import { ref, onValue, update } from "firebase/database";
import { QRCodeCanvas } from "qrcode.react";

const HomeScreen = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const playersRef = ref(db, "players");
    return onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPlayers(Object.values(data));
    });
  }, []);

  const startGame = async () => {
    await update(ref(db, "game"), {
      started: true,
      currentQuestion: "question1"
    });
  };

  return (
    <div className="container">
      <h1>🎉 ברוכים הבאים לטריוויה!</h1>
      <QRCodeCanvas value="http://localhost:3000/register" size={160} />
      <h3>🧑 שחקנים שהצטרפו:</h3>
      <ul>
        {players.map((p, i) => <li key={i}>{p.name}</li>)}
      </ul>
      <button onClick={startGame}>🚀 התחל משחק</button>
    </div>
  );
};

export default HomeScreen;