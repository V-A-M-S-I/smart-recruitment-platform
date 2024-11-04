// src/components/Header.js

import React, { useState } from 'react';
import '../Styles/header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <div className="header-left">
        <a href="/home" className="header-logo">MyCompany</a> 
      </div>
      
      <nav className={`header-nav ${isOpen ? 'open' : ''}`}>
        <a href="./newjobs" onClick={toggleMenu}>JobOpenings</a>
        <a href="#services" onClick={toggleMenu}>Services</a>
        <a href="#about" onClick={toggleMenu}>About Us</a>
        <a href="#contact" onClick={toggleMenu}>Contact</a>
      </nav>

      <button className="logout-button">Logout</button>

      <div className="hamburger" onClick={toggleMenu}>
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
      </div>
    </header>
  );
};

export default Header;
