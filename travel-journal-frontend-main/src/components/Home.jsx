import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCompass } from "react-icons/fa";
import Hero from "./Hero";
import Features from "./Features";
import FeaturedJournals from "./FeaturedJournals";
import Footer from "./Footer";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <>
      <nav className="navbar px-4 py-3">
        <Link className="navbar-brand d-flex align-items-center app-logo" to="/">
          <FaCompass className="me-2" size={28} />
          <span>Travel Journal</span>
        </Link>
        <div>
          <button onClick={handleLoginClick} className="btn btn-light me-3">
            Login
          </button>
          <button onClick={handleSignUpClick} className="btn btn-outline-light">
            Sign Up
          </button>
        </div>
      </nav>

      <main className="home-main">
        <section className="home-hero-section">
          <Hero />
          <div className="home-tagline-section">
            <h2 className="home-tagline">Your Journey, Beautifully Documented</h2>
            <p className="home-mission">Capture, organize, and share your travel experiences with elegance and ease.</p>
          </div>
        </section>
        <Features />
        <FeaturedJournals />
      </main>
      <Footer />
    </>
  );
}

export default Home;
