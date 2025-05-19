import React, { useEffect, useState } from "react";
import { db } from "../firebase-init";
import { ref, set, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const gameRef = ref(db, "game");
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.started && data?.currentQuestion && submitted && name) {
        navigate(`/play?name=${encodeURIComponent(name)}`);
      }
    });
    return () => unsubscribe();
  }, [submitted, name, navigate]);

  const handleSubmit = async () => {
    const uid = getAuth().currentUser?.uid;
    if (!uid || !name) return;
    await set(ref(db, `players/${uid}`), { name });
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      {!submitted ? (
        <>
          <h2>👤 הכנס את שמך כדי להצטרף</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="הקלד שם"
          />
          <br />
          <button onClick={handleSubmit}>🚪 הצטרף</button>
        </>
      ) : (
        <h3>⏳ ממתין לתחילת המשחק...</h3>
      )}
    </div>
  );
};

export default RegisterScreen;
