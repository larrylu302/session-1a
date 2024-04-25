// FinalScore.js
import React from 'react';

const FinalScore = ({ score, settings }) => {
    return (
        <div className="final-score-page">
            <div className="score-section">
                <h2>Game Over</h2>
                <div className="final-score">Final Score: {score}</div>
            </div>
            <div className="settings-section">
                <h2>Game Settings</h2>
                <p>Number of Words: {settings.numWords}</p>
                <p>Memorization Time per Word: {settings.memorizationTimePerWord} seconds</p>
                <p>Total Rounds: {settings.totalRounds}</p>
            </div>
        </div>
    );
};

export default FinalScore;
