import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt'; // Import bcrypt
import crypto from 'crypto'; // Import crypto for generating tokens
import nodemailer from 'nodemailer'; // Import nodemailer for sending emails
import User from './Schemas/signupSchema.js'; // Import your User schema

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://v23enkatavamsi0206:2VDlwefJX7oYljYX@cluster0.ofr5e.mongodb.net/Smart-Recruitment-Platform?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.log('Error connecting to the database:', err));

app.use(cors({ origin: 'http://localhost:3000' }));

// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'venkatavamsi0206@gmail.com',  // Replace with your email
    pass: 'ucsm iola fuqi nfxias',   // Replace with your email password or app-specific password
  },
});

// Reset Password Request (Forgot Password)
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User with this email does not exist.' });
    }

    // Generate a password reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiry time
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with the token link
    const resetURL = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
      to: user.email,
      from: 'venkatavamsi0206@gmail.com',  // Replace with your email
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste it into your browser to complete the process within one hour of receiving it:\n\n
      ${resetURL}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error sending email', error: err.message });
      }
      res.status(200).json({ message: 'Password reset link sent to your email.' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Reset Password
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  console.log(`Received token: ${token}`); 

  try {
    // Find the user by the reset token and check if the token has not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log('No user found or token expired'); 
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Debugging: Check if user is found and token is valid
    console.log('User found for password reset:', user.email);

    // Update the password (will be hashed by the pre-save hook)
    user.password = newPassword;

    // Clear the reset token and expiry time
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user object
    const savedUser = await user.save();

    if (!savedUser) {
      console.log('Failed to save the updated user object.'); 
      return res.status(500).json({ message: 'Failed to reset password. Please try again.' });
    }

    console.log('Password reset successful for user:', user.email); 
    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Error resetting password:', err); 
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
});


// Signup route
app.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 7) {
    return res.status(400).json({ message: "Password should be at least 7 characters long" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Password will be hashed by the pre-save hook
    const newUser = new User({
      name,
      email,
      password,  
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);  // Log error
    res.status(500).json({ message: 'Error registering user' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); 
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match'); 
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user: user.email });
  } catch (err) {
    console.error('Error during login:', err); 
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



app.listen(8080, () => {
  console.log('Server is running on port 8080...');
});