import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ViewJobDetails = () => {
  const { id } = useParams(); 
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/jobcreation/${id}`);
        setJob(response.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleClose = () => {
    navigate('/jobslist');
  };

  const handleEdit = () => {
    navigate(`/editjob/${id}`);
  };

  if (!job) return <p>Loading...</p>; 

  return (
    <div>
      <h2>{job.name}</h2>
      <p><strong>Title:</strong> {job.title}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> ₹{job.salary} PA</p>
      <p><strong>Job Description:</strong> {job.jobDescription}</p>
      <p><strong>Department:</strong> {job.department}</p>
      <p><strong>Employment Type:</strong> {job.employmentType}</p>
      <p><strong>Required Qualification:</strong> {job.requiredQualification}</p>
      <p><strong>Job Responsibilities:</strong> {job.jobResponsibilities}</p>
      <p><strong>Application Deadline:</strong> {job.applicationDeadline}</p>

      <div>
        <button onClick={handleClose} style={{ marginRight: '10px' }}>Close</button>
        <button onClick={handleEdit}>Edit</button>
      </div>
    </div>
  );
};

export default ViewJobDetails;
