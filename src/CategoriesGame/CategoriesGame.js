import React, { useState, useEffect } from "react";
import "./CategoriesGame.css";
import BackToHomeButton from "../Backtohomebutton";

// Define arrays for different categories
const Animals = ["Lion", "Tiger", "Bear", "Elephant", "Giraffe", "Zebra", "Fox", "Wolf", "Eagle", "Hawk", "Shark", "Dolphin", "Whale", "Frog", "Deer", "Rabbit"];
const Fruits = ["Apple", "Banana", "Orange", "Grape", "Mango", "Pineapple", "Strawberry", "Blueberry", "Watermelon", "Lemon", "Lime", "Cherry", "Peach", "Plum", "Kiwi", "Papaya"];
const Vegetables = ["Carrot", "Broccoli", "Spinach", "Potato", "Tomato", "Cucumber", "Pepper", "Onion", "Garlic", "Lettuce", "Cabbage", "Cauliflower", "Pumpkin", "Radish", "Beet", "Celery"];
const Colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Brown", "Black", "White", "Gray", "Cyan", "Magenta", "Gold", "Silver", "Maroon"];
const Countries = ["USA", "Canada", "Mexico", "Brazil", "UK", "France", "Germany", "Italy", "Spain", "Russia", "China", "Japan", "India", "Australia", "Egypt", "South Africa"];
const Sports = ["Soccer", "Basketball", "Baseball", "Tennis", "Golf", "Cricket", "Rugby", "Hockey", "Boxing", "MMA", "Cycling", "Swimming", "Rowing", "Gymnastics", "Surfing", "Skiing"];
const Jobs = ["Doctor", "Engineer", "Teacher", "Nurse", "Lawyer", "Architect", "Pilot", "Chef", "Artist", "Scientist", "Journalist", "Musician", "Actor", "Dentist", "Plumber", "Electrician"];
const Vehicles = ["Car", "Truck", "Bus", "Motorcycle", "Bicycle", "Boat", "Airplane", "Helicopter", "Submarine", "Scooter", "Train", "Tram", "Van", "Yacht", "Spaceship", "Tank"];
const Instruments = ["Guitar", "Piano", "Violin", "Drums", "Flute", "Saxophone", "Trumpet", "Clarinet", "Cello", "Harp", "Accordion", "Banjo", "Trombone", "Oboe", "Mandolin", "Ukulele"];
const Planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Eris", "Haumea", "Makemake", "Ceres", "Ganymede", "Titan"];
const Elements = ["Hydrogen", "Helium", "Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Neon", "Sodium", "Magnesium", "Aluminum", "Silicon", "Phosphorus"];
const Languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Russian", "Italian", "Portuguese", "Arabic", "Hindi", "Bengali", "Turkish", "Dutch"];
const Flower = ["Rose", "Tulip", "Daisy", "Sunflower", "Lily", "Orchid", "Daffodil", "Lavender", "Marigold", "Peony", "Chrysanthemum", "Carnation", "Hyacinth", "Iris", "Poppy"];
const Buildings = ["Skyscraper", "Apartment", "Bungalow", "Cottage", "Mansion", "Castle", "Palace", "Villa", "Hut", "Barn", "Warehouse", "Factory", "Hospital", "School", "Library"];
const Holidays = ["Christmas", "New Year", "Thanksgiving", "Halloween", "Easter", "Valentine's Day", "Independence Day", "Labor Day", "Memorial Day", "Hanukkah", "Diwali", "Ramadan", "Chinese New Year", "St. Patrick's Day", "Veterans Day", "Mother's Day"];

// Combine all categories into an object
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

