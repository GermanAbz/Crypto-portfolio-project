import React from "react";
import Footer from "./Footer";
import BackgroundEffects from "./BackgroundEffects";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <img src="./images/landingLogo.png" alt="logo" className="landing-logo"/>
      <h1>Crypto Portfolio App</h1>
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/register")}>
        Register
      </button>
      <BackgroundEffects />
      <Footer />
    </div>
  );
}

export default Landing;
