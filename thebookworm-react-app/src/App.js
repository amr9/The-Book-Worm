import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Navbar from './Components/NavBar';
import ChatBot from './Components/ChatBot'
import Login from "./Components/Login";
import RegistrationForm from "./Components/Registerationform";
import HomePage from "./Components/Feature";

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login" Component={Login} />
                <Route path="/Register" Component={RegistrationForm} />
                <Route path="/" Component={HomePage} />
                <Route path="/ChatBot" Component={ChatBot} />
                <Route path="/feature" Component={HomePage} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
