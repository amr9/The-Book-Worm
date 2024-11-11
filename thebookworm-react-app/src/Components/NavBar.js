import React, { useEffect, useState } from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import {HashLink as Link} from "react-router-hash-link"
import axios from "axios";
import Modal from './Modal';
import './NavBar.css';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location]);

    const LogoutClick = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Not authorized');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/logout/', {}, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            localStorage.removeItem('token');
            console.log(response.data.message);
            setError(null);
            setIsLoggedIn(false);
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Not authorized');
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    const closeModal = () => {
        setError(null);
    };

    const LoginClick = () => navigate('/login');
    const ChatBot = () => {
        if (isLoggedIn) {
            navigate('/ChatBot');
        }
        else{
             navigate('/login')
        }
    };
    const RegisterClick = () => navigate('/register');

    return (
        <header className="header">
            <div className="logo">
                <img src="./Custom-Icon-Design-All-Country-Flag-Egypt-Flag.48.png" alt="Egyptian Flag" onClick={ChatBot} />
            </div>
            <nav className="nav">
                <ul>
                    {isLoggedIn && (
                        <li><Link smooth to="/ChatBot" className="nav-link">ChatBot</Link></li>
                    )}
                    {/*<li><Link smooth to="/#about-us" className="nav-link">About Us</Link></li>*/}
                    <li><Link smooth to="/feature" className="nav-link">Feature</Link></li>
                    {!isLoggedIn && (
                        <>
                        <li>
                                <button className="sign-in" onClick={LoginClick}>Sign In</button>
                            </li>
                            <li>
                                <button className="register" onClick={RegisterClick}>Register</button>
                            </li>
                        </>
                    )}
                    {isLoggedIn && (
                        <li>
                            <button className="logout" onClick={LogoutClick}>Logout</button>
                        </li>
                    )}
                </ul>
            </nav>
            <Modal show={!!error} onClose={closeModal} message={error} />
        </header>
    );
};

export default Navbar;
