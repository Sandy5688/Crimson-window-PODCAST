import React, { useState, useEffect } from 'react';

const getBackendURL = () => {
  if (window.location.hostname.includes('github.dev')) {
    const hostname = window.location.hostname;
    const baseHostname = hostname.replace(/-3000|-3001/, '-5000');
    return `${window.location.protocol}//${baseHostname}`;
  }
  return 'http://localhost:5000';
};

const API_URL = getBackendURL();

function Analytics() {
  const [stats, setStats] = useState({
    totalListens: 0,
    totalEpisodes: 0,
    avgDuration: 0,
    topEpisodes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with real API call
    setTimeout(() => {
      setStats({
        totalListens: 12450,
        totalEpisodes: 24,
        avgDuration: '45 min',
        topEpisodes: [
          { title: 'Episode 1: Getting Started', listens: 2500 },
          { title: 'Episode 5: Deep Dive', listens: 2100 },
          { title: 'Episode 10: Special Guest', listens: 1800 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading analytics...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '2rem' }}>📊 Analytics</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Total Listens</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalListens.toLocaleString()}</p>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Total Episodes</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalEpisodes}</p>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>Avg Duration</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.avgDuration}</p>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#764ba2', marginBottom: '1rem' }}>Top Episodes</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {stats.topEpisodes.map((episode, index) => (
            <li key={index} style={{
              padding: '1rem',
              borderBottom: index < stats.topEpisodes.length - 1 ? '1px solid #e5e7eb' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{episode.title}</span>
              <span style={{ 
                background: '#667eea',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {episode.listens.toLocaleString()} listens
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Analytics;