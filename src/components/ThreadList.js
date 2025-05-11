import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ThreadList = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded token
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoibW9udXJhbmphbjI1MUBnbWFpbC5jb20iLCJpZCI6MTU3OSwiZmlyc3ROYW1lIjoiQmlub2QiLCJsYXN0TmFtZSI6IkJoYWkifSwiaWF0IjoxNzQ2OTgwNTkyLCJleHAiOjE3Nzg1MTY1OTJ9.DrALXAi4YICQv0USd6W0S8f4yCleWM2z5pLSM1MaE-0';

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await axios.get('https://hiring.reachinbox.xyz/api/v1/onebox/list', {
          headers: {
            Authorization: `Bearer ${token}`, // Hardcoded token
          },
          withCredentials: true,
        });

        // Check if the response contains threads data
        if (response.data && response.data.data) {
          setThreads(response.data.data);
        } else {
          setError('No threads found.');
        }
      } catch (err) {
        console.error('Error fetching threads:', err);
        setError('Failed to fetch threads.');
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [token]);

  if (loading) return <p>Loading threads...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Email Threads</h2>
      {threads.length === 0 ? (
        <p>No threads available.</p>
      ) : (
        threads.map((thread) => (
          <div
            key={thread.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '15px',
            }}
          >
            <h3>{thread.subject || 'No Subject'}</h3>
            <p><strong>Snippet:</strong> {thread.body ? thread.body.substring(0, 100) : 'No body available'}</p>
            <p><strong>Thread ID:</strong> {thread.threadId}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ThreadList;
