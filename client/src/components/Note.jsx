import React, { useState } from "react"; 

function Note(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(props.content);


  function handleDelete() {
    props.onDelete(props.id);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    props.onEdit(props.id, newContent);
    setIsEditing(false);
  }

const titleMap = {
  Bitcoin: "btc",
  Ethereum: "eth",
  XRP: "xrp",
  USDT: "usdt",
  BNB: "bnb",
  Solana: "sol",
  USDC: "usdc",
  "Lido Staked Ether": "lidStEth",
  Dogecoin: "doge"
};

const symbolKey = titleMap[props.title];
const price = props.prices[symbolKey];
  const totalUSD = price !== undefined ? (price * newContent).toFixed(2) : "Loading...";

  return (
    <div className="note">
      <h1>{props.title}</h1>

      {isEditing ? (
        <input
          type="number"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
      ) : (
        <p>Tokens: {props.content}</p>
      )}

      <div className="total-usd-note">USD: ${totalUSD}</div>

      {isEditing ? (
        <button className="save-button" onClick={handleSave}>💾</button>
      ) : (
        <div>
          <button className="edit-button" onClick={handleEdit}><span style={{ display: 'inline-block', transform: 'rotate(90deg)' }}>✏️</span></button>
          <button className="delete-button" onClick={handleDelete}>✖️</button>
        </div>
      )}
      
    </div>
  );
}

export default Note;
