import React, { useState, useEffect, useRef } from 'react';
import './WordsGame.css';
import BackToHomeButton from '../Backtohomebutton';
import { useScores } from '../ScoresContext';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate hook from React Router
import audioInstructions from "./words-audio.mp3";

const ANIMALS = ['Lion', 'Tiger', 'Bear', 'Elephant', 'Giraffe', 'Zebra', 'Fox', 'Wolf', 'Eagle', 'Hawk', 'Shark', 'Dolphin', 'Whale', 'Frog', 'Deer', 'Rabbit'];

const WordsGame = () => {
  const { scores, updateScores } = useScores();
  const navigate = useNavigate(); // Hook to access the navigate function
  const { name, day } = useParams();
  const audioRef = useRef(null); // Reference for audio element
  const [isMuted, setIsMuted] = useState(false); // State for mute functionality

  const SettingsForm = ({ onSave, initialSettings }) => {
    const [localSettings, setLocalSettings] = useState(initialSettings);
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({
        ...localSettings,
        memorizationTime: localSettings.memorizationTimePerWord * 1000 * localSettings.numWords
      });
      setShowSettingsForm(false);
      setGameState(prev => ({ ...prev, showInitial: true, initialSettings: localSettings }))
    };

    return (
      <form onSubmit={handleSubmit} className="word-settings-form">
        <div className="settings-row">
          <label>
            Number of Words:
            <input
              className='green-input'
              type="number"
              value={localSettings.numWords}
              onChange={(e) => setLocalSettings({ ...localSettings, numWords: parseInt(e.target.value, 10) })}
            />
          </label>
        </div>
        <div className="settings-row">
          <label>
            Memorization Time per Word (seconds):
            <input
              className='green-input'
              type="number"
              value={localSettings.memorizationTimePerWord}
              onChange={(e) => setLocalSettings({ ...localSettings, memorizationTimePerWord: parseInt(e.target.value, 10) })}
            />
          </label>
        </div>
        <div className="settings-row">
          <label>
            Number of Rounds:
            <input
              className='green-input'
              type="number"
              value={localSettings.totalRounds}
              onChange={(e) => setLocalSettings({ ...localSettings, totalRounds: parseInt(e.target.value, 10) })}
            />
          </label>
        </div>
        <button type="submit" className="lighter-green-button" style={{ marginTop: "20px", marginBottom: '15px' }}>Save Settings</button>
      </form>
    );
  };

  const [gameState, setGameState] = useState({
    correctWords: [],
    userChoices: [],
    showChoices: false,
    showResult: false,
    showInitial: true,
    shouldStartGame: false,
    result: '',
    mode: 'Practice',
    errorCount: 0,
    score: 0,
    currentRound: 1,
    totalRounds: 1,
    maxWordsRecalled: 0,
    initialSettings: {
      numWords: 3,
      memorizationTimePerWord: 1,
      totalRounds: 5
    }
  });

  const [settings, setSettings] = useState(gameState.initialSettings);

  useEffect(() => {
    if (gameState.showResult) {
      processResult();
    }
  }, [gameState.showResult]);

  useEffect(() => {
    if (gameState.shouldStartGame) {
      startGame();
      setGameState(prev => ({ ...prev, shouldStartGame: false }));
    }
  }, [gameState.shouldStartGame]);

  useEffect(() => {
    if (audioRef.current && !isMuted && gameState.showInitial) {
      audioRef.current.play();
    }
  }, [isMuted, gameState.showInitial]);

  const processResult = () => {
    const score = gameState.correctWords.reduce((acc, word, index) =>
      acc + (gameState.userChoices[index] === word ? 1 : 0), 0);
    const isCorrect = score === gameState.correctWords.length;

    setGameState(prevState => ({
      ...prevState,
      errorCount: isCorrect ? 0 : prevState.errorCount + 1,
      score: prevState.score + score,
      currentRound: prevState.currentRound + 1,
      maxWordsRecalled: Math.max(prevState.maxWordsRecalled, score)
    }));

    if (gameState.currentRound < gameState.totalRounds) {
      if (isCorrect) {
        setSettings(prevSettings => ({
          ...prevSettings,
          numWords: prevSettings.numWords + 1
        }));
      }
      setGameState(prev => ({ ...prev, shouldStartGame: true }));
    }
  };

  const startGame = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const selectedWords = selectRandomWords(settings.numWords);
    setGameState(prevState => ({
      ...prevState,
      correctWords: selectedWords,
      userChoices: [],
      showChoices: false,
      showResult: false,
      showInitial: false,
      result: '',
      totalRounds: settings.totalRounds
    }));

    setTimeout(() => {
      setGameState(prevState => ({ ...prevState, showChoices: true }));
    }, settings.memorizationTimePerWord * 1000 * selectedWords.length);
  };

  const selectRandomWords = (numWords) => {
    const selected = [];
    let attempts = 0;
    while (selected.length < numWords && attempts < 100) {
      const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      if (!selected.includes(word)) {
        selected.push(word);
      }
      attempts++;
    }
    return selected;
  };

  const handleChoice = (word) => {
    if (gameState.userChoices.length < settings.numWords && !gameState.userChoices.includes(word)) {
      setGameState(prevState => ({
        ...prevState,
        userChoices: [...prevState.userChoices, word],
        lastSelected: word
      }));

      setTimeout(() => {
        setGameState(prevState => ({ ...prevState, lastSelected: null }));
      }, 3000);
    }
  };

  const submitChoices = () => {
    setGameState(prev => ({ ...prev, showResult: true, showChoices: false }));
  };

  const [showSettingsForm, setShowSettingsForm] = useState(false);

  return (
    <div className="WordsGame">
      <audio ref={audioRef} src={audioInstructions} />
      <BackToHomeButton />
      {gameState.currentRound <= gameState.totalRounds && renderGameUI()}
      {gameState.currentRound > gameState.totalRounds && renderGameOver()}
      {showSettingsForm && renderSettingsForm()}
      {gameState.showInitial && renderInitialView()}
      <button
        className="mute-button"
        onClick={() => {
          setIsMuted(!isMuted);
          if (audioRef.current) {
            audioRef.current.muted = !isMuted;
          }
        }}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>
    </div>
  );

  function renderGameUI() {
    return (
      <>
        {gameState.correctWords.length > 0 && !gameState.showChoices &&
          <div className="word-list">
            {gameState.correctWords.map((word, index) => (
              <div key={index} className="word-item">{word}</div>
            ))}
          </div>
        }
        {gameState.showChoices &&
          <div>
            <h2>Select the words in the order they were presented:</h2>
            <div className="word-grid">
              {ANIMALS.map((animal, index) => (
                <button
                  key={index}
                  className={`animal-button ${gameState.lastSelected === animal ? 'selected' : ''}`}
                  onClick={() => handleChoice(animal)}
                >
                  {animal}
                </button>
              ))}
            </div>
            <button onClick={submitChoices} className='green-button' >Submit Selection</button>
          </div>
        }
      </>
    );
  }

  function handleGameOver() {
    updateScores('words',
      {
        'Final Score': gameState.score,
        'Max Words Recalled in One Round': gameState.maxWordsRecalled,
      }
    )
    navigate(`/${name}/${day}/home`); // Navigate back to the home page
  }

  function renderGameOver() {
    return (
      <div className='words-instructions'>
        <h2>Game Over</h2>
        <div>Final Score: {gameState.score}</div>
        <div>Max Words Recalled in One Round: {gameState.maxWordsRecalled}</div>
        <div className="initial-settings" style={{ marginBottom: '20px', marginTop: '20px' }}>
          <strong>Initial Settings:</strong><br />
          Number of Words: {gameState.initialSettings.numWords}<br />
          Memorization Time per Word: {gameState.initialSettings.memorizationTimePerWord}<br />
          Total Rounds: {gameState.initialSettings.totalRounds}
        </div>
        <button className="lighter-green-button" onClick={handleGameOver}>Done</button>
      </div>
    );
  }

  function renderSettingsForm() {
    return (
      <SettingsForm
        onSave={(newSettings) => setSettings(newSettings)}
        initialSettings={settings}
      />
    );
  }

  function renderInitialView() {
    return (
      <>
        <div style={{ marginBottom: '30px' }} className='words-instructions'>
          <h1>Word Recall</h1>
          Directions: You will be presented with several words. Your job is to remember these words in order and select tiles with those words in the exact same order that they were presented.

          <div style={{ paddingTop: '20px' }}>But be careful! You cannot change your answers once you’ve selected a tile. Choose wisely. The fate of the multiverse depends on you!</div>
        </div>
        <button className="green-button" onClick={() => {
          setShowSettingsForm(true);
          setGameState(prev => ({ ...prev, showInitial: false }))
        }}>Settings</button>
        <button className="green-button" onClick={startGameWithAudioPause}>Start Game</button>
      </>
    );
  }

  function startGameWithAudioPause() {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    startGame();
  }
};

export default WordsGame;
