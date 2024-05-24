import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Make sure you link to the correct path of your CSS file

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1 className="title">Teen Memory Game</h1>
      <div className="games-grid">
        <Link to="/words-game" className="game-button words-game">Words</Link>
        <Link to="/numbers-game" className="game-button digits-game">Digits</Link>
        <Link to="/digits-reversed-game" className="game-button digits-reversed-game">Digits Reversed</Link>
        <Link to="/verbal-game" className="game-button verbal-game">Verbal</Link>
      </div>
    </div>
  );
};

export default HomePage;
