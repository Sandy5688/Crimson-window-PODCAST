import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMetadataById } from "../utils/api";

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

  if (loading) return <p>Loading metadata...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!metadata) return <p>No metadata found for ID: {id}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Podcast Metadata (Channel: {id})</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}><strong>Channel</strong></td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.channel}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}><strong>Platform</strong></td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.platform}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}><strong>RSS URL</strong></td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              <a href={metadata.url} target="_blank" rel="noopener noreferrer">{metadata.url}</a>
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}><strong>Status</strong></td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.status}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}><strong>Checked At</strong></td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.checked_at}</td>
          </tr>
          {metadata.email && (
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}><strong>Email</strong></td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.email}</td>
            </tr>
          )}
          {metadata.brandName && (
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}><strong>Brand Name</strong></td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.brandName}</td>
            </tr>
          )}
          {metadata.dateCreated && (
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}><strong>Date Created</strong></td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.dateCreated}</td>
            </tr>
          )}
          {metadata.dateSubmitted && (
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}><strong>Date Submitted</strong></td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{metadata.dateSubmitted}</td>
            </tr>
          )}
          {metadata.link && (
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}><strong>Link</strong></td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <a href={metadata.link} target="_blank" rel="noopener noreferrer">{metadata.link}</a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EnrichedMetadata;
