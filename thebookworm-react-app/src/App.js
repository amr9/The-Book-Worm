import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Create this file to style your chat interface

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
            console.error('Error sending message:', error);
        }

        setInput('');
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default App;
