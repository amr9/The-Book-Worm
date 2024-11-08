import React, { useState } from 'react';
import axios from 'axios';
import './Regesterationform.css';
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        age: '',
        username: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        try {
            const response = await axios.post('http://localhost:8000/api/register/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('User registered successfully', response.data);
            setSuccess(true);
            setError(null);
            navigate('/login');
        } catch (Error){
            if (Error.response && Error.response.data) {
                const errorData = Error.response.data;
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
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div>
                    <label>First Name:</label>
                    <br />
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <br />
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <br />
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <br />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Age:</label>
                    <br />
                    <input
                        type="number"
                        name="age"
                        min="10"
                        step="1"
                        value={formData.age}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Username:</label>
                    <br />
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <br />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <br />
                <div className="register-button-container">
                    <button type="submit">Register</button>
                </div>
            </form>
            {error && <div className="error-container">
                {Object.keys(error).map(key => (
                    <div key={key}>{error[key].join(', ')}</div>
                ))}
            </div>}
            {success && <div className="success-message">Registration successful!</div>}
        </div>
    );
};

export default RegistrationForm;
