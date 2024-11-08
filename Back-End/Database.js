import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { Mongoose } from 'mongoose';
import axios from 'axios';
import cors from 'cors';
import bcrypt, { compareSync } from 'bcrypt'; 
import crypto from 'crypto'; 
import nodemailer from 'nodemailer'; 
import multer from 'multer'; 
import fs from 'fs';
import path from 'path';
import { PDFExtract } from 'pdf.js-extract';
import { fileURLToPath } from 'url'; 
import User from './Schemas/signupSchema.js'; 
import Job from './Schemas/jobcreationSchema.js';
import Applicant from './Schemas/applicationSchema.js';
import Admin from './Schemas/adminloginSchema.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getMaxListeners } from 'events';

// Create __dirname in ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set view engine
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://venkatavamsi0206:2VDlwefJX7oYljYX@cluster0.ofr5e.mongodb.net/Smart-Recruitment-Platform?retryWrites=true&w=majority', {

})
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.log('Error connecting to the database:', err));

// Enable CORS
app.use(cors({ origin: 'http://localhost:3000' }));

// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'venkatavamsi0206@gmail.com',  // Replace with your email
    pass: 'ucsm iola fuqi nfxi',   // Replace with your app-specific password
  },
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirPath = path.join(__dirname, 'uploads', 'resumes');
    
    // Ensure the directory exists
    fs.mkdirSync(dirPath, { recursive: true });
    
    cb(null, dirPath);  // Save files in 'uploads/resumes' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Apply Job Route
