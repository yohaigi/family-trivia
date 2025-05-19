import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navStyle = {
    backgroundColor: "#1976d2",
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    direction: "rtl"
  };

  const linkStyle = {
    color: "white",
    fontWeight: "bold",
    textDecoration: "none"
  };

  return (
    <nav style={navStyle}>
      <Link to="/admin-panel" style={linkStyle}>ניהול</Link>
      <Link to="/tv-live" style={linkStyle}>מסך טלוויזיה</Link>
      <Link to="/play?name=שחקן" style={linkStyle}>שחקן</Link>
      <Link to="/scoreboard" style={linkStyle}>ניקוד</Link>
    </nav>
  );
};

export default Navbar;
