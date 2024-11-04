import React, { useState } from 'react';
import axios from 'axios';
import { auth } from '../config/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/signup.css';

export default function Signup() {
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/signup", signupData);
      console.log(response);
      setSuccess(response.data.message);
      setError('');
      navigate('/home');
      // Reset form fields
      setSignupData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      setError( error.response.data.message );
      setSuccess('');
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        console.log('Google authentication successful:', result.user);
        navigate('/home');
    } catch (error) {
        console.error('Error with Google authentication:', error.message);
    }
};

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type='text'
            name='name'
            placeholder='Enter your full name'
            value={signupData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type='email'
            name='email'
            placeholder='Enter your email'
            value={signupData.email}
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
            value={signupData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type='password'
            name='confirmPassword'
            placeholder='Re-enter your password'
            value={signupData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type='submit'>Sign Up</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <hr />
            
      <button onClick={handleGoogleAuth}>Sign Up with Google</button><br></br>
      <Link to="/login">Already have an account? Log in</Link>
    </div>
  );
}