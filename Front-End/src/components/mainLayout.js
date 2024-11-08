// src/components/MainLayout.js

import React from 'react';
import '../Styles/mainLayout.css';

const MainLayout = () => {
  return (
    <>
    <main className="main-layout">
      <img 
        src='https://t4.ftcdn.net/jpg/03/46/80/55/240_F_346805525_z2hiw6xT2Qi8tOU9Lgnv8Oblt2rLwrDl.jpg' 
        alt='company' 
      />
      
      <section className="services">
        <h1>Welcome to MyCompany</h1>
        <p>We provide top-notch solutions for your business needs.</p>
      
        <h2>Our Services</h2>
        <p>Discover our range of services tailored for you.</p>
      </section>

      
    </main>
    
    </>
  );
};

export default MainLayout;
