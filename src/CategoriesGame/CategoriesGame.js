import React, { useState, useEffect, useRef } from "react";
import "./CategoriesGame.css";
import BackToHomeButton from "../Backtohomebutton";
import { useScores } from '../ScoresContext';
import { useParams, useNavigate } from 'react-router-dom';
import audioInstructions from "./categories-audio.mp3";
import PinChecker from "../PinChecker"; // Import the PinChecker component

const Animals = ["Lion", "Tiger", "Bear", "Elephant", "Giraffe", "Zebra", "Kangaroo", "Penguin"];
const Fruits = ["Apple", "Banana", "Blueberry", "Grape", "Mango", "Strawberry", "Pineapple", "Watermelon"];
const Vegetables = ["Carrot", "Broccoli", "Spinach", "Potato", "Onion", "Cucumber", "Peas", "Corn"];
const Colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Black", "Brown"];
const Countries = ["USA", "Canada", "Mexico", "UK", "China", "India", "Australia", "Brazil"];
const Sports = ["Soccer", "Basketball", "Baseball", "Tennis", "Swimming", "Running", "Cycling", "Gymnastics"];
const Jobs = ["Doctor", "Teacher", "Nurse", "Pilot", "Chef", "Firefighter", "Police", "Farmer"];
const Vehicles = ["Car", "Truck", "Bus", "Bicycle", "Boat", "Train", "Airplane", "Motorcycle"];
const Instruments = ["Guitar", "Piano", "Violin", "Drums", "Flute", "Trumpet", "Harp", "Saxophone"];
const Planets = ["Pluto", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
const Elements = ["Hydrogen", "Helium", "Oxygen", "Carbon", "Nitrogen", "Gold", "Silver", "Iron"];
const Languages = ["English", "Spanish", "French", "German", "Japanese", "Italian", "Russian", "Portuguese"];
const Flower = ["Rose", "Tulip", "Daisy", "Sunflower", "Lily", "Orchid", "Violet", "Daffodil"];
const Buildings = ["Skyscraper", "Apartment", "Cottage", "Castle", "School", "Hospital", "Library", "Museum"];
const Holidays = ["Christmas", "New Year", "Thanksgiving", "Halloween", "Easter", "Valentine's Day", "Independence Day", "Hanukkah"];

const CATEGORIES = {
  Animals,
  Fruits,
  Vegetables,
  Colors,
  Countries,
  Sports,
  Jobs,
  Vehicles,
  Instruments,
  Planets,
  Elements,
  Languages,
  Flower,
  Buildings,
  Holidays,
};

const CategoriesGame = () => {
  const { scores, updateScores } = useScores();
  const navigate = useNavigate();
  const {name, day} = useParams();
  const audioRef = useRef(audioInstructions); // Reference for audio element

  const SettingsForm = ({ onSave, initialSettings }) => {
    const [localSettings, setLocalSettings] = useState(initialSettings);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(localSettings);
      setShowSettingsForm(false);
      setGameState((prev) => ({ ...prev, showInitial: true }));
    };

    return (
      <form onSubmit={handleSubmit} className="word-settings-form">
        <div className="settings-row">
          <label>
            Number of Categories:
            <input
              className="green-input"
              type="number"
              max={5}
              min={1}
              value={localSettings.numCategories}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  numCategories: parseInt(e.target.value, 10),
                })
              }
            />
          </label>
        </div>
        <div className="settings-row">
          <label>
            Wait Time (seconds):
            <input
              className="green-input"
              type="number"
              max={60}
              min={0}
              value={localSettings.waitTime}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  waitTime: parseInt(e.target.value, 10),
                })
              }
            />
          </label>
        </div>
        <div className="settings-row">
          <label>
            Show Category Label:
            <input
              className="green-input"
              type="checkbox"
              checked={localSettings.showCategoryLabel}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  showCategoryLabel: e.target.checked,
                })
              }
            />
          </label>
        </div>
        <div className="settings-row">
          <label>
            Number of Rounds:
            <input
              className="green-input"
              type="number"
              max={999}
              min={0}
              value={localSettings.totalRounds}
              onChange={(e) => setLocalSettings({ ...localSettings, totalRounds: parseInt(e.target.value, 10) })}
            />
          </label>
        </div>
        <button
          type="submit"
          className="lighter-green-button"
          style={{ marginTop: "20px", marginBottom: "15px" }}
        >
          Save Settings
        </button>
      </form>
    );
  };

  const [gameState, setGameState] = useState({
    correctWords: [],
    selectedCategories: [],
    userChoices: [],
    showChoices: false,
    showSecondChoices: false,
    showResult: false,
    showInitial: true,
    shouldStartGame: false,
    showWaitTime: false,
    result: "",
    mode: "Practice",
    errorCount: 0,
    score: 0,
    currentRound: 1,
    totalRounds: 1,
    maxWordsRecalled: 0,
    initialSettings: {
      numCategories: 4,
      waitTime: 1,
      showCategoryLabel: true,
      totalRounds: 1,
    },
  });

  const [settings, setSettings] = useState(gameState.initialSettings);
  const [waitCounter, setWaitCounter] = useState(0);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // State for mute functionality

  useEffect(() => {
    if (audioRef.current) {
      if ((gameState.showInitial || showSettingsForm) && !isMuted) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isMuted, gameState.showInitial, showSettingsForm]);

  const processResult = () => {
    const score = gameState.correctWords.reduce(
      (acc, word) =>
        acc + (gameState.userChoices.flat().includes(word) ? 1 : 0),
      0
    );
    const isCorrect = score === gameState.correctWords.length;

    setGameState((prevState) => ({
      ...prevState,
      errorCount: isCorrect ? 0 : prevState.errorCount + 1,
      score: prevState.score + score,
      currentRound: prevState.currentRound + 1,
      maxWordsRecalled: Math.max(prevState.maxWordsRecalled, score),
    }));

    if (gameState.currentRound < gameState.totalRounds) {
      if (isCorrect) {
        setSettings((prevSettings) => ({
          ...prevSettings,
          numWords: prevSettings.numWords + 1,
        }));
      }
      setGameState((prev) => ({ ...prev, shouldStartGame: true }));
    }
  };

  const startGame = () => {
    const { selectedWords, categories } = selectRandomWords(settings.numCategories);
    setGameState((prevState) => ({
      ...prevState,
      correctWords: selectedWords,
      selectedCategories: categories,
      userChoices: Array.from({ length: settings.numCategories }, () => Array(5).fill("")),
      showChoices: true,
      showResult: false,
      showInitial: false,
      showSecondChoices: false,
      result: "",
      totalRounds: settings.totalRounds,
      shouldStartGame: false,
    }));
  };

  useEffect(() => {
    if (gameState.showResult) {
      processResult();
    }
  }, [gameState.showResult]);

  useEffect(() => {
    if (gameState.shouldStartGame) {
      startGame();
    }
  }, [gameState.shouldStartGame]);

  useEffect(() => {
    let timer;
    if (waitCounter > 0) {
      timer = setTimeout(() => setWaitCounter(waitCounter - 1), 1000);
    } else if (waitCounter === 0 && gameState.showWaitTime) {
      setGameState((prev) => ({
        ...prev,
        showWaitTime: false,
        showSecondChoices: true,
        userChoices: Array.from({ length: settings.numCategories }, () => Array(5).fill("")),
      }));
    }
    return () => clearTimeout(timer);
  }, [waitCounter, gameState.showWaitTime]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const selectRandomWords = (numCategories) => {
    const categoryKeys = Object.keys(CATEGORIES);
    const shuffledCategoryKeys = shuffleArray([...categoryKeys]);
    const selectedCategoryKeys = shuffledCategoryKeys.slice(0, numCategories);
    const selectedWords = [];
    const selectedCategories = [];

    selectedCategoryKeys.forEach((categoryKey) => {
      const category = CATEGORIES[categoryKey];
      const shuffledWords = shuffleArray([...category]);
      selectedWords.push(...shuffledWords.slice(0, 5));
      selectedCategories.push(categoryKey);
    });

    return {
      selectedWords: shuffleArray(selectedWords),
      categories: selectedCategories,
    };
  };

  const handleChoice = (word) => {
    setGameState((prevState) => ({
      ...prevState,
      selectedWord: word,
    }));
  };

  const handleCategoryClick = (categoryIndex, rowIndex) => {
    if (gameState.selectedWord) {
      const category = gameState.selectedCategories[categoryIndex];
      const correctWordsForCategory = CATEGORIES[category];
      if (correctWordsForCategory.includes(gameState.selectedWord)) {
        setGameState((prevState) => {
          const newChoices = [...prevState.userChoices];
          if (!newChoices[categoryIndex].includes(gameState.selectedWord)) {
            newChoices[categoryIndex][rowIndex] = gameState.selectedWord;
            return {
              ...prevState,
              userChoices: newChoices,
              selectedWord: null,
            };
          }
          return prevState;
        });
      }
    }
  };

  const submitChoices = () => {
    setWaitCounter(settings.waitTime);
    setGameState((prev) => ({
      ...prev,
      showChoices: false,
      showWaitTime: true,
    }));
  };

  const submitFinalChoices = () => {
    setGameState((prev) => ({
      ...prev,
      showResult: true,
      showSecondChoices: false,
    }));
  };

  const canSubmitChoices = () => {
    return gameState.userChoices.every((choices) => choices.every((choice) => choice));
  };

  const renderFirstGameUI = () => {
    return (
      <>
        {gameState.showChoices && (
          <div className="game-container">
            <h2>
              Place each word in the correct category. You will not be able to place a word in the incorrect category, and can take
              as much time as you need before moving on. Press "Recall" when you are ready.
              <div></div>Try to remember these words
            </h2>
            <div className="categories-container">
              {gameState.selectedCategories.map((category, categoryIndex) => (
                <table key={categoryIndex} className="category-table">
                  <thead>
                    <tr>
                      <th className="category-header">
                        {settings.showCategoryLabel ? category : `Category ${categoryIndex + 1}`}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="category-cell" onClick={() => handleCategoryClick(categoryIndex, rowIndex)}>
                          {gameState.userChoices[categoryIndex][rowIndex] || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
            <div className="word-bank">
              {gameState.correctWords.map((word, index) => (
                <button
                  key={index}
                  className={`word-button ${gameState.selectedWord === word ? "selected" : ""} ${
                    gameState.userChoices.flat().includes(word) ? "grayed-out" : ""
                  }`}
                  onClick={() => handleChoice(word)}
                  disabled={gameState.userChoices.flat().includes(word)}
                >
                  {word}
                </button>
              ))}
            </div>
            <button onClick={submitChoices} className="green-button" disabled={!canSubmitChoices()}>
              Recall
            </button>
          </div>
        )}
      </>
    );
  };

  const assignWordToCell = (categoryIndex, rowIndex) => {
    if (gameState.selectedWord) {
      setGameState((prevState) => {
        const newChoices = [...prevState.userChoices];
        if (!newChoices[categoryIndex][rowIndex] && !prevState.userChoices.flat().includes(gameState.selectedWord)) {
          newChoices[categoryIndex][rowIndex] = gameState.selectedWord;
          return {
            ...prevState,
            userChoices: newChoices,
            selectedWord: "",
          };
        }
        return prevState;
      });
    }
  };

  const renderSecondGameUI = () => {
    const allWords = Object.values(CATEGORIES).flat().sort();

    return (
      <>
        {gameState.showSecondChoices && (
          <div className="game-container">
            <h2>
              Please look through the list of words below and select the words you
              just saw. Then place them into the boxes above. Note: Scroll through the word bank to see other words
            </h2>
            <div className="categories-container">
              {gameState.selectedCategories.map((category, categoryIndex) => (
                <table key={categoryIndex} className="category-table">
                  <tbody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        <td
                          className="category-cell"
                          onClick={() => assignWordToCell(categoryIndex, rowIndex)}
                        >
                          {gameState.userChoices[categoryIndex][rowIndex] || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
            <div className="word-bank second-phase-bank">
              {allWords.map((word, index) => (
                <button
                  key={index}
                  className={`word-button ${gameState.selectedWord === word ? "selected" : ""} ${
                    gameState.userChoices.flat().includes(word) ? "grayed-out" : ""
                  }`}
                  onClick={() => handleChoice(word)}
                  disabled={gameState.userChoices.flat().includes(word)}
                >
                  {word}
                </button>
              ))}
            </div>
            <button onClick={submitFinalChoices} className="green-button-categories" disabled={!canSubmitChoices()}>
              Submit Selection
            </button>
          </div>
        )}
      </>
    );
  };


  const startOver = () => {
    setGameState((prevState) => ({
      ...prevState,
      correctWords: [],
      selectedCategories: [],
      userChoices: [],
      showChoices: false,
      showSecondChoices: false,
      showResult: false,
      showInitial: true,
      shouldStartGame: false,
      showWaitTime: false,
      result: "",
      mode: "Practice",
      errorCount: 0,
      score: 0,
      currentRound: 1,
      totalRounds: 1,
      maxWordsRecalled: 0,
    }));
    setSettings(gameState.initialSettings);
  };

  const handleGameOver = () => {
    updateScores('categories', {
      'Words Correctly Recalled': gameState.score,
      'Max Words Recalled in One Round': gameState.maxWordsRecalled,
    });
    navigate(`/${name}/${day}/home`); // Navigate back to the home page
  };

  const renderGameOver = () => {
    return (
      <div className="words-instructions">
        <h2>Game Over</h2>
        <div>Final Score: {gameState.score}</div>
        <div>Max Words Recalled in a Category: {gameState.maxWordsRecalled}</div>
        <div className="initial-settings" style={{ marginBottom: "20px", marginTop: "20px" }}>
          <strong>Initial Settings:</strong>
          <br />
          Number of Categories: {settings.numCategories}
          <br />
          Wait Time: {settings.waitTime} {settings.waitTime === 1 ? 'second' : 'seconds'}
          <br />
          Category Label Shown: {gameState.initialSettings.showCategoryLabel ? "Yes" : "No"}
          <br />
          Total Rounds: {settings.totalRounds}
        </div>
        {/* Integrate PinChecker and call handleGameOver on correct pin */}
        {/* <PinChecker onPinCorrect={handleGameOver} /> */}
        <button className="lighter-green-button" onClick={handleGameOver}>Done</button>
      </div>
    );
  };

  const renderSettingsForm = () => {
    return <SettingsForm onSave={(newSettings) => setSettings(newSettings)} initialSettings={settings} />;
  };

  const renderInitialView = () => {
    return (
      <>
        <div style={{ marginBottom: "30px" }} className="words-instructions">
          <h1>Categories Recall</h1>
          You'll see several words in a grid at the bottom, and four different categories at the top. Click to place each word in the correct category. The computer will help you by only letting you place a word in the right spot. Try to remember the words as you
          do this. Click “Start” when you are ready. A blank grid will appear with a list of words. Find the words you remembered and click them to fill the grid.
          <div style={{ paddingTop: "20px" }}>But be careful! You cannot change your answers once you've selected them.
          Choose wisely. The fate of the multiverse depends on you!</div>
        </div>
        <button className="green-button" onClick={() => { setShowSettingsForm(true); setGameState((prev) => ({ ...prev, showInitial: false })); }}>
          Settings
        </button>
        <button className="green-button" onClick={startGame}>
          Start Game
        </button>
      </>
    );
  };

  const renderWaitTime = () => {
    return (
      <div className="wait-time-screen">
        <div className="wait-time-text">Timer: {waitCounter}</div>
      </div>
    );
  };

  return (
    <div className="CategoriesGame">
      <audio ref={audioRef} src={audioInstructions} />
      {gameState.showInitial && <BackToHomeButton />}
      {gameState.currentRound <= gameState.totalRounds && renderFirstGameUI()}
      {gameState.currentRound > gameState.totalRounds && renderGameOver()}
      {showSettingsForm && renderSettingsForm()}
      {gameState.showInitial && renderInitialView()}
      {gameState.showWaitTime && renderWaitTime()}
      {gameState.showSecondChoices && renderSecondGameUI()}
      {(gameState.showInitial || showSettingsForm) && (
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
      )}
    </div>
  );
};

export default CategoriesGame;
