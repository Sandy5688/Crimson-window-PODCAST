import React, { useState } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    podcastName: 'Crimson Window Podcast',
    email: 'contact@crimsonwindow.com',
    autoPublish: true,
    notifications: true
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '2rem' }}>⚙️ Settings</h1>

      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Podcast Name
            </label>
            <input
              type="text"
              name="podcastName"
              value={settings.podcastName}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="autoPublish"
                checked={settings.autoPublish}
                onChange={handleChange}
                style={{ marginRight: '0.5rem', width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Auto-publish episodes</span>
            </label>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                style={{ marginRight: '0.5rem', width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Email notifications</span>
            </label>
          </div>

          {saved && (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              background: '#efe',
              border: '1px solid #cfc',
              borderRadius: '6px',
              color: '#060'
            }}>
              ✅ Settings saved successfully!
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
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
