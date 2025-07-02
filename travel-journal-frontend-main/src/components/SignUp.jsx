import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../constext/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaCompass } from "react-icons/fa";
import "./SignUp.css";

function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { state, register, clearError } = useAuth();

  async function handleSignUp(e) {
    e.preventDefault();
    setIsLoading(true);
    clearError();
    try {
      const success = await register(
        fullName,
        email,
        password,
        confirmPassword
      );
      if (success) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-background">
        <FaCompass className="signup-bg-icon icon-1" />
        <FaCheckCircle className="signup-bg-icon icon-2" />
      </div>
      <div className="signup-content">
        <div className="signup-card">
          <div className="signup-header">
            <FaCompass className="signup-logo" />
            <h2>Create your travel journal</h2>
            <p>Start documenting your adventures today</p>
          </div>
          <form className="signup-form" onSubmit={handleSignUp}>
            {state.error && (
              <div className="signup-error">{state.error}</div>
            )}
            <div className="signup-group">
              <label htmlFor="fullName" className="signup-label">
                <FaUser className="signup-icon" /> Full Name
              </label>
              <input
                type="text"
                className="signup-input"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="signup-group">
              <label htmlFor="email" className="signup-label">
                <FaEnvelope className="signup-icon" /> Email
              </label>
              <input
                type="email"
                className="signup-input"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="signup-group">
              <label htmlFor="password" className="signup-label">
                <FaLock className="signup-icon" /> Password
              </label>
              <input
                type="password"
                className="signup-input"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="signup-group">
              <label htmlFor="confirmPassword" className="signup-label">
                <FaLock className="signup-icon" /> Confirm Password
              </label>
              <input
                type="password"
                className="signup-input"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            <button
              type="submit"
              className={`signup-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? <div className="signup-spinner"></div> : "Sign Up"}
            </button>
          </form>
          <div className="signup-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="signup-link">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
