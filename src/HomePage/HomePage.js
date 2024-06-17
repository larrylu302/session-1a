import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useScores } from '../ScoresContext';
import './HomePage.css';

const HomePage = () => {
  const { scores, updateScores } = useScores();
  const { name, day } = useParams();

  const isLinkActive = (game) => {
    return !scores[game];
  };

  const allScoresPresent = () => {
    return scores.words && scores.numbers && scores.reversedNumbers && scores.categories;
  };

  return (
    <div className="homepage-container">
      <h1 className="home-title">Select a tile to begin a mission</h1>
      <div className="home-title">{name} - Day {day}</div>
      <div className="games-grid">
        {isLinkActive('words') ? (
          <Link to={`/${name}/${day}/words-game`} className="game-button words-game">Find the Navigational Coordinates</Link>
        ) : (
          <span className="game-button disabled">Find the Navigational Coordinates</span>
        )}
        {isLinkActive('numbers') ? (
          <Link to={`/${name}/${day}/numbers-game`} className="game-button digits-game">Decipher the Secret Code</Link>
        ) : (
          <span className="game-button disabled">Decipher the Secret Code</span>
        )}
        {isLinkActive('reversedNumbers') ? (
          <Link to={`/${name}/${day}/reversed-numbers-game`} className="game-button digits-reversed-game">Unscramble the Code to the Vault</Link>
        ) : (
          <span className="game-button disabled">Unscramble the Code to the Vault</span>
        )}
        {isLinkActive('categories') ? (
          <Link to={`/${name}/${day}/categories-game`} className="game-button verbal-game">Discover the Code to the Portal</Link>
        ) : (
          <span className="game-button disabled">Discover the Code to the Portal</span>
        )}
      </div>
      {allScoresPresent() && (
        <div className="see-score-container">
          <Link to={`/${name}/${day}/final-score`} state={{scores: scores}} className="see-score-button">Next</Link>
        </div>
      )}
            {/* {(
        // <div className="see-score-container">
        //   <Link to={`/${name}/${day}/final-score`} state={{scores: scores}} className="see-score-button">Next</Link>
        // </div>
      )} */}
    </div>
  );
};

export default HomePage;
