import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminScreen from "./components/AdminScreen";
import HomeScreen from "./components/HomeScreen";
import RegisterScreen from "./components/RegisterScreen";
import LivePlayer from "./components/LivePlayer";
import TVLive from "./components/TVLive";
import GameAdminPanel from "./components/GameAdminPanel";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/play" element={<LivePlayer />} />
        <Route path="/tv-live" element={<TVLive />} />
        <Route path="/admin-panel" element={<GameAdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
