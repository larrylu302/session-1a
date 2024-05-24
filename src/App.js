import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import WordsGame from './WordsGame/WordsGame';
import FinalScore from './FinalScore/FinalScore';
import NumbersGame from './NumbersGame/NumbersGame';
import './App.css';
// import DigitsGame from './components/DigitsGame';
// import DigitsReversedGame from './components/DigitsReversedGame';
// import VerbalGame from './components/VerbalGame';

function App() {
  return (
    <Router>
      <div class="apple">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/words-game" element={<WordsGame />} />
          <Route path="/final-score" element={<FinalScore />} />
          <Route path="/numbers-game" element={<NumbersGame />} />
          {/*<Route path="/digits-reversed-game" element={<DigitsReversedGame />} />
          <Route path="/verbal-game" element={<VerbalGame />} /> */}
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
