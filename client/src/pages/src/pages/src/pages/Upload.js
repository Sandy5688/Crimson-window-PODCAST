import React, { useState } from 'react';

const getBackendURL = () => {
  if (window.location.hostname.includes('github.dev')) {
    const hostname = window.location.hostname;
    const baseHostname = hostname.replace(/-3000|-3001/, '-5000');
    return `${window.location.protocol}//${baseHostname}`;
  }
  return 'http://localhost:5000';
};

const API_URL = getBackendURL();

function Upload() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audioFile: null
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      audioFile: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    // Create FormData for file upload
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('audio', formData.audioFile);

    try {
      const response = await fetch(`${API_URL}/api/episodes/upload`, {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setSuccess(true);
      setFormData({ title: '', description: '', audioFile: null });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '2rem' }}>📤 Upload Episode</h1>

      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Episode Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
              placeholder="Enter episode title"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Enter episode description"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Audio File
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
            {formData.audioFile && (
              <p style={{ marginTop: '0.5rem', color: '#667eea', fontSize: '0.9rem' }}>
                Selected: {formData.audioFile.name}
              </p>
            )}
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '6px',
              color: '#c00'
            }}>
              Error: {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              background: '#efe',
              border: '1px solid #cfc',
              borderRadius: '6px',
              color: '#060'
            }}>
              ✅ Episode uploaded successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            style={{
              width: '100%',
              padding: '1rem',
              background: uploading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Episode'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;