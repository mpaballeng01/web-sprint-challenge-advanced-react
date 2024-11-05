import React, { useState } from 'react';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  // State setup
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  // Calculate the (x, y) coordinates from the index
  function getXY() {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return [x, y];
  }

  // Get coordinates message
  function getXYMessage() {
    const [x, y] = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  // Reset to initial values
  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  // Calculate next index based on direction
  function getNextIndex(direction) {
    const moves = {
      left: index % 3 !== 0 ? index - 1 : index,
      right: index % 3 !== 2 ? index + 1 : index,
      up: index >= 3 ? index - 3 : index,
      down: index <= 5 ? index + 3 : index,
    };
    return moves[direction];
  }

  // Handle movement buttons
  function move(evt) {
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);
    if (nextIndex === index) {
      setMessage(`You can't go ${direction}`);
    } else {
      setIndex(nextIndex);
      setSteps(steps + 1);
      setMessage(''); // Clear any error message
    }
  }

  // Handle email input change
  function onChange(evt) {
    setEmail(evt.target.value);
  }

  // Handle form submission
  function onSubmit(evt) {
    evt.preventDefault();
    const [x, y] = getXY();
    const payload = { x, y, steps, email };

    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) =>{ 
        setMessage(data.message) 
        setEmail("")}) 
      .catch((err) => setMessage('An error occurred. Please try again.'));
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} time{steps !== 1 ? 's' : ''}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} role='gridcell' className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input 
          id="email" 
          type="email" 
          placeholder="type email" 
          value={email} 
          onChange={onChange} 
        />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}
