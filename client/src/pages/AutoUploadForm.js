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

  const handleInputChange = () => {
    // Reset message on user interaction (tease less, engage more)
    if (message.includes('Coming Soon')) setMessage('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Auto Upload Podcast Feed</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="channel">Channel:</label>
          <input
            id="channel"
            type="text"
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value);
              handleInputChange();
            }}
            placeholder="Enter channel name"
          />
        </div>
        <div>
          <label htmlFor="platform">Platform:</label>
          <select 
            id="platform" 
            value={platform} 
            onChange={(e) => {
              setPlatform(e.target.value);
              handleInputChange();
            }}
          >
            <option value="">Select Platform</option>
            <option value="Amazon Music">Amazon Music</option>
            <option value="Deezer">Deezer</option>
            <option value="iHeartRadio">iHeartRadio</option>
            <option value="TuneIn">TuneIn</option>
            <option value="Podchaser">Podchaser</option>
          </select>
        </div>
        <div>
          <label htmlFor="rss-file">RSS Feed File:</label>
          <input
            id="rss-file"
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
      {/* Future: Replace with FormData + api.post('/upload') when Repo B lands */}
    </div>
  );
}

export default AutoUploadForm;
