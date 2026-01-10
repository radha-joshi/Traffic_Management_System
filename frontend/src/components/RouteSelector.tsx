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
    <div style={{
      padding: '20px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '15px',
      marginBottom: '20px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      color: 'white'
    }}>
      <h3 style={{ marginBottom: '15px', color: '#ffd700' }}>🗺️ Select Route Points</h3>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Start Location:
        </label>
        <select
          value={startId}
          onChange={handleStartChange}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '1em'
          }}
        >
          <option value="" style={{ background: '#333' }}>Select Start</option>
          {data.map(item => (
            <option key={item.id} value={item.id} style={{ background: '#333' }}>
              {item.location} ({item.status})
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          End Location:
        </label>
        <select
          value={endId}
          onChange={handleEndChange}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '1em'
          }}
        >
          <option value="" style={{ background: '#333' }}>Select End</option>
          {data.map(item => (
            <option key={item.id} value={item.id} style={{ background: '#333' }}>
              {item.location} ({item.status})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RouteSelector;