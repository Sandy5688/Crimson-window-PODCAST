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

function Dashboard() {
  const [allChannels, setAllChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedChannel, setSelectedChannel] = useState('All');

  const platforms = ['All', 'Amazon Music', 'Deezer', 'iHeartRadio', 'Tunnel', 'Podchaser'];
  const channelIds = ['All', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];

  useEffect(() => {
    fetchAllChannels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedPlatform, selectedChannel, allChannels]);

  const fetchAllChannels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/metadata/all`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setAllChannels(data);
      setFilteredChannels(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allChannels];

    if (selectedPlatform !== 'All') {
      filtered = filtered.filter(ch => ch.platform === selectedPlatform);
    }

    if (selectedChannel !== 'All') {
      filtered = filtered.filter(ch => ch.channel === selectedChannel);
    }

    setFilteredChannels(filtered);
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'Amazon Music': '#FF9900',
      'Deezer': '#FF0092',
      'iHeartRadio': '#C6002B',
      'Tunnel': '#1DB954',
      'Podchaser': '#5B21B6'
    };
    return colors[platform] || '#667eea';
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading all 50 channels...</h2>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>API: {API_URL}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>❌ Error: {error}</h2>
        <p><strong>API URL:</strong> {API_URL}</p>
        <p>Make sure port 5000 is public and backend has /api/metadata/all endpoint</p>
        <button 
          onClick={fetchAllChannels}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>🎙️ Podcast Dashboard</h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Showing {filteredChannels.length} of {allChannels.length} channels
        </p>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Platform
          </label>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          >
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Channel
          </label>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          >
            {channelIds.map(channel => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Channels Grid */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredChannels.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#666'
          }}>
            No channels match your filters
          </div>
        ) : (
          filteredChannels.map((channel, index) => (
            <div key={index} style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${getPlatformColor(channel.platform)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#333' }}>
                  Channel: {channel.channel}
                </h3>
                <span style={{ 
                  background: getPlatformColor(channel.platform),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {channel.platform}
                </span>
              </div>

              {channel.history && (
                <div style={{ 
                  marginBottom: '1rem',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '6px'
                }}>
                  <p style={{ margin: '0.25rem 0' }}><strong>Brand:</strong> {channel.history.brandName}</p>
                  <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {channel.history.email}</p>
                  <p style={{ margin: '0.25rem 0' }}><strong>Status:</strong> {channel.status}</p>
                </div>
              )}

              <div>
                <h4 style={{ color: '#764ba2', marginBottom: '0.5rem' }}>
                  RSS Feeds ({channel.url?.length || 0})
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {channel.url?.map((feed, i) => (
                    <li key={i} style={{ 
                      margin: '0.5rem 0',
                      padding: '0.5rem',
                      background: '#f3f4f6',
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}>
                      <a 
                        href={feed} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: getPlatformColor(channel.platform),
                          textDecoration: 'none',
                          wordBreak: 'break-all'
                        }}
                      >
                        {feed}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;