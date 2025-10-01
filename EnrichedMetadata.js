// client/src/components/EnrichedMetadata.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMetadata, updateMetadata } from '../utils/api';

function EnrichedMetadata() {
  const { id } = useParams();
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await fetchMetadata(id);
        setMetadata(data);
      } catch (err) {
        setError('Failed to load metadata');
      } finally {
        setLoading(false);
      }
    };
    loadMetadata();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updated = await updateMetadata(id, metadata);
      setMetadata(updated);
      alert('Metadata updated successfully!');
    } catch (err) {
      alert('Failed to update metadata');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Metadata for {id}</h2>
      <pre>{JSON.stringify(metadata, null, 2)}</pre>
      <button onClick={handleUpdate}>Update Metadata</button>
    </div>
  );
}

export default EnrichedMetadata;
