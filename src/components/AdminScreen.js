import React, { useState, useEffect } from "react";
import { db } from "../firebase-init";
import { ref, push, onValue, update, remove } from "firebase/database";

const AdminScreen = () => {
  const [form, setForm] = useState({
    id: "",
    answer: "",
    imageUrl: "",
    fullImageUrl: "",
    timeLimit: 30,
    hint: ""
  });
  const [questions, setQuestions] = useState({});
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const qRef = ref(db, "questions");
    return onValue(qRef, (snapshot) => {
      setQuestions(snapshot.val() || {});
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const questionRef = ref(db, "questions/");
    if (editId) {
      await update(ref(db, `questions/${editId}`), form);
      setEditId(null);
    } else {
      await push(questionRef, form);
    }
    setForm({ id: "", answer: "", imageUrl: "", fullImageUrl: "", timeLimit: 30, hint: "" });
  };

  const handleEdit = (id) => {
    const q = questions[id];
    setForm(q);
    setEditId(id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את השאלה?")) {
      await remove(ref(db, `questions/${id}`));
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <h2 style={{ marginBottom: 20 }}>📝 ניהול שאלות</h2>
      <input name="id" placeholder="מזהה שאלה (למשל: 'baruchin')" value={form.id} onChange={handleChange} /><br />
      <input name="imageUrl" placeholder="קישור לתמונה מטושטשת" value={form.imageUrl} onChange={handleChange} /><br />
      <input name="fullImageUrl" placeholder="קישור לתמונה מלאה" value={form.fullImageUrl} onChange={handleChange} /><br />
      <input name="answer" placeholder="תשובה נכונה" value={form.answer} onChange={handleChange} /><br />
      <input name="hint" placeholder="רמז (אופציונלי - יוצג קוביות)" value={form.hint} onChange={handleChange} /><br />
      <input name="timeLimit" type="number" value={form.timeLimit} onChange={handleChange} /><br />
      <button onClick={handleSubmit} style={{ marginTop: 10 }}>
        {editId ? "💾 עדכן שאלה" : "💾 שמור שאלה"}
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h3>📚 שאלות קיימות:</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#0077cc", color: "white" }}>
            <th>מזהה</th>
            <th>תשובה</th>
            <th>זמן</th>
            <th>רמז</th>
            <th>⚙️</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(questions).map(([id, q]) => (
            <tr key={id} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{q.id}</td>
              <td>{q.answer}</td>
              <td>{q.timeLimit} שנ'</td>
              <td>{q.hint}</td>
              <td>
                <button onClick={() => handleEdit(id)}>✏️</button>{" "}
                <button onClick={() => handleDelete(id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminScreen;
