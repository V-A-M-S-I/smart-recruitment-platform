import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/login", loginData);
      console.log(response);
      setSuccess(response.data.message);
      setError('');
      navigate('/home');
      // Reset form fields
      setLoginData({
        email: '',
        password: '',
      });
    } catch (error) {
      setError(error.response.data.message);
      setSuccess('');
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google authentication successful:', result.user);
    } catch (error) {
      console.error('Error with Google authentication:', error.message);
    }
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type='email'
            name='email'
            placeholder='Enter your email'
            value={loginData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type='password'
            name='password'
            placeholder='Enter your password'
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        <Link to="/forgot-password" className="forgot-password-link">Forgot Password</Link>
        <button type='submit'>Login</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}

      <hr />

      <button onClick={handleGoogleAuth}>Login with Google</button>
      
      <Link to="/signup" className="signup-link">Don't have an account? Sign up</Link>
    </div>
  );
}