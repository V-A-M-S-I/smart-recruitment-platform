import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../Styles/jobcreation.css';

export default function JobCreation() {
  const [jobData, setJobData] = useState({
    name: '',
    title: '',
    location: '',
    salary: '',
    jobDescription: '',
    department: 'CSE/IT',
    employmentType: 'Full-Time',
    requiredQualification: '',
    jobResponsibilities: '',
    applicationDeadline: ''
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to show/hide popup
  const [popupMessage, setPopupMessage] = useState(''); // State to store the popup message
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      axios.get(`http://localhost:8080/jobcreation/${id}`)
        .then(response => {
          setJobData(response.data);
        })
        .catch(error => console.error('Error fetching job data:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8080/jobcreation/${id}`, jobData);
        setPopupMessage('Data has been successfully updated!');
      } else {
        await axios.post("http://localhost:8080/jobcreation", jobData);
        setPopupMessage('Data has been successfully saved!');
      }
      setShowPopup(true);
      
      // Show the popup message for 3 seconds, then navigate to /jobslist
      setTimeout(() => {
        setShowPopup(false);
        navigate('/jobslist');
      }, 3000);
    } catch (err) {
      console.error('Error saving job data:', err);
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company Name:</label>
          <input
            type="text"
            placeholder="Enter your company Name"
            name="name"
            value={jobData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            name="title"
            placeholder="Enter the job title"
            value={jobData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Job Description:</label>
          <textarea
            name="jobDescription"
            rows={4}
            cols={40}
            placeholder="Enter the job description"
            value={jobData.jobDescription}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Department:</label>
          <select
            name="department"
            value={jobData.department}
            onChange={handleChange}
            required
          >
            <option value="CSE/IT">CSE/IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH/CIVIL">MECH/CIVIL</option>
            <option value="All Streams">All Streams</option>
            <option value="PG">PG</option>
          </select>
        </div>
        <div>
          <label>Job Location:</label>
          <input
            type="text"
            name="location"
            placeholder="Enter the job location"
            value={jobData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Employment Type:</label>
          <select
            name="employmentType"
            value={jobData.employmentType}
            onChange={handleChange}
            required
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div>
          <label>Salary Range:</label>
          <input
            type="text"
            name="salary"
            placeholder="Enter the salary range"
            value={jobData.salary}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Application Deadline:</label>
          <input
            type="date"
            name="applicationDeadline"
            value={jobData.applicationDeadline}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Required Qualification:</label>
          <textarea
            name="requiredQualification"
            rows={4}
            cols={40}
            placeholder="Enter the required qualifications"
            value={jobData.requiredQualification}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Job Responsibilities:</label>
          <textarea
            name="jobResponsibilities"
            rows={4}
            cols={40}
            placeholder="Enter the job responsibilities"
            value={jobData.jobResponsibilities}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{isEditMode ? 'Update' : 'Save'}</button>
      </form>

      {/* Popup Component */}
      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
