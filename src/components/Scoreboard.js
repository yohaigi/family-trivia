import React, { useEffect, useState } from "react";
import { db } from "../firebase-init";
import { ref, onValue } from "firebase/database";

const Scoreboard = () => {
  const [scores, setScores] = useState([]);
  const [questions, setQuestions] = useState({});

  useEffect(() => {
    const qRef = ref(db, "questions");
    return onValue(qRef, (snapshot) => {
      setQuestions(snapshot.val() || {});
    });
  }, []);

  useEffect(() => {
    const answersRef = ref(db, "answers");
    return onValue(answersRef, (snapshot) => {
      const allAnswers = snapshot.val() || {};
      const playerScores = {};

      Object.entries(allAnswers).forEach(([qId, answers]) => {
        const correct = questions[qId]?.answer?.trim();
        Object.values(answers).forEach((ans) => {
          if (!playerScores[ans.name]) playerScores[ans.name] = 0;
          if (ans.answer?.trim() === correct) {
            playerScores[ans.name]++;
          }
        });
      });

      const sorted = Object.entries(playerScores)
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score);

      setScores(sorted);
    });
  }, [questions]);

  return (
    <div className="container">
      <h2>🏆 ניקוד שחקנים</h2>
      <ul>
        {scores.map((p, i) => (
          <li key={i}>
            <strong>{p.name}</strong>: {p.score} נקודות
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scoreboard;