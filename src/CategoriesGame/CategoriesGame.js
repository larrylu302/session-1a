import React, { useState, useEffect } from 'react';
import './CategoriesGame.css';
import BackToHomeButton from '../Backtohomebutton';

const Animals = ['Lion', 'Tiger', 'Bear', 'Elephant', 'Giraffe', 'Zebra', 'Fox', 'Wolf', 'Eagle', 'Hawk', 'Shark', 'Dolphin', 'Whale', 'Frog', 'Deer', 'Rabbit'];
const Fruits = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango', 'Pineapple', 'Strawberry', 'Blueberry', 'Watermelon', 'Lemon', 'Lime', 'Cherry', 'Peach', 'Plum', 'Kiwi', 'Papaya'];
const Vegetables = ['Carrot', 'Broccoli', 'Spinach', 'Potato', 'Tomato', 'Cucumber', 'Pepper', 'Onion', 'Garlic', 'Lettuce', 'Cabbage', 'Cauliflower', 'Pumpkin', 'Radish', 'Beet', 'Celery'];
const Colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown', 'Black', 'White', 'Gray', 'Cyan', 'Magenta', 'Gold', 'Silver', 'Maroon'];
const Countries = ['USA', 'Canada', 'Mexico', 'Brazil', 'UK', 'France', 'Germany', 'Italy', 'Spain', 'Russia', 'China', 'Japan', 'India', 'Australia', 'Egypt', 'South Africa'];
const Sports = ['Soccer', 'Basketball', 'Baseball', 'Tennis', 'Golf', 'Cricket', 'Rugby', 'Hockey', 'Boxing', 'MMA', 'Cycling', 'Swimming', 'Rowing', 'Gymnastics', 'Surfing', 'Skiing'];
const Jobs = ['Doctor', 'Engineer', 'Teacher', 'Nurse', 'Lawyer', 'Architect', 'Pilot', 'Chef', 'Artist', 'Scientist', 'Journalist', 'Musician', 'Actor', 'Dentist', 'Plumber', 'Electrician'];
const Vehicles = ['Car', 'Truck', 'Bus', 'Motorcycle', 'Bicycle', 'Boat', 'Airplane', 'Helicopter', 'Submarine', 'Scooter', 'Train', 'Tram', 'Van', 'Yacht', 'Spaceship', 'Tank'];
const Instruments = ['Guitar', 'Piano', 'Violin', 'Drums', 'Flute', 'Saxophone', 'Trumpet', 'Clarinet', 'Cello', 'Harp', 'Accordion', 'Banjo', 'Trombone', 'Oboe', 'Mandolin', 'Ukulele'];
const Planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Eris', 'Haumea', 'Makemake', 'Ceres', 'Ganymede', 'Titan'];
const Elements = ['Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium', 'Aluminum', 'Silicon', 'Phosphorus'];
const Languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Russian', 'Italian', 'Portuguese', 'Arabic', 'Hindi', 'Bengali', 'Turkish', 'Dutch'];
const Flower = ['Rose', 'Tulip', 'Daisy', 'Sunflower', 'Lily', 'Orchid', 'Daffodil', 'Lavender', 'Marigold', 'Peony', 'Chrysanthemum', 'Carnation', 'Hyacinth', 'Iris', 'Poppy'];
const Buildings = ['Skyscraper', 'Apartment', 'Bungalow', 'Cottage', 'Mansion', 'Castle', 'Palace', 'Villa', 'Hut', 'Barn', 'Warehouse', 'Factory', 'Hospital', 'School', 'Library'];
const Holidays = ['Christmas', 'New Year', 'Thanksgiving', 'Halloween', 'Easter', 'Valentine\'s Day', 'Independence Day', 'Labor Day', 'Memorial Day', 'Hanukkah', 'Diwali', 'Ramadan', 'Chinese New Year', 'St. Patrick\'s Day', 'Veterans Day', 'Mother\'s Day'];

const CATEGORIES = { Animals, Fruits, Vegetables, Colors, Countries, Sports, Jobs, 
Vehicles, Instruments, Planets, Elements, Languages, Flower, Buildings, Holidays };

