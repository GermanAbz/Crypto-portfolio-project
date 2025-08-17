import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import BackgroundEffects from "./BackgroundEffects";

function Register({ setUserEmail }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/register", { email, password });
      alert("Registration successful");
      setUserEmail(email);
      navigate("/home", { state: { email } });
    } catch (err) {
      if (err.response) {
        alert(err.response.data.error || "Registration failed");
      } else if (err.request) {
        alert("No response from server");
      } else {
        alert("Error registering");
      }
    }
  };

  return (
    <div className="register">
      <img src="./images/landingLogo.png" alt="logo" className="landing-logo"/>
      <h2>Registration</h2>
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
        <button type="submit">Register</button>
      </form>
      <p>
        Already registered? <Link to="/login">Login here</Link>
      </p>
      < BackgroundEffects />
      < Footer />
    </div>
  );
}

export default Register;
