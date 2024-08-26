import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import { generateText } from './textUtils';
import Header from "../Components/Header";

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
  const [timerStarted, setTimerStarted] = useState(false);
  const textDisplayRef = useRef(null);

  useEffect(() => {
    if (isTestStarted && timerStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endTest();
    }
  }, [isTestStarted, timerStarted, timeLeft]);

  useEffect(() => {
    if (isTestStarted && timerStarted) {
      calculateWpmAndAccuracy();
    }
  }, [userInput, isTestStarted, timerStarted]);

  useEffect(() => {
    if (isTestStarted && textDisplayRef.current) {
      textDisplayRef.current.focus();
    }
  }, [isTestStarted]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Enter') {
        if (!isTestStarted && !isTestEnded) {
          setTimeLeft(testDuration); // Make sure the correct test duration is set
          startTest();
        } else if (isTestEnded) {
          resetTest(); // Reset first
          setTimeout(() => startTest(), 0); // Start immediately after reset
        }
      } else if (e.code === 'Space') {
        e.preventDefault(); // Prevent spacebar from scrolling the page
      } else if (e.code === 'Escape' && isTestStarted) {
        resetTest();
      } else if (!timerStarted && isTestStarted) {
        setTimerStarted(true); // Start the timer on the first key press
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isTestStarted, isTestEnded, timerStarted, testDuration]);

  const changeTestDuration = (duration) => {
    setTestDuration(duration);
    if (!isTestStarted) {
      setTimeLeft(duration); // Update timeLeft only if the test hasn’t started
    }
  };

  const startTest = () => {
    setIsTestStarted(true);
    setIsTestEnded(false);
    setText(generateText(300));
    setUserInput('');
    setCursorPosition(0);
    setTimeLeft(testDuration); // Use the updated test duration
    setWpm(0);
    setAccuracy(100);
    setTimerStarted(false); // Reset the timer flag
    if (textDisplayRef.current) textDisplayRef.current.focus();
  };

  const resetTest = () => {
    setIsTestStarted(false);
    setIsTestEnded(false);
    setUserInput('');
    setCursorPosition(0);
    setTimeLeft(testDuration); // Use the updated test duration
    setWpm(0);
    setAccuracy(100);
    setTimerStarted(false); // Reset the timer flag
  };

  const endTest = () => {
    setIsTestStarted(false);
    setIsTestEnded(true);
    calculateWpmAndAccuracy(); // Ensure the final stats are updated
  };

  const calculateWpmAndAccuracy = () => {
    const words = userInput.trim().split(/\s+/).length;
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
        <p>Press Enter to start the test</p>
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
