import React, { useState } from 'react';
import LiveMap from './components/LiveMap';
import Dashboard from './components/Dashboard';
import RouteSelector from './components/RouteSelector';
import { generateMockData, DataItem } from './mockData';
import './App.css';

function App() {
  const [data] = useState<DataItem[]>(generateMockData());
  const [startPoint, setStartPoint] = useState<DataItem | null>(null);
  const [endPoint, setEndPoint] = useState<DataItem | null>(null);

  const handleRouteSelect = (start: DataItem | null, end: DataItem | null) => {
    setStartPoint(start);
    setEndPoint(end);
  };

  return (
    <div className="App" style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
        <LiveMap data={data} startPoint={startPoint} endPoint={endPoint} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <RouteSelector data={data} onRouteSelect={handleRouteSelect} />
        <Dashboard data={data} />
      </div>
    </div>
  );
}

export default App;