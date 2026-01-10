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
    <div className="App" style={{
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        flex: 1,
        borderRight: '2px solid rgba(255,255,255,0.2)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          fontSize: '1.2em',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          🗺️ Live Traffic Map
        </div>
        <LiveMap data={data} startPoint={startPoint} endPoint={endPoint} />
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: 'transparent'
      }}>
        <div style={{
          padding: '20px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.3)',
          color: 'white',
          marginBottom: '20px'
        }}>
          <h1 style={{
            margin: '0',
            fontSize: '2em',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            🚦 Smart Traffic Management System
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>
            Real-time traffic monitoring and route optimization
          </p>
        </div>
        <RouteSelector data={data} onRouteSelect={handleRouteSelect} />
        <Dashboard data={data} />
      </div>
    </div>
  );
}

export default App;