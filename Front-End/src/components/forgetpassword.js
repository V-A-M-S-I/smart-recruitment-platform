import React, { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8080/forgot-password', { // Use full URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Password reset link sent to your email.');
            } else {
                console.error('Failed to send reset link:', data.message);
                setMessage(data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error occurred during forgot password request:', error);
            setMessage('An error occurred.');
        }
    };

    return (
        <div className='container'>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Enter your email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;