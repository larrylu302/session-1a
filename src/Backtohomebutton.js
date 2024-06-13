import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate hook from React Router

/**
 * BackToHomeButton component for navigating back to the home page.
 */
const BackToHomeButton = () => {
  const navigate = useNavigate(); // Hook to access the navigate function
  const {name, day} = useParams();

  const goToHome = () => {
    navigate(`/${name}/${day}/home`); // Navigate back to the home page
  };

  return (
    <button onClick={goToHome} style={buttonStyle}>
      Back to Home
    </button>
  );
};

// You can define styles here or import them from an external CSS file
const buttonStyle = {
  margin: '20px',
  padding: '10px 15px',
  backgroundColor: '#64b5f6',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1em',
  position: 'fixed',
  top:'25px',
};

export default BackToHomeButton;
