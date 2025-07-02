import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../constext/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCompass, FaPlane } from "react-icons/fa";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { state, login, clearError } = useAuth();

  useEffect(() => {
    if (state.isAuthenticated) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate("/dashboard");
    }
    clearError();
  }, [state.isAuthenticated, navigate, clearError]);

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);

    const obj = {
      email: email,
      password: password,
    };

    console.log("Login object:", obj);

    try {
      const success = await login(email, password);
      if (success) {
        console.log("Login successful");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shapes">
          <FaCompass className="shape shape-1" />
          <FaPlane className="shape shape-2" />
          <FaCompass className="shape shape-3" />
        </div>
      </div>
      
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <FaCompass className="logo-icon" />
              <h1>Travel Journal</h1>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {state.error && (
              <div className="error-message">
                {state.error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="input-icon" />
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FaLock className="input-icon" />
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <Link to="/forgotpassword" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
