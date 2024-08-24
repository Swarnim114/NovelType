import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import { generateText } from './textUtils';

const Home = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
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

  const startTest = () => {
    setIsTestStarted(true);
    setText(generateText(200));
    setUserInput('');
    setCursorPosition(0);
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    if (textDisplayRef.current) textDisplayRef.current.focus();
  };

  const endTest = () => {
    setIsTestStarted(false);
    calculateWpmAndAccuracy();
  };

  const calculateWpmAndAccuracy = () => {
    const words = userInput.trim().split(' ').length;
    const characters = userInput.length;
    const minutes = (60 - timeLeft) / 60;
    const calculatedWpm = Math.round(words / minutes);
    setWpm(calculatedWpm);

    let correctChars = 0;
    for (let i = 0; i < characters; i++) {
      if (userInput[i] === text[i]) correctChars++;
    }
    const calculatedAccuracy = Math.round((correctChars / characters) * 100) || 100;
    setAccuracy(calculatedAccuracy);
  };

  const handleKeyDown = (e) => {
    if (!isTestStarted) return;

    if (e.key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1));
      setCursorPosition(prev => Math.max(0, prev - 1));
    } else if (e.key.length === 1) {
      setUserInput(prev => prev + e.key);
      setCursorPosition(prev => prev + 1);
    }
  };

  const renderText = () => {
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

  return (
    <div className="home-container">
      <h1 className="title">Monkeytype Clone</h1>
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
      <button
        className="start-btn"
        onClick={startTest}
        disabled={isTestStarted}
      >
        {isTestStarted ? 'Test in progress...' : 'Start Test'}
      </button>
    </div>
  );
};

export default Home;
