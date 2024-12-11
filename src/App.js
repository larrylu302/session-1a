import React from 'react';
import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import WordsGame from './WordsGame/WordsGame';
import FinalScore from './FinalScore/FinalScore';
import NumbersGame from './NumbersGame/NumbersGame';
import CategoriesGame from './CategoriesGame/CategoriesGame';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import './App.css';
import Calendar from './Calendar/Calendar';
import ReversedNumbersGame from './ReversedNumbersGame/ReversedNumbersGame';
import { ScoresProvider } from './ScoresContext';
import PinChecker from './PinChecker';

function App() {


  return (
    <ScoresProvider>
      <Router>
      <div className="apple">
        <Routes>
          <Route path="/" element={<Calendar  />} />
          <Route path=":name/:day/words-game" element={<WordsGame />} />
          <Route path=":name/:day/final-score" element={<FinalScore />} />
          <Route path=":name/:day/numbers-game" element={<NumbersGame />} />
          <Route path=":name/:day/reversed-numbers-game" element={<ReversedNumbersGame />} />
          <Route path=":name/:day/categories-game" element={<CategoriesGame />} />
          <Route path=":name/:day/home" element={<HomePage />} />
          <Route path=":name/:day/:video" element={<VideoPlayer />} />
          <Route path=":name/:day/final-score" element={<FinalScore />} />
          <Route path="pin" element={<PinChecker />} />
        </Routes>
      </div>
    </Router>
    </ScoresProvider>

  );
}

export default App;
