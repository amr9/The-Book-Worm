import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                username,
                password,
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            setError(null);
            console.log(response.data.message);
            navigate('/ChatBot');
        } catch (Error) {
            if (Error.response && Error.response.data) {
                 const errorData = Error.response.data.errors;
                const formattedErrors = {};

                for (const key in errorData) {
                    formattedErrors[key] = Array.isArray(errorData[key])
                        ? errorData[key]
                        : [errorData[key]];
                }

                setError(formattedErrors);
                console.log(formattedErrors);
            } else {
                setError(['Something went wrong. Please try again.']);
            }
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                <div>
                    <label>Username:</label>
                    <br/>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <br/>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="login-button-container">
                    <button type="submit">Login</button>
                </div>
            </form>
            {error && <div className="error-container">
                {Object.keys(error).map(key => (
                    <div key={key}>{error[key].join(', ')}</div>
                ))}
            </div>}
        </div>
    );
};

export default Login
