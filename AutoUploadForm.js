import React, { useState } from 'react';

function AutoUploadForm() {
  const [channel, setChannel] = useState('');
  const [platform, setPlatform] = useState('');
  const [message, setMessage] = useState('Coming Soon: Upload functionality will be available once Repo B is integrated.');

  // Placeholder: Upload disabled until Repo B is ready
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Upload is coming soon. Check back later!');
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
            placeholder="Enter channel name"
          />
        </div>
        <div>
          <label>Platform:</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
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
            accept=".xml,.rss"
            disabled
            title="Coming Soon"
          />
        </div>
        <button type="submit" disabled style={{ opacity: 0.5 }}>
          Upload (Coming Soon)
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default AutoUploadForm;
