import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


function Header(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email
  return (
    <header>
      <h1><img src="/images/Logo.png" className="logo" /> My Crypto Portfolio</h1>
      <div className="header-float-right">
        <div className="header-div">
          <div className="circle-outer">
           <div className="circle"></div>
          </div>
          <h2>{email}</h2>
        </div>
        <button onClick={() => navigate("/login")} className="header-logout-button">Log out</button>
      </div>
      
    </header>
  );
}

export default Header;
