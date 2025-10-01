// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EnrichedMetadata from './components/EnrichedMetadata';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/metadata/:id" element={<EnrichedMetadata />} />
      </Routes>
    </Router>
  );
}

export default App;
