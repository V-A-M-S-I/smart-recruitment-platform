import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  const sendMailToAllApplicants = async () => {
    try {
      await axios.post(`http://localhost:8080/send-mail-to-applicants/${id}`);
      alert('Emails sent successfully to all applicants.');
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('Failed to send emails to applicants.');
    }
  };

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
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Feedback</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
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
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <Link 
                  to={`/applicants/feedback/${applicant._id}`} 
                  style={{ textDecoration: 'none', color: 'white', backgroundColor: 'blue', padding: '5px 10px', borderRadius: '4px' }}
                >
                  Feedback
                </Link>
              </td>
              <td 
                style={{ 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  color: applicant.status === 'Eligible' ? 'green' : 'red' 
                }}
              >
                {applicant.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Send Mail Button outside the table, applying to all applicants */}
      <button 
        onClick={sendMailToAllApplicants}
        style={{ 
          marginTop: '10px', 
          padding: '10px 20px', 
          backgroundColor: '#007BFF', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}
      >
        Send Mail to All Applicants
      </button>
    </div>
  );
}

export default ApplicantsList;
