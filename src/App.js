import React from 'react';
import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import WordsGame from './WordsGame/WordsGame';
import FinalScore from './FinalScore/FinalScore';
import NumbersGame from './NumbersGame/NumbersGame';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import './App.css';
import Calendar from './Calendar/Calendar';
import ReversedNumbersGame from './ReversedNumbersGame/ReversedNumbersGame';

function App() {
  const [scores, setScores] = useState({
    words: {},
    numbers: {},
    reversedNumbers: {},
    categories: {}
  });

  const updateScore = (game, score) => {
    setScores(prevScores => ({
      ...prevScores,
      [game]: score
    }));
  };

  return (
    <Router>
      <div class="apple">
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path=":name/:day/words-game" element={<WordsGame updateScore={updateScore}/>} />
          <Route path=":name/:day/final-score" element={<FinalScore />} />
          <Route path=":name/:day/numbers-game" element={<NumbersGame updateScore={updateScore}/>} />
          <Route path=":name/:day/reversed-numbers-game" element={<ReversedNumbersGame updateScore={updateScore}/>} />
          <Route path=":name/:day/categories-game" element={<ReversedNumbersGame />} />
          <Route path=":name/:day/home" element={<HomePage scores={scores} />} />
          <Route path=":name/:day/:video" element={<VideoPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
