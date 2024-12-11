import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useScores } from '../ScoresContext';
import './HomePage.css';

const HomePage = () => {
  const { scores } = useScores();
  const { name, day } = useParams();

  // Define the order of games for each day.
  const dailyGameOrder = {
    '1': ['words', 'numbers', 'reversedNumbers', 'categories'],
    '2': ['categories', 'reversedNumbers', 'numbers', 'words'],
    '3': ['numbers', 'categories', 'words', 'reversedNumbers'],
    '4': ['reversedNumbers', 'words', 'numbers', 'categories'],
    '5': ['categories', 'numbers', 'reversedNumbers', 'words'],
    '6': ['reversedNumbers', 'categories', 'words', 'numbers'],
    '7': ['numbers', 'reversedNumbers', 'words', 'categories'],
    '8': ['categories', 'numbers', 'reversedNumbers', 'words'],
    '9': ['reversedNumbers', 'words', 'categories', 'numbers'],
    '10': ['categories', 'reversedNumbers', 'words', 'numbers'],
    '11': ['reversedNumbers', 'categories', 'numbers', 'words'],
    '12': ['categories', 'words', 'reversedNumbers', 'numbers'],
    '13': ['words', 'reversedNumbers', 'categories', 'numbers'],
    '14': ['words', 'numbers', 'reversedNumbers', 'categories'],
    '15': ['numbers', 'categories', 'words', 'reversedNumbers']
  };

  const order = dailyGameOrder[day] || ['words', 'numbers', 'reversedNumbers', 'categories'];

  // Find the first incomplete game:
  const firstIncompleteGame = order.find(game => !scores[game]);

  // Check if all games are completed:
  const allScoresPresent = () => {
    return order.every(game => scores[game]);
  };

  // Display names for each game:
  const gameDisplayNames = {
    'words': 'Find the Navigational Coordinates',
    'categories': 'Discover the Code to the Portal',
    'numbers': 'Decipher the Secret Code',
    'reversedNumbers': 'Unscramble the Code to the Value'
  };


  // Routes for each game:
  const gameRoutes = {
    words: `/${name}/${day}/words-game`,
    numbers: `/${name}/${day}/numbers-game`,
    reversedNumbers: `/${name}/${day}/reversed-numbers-game`,
    categories: `/${name}/${day}/categories-game`
  };

  return (
    <div className="homepage-container">
      <h1 className="home-title">Raise your hand, and someone will assist you in selecting a game to play</h1>
      <div className="home-title">{name} - Day {day}</div>
      <div className="games-grid">
        {order.map((game) => {
          const isActive = game === firstIncompleteGame;
          const isCompleted = scores[game];

          if (isActive) {
            // The first incomplete game is playable:
            return (
              <Link
                key={game}
                to={gameRoutes[game]}
                className={`game-button` }
              >
                {gameDisplayNames[game]}
              </Link>
            );
          } else if (isCompleted) {
            // Completed games are shown as completed and not clickable:
            return (
              <span
                key={game}
                className={`game-button disabled`}
              >
                {gameDisplayNames[game]}
              </span>
            );
          } else {
            // Future games are disabled until previous ones are completed:
            return (
              <span
                key={game}
                className={`game-button disabled`}
              >
                {gameDisplayNames[game]}
              </span>
            );
          }
        })}
      </div>

      {allScoresPresent() && (
        <div className="see-score-container">
          <Link to={`/${name}/${day}/final-score`} state={{scores: scores}} className="see-score-button">Next</Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
