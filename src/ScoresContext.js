import React, { createContext, useState, useContext } from 'react';
const ScoresContext = createContext();

export const ScoresProvider = ({ children }) => {
  const [scores, setScores] = useState({
    words: null,
    numbers: null,
    reversedNumbers: null,
    categories: null
  });

  const updateScores = (game, score) => {
    setScores(prevScores => ({
      ...prevScores,
      [game]: score
    }));
  };

  return (
    <ScoresContext.Provider value={{ scores, updateScores }}>
      {children}
    </ScoresContext.Provider>
  );
};

// Custom hook to use the ScoresContext
export const useScores = () => useContext(ScoresContext);
