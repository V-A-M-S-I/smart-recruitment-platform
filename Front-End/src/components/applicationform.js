import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ApplicationForm() {
  const { id } = useParams(); // Get jobId from URL parameters
  const [resume, setResume] = useState(null);
  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    department: '',
    qualification: '',
    institute: '',
    graduationYear: '',
    skills: '',
    workExperience: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    
    // Append each form field to the FormData object
    formData.append('firstname', data.firstname);
    formData.append('lastname', data.lastname);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('qualification', data.qualification);
    formData.append('institute', data.institute);
    formData.append('graduationYear', data.graduationYear);
    formData.append('department', data.department);
    formData.append('skills', data.skills);
    formData.append('workExperience', data.workExperience);
    formData.append('resume', resume);  
    

    try {
      const response = await axios.post(`http://localhost:8080/applyjob/${id}`, formData);
      
      if (response.status === 200) {
        alert('Application submitted successfully');
      } else{
        alert('Application submitted successfully');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('An error occurred while submitting the application');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name:</label>
        <input
          type='text'
          placeholder='Enter your First Name'
          name='firstname'
          value={data.firstname}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type='text'
          placeholder='Enter your Last Name'
          name='lastname'
          value={data.lastname}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type='email'
          placeholder='Enter your Email'
          name='email'
          value={data.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type='tel'
          placeholder='Enter your Phone Number'
          name='phone'
          value={data.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Highest Qualification:</label>
        <input
          type='text'
          placeholder='e.g., B.Tech, M.Sc'
          name='qualification'
          value={data.qualification}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>University/Institute Name:</label>
        <input
          type='text'
          placeholder='Enter your Institute Name'
          name='institute'
          value={data.institute}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Year of Graduation:</label>
        <input
          type='number'
          placeholder='Enter Year of Graduation'
          name='graduationYear'
          value={data.graduationYear}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Department:</label>
        <select
          name="department"
          value={data.department}
          onChange={handleChange}
          required>
          <option value="">Select Department</option>
          <option value="CSE/IT">CSE/IT</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="MECH/CIVIL">MECH/CIVIL</option>
          <option value="PG">PG</option>
        </select>
      </div>
      <div>
        <label>Skills:</label>
        <input
          type='text'
          placeholder='List your skills, separated by commas'
          name='skills'
          value={data.skills}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Work Experience (if any):</label>
        <textarea
          placeholder='Describe your previous work experience'
          name='workExperience'
          value={data.workExperience}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Upload Resume:</label>
        <input
          type='file'
          accept=".pdf,.doc,.docx"
          onChange={handleResumeUpload}
          required
        />
      </div>
      <button type="submit">Submit Application</button>
    </form>
  );
}
