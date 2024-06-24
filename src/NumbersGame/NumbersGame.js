import React, { useState, useEffect, useRef } from 'react';
import './NumbersGame.css';
import BackToHomeButton from '../Backtohomebutton';
import volumeIcon from './volume_icon.png';
import readInstructions from './decipher_password_voiceover.mp3';
import { useScores } from '../ScoresContext';
import { useParams, useNavigate } from 'react-router-dom';

const NumbersGame = () => {
  const { scores, updateScores } = useScores();
  const navigate = useNavigate(); // Hook to access the navigate function
  const {name, day} = useParams();

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
    initialSettings: {
      sequenceLength: 3,
      intervalBetweenDigits: .75,
      timeBeforeTest: 1,
      totalRounds: 5,}
  };

  const [gameState, setGameState] = useState(initialGameState);
  const [settings, setSettings] = useState(gameState.initialSettings);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && !gameStarted && !showSettingsForm) {
      audioRef.current.play();
    }
  }, [gameStarted, showSettingsForm]);

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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      setGameState(prevState => ({ ...prevState, gameOver: true }));
    }
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  const handleGameOver = () => {
    updateScores('numbers',
      {'Final Score': gameState.score,
      'Max Digits Recalled in One Round': gameState.maxDigitsInRound,
    }
    )
    navigate(`/${name}/${day}/home`); // Navigate back to the home page
  }

  return (
    <div className="NumbersGame">
      <BackToHomeButton />

      {!gameStarted && !showSettingsForm && (
        <div>
          <div style={{ marginBottom: '50px', marginLeft:'30px', marginRight:'30px', paddingBottom:'70px' }} className='numbers-instructions'>
            <h1>Decipher the Secret Password</h1>
            Directions: You will hear several numbers (so make sure to wear your headphones!). Your job is to
            remember these numbers and select the tiles with those numbers in the exact order of how they were
            presented.
            <div>But be careful! You cannot change your answers once you’ve selected them.  
            Choose wisely. The fate of the multiverse depends on you!</div>

          </div>
          <div className="initial-buttons">
            <button style={{marginRight:'20px'}} className="number-button" onClick={handleShowSettings}>Settings</button>
            <button className="number-button" onClick={startGame}>Start Game</button>
          </div>
          <audio ref={audioRef} src={readInstructions} muted={muted} />
          <button className="number-button" style={{ position: 'fixed', bottom: '10px', right: '10px' }} onClick={toggleMute}>
            {muted ? 'Unmute' : 'Mute'}
          </button>
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
          {gameState.displaySequence &&
          <div className='numbers-instructions'>
            <div>Listen carefully!</div>
            <img src={volumeIcon} alt="img not working" />
          </div>}
          <GameDisplay
            gameState={gameState}
            onNumberClick={handleNumberInput}
          />
        </>
      )}
      {gameState.gameOver && (
      <div className="numbers-instructions">
          <h2>Game Over</h2>
          <p>Your final score is: {gameState.score}</p>
          <p>Maximum digits recalled in one round: {gameState.maxDigitsInRound}</p>
          <button className="number-setting-button-submit" onClick={handleGameOver}>Done</button>
      </div>
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
  <div className="RecallDisplay" style={{backgroundColor:'#f4c76e', borderRadius:'10px'}}>
    <h2 style={{color:'black'}}>Recall the sequence:</h2>
    <div className="buttons">
      {Array.from({ length: 10 }, (_, index) => (
        <button key={index} onClick={() => onNumberClick(index)} className="number-grid-button">
          {index}
        </button>
      ))}
    </div>
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
    <div className="number-settings-form">
      <form onSubmit={handleSubmit}>
        <div className="settings-row">
          <label>
            Number of Digits:
            <input
              className='orange-input'
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
              className='orange-input'
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
              className='orange-input'
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
              className='orange-input'
              type="number"
              min="1"
              max="10"
              value={localSettings.totalRounds}
              onChange={(e) => setLocalSettings({ ...localSettings, totalRounds: parseInt(e.target.value, 10) })}
            />
          </label>
        </div>
        <button type="submit" className="number-setting-button-submit">Save Settings</button>
      </form>
      {showConfirmation && <div className="confirmation-message">Settings updated successfully!</div>}
    </div>
  );
};

export default NumbersGame;
