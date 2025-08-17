import React, { useState } from "react";
import { combinedList } from "../../../server/routes/cryptoList";


function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => { 
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
    event.preventDefault();
  }

  return (
    <div>
      <form className="form">
        <select id="crypto-select" name="title" onChange={handleChange} value={note.title}>
          <option value="">CHOOSE CRYPTO</option>
          {combinedList.map(item => {
            return (
              <option value={item.name}>{item.name}</option>
            );
          })}
        </select>
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Number of tokens..."
          rows="1"
        />

        <button onClick={submitNote} className="plus-button">+</button>
      </form>
    </div>
  );
}

export default CreateArea;