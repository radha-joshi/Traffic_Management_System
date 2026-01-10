import React, { useState, useEffect } from 'react';
import LiveMap from './components/LiveMap';
import Dashboard from './components/Dashboard';
import './App.css';

// WE DEFINE DATA HERE TO STOP IMPORT ERRORS
const HARDCODED_DATA = [
  { id: 1, location: "Sitabuldi Main Road", lat: 21.1458, lng: 79.0882, status: "Slow", vehicles: 45 },
  { id: 2, location: "Dharampeth", lat: 21.1358, lng: 79.0700, status: "Efficient", vehicles: 12 },
  { id: 3, location: "Sadar", lat: 21.1600, lng: 79.0900, status: "Moderate", vehicles: 28 },
  { id: 4, location: "Itwari", lat: 21.1550, lng: 79.1100, status: "Slow", vehicles: 55 }
];

function App() {
  const [data, setData] = useState<any[]>([]); // <any[]> stops the red lines

  useEffect(() => {
    setData(HARDCODED_DATA);
  }, []);

  return (
    <div className="App">
       {/* Simple Header */}
      <div style={{ padding: '15px', background: '#333', color: 'white' }}>
        <h1>🚦 Traffic System (Emergency Mode)</h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Pass data to components */}
        <LiveMap data={data} />
        <Dashboard data={data} />
      </div>
    </div>
  );
}

export default App;