// Main functional component for the game
const CategoriesGame = () => {
  // Form component for settings, receives save function and initial settings as props
  const SettingsForm = ({ onSave, initialSettings }) => {
    const [localSettings, setLocalSettings] = useState(initialSettings); // State for local settings within the form

    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(localSettings); // Save settings to parent component
      setShowSettingsForm(false); // Hide settings form
      setGameState((prev) => ({ ...prev, showInitial: true })); // Show initial game view
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

  // Main state for the game
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
      numCategories: 3,
      waitTime: 0,
      showCategoryLabel: true,
      totalRounds: 1,
    },
  });

  // State for game settings
  const [settings, setSettings] = useState(gameState.initialSettings);
  const [waitCounter, setWaitCounter] = useState(0); // Counter for wait time
  const [showSettingsForm, setShowSettingsForm] = useState(false); // Flag to show/hide settings form

  // Process result after each round
  const processResult = () => {
    const score = gameState.correctWords.reduce(
      (acc, word, index) =>
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

  // Start the game
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

  // Use effect to process results after showing them
  useEffect(() => {
    if (gameState.showResult) {
      processResult();
    }
  }, [gameState.showResult]);

  // Use effect to start game when flag is set
  useEffect(() => {
    if (gameState.shouldStartGame) {
      startGame();
    }
  }, [gameState.shouldStartGame]);

  // Use effect to handle wait time countdown
  useEffect(() => {
    let timer;
    if (waitCounter > 0) {
      timer = setTimeout(() => setWaitCounter(waitCounter - 1), 1000);
    } else if (waitCounter === 0 && gameState.showWaitTime) {
      setGameState((prev) => ({
        ...prev,
        showWaitTime: false,
        showSecondChoices: true,
        userChoices: Array.from({ length: settings.numCategories }, () => Array(5).fill("")), // Reset user choices for second phase
      }));
    }
    return () => clearTimeout(timer);
  }, [waitCounter, gameState.showWaitTime]);

  // Shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Select random words for categories
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

  // Handle word selection
  const handleChoice = (word) => {
    setGameState((prevState) => ({
      ...prevState,
      selectedWord: word,
    }));
  };

  // Handle category click
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

  // Submit user choices and start wait time
  const submitChoices = () => {
    setWaitCounter(settings.waitTime);
    setGameState((prev) => ({
      ...prev,
      showChoices: false,
      showWaitTime: true,
    }));
  };

  // Submit final choices
  const submitFinalChoices = () => {
    setGameState((prev) => ({
      ...prev,
      showResult: true,
      showSecondChoices: false,
    }));
  };

  // Check if all choices have been made
  const canSubmitChoices = () => {
    return gameState.userChoices.every((choices) => choices.every((choice) => choice));
  };

  // Render first part of the game UI
  const renderFirstGameUI = () => {
    return (
      <>
        {gameState.showChoices && (
          <div className="game-container">
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

  // Assign word to a cell
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

  // Render second part of the game UI
  const renderSecondGameUI = () => {
    const allWords = Object.values(CATEGORIES).flat().sort(); // Flatten and sort all words from all categories
    const handleDropdownChange = (e) => {
      const selectedWord = e.target.value;
      handleChoice(selectedWord);
    };

    return (
      <>
        {gameState.showSecondChoices && (
          <div className="game-container">
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
                        <td className="category-cell" onClick={() => assignWordToCell(categoryIndex, rowIndex)}>
                          {gameState.userChoices[categoryIndex][rowIndex] || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
            <div className="word-bank">
              <select onChange={handleDropdownChange} className="word-selector" value={gameState.selectedWord || allWords[0]}>
                {allWords.map((word, index) => (
                  <option key={index} value={word} disabled={gameState.userChoices.flat().includes(word)}>
                    {word}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={submitFinalChoices} className="green-button" disabled={!canSubmitChoices()}>
              Submit Selection
            </button>
          </div>
        )}
      </>
    );
  };

  // Restart the game
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

  // Render game over screen
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
        <button className="lighter-green-button" onClick={startOver}>
          Start Over
        </button>
      </div>
    );
  };

  // Render settings form
  const renderSettingsForm = () => {
    return <SettingsForm onSave={(newSettings) => setSettings(newSettings)} initialSettings={settings} />;
  };

  // Render initial view before the game starts
  const renderInitialView = () => {
    return (
      <>
        <div style={{ marginBottom: "30px" }} className="words-instructions">
          <h1>Categories Recall</h1>
          Directions: You will be presented with several words. Your job is to organize those words into categories, remembering which words were in each category. You will then be given the categories and asked to recall the words in each category from a large word bank.
          <div style={{ paddingTop: "20px" }}>But be careful! You cannot change your answers once you’ve selected from the word bank.</div>
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

  // Render wait time screen
  const renderWaitTime = () => {
    return (
      <div className="wait-time-screen">
        <div className="wait-time-text">Timer: {waitCounter}</div>
      </div>
    );
  };

  return (
    <div className="CategoriesGame">
      <BackToHomeButton /> {/* Navigation button */}
      {gameState.currentRound <= gameState.totalRounds && renderFirstGameUI()} {/* Render first part of the game */}
      {gameState.currentRound > gameState.totalRounds && renderGameOver()} {/* Render game over screen */}
      {showSettingsForm && renderSettingsForm()} {/* Render settings form if flag is set */}
      {gameState.showInitial && renderInitialView()} {/* Render initial view before game starts */}
      {gameState.showWaitTime && renderWaitTime()} {/* Render wait time screen */}
      {gameState.showSecondChoices && renderSecondGameUI()} {/* Render second part of the game */}
    </div>
  );
};

export default CategoriesGame; // Export the component for use in other parts of the app
