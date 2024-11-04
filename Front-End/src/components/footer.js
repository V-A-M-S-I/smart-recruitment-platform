import React from 'react';
import '../Styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#contact">Contact Us</a>
      </div>
      <p>&copy; 2024 MyCompany. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
