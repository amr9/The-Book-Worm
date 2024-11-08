import React, {useEffect, useState} from 'react';
import './Feature.css';
import {useLocation, useNavigate} from "react-router-dom";

const HomePage = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

        useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location]);

    const LoginClick = () => navigate('/login');
    const RegisterClick = () => navigate('/register');



    return (
        <div className="homepage">
            <section id="home" className="hero">
                <div className="hero-content">
                    <h1>Dustour Masr</h1>
                    <p>Ask Al-Dustour: AI-Powered Egyptian Law Assistance</p>
                    <div className="hero-buttons">
                        {!isLoggedIn && (
                        <>
                            <button className="sign-in" onClick={LoginClick}>Sign In</button>
                            <button className="register" onClick={RegisterClick}>Register</button>
                        </>
                    )}
                    </div>
                </div>
                <div className="hero-image">
                    <img src="./egypt-flag-in-waves-effect.png" alt="HeroImage" className="Image-red"/>
                </div>
            </section>
            <section className="quotes">
                <h2>Development Team</h2>
                <p> 1 Member</p>
                <div className="quote-cards">
                    <div className="quote-card">
                        <address>"
                            With this revolutionary AI, every answer you seek about the Egyptian Constitution is right at your fingertips.
                            It's designed to do more than just inform;
                            it empowers users to engage deeply with the principles and rights enshrined in Egypt’s legal foundation."</address>
                        <div className="quote-author">
                            <img src="./profile picture head.jpg" alt="author" />
                            <div>
                                <p className="author-name">Amr Emad</p>
                                <p className="author-role">Full Stack Developer</p>
                            </div>
                        </div>
                    </div>
                    {/* Repeat the above quote-card div as needed */}
                </div>
            </section>
            <section id="feature" className="feature">
                <h1>Feature</h1>
                <p className="feature-paragraph">
                    Imagine a virtual guide at your fingertips, ready to clarify and explain the rights, laws, and principles of the Egyptian Constitution.
                    This AI, tailored to answer questions directly from Egypt’s foundational legal document,
                    empowers citizens, students, and anyone curious about Egyptian law with instant, accurate answers.
                    Whether you’re exploring constitutional rights, researching legal structures,
                    or simply want to know more about Egypt's governance, this AI serves as a reliable companion.
                    Accessible and user-friendly, it transforms complex legal language into clear, understandable information,
                    fostering legal literacy and empowering informed engagement with Egypt’s legal framework.
                </p>
            </section>
        </div>
    );
};

export default HomePage;
