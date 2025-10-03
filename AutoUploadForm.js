import React, { useState } from 'react';
import api from '../utils/api'; // From existing api.js

function AutoUploadForm() {
  const [file, setFile] = useState(null);
  const [channel, setChannel] = useState('');
  const [platform, setPlatform] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('channel', channel);
    formData.append('platform', platform);

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(`Upload successful: ${response.data.message}`);
      // Reset form
      setFile(null);
      setChannel('');
      setPlatform('');
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Auto Upload Podcast Feed</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Channel:</label>
          <input
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Platform:</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} required>
            <option value="">Select Platform</option>
            <option value="Amazon Music">Amazon Music</option>
            <option value="Deezer">Deezer</option>
            <option value="iHeartRadio">iHeartRadio</option>
            <option value="TuneIn">TuneIn</option>
            <option value="Podchaser">Podchaser</option>
          </select>
        </div>
        <div>
          <label>RSS Feed File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".xml,.rss"
            required
          />
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AutoUploadForm;
