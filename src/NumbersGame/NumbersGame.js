import React, { useState } from 'react';
import './NumbersGame.css';
import BackToHomeButton from '../Backtohomebutton';

const NumbersGame = () => {
  // Initial states for easier resets
  const initialGameState = {
    numberSequence: [],
    userSequence: [],
    memorizationPhase: false,
    gameOver: false,
    displaySequence: false,
    displayTest: false,
    currentRound: 0,
    totalRounds: 3,
    score: 0,
    maxDigitsInRound: 0,
  };

  const initialSettings = {
    sequenceLength: 5,
    intervalBetweenDigits: 1,
    timeBeforeTest: 3,
    totalRounds: 3,
  };

  const [gameState, setGameState] = useState(initialGameState);
  const [settings, setSettings] = useState(initialSettings);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    if (gameState.currentRound < settings.totalRounds) {
      const sequence = generateSequence(settings.sequenceLength);
      speakNumbers(sequence);
      setGameState(prevState => ({
        ...prevState,
        numberSequence: sequence,
        userSequence: [],
        memorizationPhase: true,
        gameOver: false,
        displaySequence: true,
        displayTest: false,
        currentRound: prevState.currentRound + 1,
      }));
      setGameStarted(true);
    } else {
      setGameState(prevState => ({ ...prevState, gameOver: true }));
    }
  };

  const resetGame = () => {
    setGameState(initialGameState);
    setGameStarted(false);
    setShowSettingsForm(false);
  };

  const generateSequence = (length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 10));
  };

  const speakNumbers = (sequence) => {
    let totalDelay = 0;
    sequence.forEach((num, index) => {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(num.toString());
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
        if (index === sequence.length - 1) {
          setTimeout(() => {
            setGameState(prevState => ({ ...prevState, displaySequence: false, displayTest: true, memorizationPhase: false }));
          }, settings.timeBeforeTest * 1000);
        }
      }, totalDelay);
      totalDelay += settings.intervalBetweenDigits * 1000;
    });
  };

  const handleNumberInput = (number) => {
    if (gameState.displayTest) {
      const newUserSequence = [...gameState.userSequence, number];
      const isCorrect = number === gameState.numberSequence[newUserSequence.length - 1];
      setGameState(prevState => ({
        ...prevState,
        userSequence: newUserSequence,
        score: isCorrect ? prevState.score + 1 : prevState.score,
        maxDigitsInRound: isCorrect ? Math.max(prevState.maxDigitsInRound, newUserSequence.filter((num, index) => num === gameState.numberSequence[index]).length) : prevState.maxDigitsInRound,
      }));

      if (newUserSequence.length === gameState.numberSequence.length) {
        startGame();
      }
    }
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    setShowSettingsForm(false);
  };

  const handleShowSettings = () => {
    setShowSettingsForm(true);
    setGameStarted(false);
  };

  return (
    <div className="App">
      <BackToHomeButton />
      <h1>Number Recall Game</h1>
      <div style={{ marginBottom: '20px' }}> Instructions here </div>
      {!gameStarted && !showSettingsForm && (
        <div className="initial-buttons">
          <button className="button" onClick={handleShowSettings}>Settings</button>
          <button className="button" onClick={startGame}>Start Game</button>
        </div>
      )}
      {showSettingsForm && (
        <SettingsForm
          onSave={handleSettingsChange}
          initialSettings={settings}
        />
      )}
      {gameStarted && !gameState.gameOver && (
        <>
          {gameState.displaySequence && <div className="alert-message">Listen carefully!</div>}
          <GameDisplay
            gameState={gameState}
            onNumberClick={handleNumberInput}
          />
        </>
      )}
      {gameState.gameOver && (
        <GameOverDisplay
          score={gameState.score}
          maxDigitsInRound={gameState.maxDigitsInRound}
          onRestart={resetGame}
        />
      )}
    </div>
  );
};

const GameDisplay = ({ gameState, onNumberClick }) => (
  <div>
    {gameState.displayTest && (
      <RecallDisplay onNumberClick={onNumberClick} />
    )}
  </div>
);

const RecallDisplay = ({ onNumberClick }) => (
  <div className="RecallDisplay">
    <h2>Recall the sequence:</h2>
    <div className="buttons">
      {Array.from({ length: 10 }, (_, index) => (
        <button key={index} onClick={() => onNumberClick(index)} className="animal-button">
          {index}
        </button>
      ))}
    </div>
  </div>
);

const GameOverDisplay = ({ score, maxDigitsInRound, onRestart }) => (
  <div className="game-over-display">
    <h2>Game Over</h2>
    <p>Your final score is: {score}</p>
    <p>Maximum digits recalled in one round: {maxDigitsInRound}</p>
    <button onClick={onRestart} className="button">Start Over</button>
  </div>
);

const SettingsForm = ({ onSave, initialSettings }) => {
  const [localSettings, setLocalSettings] = useState(initialSettings);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localSettings);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  return (
    <div className="settings-form">
      <form onSubmit={handleSubmit}>
        <div className="settings-row">
          <label>
            Number of Digits:
            <input
              type="number"
              min="1"
              max="10"
              value={localSettings.sequenceLength}
              onChange={(e) => setLocalSettings({ ...localSettings, sequenceLength: parseInt(e.target.value, 10) })}
            />
          </label>
        </div>
        <div className="settings-row">
          <label>
            Interval Between Digits (seconds):
            <input
              type="number"
              min="0.5"
              max="5"
              step="0.1"
              value={localSettings.intervalBetweenDigits}
              onChange={(e) => setLocalSettings({ ...localSettings, intervalBetweenDigits: parseFloat(e.target.value) })}
            />
          </label>
        </div>
        <div className="settings-row">
          <label>
            Time Before Test (seconds):
            <input
              type="number"
              min="1"
              max="10"
              value={localSettings.timeBeforeTest}
              onChange={(e) => setLocalSettings({ ...localSettings, timeBeforeTest: parseInt(e.target.value, 10) })}
            />
          </label>
        </div>
        <div className="settings-row">
          <label>
            Total Rounds:
            <input
              type="number"
              min="1"
              max="10"
              value={localSettings.totalRounds}
              onChange={(e) => setLocalSettings({ ...localSettings, totalRounds: parseInt(e.target.value, 10) })}
            />
          </label>
        </div>
        <button type="submit" className="button">Save Settings</button>
      </form>
      {showConfirmation && <div className="confirmation-message">Settings updated successfully!</div>}
    </div>
  );
};

export default NumbersGame;
