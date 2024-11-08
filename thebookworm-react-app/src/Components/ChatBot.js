import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatBot.css';

function ChatBot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');  // Redirect to login page if not logged in
        }
    }, [navigate]);

    const handleSend = async () => {
        if (!input) return;

        // Add user message to chat
        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);

        // Clear input immediately after adding to messages
        setInput('');

        // Send input to backend
        try {
            const response = await axios.post(
                'http://localhost:8000/api/question',
                { question: input },
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}` // Pass token in headers
                    }
                }
            );

            const botMessage = {
                text: response.data.answer,
                sender: 'bot',
                sources: response.data.source_documents || []
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (error.response) {
                errorMessage = error.response.data.error || 'An error occurred on the server.';
            } else if (error.request) {
                errorMessage = 'No response from the server. Please check if it is running.';
            } else {
                errorMessage = error.message;
            }

            const botMessage = { text: errorMessage, sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
        }
    };

    return (
        <div className="pattern">
            <div className="chat-container">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.sender}>
                            {msg.text}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="sources">
                                    <h4>Source Documents:</h4>
                                    <ul>
                                        {msg.sources.map((source, idx) => (
                                            <li key={idx}>{source.page_content}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
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
                        <img src={require("../StaticImages/arrowup.png")} alt="arrow up" className="send-button-img"/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatBot;
