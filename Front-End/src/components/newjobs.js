import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa'; 
import { Navigate, useNavigate } from 'react-router-dom';

export default function Newjobs() {
  const [job, setJobs] = useState([]); 
  const navigate = useNavigate([]);

  useEffect(()=>{
    const fetchJobs = async()=>{
      try{
        const response = await axios.get("http://localhost:8080/jobcreation");
        setJobs(response.data);
      }catch(err){
        console.log(err);
      }
    };

    fetchJobs();
  }, []);

  const handleView = (jobId) => {
    navigate(`/jobdetails/${jobId}`); 
  };

  return (
    <div className="row">
      {job.length > 0 ? (
        job.map((job) => (
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
                
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No job listings available.</p>
      )}
    </div>
  )
}
