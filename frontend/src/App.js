import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, NavLink } from "react-router-dom";
import Home from "./components/Home";
import FactoryAnalysisForm from "./components/FactoryAnalysisForm";
import TrafficAnalysisForm from "./components/TrafficAnalysisForm";
import UserReportForm from "./components/UserReportForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ChatBot from "./components/ChatBot";
import "./Navbar.css"; // Import the new CSS file

const App = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return isAdminAuthenticated ? children : <Navigate to="/admin/login" />;
  };

  return (
    <Router>
      <div>
        {/* Improved Navbar */}
        <nav className="navbar">
          <Link to="/" className="navbar-logo">
            AQI Monitor
          </Link>

          <div className="navbar-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Home
            </NavLink>
            <NavLink to="/factory-analysis" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Factory Analysis
            </NavLink>
            <NavLink to="/traffic-analysis" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Traffic Analysis
            </NavLink>
            <NavLink to="/report" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Report
            </NavLink>
            <NavLink to="/admin/login" className={({ isActive }) => isActive ? "nav-link admin-link" : "nav-link admin-link"}>
              Admin
            </NavLink>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/factory-analysis" element={<FactoryAnalysisForm />} />
          <Route path="/traffic-analysis" element={<TrafficAnalysisForm />} />
          <Route path="/report" element={<UserReportForm />} />
          <Route
            path="/admin/login"
            element={<AdminLogin setIsAdminAuthenticated={setIsAdminAuthenticated} />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Floating Chatbot Button */}
        {!showChatbot && (
          <button
            onClick={toggleChatbot}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              backgroundColor: "#3f51b5",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              fontSize: "24px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              zIndex: 1000,
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            title="Open ChatBot"
          >
            💬
          </button>
        )}

        {/* Fullscreen Chatbot */}
        {showChatbot && (
          <div className="chatbot-window" style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "750px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}>
            <button
              onClick={toggleChatbot}
              style={{
                alignSelf: "flex-end",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#555",
                padding: "8px",
                cursor: "pointer"
              }}
              title="Close"
            >
              ✖
            </button>
            <div style={{ flexGrow: 1, overflowY: "auto", padding: "10px" }}>
              <ChatBot />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;