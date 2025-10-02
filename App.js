import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AutoUpload from "./pages/AutoUpload";
import EnrichedMetadata from "./pages/EnrichedMetadata";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
              <AutoUpload />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
