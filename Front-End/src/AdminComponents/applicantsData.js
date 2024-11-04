import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ApplicantsList() {
  const [applicants, setApplicants] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/applicants/${id}`);
        setApplicants(response.data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, [id]);

  return (
    <div>
      <h1>Applicants for Job ID: {id}</h1>
      <table style={{ width: '75%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>First Name</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Last Name</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Institute</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Phone Number</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Graduation Year</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Resume</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => (
            <tr key={applicant._id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{applicant.firstname}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{applicant.lastname}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{applicant.email}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{applicant.institute}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{applicant.phone}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{applicant.graduationYear}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <a 
                  href={applicant.resume} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'white', backgroundColor: '#4CAF50', padding: '5px 10px', borderRadius: '4px' }}
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicantsList;
