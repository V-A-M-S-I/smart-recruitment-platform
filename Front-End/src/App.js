import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/login";
import Signup from "./components/signup";
import ForgotPassword from './components/forgetpassword';
import ResetPassword from './components/resetpassword.js';
import Home from './components/home.js';

function App() {
  return (
    <Router>
      <div>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Home />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;