import React, { useState } from 'react';

function Upload() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audioFile: null
  });
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, audioFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Uploading:', formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
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
                fontSize: '1rem',
                boxSizing: 'border-box'
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
                resize: 'vertical',
                boxSizing: 'border-box'
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
            style={{
              width: '100%',
              padding: '1rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Upload Episode
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;
