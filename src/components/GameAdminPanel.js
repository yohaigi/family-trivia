import React from "react";
import Scoreboard from "./Scoreboard";
import ResetButton from "./ResetButton";
import { Link } from "react-router-dom";

const GameAdminPanel = () => {
  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h2>🎮 לוח ניהול המשחק</h2>

      <hr />
      <h3>🏆 ניקוד</h3>
      <Scoreboard />

      <hr />
      <Link to="/admin" style={{ display: "inline-block", marginTop: 20 }}>
        ➕ העלאת שאלה חדשה
      </Link>

      <hr />
      <h4>🧹 איפוס המשחק</h4>
      <ResetButton />
    </div>
  );
};

export default GameAdminPanel;
