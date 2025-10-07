import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Dashboard from './pages/Dashboard';
import AutoUploadForm from './pages/AutoUploadForm'; // Protected upload page
import EnrichedMetadata from './pages/EnrichedMetadata'; // Metadata viewer
import Login from './pages/Login'; // Auth entry
import ProtectedRoute from './components/ProtectedRoute'; // Auth guard
import NotFound from './pages/NotFound'; // 404 fallback

function App() {
  return (
    <AuthProvider>  {/* Global auth state */}
      <SocketProvider>  {/* Real-time Socket.io */}
        <Router>
          <Routes>
            {/* Root redirect: Dashboard if auth'd, login otherwise */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />  {/* Public login */}
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/autoupload"
              element={
                <ProtectedRoute>
                  <AutoUploadForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/metadata/:id"
              element={
                <ProtectedRoute>
                  <EnrichedMetadata />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
