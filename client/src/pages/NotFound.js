import React from "react";
import { Link } from "react-router-dom";  // For home nav

function NotFound() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>404 - Page Not Found</h2>
      <p>The requested page does not exist.</p>
      <Link to="/" aria-label="Go home">← Back to Home</Link>  {/* Navigates to dashboard/login via App redirect */}
      {/* TODO: Customize with fun GIF or podcast-themed "lost episode" vibe */}
    </div>
  );
}

export default NotFound;
