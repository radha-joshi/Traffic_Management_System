import React from 'react';
import { useSimulation } from './hooks/useSimulation';
import { generateMockData } from './mockData';
import LiveMap from './components/LiveMap';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const initialData = generateMockData();
  const liveData = useSimulation(initialData);

  return (
    <div className="App" style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
        <LiveMap data={liveData} />
      </div>
      <div style={{ flex: 1 }}>
        <Dashboard data={liveData} />
      </div>
    </div>
  );
}

export default App;