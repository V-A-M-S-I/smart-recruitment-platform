import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const query = new URLSearchParams(useLocation().search);
    const token = query.get('token');

    console.log('Token retrieved from URL:', token); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setMessage('Invalid or missing token.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Password has been reset successfully.');
            } else {
                setMessage(data.message || 'Something went wrong.');
            }
        } catch (error) {
            setMessage('An error occurred.');
        }
    };

    return (
        <div className='container'>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newPassword">New Password:</label>
                <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;