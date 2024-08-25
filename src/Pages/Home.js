import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import { generateText } from './textUtils';

const Home = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestEnded, setIsTestEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [testDuration, setTestDuration] = useState(60);
  const textDisplayRef = useRef(null);

  useEffect(() => {
    if (isTestStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endTest();
    }
  }, [isTestStarted, timeLeft]);

  useEffect(() => {
    if (isTestStarted) {
      calculateWpmAndAccuracy();
    }
  }, [userInput, isTestStarted]);

  // Ensure the text display has focus when the test starts
  useEffect(() => {
    if (isTestStarted && textDisplayRef.current) {
      textDisplayRef.current.focus();
    }
  }, [isTestStarted]);

  // Handle the spacebar to start/restart the test
  useEffect(() => {
    const handleSpaceKeyPress = (e) => {
      if (e.code === 'Enter') {
        if (!isTestStarted && !isTestEnded) {
          startTest();
        } else if (isTestEnded) {
          resetTest();
        }
      }
    };

    window.addEventListener('keydown', handleSpaceKeyPress);
    return () => {
      window.removeEventListener('keydown', handleSpaceKeyPress);
    };
  }, [isTestStarted, isTestEnded]);

  const startTest = () => {
    setIsTestStarted(true);
    setIsTestEnded(false);
    setText(generateText(200));
    setUserInput('');
    setCursorPosition(0);
    setTimeLeft(testDuration);
    setWpm(0);
    setAccuracy(100);
    if (textDisplayRef.current) textDisplayRef.current.focus();
  };

  const endTest = () => {
    setIsTestStarted(false);
    setIsTestEnded(true);
    calculateWpmAndAccuracy();
  };

  const resetTest = () => {
    setIsTestEnded(false);
    startTest();
  };

  const calculateWpmAndAccuracy = () => {
    const words = userInput.trim().split(/\s+/).length; // Improved word count handling
    const characters = userInput.length;
    const minutes = (testDuration - timeLeft) / 60;
    const calculatedWpm = minutes > 0 ? Math.round(words / minutes) : 0;
    setWpm(calculatedWpm);

    let correctChars = 0;
    for (let i = 0; i < characters; i++) {
      if (userInput[i] === text[i]) correctChars++;
    }
    const calculatedAccuracy = characters > 0 ? Math.round((correctChars / characters) * 100) : 100;
    setAccuracy(calculatedAccuracy);
  };

  const handleKeyDown = (e) => {
    if (!isTestStarted || isTestEnded) return;

    if (e.key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1));
      setCursorPosition(prev => Math.max(0, prev - 1));
    } else if (e.key.length === 1) {
      setUserInput(prev => prev + e.key);
      setCursorPosition(prev => prev + 1);
    }
  };

  const renderText = () => {
    if (isTestEnded) {
      return (
        <div className="results">
          <h2>Test Results</h2>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Press Enter to restart</p>
        </div>
      );
    }

    return text.split('').map((char, index) => {
      let className = 'char';
      if (index < userInput.length) {
        className += userInput[index] === char ? ' correct' : ' incorrect';
      }
      if (index === cursorPosition) {
        className += ' cursor';
      }
      return <span key={index} className={className}>{char}</span>;
    });
  };

  const changeTestDuration = (duration) => {
    setTestDuration(duration);
    setTimeLeft(duration);
  };

  return (
    <div className="home-container">
      <div className="test-options">
        <button onClick={() => changeTestDuration(10)}>10s</button>
        <button onClick={() => changeTestDuration(15)}>15s</button>
        <button onClick={() => changeTestDuration(30)}>30s</button>
        <button onClick={() => changeTestDuration(60)}>1m</button>
      </div>
      <div
        className="text-display"
        ref={textDisplayRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {renderText()}
      </div>
      <div className="info-area">
        <span>Time left: {timeLeft}s</span>
        <span>WPM: {wpm}</span>
        <span>Accuracy: {accuracy}%</span>
      </div>
      {!isTestStarted && !isTestEnded && (
        <p>Press space to start the test</p>
      )}
      <button
        className="start-btn"
        onClick={startTest}
        disabled={isTestStarted}
      >
        Start Test
      </button>
    </div>
  );
};

export default Home;
