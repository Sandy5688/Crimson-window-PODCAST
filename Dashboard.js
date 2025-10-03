import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import api from '../utils/api'; // From existing api.js

function Dashboard() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { feedUpdates } = useSocket();

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await api.get('/feeds'); // Assumes backend /api/feeds endpoint
        setFeeds(response.data);
      } catch (error) {
        console.error('Failed to fetch feeds:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeds();
  }, []);

  useEffect(() => {
    if (feedUpdates.length > 0) {
      // Refresh feeds on update
      setFeeds((prev) => [...prev, ...feedUpdates]);
    }
  }, [feedUpdates]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Podcast Dashboard</h2>
      <Link to="/autoupload">Go to Auto Upload</Link>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Channel</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Platform</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feeds.map((feed) => (
            <tr key={`${feed.channel}-${feed.platform}`}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{feed.channel}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{feed.platform}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{feed.status}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <Link to={`/metadata/${feed.channel}`}>View Metadata</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
