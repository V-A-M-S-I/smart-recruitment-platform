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
    <img 
        src='https://media.istockphoto.com/id/1394520456/photo/we-are-hiring-text-on-notepad-and-magnifying-glass-on-blue-background.jpg?s=612x612&w=0&k=20&c=5TXWF0FeFaJjOp0CgXU1ysN4jzXOQduJliVevkhpQL0=' 
        alt='hiring' className='job' 
      />
    </>
  );
};

export default MainLayout;
