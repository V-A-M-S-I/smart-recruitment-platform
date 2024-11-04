import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/joblist.css'; 
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/jobcreation');
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };

    fetchJobs();
  }, []);

  const handleView = (jobId) => {
    navigate(`/viewjobdetails/${jobId}`); 
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`http://localhost:8080/jobcreation/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId)); // Remove job from state
      console.log('Job deleted successfully');
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const handlePublish = (job) => {
    navigate('/newjobs', { state: { job } });
  };

  const handleApplicants = (jobId) => {
    navigate(`/applicants/${jobId}`); // Navigate to applicants page with job ID
  };

  return (
    <div className="row">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div className="column" key={job._id}>
            <div className="card">
              <h3>{job.name}</h3>
              <p className="job-location">
                <FaMapMarkerAlt className="icon-location" />
                {job.location}
              </p>
              <div className="job-details">
                <p>
                  <FaBriefcase className="icon-role" />
                  <strong>Role:</strong> {job.title}
                </p>
                <p>
                  <FaClock className="icon-role" />
                  <strong>Type:</strong> {job.employmentType}
                </p>
                <p className="salary">
                  <FaMoneyBillWave className="icon-salary" />
                  <strong>Salary:</strong> ₹{job.salary} PA
                </p>
                <p className="deadline">
                  <FaCalendarAlt className="icon-deadline" />
                  <strong>Deadline:</strong> {job.applicationDeadline || 'N/A'}
                </p>
              </div>
              <div className="job-card-actions">
                <button className="btn view-btn" onClick={() => handleView(job._id)}>View</button>
                <button className="btn delete-btn" onClick={() => handleDelete(job._id)}>Delete</button>
                <button className="btn publish-btn" onClick={() => handlePublish(job)}>Publish</button>
                <button className="btn applicants-btn" onClick={() => handleApplicants(job._id)}>Applicants</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No job listings available.</p>
      )}
    </div>
  );
};

export default JobList;
