import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Feedback() {
  const { id } = useParams(); // Get the applicant ID from the URL parameters
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/applicants/feedback/${id}`);
        setFeedback(response.data.feedback); // Set the feedback from the response
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching feedback');
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchFeedback();
  }, [id]); // Fetch feedback whenever the applicant ID changes

  // Display loading state
  if (loading) {
    return <div>Loading feedback...</div>;
  }

  // Display error message if there was an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the feedback
  return (
    <div>
      <h2>Applicant Feedback</h2>
      {feedback ? <p>{feedback}</p> : <p>No feedback available for this applicant.</p>}
    </div>
  );
}
