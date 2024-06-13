import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './HomePage.css';
import WordsGame from '../WordsGame/WordsGame';
import FinalScore from '../FinalScore/FinalScore';
import NumbersGame from '../NumbersGame/NumbersGame';
import ReversedNumbersGame from '../ReversedNumbersGame/ReversedNumbersGame';

const HomePage = () => {
  const {name, day} = useParams();


  return (

    <div className="homepage-container">
      <h1 className="title">Teen Memory Game</h1>
      <div>{name} & {day}</div>
      <div className="games-grid">
        <Link to={`/${name}/${day}/words-game`} className="game-button words-game">Words</Link>
        <Link to={`/${name}/${day}/numbers-game`} className="game-button digits-game">Decipher the Secret Code</Link>
        <Link to={`/${name}/${day}/reversed-numbers-game`} className="game-button digits-reversed-game">Digits Reversed</Link>
        <Link to={`/${name}/${day}/categories-game`} className="game-button verbal-game">Verbal</Link>
      </div>
    </div>
  );
};

export default HomePage;
