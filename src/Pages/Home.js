import React, { useState } from 'react';
import './Home.css';

function Home() {
    const [text, setText] = useState("The quick brown fox jumps over the lazy dog.");
    const [typedText, setTypedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleInputChange = (e) => {
        const newTypedText = e.target.value;
        setTypedText(newTypedText);
        setIsTyping(true);
    };

    const calculateAccuracy = () => {
        if (!text || !typedText) return 0;
        const textArr = text.split(' ');
        const typedArr = typedText.split(' ');
        const correctWords = typedArr.filter((word, index) => word === textArr[index]);
        return (correctWords.length / textArr.length) * 100;
    };

    const resetTyping = () => {
        setTypedText("");
        setIsTyping(false);
    };

    return (
        <div className="home-container">
            <main className="typing-area">
                <TextDisplay text={text} />
                <TypingInput value={typedText} onChange={handleInputChange} />
                {typedText === text && isTyping && <p className="completed-text">Well done!</p>}
                {isTyping && <p className="accuracy">Accuracy: {calculateAccuracy().toFixed(2)}%</p>}
            </main>
            <footer className="footer">
                <p className="footer-text">© 2024 Monkeytype</p>
            </footer>
        </div>
    );
}

const TextDisplay = ({ text }) => (
    <div className="text-display">
        <p>Type the following text:</p>
        <div className="text-to-type">{text}</div>
    </div>
);

const TypingInput = ({ value, onChange }) => (
    <textarea
        className="typing-input"
        value={value}
        onChange={onChange}
        placeholder="Start typing here..."
    />
);

export default Home;
