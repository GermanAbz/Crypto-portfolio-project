import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import BackgroundEffects from "./BackgroundEffects";

function Login({ setUserEmail }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/login", { email, password });
      setUserEmail(email); 
      navigate("/home", { state: { email } });
    } catch (err) {
      if (err.response) {
        alert(err.response.data.error || "Login failed");
      } else if (err.request) {
        alert("No response from server");
      } else {
        alert("Error logging in");
      }
    }
  };

  return (
    <div className="login">
      <img src="./images/landingLogo.png" alt="logo" className="landing-logo"/>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      < BackgroundEffects />
      <Footer />
    </div>
  );
}

export default Login;
