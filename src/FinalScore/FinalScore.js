import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScores } from '../ScoresContext';
import './FinalScore.css';
import PinChecker from '../PinChecker';

const FinalScore = () => {
    const { scores } = useScores();
    const {name, day} = useParams();
    const navigate = useNavigate(); // Hook to access the navigate function

    const game_key = {words: "Find the Navigational Coordinates (words)",
                    numbers: "Decipher the Secret Code (numbers)",
                    reversedNumbers: "Unscramble the Code to the Vault (reversed numbers)",
                    categories: "Discover the Code to the Portal (categories)"};
                    console.log(scores);
    const renderScores = (gameScores) => {
        return Object.entries(gameScores || {}).map(([key, value]) => (
          <div key={key} className="score-item">
            <span className="score-key">{key}:</span> <span className="score-value">{value}</span>
          </div>
        ));
      };
    const handleNext = () => {
      // let confirmation = window.confirm("Has someone confirmed your score?");
      // if(confirmation)
      navigate(`/${name}/${day}/challenge`);
    }
      return (
        <div className="final-score-container">
          <h1 className="title">Final Scores</h1>
          <div>{`${name} - Day ${day}`}</div>
          <div>{console.log(scores)}</div>
          <div className="scores-grid">
            {Object.entries(scores || {}).map(([game, gameScores]) => (
              <div key={game_key[game]} className="game-score">
                <h2 className="game-title">{game_key[game]}</h2>
                {renderScores(gameScores)}
              </div>
            ))}
          </div>
          <PinChecker onPinCorrect={handleNext} />
          {/* <button className='green-button' onClick={handleNext}>Confirm Score</button> */}
        </div>
      );
};

export default FinalScore;

