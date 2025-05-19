import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../firebase-init";
import { ref, onValue, set } from "firebase/database";
import { getAuth } from "firebase/auth";

const LivePlayer = () => {
  const [params] = useSearchParams();
  const name = params.get("name") || "אנונימי";
  const [questionId, setQuestionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const gameRef = ref(db, "game");
    return onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.currentQuestion) {
        setQuestionId(data.currentQuestion);
        setSubmitted(false);
        setAnswer("");
      }
    });
  }, []);

  useEffect(() => {
    if (!questionId) return;
    const qRef = ref(db, `questions/${questionId}`);
    return onValue(qRef, (snapshot) => {
      setQuestion(snapshot.val());
    });
  }, [questionId]);

  const handleSubmit = async () => {
    const userId = getAuth().currentUser?.uid;
    if (!userId || !answer || !questionId || submitted) return;
    await set(ref(db, `answers/${questionId}/${userId}`), {
      name,
      answer,
      time: Date.now(),
    });
    setSubmitted(true);
  };

  if (!questionId || !question) return <p>🔄 טוען שאלה...</p>;

  return (
    <div className="container">
      <h2>❓ שאלה: {questionId}</h2>
      {!submitted ? (
        <>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="כתוב את תשובתך"
          />
          <button onClick={handleSubmit}>שלח</button>
        </>
      ) : (
        <p>✅ תשובה נשלחה!</p>
      )}
    </div>
  );
};

export default LivePlayer;
