import React, { useState } from 'react';

const PinChecker = ( {onPinCorrect} ) => {
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');

  // Set your correct PIN here
  const correctPin = '22';

  const handleCheckPin = () => {
    if (pin === correctPin) {
      setMessage('✅ PIN Correct! Welcome.');

      onPinCorrect();
    } else {
      setMessage('❌ Incorrect PIN. Please try again.');
    }
  };

  const [isHovering, setIsHovering] = useState(false);

  const messageStyle = {
    marginTop: '2px',
    fontSize: '8px',
    textAlign: 'center',
    color: message.includes('Incorrect') ? 'red' : 'green'
  };

  return (
    <div style={containerStyle}>
    <h3 style={{ marginTop: '10px', marginBottom: '10px'}}>Please raise your hand and wait for someone to confirm your score</h3>
<input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="****"
        style={inputStyle}
      />
      <button
        style={isHovering ? buttonHoverStyle : buttonStyle}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleCheckPin}
      >
        Check PIN
      </button>
      {message && <div style={messageStyle}>{message}</div>}
    </div>
  );


};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '300px',
  margin: '10px auto',
  padding: '10px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  fontFamily: 'Arial, sans-serif'
};

const inputStyle = {
  padding: '10px',
  fontSize: '16px',
  margin: '10px 0',
  border: '1px solid #ccc',
  borderRadius: '4px',
  width: '100%',
  boxSizing: 'border-box'
};

const buttonStyle = {
  backgroundColor: '#4caf50',
  color: '#fff',
  padding: '10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '16px',
  transition: 'background-color 0.2s ease'
};

const buttonHoverStyle = {
  ...buttonStyle,
  backgroundColor: '#45a049'
};



export default PinChecker;
