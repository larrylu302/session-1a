import React, { useState, useEffect, useRef } from 'react';
import './NumbersGame.css';
import BackToHomeButton from '../Backtohomebutton';
import volumeIcon from './volume_icon.png';
import firstVideo from './numbers_first_video.mp4'
import readInstructions from './decipher_password_voiceover.mp3'
import { Link } from 'react-router-dom';


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
    sequenceLength: 1,
    intervalBetweenDigits: 1,
    timeBeforeTest: 1,
    totalRounds: 1,
  };

  const [gameState, setGameState] = useState(initialGameState);
  const [settings, setSettings] = useState(initialSettings);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false); // State to track video completion
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && videoWatched && !gameStarted && !showSettingsForm) {
      audioRef.current.play();
    }
  }, [videoWatched, gameStarted, showSettingsForm]);

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

  const resetGame = () => {
    setGameState(initialGameState);
    setGameStarted(false);
    setShowSettingsForm(false);
    setVideoWatched(false); // Reset video state
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
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


  const handleVideoEnd = () => {
    setVideoWatched(true);
  };

  const handleSkipVideo = () => {
    setVideoWatched(true);
  };

  return (
    <div className="NumbersGame">
      <BackToHomeButton />

      {!videoWatched && (
        <div className="video-container">
          <div><video width="600" controls autoPlay playsInline onEnded={handleVideoEnd}>
            <source src={firstVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video></div>
          <button className="number-button" onClick={handleSkipVideo}>Skip Video</button>
        </div>
      )}

      {videoWatched && !gameStarted && !showSettingsForm && (
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

const GameOverDisplay = ({ score, maxDigitsInRound, onRestart }) => (
  <div className="numbers-instructions">
    <h2>Game Over</h2>
    <p>Your final score is: {score}</p>
    <p>Maximum digits recalled in one round: {maxDigitsInRound}</p>
    <button onClick={onRestart} className="number-setting-button-submit">Done</button>
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