app.post('/applyjob/:id', upload.single('resume'), async (req, res) => {
  const {
    firstname, lastname, email, phone, department, qualification,
    institute, graduationYear, skills, workExperience,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Resume file is required' });
  }

  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: 'Invalid Job ID format' });
  }

  try {
    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Extract job details
    const { title, description, requiredQualification, responsibilities } = jobExists;

    const resumePath = path.join(__dirname, 'uploads', 'resumes', req.file.filename);
    const pdfExtract = new PDFExtract();
    const options = {};

    pdfExtract.extract(resumePath, options, async (err, data) => {
      if (err) {
        console.error('Error extracting PDF text:', err);
        return res.status(500).json({ message: 'Error processing resume file', error: err.message });
      }

      const extractedText = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
      
      // Construct the prompt with both resume content and job details
      const prompt = `
         compare and give  resume content, and the job details,and provide feeback whether applicant is suitable for the job are not give output as Eligible/NotEligible and resons for elible r not most important thing is consider every applicnat as fresher he does not requiure any exprirnce  first like of output shold be eligible r not later give feedback:
        
        **Resume Content:**
        "${extractedText}"
        
        **Job Title:**
        "${title}"

        **Job Description:**
        "${description}"

        **Required Qualifications:**
        "${requiredQualification}"

        **Job Responsibilities:**
        "${responsibilities}"
      `;

      // Pass the prompt to the Gemini API
      const genAI = new GoogleGenerativeAI("AIzaSyC8SzSsUp1uo4zSz8OfUCLyBr1YE0O1A2k"); // replace with your actual API key
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      try {
        const response = await model.generateContent(prompt);
        
        // Log the entire response for debugging
        console.log('Gemini API response:', JSON.stringify(response, null, 2));

        // Extract the feedback text from the response
        const feedbackText = response.response.candidates[0].content.parts[0].text;
        console.log(feedbackText);
        const eligibilityStatus = feedbackText.includes("Eligible") ? "Eligible" : "Not Eligible";

        console.log(`Eligibility Status: ${eligibilityStatus}`);

        // Save applicant with the feedback received
        const newApplicant = new Applicant({
          firstname, lastname, email, phone, department, qualification,
          institute, graduationYear, skills, workExperience,
          resume: `http://localhost:8080/uploads/resumes/${req.file.filename}`,
          jobId: new mongoose.Types.ObjectId(jobId),
          feedback: feedbackText, 
          status: eligibilityStatus,
        });

        await newApplicant.save();
        res.status(201).json({ message: 'Application submitted successfully', feedback: feedbackText });
      } catch (apiError) {
        console.error('Error generating feedback:', apiError);
        res.status(500).json({ message: 'Error generating feedback', error: apiError.message });
      }
    });
    
  } catch (err) {
    console.error('Error applying for job:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



app.get('/applicants/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if `id` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    const objectId = new mongoose.Types.ObjectId(id);
    const applicants = await Applicant.find({ jobId: objectId });

    if (!applicants.length) {
      return res.status(404).json({ message: 'No applicants found for this job ID' });
    }

    res.status(200).json(applicants);
  } catch (err) {
    console.error('Error fetching applicants:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/applicants/feedback/:id', async (req, res) => {
  const applicantId = req.params.id;

  // Check if the applicant ID is a valid MongoDB Object ID
  if (!mongoose.Types.ObjectId.isValid(applicantId)) {
    return res.status(400).json({ message: 'Invalid Applicant ID format' });
  }

  try {
    // Find the applicant by ID
    const applicant = await Applicant.findById(applicantId);
    
    // If applicant is not found, return a 404 error
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Return the feedback in the response
    res.status(200).json({ feedback: applicant.feedback });
  } catch (err) {
    console.error('Error retrieving applicant feedback:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


app.post('/send-mail-to-applicants/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid job ID format' });
  }

  try {
    // Fetch all applicants for the given job ID
    const applicants = await Applicant.find({ jobId: id });
  
    if (applicants.length === 0) {
      return res.status(404).json({ message: 'No applicants found for this job.' });
    }
  
    // Check if the job exists
    const jobExists = await Job.findById(id);
    if (!jobExists) {
      return res.status(404).json({ message: 'Job not found' });
    }
  
    // Extract job details
    const { title, name } = jobExists;
  
    // Loop through each applicant and send an email
    const emailPromises = applicants.map(applicant => {
      const message = applicant.status === 'Eligible'
        ? `Dear ${applicant.firstname} ${applicant.lastname},\n\nCongratulations! You have been shortlisted for the next round for the position of ${title} at ${name}. We will send you the details of the next steps within a few days.\n\nBest regards,\n${name} Recruitment Team`
        : `Dear ${applicant.firstname} ${applicant.lastname},\n\nThank you for applying for the ${title} position at ${name}. Although you were not shortlisted for the next round, we encourage you to keep developing your skills and consider applying for future opportunities with us. We wish you all the best in your career journey.\n\nBest regards,\n${name} Recruitment Team`;
  
      const mailOptions = {
        from: 'campustocorpate@veltech.edu.in',
        to: applicant.email,
        subject: `Application Status for Job: ${title} at ${name}`,
        text: message
      };
  
      return transporter.sendMail(mailOptions);
    });
  
    // Send all emails
    await Promise.all(emailPromises);
    res.status(200).json({ message: 'Emails sent successfully to all applicants.' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: 'Failed to send emails to applicants.' });
  }
  
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


app.post('/adminlogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if password matches
    if (admin.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/jobcreation', async (req, res) => {  
  const {
    name,
    title,
    location,
    salary,
    jobDescription,
    department,
    employmentType, 
    requiredQualification,
    jobResponsibilities,
    applicationDeadline
  } = req.body;

  try {
    const existingCompany = await Job.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company has already created a job listing' });
    }

    const newJob = new Job({
      name,
      title,
      location,
      salary,
      jobDescription,
      department,
      employmentType, 
      requiredQualification,
      jobResponsibilities,
      applicationDeadline,
      published: false  // Set published to false by default
    });

    await newJob.save();
    res.status(201).json({ message: 'Job creation successful', newJob });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



app.get('/jobcreation', async (req, res) => {
  try {
    const jobs = await Job.find(); 
    res.status(200).json(jobs); 
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


app.get('/jobcreation/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id); // Fetch job by ID
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job); 
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/jobcreation/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// PUT (Update) Job
app.put('/jobcreation/:id', async (req, res) => {
  const {
    name,
    title,
    location,
    salary,
    jobDescription,
    department,
    employmentType,
    requiredQualification,
    jobResponsibilities,
    applicationDeadline
  } = req.body;

  try {
    // Find the job by ID and update it with the new data
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        name,
        title,
        location,
        salary,
        jobDescription,
        department,
        employmentType,
        requiredQualification,
        jobResponsibilities,
        applicationDeadline
      },
      { new: true } 
    );

    // If no job is found with the given ID
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job updated successfully', updatedJob });
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


app.listen(8080, () => {
  console.log('Server is running on port 8080...');
});