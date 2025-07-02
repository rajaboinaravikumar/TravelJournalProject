// app.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import SignUp from "./components/SignUp";
import Welcome from "./components/Welcome";
import CreateJournal from "./components/CreateJournal";
import JournalPublished from "./components/JournalPublished";
import JournalDetail from "./components/JournalDetail";
import Explore from "./components/Explore";
import Following from "./components/Following";
import UserProfile from "./components/UserProfile";
import Profilepage from "./components/Profilepage";
import Notifications from './components/Notifications';
import { 
  FaUserCircle, 
  FaCompass, 
  FaBookOpen, 
  FaGlobe, 
  FaBell, 
  FaPlus, 
  FaHeart, 
  FaSignOutAlt 
} from "react-icons/fa";
import { AuthProvider, useAuth } from "./constext/AuthContext.tsx";
import { JournalProvider } from "./constext/JournalContext.tsx";
import "./App.css";

function Navigation() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
    console.log("Logout initiated");
  };

  const goToProfile = () => {
    navigate("/Profilepage");
  };

  // Don't show navigation on home page for non-authenticated users
  // Don't show navigation on login, signup, forgot password, and profile pages
  if (!state.isAuthenticated || 
      location.pathname === "/login" || 
      location.pathname === "/signup" || 
      location.pathname === "/forgotpassword" ||
      location.pathname === "/Profilepage") {
    return null;
  }

  return (
    <header className="app-header-nav">
      <div className="header-container">
        <div className="header-brand">
          <FaCompass className="header-icon" />
          <h1 className="header-title">Travel Journal</h1>
        </div>
        
        <div className="header-actions">
          <button className="header-btn" onClick={() => navigate("/dashboard")}>
            <FaBookOpen />
            <span>Dashboard</span>
          </button>
          <button className="header-btn" onClick={() => navigate("/create")}>
            <FaPlus />
            <span>Create Journal</span>
          </button>
          <button className="header-btn" onClick={() => navigate("/explore")}>
            <FaGlobe />
            <span>Explore</span>
          </button>
          <button className="header-btn" onClick={() => navigate("/following")}>
            <FaHeart />
            <span>Following</span>
          </button>
          <div className="header-profile" onClick={goToProfile}>
            {state.user?.profileImage ? (
              <img
                src={state.user.profileImage}
                alt="Profile"
                className="header-avatar"
              />
            ) : (
              <FaUserCircle className="header-avatar-icon" />
            )}
          </div>
          <button className="header-btn logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <JournalProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/create" element={<CreateJournal />} />
            <Route path="/journal-published" element={<JournalPublished />} />
            <Route path="/journal/:id" element={<JournalDetail />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/following" element={<Following />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/Profilepage" element={<Profilepage />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </Router>
      </JournalProvider>
    </AuthProvider>
  );
}

export default App;
