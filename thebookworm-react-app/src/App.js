import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSend = async () => {
        if (!input) return;

        // Add user message to chat
        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);

        // Send input to backend
        try {
            const response = await axios.post('http://localhost:8000/api/question', { question: input });
            const botMessage = { text: response.data.answer, sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            // Handle different types of errors
            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (error.response) {
                // The request was made and the server responded with a status code
                errorMessage = error.response.data.error || 'An error occurred on the server.';
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'No response from the server. Please check if it is running.';
            } else {
                // Something happened in setting up the request
                errorMessage = error.message;
            }

            const botMessage = { text: errorMessage, sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
    }

        setInput('');
    };

    return (
        <div className="pattern">
            <div className="chat-container">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.sender}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="question-button-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your question..."
                    />
                    <button onClick={handleSend} className="send-button" disabled={!input}>
                        <img src={require("./StaticImages/arrowup.png")} alt="arrow up" className="send-button-img"/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
