import React, { useEffect, useState } from "react";
import { db } from "../firebase-init";
import { ref, onValue, update } from "firebase/database";
import { QRCodeCanvas } from "qrcode.react";

const TVLive = () => {
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  const [questionIds, setQuestionIds] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionId, setQuestionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState([]);

  const baseUrl = process.env.REACT_APP_BASE_URL || window.location.origin;

  useEffect(() => {
    const qRef = ref(db, "questions");
    return onValue(qRef, (snapshot) => {
      const data = snapshot.val() || {};
      setQuestions(data);
      setQuestionIds(Object.keys(data));
    });
  }, []);

  useEffect(() => {
    const playersRef = ref(db, "players");
    return onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPlayers(Object.values(data));
    });
  }, []);

  useEffect(() => {
    const answersRef = ref(db, "answers");
    return onValue(answersRef, (snapshot) => {
      setAnswers(snapshot.val() || {});
    });
  }, []);

  const handleStartGame = async () => {
    if (!questionIds.length) return;
    const id = questionIds[0];
    setQuestionIndex(0);
    setQuestionId(id);
    await update(ref(db, "game"), {
      started: true,
      currentQuestion: id
    });
  };

  useEffect(() => {
    if (!questionId || !questions[questionId]) return;
    const q = questions[questionId];
    setQuestion(q);
    setTimeLeft(q.timeLimit);
    setShowAnswer(false);
  }, [questionId, questions]);

  useEffect(() => {
    if (timeLeft === null || showAnswer || gameEnded) return;
    if (timeLeft === 0) {
      setShowAnswer(true);
      setTimeout(() => {
        const nextIndex = questionIndex + 1;
        if (nextIndex < questionIds.length) {
          const nextId = questionIds[nextIndex];
          setQuestionIndex(nextIndex);
          setQuestionId(nextId);
          update(ref(db, "game"), { currentQuestion: nextId });
        } else {
          setGameEnded(true);
          update(ref(db, "game"), { currentQuestion: null });
        }
      }, 5000);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showAnswer, gameEnded]);

  useEffect(() => {
    if (!gameEnded || !Object.keys(questions).length) return;
    const playerScores = {};
    Object.entries(answers).forEach(([qId, byPlayers]) => {
      const correct = questions[qId]?.answer?.trim();
      Object.values(byPlayers).forEach((ans) => {
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
  }, [gameEnded, answers, questions]);

  if (gameEnded) {
    return (
      <div className="container" style={{ textAlign: "center" }}>
        <h1>🎉 המשחק הסתיים!</h1>
        {scores.length > 0 ? (
          <>
            <h2>🥇 המנצח: {scores[0].name} - {scores[0].score} נקודות</h2>
            <h3>📊 ניקוד כולל:</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {scores.map((p, i) => (
                <li key={i} style={{ fontSize: "1.2em" }}>
                  {p.name} — {p.score} נק'
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>לא התקבלו תשובות. תודה על ההשתתפות!</p>
        )}
      </div>
    );
  }

  if (!questionId || !question) {
    return (
      <div className="container" style={{ textAlign: "center" }}>
        <h1>🎉 ברוכים הבאים למשחק הטריוויה!</h1>
        <p>📲 סרקו את הברקוד כדי להצטרף</p>
        console.log("🌍 baseUrl from ENV:", baseUrl);

        <QRCodeCanvas value={`${baseUrl}/register`} size={180} />


        <h3 style={{ marginTop: 30 }}>שחקנים שנרשמו:</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {players.map((p, i) => (
            <li key={i} style={{ fontSize: "1.2em" }}>👤 {p.name}</li>
          ))}
        </ul>

        {players.length > 0 && questionIds.length > 0 && (
          <button onClick={handleStartGame} style={{ marginTop: 20 }}>
            🚀 התחל משחק
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container" style={{ textAlign: "center" }}>
      {!showAnswer ? (
        <>
          <h1>⏱️ זמן נותר: {timeLeft} שניות</h1>
          <div style={{ background: "white", padding: 30, borderRadius: 20, display: "inline-block", boxShadow: "0 0 20px rgba(0,0,0,0.1)" }}>
            <img src={question.imageUrl} alt="question" style={{ maxWidth: "100%", marginTop: 20, borderRadius: 12 }} />
            {question.hint && (
              <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 10 }}>
                {question.hint.split("").map((char, index) => (
                  <div
                    key={index}
                    style={{
                      width: 50,
                      height: 60,
                      border: "2px solid #0077cc",
                      fontSize: "2em",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                      borderRadius: 8,
                      backgroundColor: char === "⬜" ? "#f0f0f0" : "#e6f2ff",
                      color: char === "⬜" ? "#ccc" : "#003366"
                    }}
                  >
                    {char}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <h1>✅ התשובה: {question.answer}</h1>
          <img src={question.fullImageUrl} alt="full" style={{ maxWidth: "80%", marginTop: 20 }} />
        </>
      )}
    </div>
  );
};

export default TVLive;
