import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Total from "./Total";
import Tickers from "./Tickers";
import Charts from "./Charts";
import Stocks from "./Stocks";
import Login from "./Login";
import Register from "./Register";
import Landing from "./Landing";

function App() {
  const [notes, setNotes] = useState([]);
  const [prices, setPrices] = useState({});
  const [tickers, setTickers] = useState({});
  const [userEmail, setUserEmail] = useState(null); 

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/price");
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000 * 15);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/tickers");
        const data = await res.json();
        setTickers(data);
      } catch (err) {
        console.error("Error fetching other data:", err);
      }
    };

    fetchTickers();
    const interval = setInterval(fetchTickers, 60000 * 15);
    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    if (!userEmail) return;

    const fetchUserTokens = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/user_tokens?email=${userEmail}`);
        if (!res.ok) throw new Error("Failed to fetch user tokens");
        const data = await res.json();
        setNotes(data); 
      } catch (err) {
        console.error("Error fetching user tokens:", err);
      }
    };

    fetchUserTokens();
  }, [userEmail]);

  function addNote(newNote) {
    setNotes((prevNotes) => [...prevNotes, newNote]);
    
    if (userEmail) {
      fetch("http://localhost:3000/api/user_tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          token_symbol: titleToKeyMap[newNote.title],
          amount: newNote.content,
          title: newNote.title,
        }),
      }).catch((err) => console.error("Error saving token:", err));
    }
  }

  function deleteNote(id) {
    if (userEmail) {
      const tokenToDelete = notes[id];
      fetch("http://localhost:3000/api/user_tokens", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          token_symbol: titleToKeyMap[tokenToDelete.title],
        }),
      }).catch((err) => console.error("Error deleting token:", err));
    }
    setNotes((prevNotes) => prevNotes.filter((_, index) => index !== id));
  }

  function editNote(id, newContent) {
    setNotes((prevNotes) =>
      prevNotes.map((note, index) =>
        index === id ? { ...note, content: newContent } : note
      )
    );

   
    if (userEmail) {
      const note = notes[id];
      fetch("http://localhost:3000/api/user_tokens", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          token_symbol: titleToKeyMap[note.title],
          amount: newContent,
        }),
      }).catch((err) => console.error("Error updating token:", err));
    }
  }

  const titleToKeyMap = {
    Bitcoin: "btc",
    Ethereum: "eth",
    XRP: "xrp",
    USDT: "usdt",
    BNB: "bnb",
    Solana: "sol",
    USDC: "usdc",
    "Lido Staked Ether": "lidStEth",
    Dogecoin: "doge",
  };

  

  const totalPortfolioWorth = notes.reduce((sum, note) => {
    const key = titleToKeyMap[note.title];
    const price = prices[key] || 0;
    return sum + (note.content ? price * note.content : 0);
  }, 0);

  
  const HomePage = () => (
    <div className="background">
      <Header/>
      <div className="create-area-total-container">
        <div className="create-area">
          <CreateArea onAdd={addNote} />
        </div>
        <div className="total-container">
          <Total
            total={totalPortfolioWorth.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          />
        </div>
        <div className="tickers-container">
          <Tickers tickers={tickers} />
        </div>
      </div>

      <div className="notes-charts-stock">
        <div className="notes-container">
          {notes.map((noteItem, index) => (
            <Note
              key={index}
              id={index}
              title={noteItem.title}
              content={noteItem.content}
              onDelete={deleteNote}
              onEdit={editNote}
              prices={prices}
            />
          ))}
        </div>
        <Charts notes={notes} prices={prices} />
        <Stocks tickers={tickers} />
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="background">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
          <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

