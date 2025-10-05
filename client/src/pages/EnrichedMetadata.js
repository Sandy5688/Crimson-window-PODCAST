import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMetadataById } from "../utils/api";  // Relative from pages/ to utils/

function EnrichedMetadata() {
  const { id } = useParams();
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const data = await getMetadataById(id);
        setMetadata(data);
      } catch (err) {
        setError(err.message || "Failed to fetch metadata");
      } finally {
        setLoading(false);
      }
    }
    fetchMetadata();
  }, [id]);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    // Re-trigger fetch (call fetchMetadata again)
    fetchMetadata();
  };

  if (loading) return <p>Loading metadata...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!metadata) return <p>No metadata found for ID: {id}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Podcast Metadata (Channel: {id})</h2>
      <button onClick={handleRefresh} style={{ marginBottom: "10px" }}>Refresh Metadata</button>  {/* UX boost */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="col">Channel</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="col">Platform</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="row">Channel</th>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.channel}</td>
          </tr>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="row">Platform</th>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.platform}</td>
          </tr>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="row">RSS URL</th>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              <a href={metadata.url} target="_blank" rel="noopener noreferrer">{metadata.url}</a>
            </td>
          </tr>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="row">Status</th>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.status}</td>
          </tr>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="row">Checked At</th>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.checked_at}</td>
          </tr>
          {metadata.email && (
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="row">Email</th>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.email}</td>
            </tr>
          )}
          {metadata.brandName && (
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="row">Brand Name</th>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.brandName}</td>
            </tr>
          )}
          {metadata.dateCreated && (
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="row">Date Created</th>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.dateCreated}</td>
            </tr>
          )}
          {metadata.dateSubmitted && (
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="row">Date Submitted</th>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.dateSubmitted}</td>
            </tr>
          )}
          {metadata.link && (
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }} scope="row">Link</th>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <a href={metadata.link} target="_blank" rel="noopener noreferrer">{metadata.link}</a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Fields from feeds.json (channel, platform, url), statuses.json (status, checked_at), channels.xlsx (email, brandName, dates, link) */}
    </div>
  );
}

export default EnrichedMetadata;