const CategoriesGame = () => {
  const SettingsForm = ({ onSave, initialSettings }) => {
    const [localSettings, setLocalSettings] = useState(initialSettings);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(localSettings);
      setShowSettingsForm(false);
      setGameState(prev => ({ ...prev, showInitial: true }))
    };

    return (
      <form onSubmit={handleSubmit} className="word-settings-form">
        <div className="settings-row">
          <label>
            Number of Categories:
            <input
              className='green-input'
              type="number"
              max={5}
              min={1}
              value={localSettings.numCategories}
              onChange={(e) => setLocalSettings({ ...localSettings, numCategories: parseInt(e.target.value, 10) })}
            />
          </label>
        </div>
        <div className="settings-row">
          <label>
            Wait Time (seconds):
            <input
              className='green-input'
              type="number"
              max={60}
              min={0}
              value={localSettings.waitTime}
              onChange={(e) => setLocalSettings({ ...localSettings, waitTime: parseInt(e.target.value, 10) })}
            />
          </label>
        </div>
        <div className="settings-row">
          <label>
            Show Category Label:
            <input
                className='green-input'
                type="checkbox"
                checked={localSettings.showCategoryLabel}
                onChange={(e) => setLocalSettings({ ...localSettings, showCategoryLabel: e.target.checked})}
            />
          </label>
        </div>
        <button type="submit" className="lighter-green-button" style={{marginTop: "20px", marginBottom: '15px'}}>Save Settings</button>
      </form>
    );
  };

  const [gameState, setGameState] = useState({
    correctWords: [],
    selectedCategories: [],
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
        numCategories: 3,
        waitTime: 0,
        showCategoryLabel: true,
        totalRounds: 1
      }  
  });

  const [settings, setSettings] = useState(gameState.initialSettings);
  

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
    const { selectedWords, categories } = selectRandomWords(settings.numCategories);
    setGameState(prevState => ({
      ...prevState,
      correctWords: selectedWords,
      selectedCategories: categories,
      userChoices: Array.from({ length: settings.numCategories }, () => []),
      showChoices: false,
      showResult: false,
      showInitial: false,
      result: '',
      totalRounds: settings.totalRounds
    }));

    setTimeout(() => {
      setGameState(prevState => ({ ...prevState, showChoices: true }));
    }, settings.waitTime * 1000);
  };

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

    selectedCategoryKeys.forEach(categoryKey => {
      const category = CATEGORIES[categoryKey];
      const shuffledWords = shuffleArray([...category]);
      selectedWords.push(...shuffledWords.slice(0, 5));
      selectedCategories.push(categoryKey);
    });

    return { selectedWords: shuffleArray(selectedWords), categories: selectedCategories };
  };

  const handleChoice = (word) => {
    setGameState(prevState => ({
      ...prevState,
      selectedWord: word
    }));
  };

  const handleCategoryClick = (categoryIndex) => {
    if (gameState.selectedWord) {
      const category = gameState.selectedCategories[categoryIndex];
      const correctWordsForCategory = CATEGORIES[category];
      if (correctWordsForCategory.includes(gameState.selectedWord)) {
        setGameState(prevState => {
          const newChoices = [...prevState.userChoices];
          if (newChoices[categoryIndex].length < 5 && !newChoices[categoryIndex].includes(gameState.selectedWord)) {
            newChoices[categoryIndex] = [...newChoices[categoryIndex], gameState.selectedWord];
            return {
              ...prevState,
              userChoices: newChoices,
              selectedWord: null
            };
          }
          return prevState;
        });
      }
    }
  };

  const submitChoices = () => {
    setGameState(prev => ({ ...prev, showResult: true, showChoices: false }));
  };

  const startOver = () => {
    setGameState(prevState => ({
      ...prevState,
      correctWords: [],
      selectedCategories: [],
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
    }));
    setSettings(gameState.initialSettings);
  };

  const [showSettingsForm, setShowSettingsForm] = useState(false);

  const canSubmitChoices = () => {
    return gameState.userChoices.every(choices => choices.length === 5);
  };

  return (
    <div className="CategoriesGame">
      <BackToHomeButton />
      {gameState.currentRound <= gameState.totalRounds && renderGameUI()}
      {gameState.currentRound > gameState.totalRounds && renderGameOver()}
      {showSettingsForm && renderSettingsForm()}
      {gameState.showInitial && renderInitialView()}
    </div>
  );

  function renderGameUI() {
    return (
      <>
        {gameState.showChoices &&
          <div className="game-container">
            <div className="categories-container">
              {gameState.selectedCategories.map((category, categoryIndex) => (
                <table key={categoryIndex} className="category-table">
                  <thead>
                    <tr>
                      <th className="category-header">{settings.showCategoryLabel ? category : `Category ${categoryIndex + 1}`}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        <td
                          className="category-cell"
                          onClick={() => handleCategoryClick(categoryIndex)}
                        >
                          {gameState.userChoices[categoryIndex][rowIndex] || ''}
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
                  className={`word-button ${gameState.selectedWord === word ? 'selected' : ''} ${gameState.userChoices.flat().includes(word) ? 'grayed-out' : ''}`}
                  onClick={() => handleChoice(word)}
                  disabled={gameState.userChoices.flat().includes(word)}>
                  {word}
                </button>
              ))}
            </div>
            <button onClick={submitChoices} className='green-button' disabled={!canSubmitChoices()}>Recall</button>
          </div>
        }
      </>
    );
  }

  function renderGameOver() {
    return (
      <div className='words-instructions'>
        <h2>Game Over</h2>
        <div>Final Score: {gameState.score}</div>
        <div>Max Words Recalled in One Round: {gameState.maxWordsRecalled}</div>
        <div className="initial-settings" style={{ marginBottom: '20px', marginTop: '20px' }}>
          <strong>Initial Settings:</strong><br />
          Number of Categories: {gameState.initialSettings.numCategories}<br />
          Wait Time: {gameState.initialSettings.waitTime}<br />
          Total Rounds: {gameState.initialSettings.totalRounds}
        </div>
        <button className="lighter-green-button" onClick={startOver}>Start Over</button>
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
          <h1>Categories Recall</h1>
          Directions: You will be presented with several words. Your job is to organize those words into categories, remembering which words were in each category. You will then be given the categories and asked to recall the words in each category from a large word bank.
          <div style={{ paddingTop: '20px' }}>But be careful! You cannot change your answers once you’ve selected from the word bank.</div>
        </div>
        <button className="green-button" onClick={() => {
          setShowSettingsForm(true);
          setGameState(prev => ({ ...prev, showInitial: false }));
        }}>Settings</button>
        <button className="green-button" onClick={startGame}>Start Game</button>
      </>
    );
  }
};

export default CategoriesGame;

