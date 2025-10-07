import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Upload from './pages/Upload';
import Settings from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'upload':
        return <Upload />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: '🎙️ Dashboard' },
    { id: 'analytics', label: '📈 Analytics' },
    { id: 'upload', label: '📤 Upload' },
    { id: 'settings', label: '⚙️ Settings' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{
        width: '250px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem 1rem',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        <h2 style={{ 
          marginBottom: '2rem', 
          fontSize: '1.5rem',
          textAlign: 'center',
          borderBottom: '2px solid rgba(255,255,255,0.3)',
          paddingBottom: '1rem'
        }}>
          Crimson Window
        </h2>
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navItems.map(item => (
            <li key={item.id} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => setCurrentPage(item.id)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: currentPage === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontWeight: currentPage === item.id ? 'bold' : 'normal'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== item.id) {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== item.id) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '1rem',
          right: '1rem',
          padding: '1rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>🎧 Podcast Manager</p>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>v1.0.0</p>
        </div>
      </nav>

      <main style={{ flex: 1, background: '#f5f5f5' }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;