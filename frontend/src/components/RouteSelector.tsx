import React, { useState } from 'react';
import { DataItem } from '../mockData';

interface RouteSelectorProps {
  data: DataItem[];
  onRouteSelect: (start: DataItem | null, end: DataItem | null) => void;
}

const RouteSelector: React.FC<RouteSelectorProps> = ({ data, onRouteSelect }) => {
  const [startId, setStartId] = useState<number | ''>('');
  const [endId, setEndId] = useState<number | ''>('');

  const handleStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value) || '';
    setStartId(id);
    const start = id ? data.find(item => item.id === id) || null : null;
    const end = endId ? data.find(item => item.id === endId) || null : null;
    onRouteSelect(start, end);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value) || '';
    setEndId(id);
    const start = startId ? data.find(item => item.id === startId) || null : null;
    const end = id ? data.find(item => item.id === id) || null : null;
    onRouteSelect(start, end);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
      <h3>Select Route Points</h3>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Start Location:
          <select value={startId} onChange={handleStartChange}>
            <option value="">Select Start</option>
            {data.map(item => (
              <option key={item.id} value={item.id}>
                {item.location} ({item.status})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          End Location:
          <select value={endId} onChange={handleEndChange}>
            <option value="">Select End</option>
            {data.map(item => (
              <option key={item.id} value={item.id}>
                {item.location} ({item.status})
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default RouteSelector;