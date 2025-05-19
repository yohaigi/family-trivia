import React, { useEffect, useState } from "react";
import { db } from "../firebase-init";
import { ref, onValue, update } from "firebase/database";
import { QRCodeCanvas } from "qrcode.react";


const QuestionPicker = () => {
  const [questions, setQuestions] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const qRef = ref(db, "questions");
    return onValue(qRef, (snapshot) => {
      setQuestions(snapshot.val() || {});
    });
  }, []);

  const chooseQuestion = async (id) => {
    setSelectedId(id);
    await update(ref(db, "game"), {
      started: true,
      currentQuestion: id
    });
  };

  return (
    <div className="container">
      <h2>📋 בחר שאלה להצגה</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {Object.entries(questions).map(([id, q]) => (
          <li key={id} style={{ marginBottom: 20 }}>
            <strong>{id}</strong>
            <br />
            <button onClick={() => chooseQuestion(id)}>📺 הצג שאלה</button>
            {selectedId === id && (
              <div style={{ marginTop: 10 }}>
                <p>📲 שחקנים סרקו את הקוד הבא:</p>
                <QRCodeCanvas value={`http://localhost:3000/question/${id}`} size={120} />

              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionPicker;
