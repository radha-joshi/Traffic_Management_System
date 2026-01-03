import React, { useState, useEffect } from 'react';
import './App.css';

interface Intersection {
  intersection_id: number;
  intersection_name: string;
}

interface SignalStatus {
  intersection_id: number;
  road_id: number;
  signal_color: string;
  direction: string;
  road_name: string;
  intersection_name: string;
}

interface EmergencyData {
  active_emergency?: {
    emergency_type: string;
  };
}

interface IntersectionSignals {
  [key: number]: {
    intersection_name: string;
    signals: SignalStatus[];
  };
}

function App() {
  const [intersections, setIntersections] = useState<Intersection[]>([]);
  const [signalStatus, setSignalStatus] = useState<SignalStatus[]>([]);
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);
  const [emergencyMessage, setEmergencyMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch intersections on component mount
  useEffect(() => {
    fetchIntersections();
    const interval = setInterval(() => {
      fetchSignalStatus();
      checkEmergencyStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchIntersections = async () => {
    try {
      const response = await fetch('/api/intersections');
      const data = await response.json();
      setIntersections(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching intersections:', error);
      setIsLoading(false);
    }
  };

  const fetchSignalStatus = async () => {
    try {
      const response = await fetch('/api/signal/status');
      const data = await response.json();
      setSignalStatus(data);
    } catch (error) {
      console.error('Error fetching signal status:', error);
    }
  };

  const checkEmergencyStatus = async () => {
    try {
      const response = await fetch('/api/emergency/status');
      const data: EmergencyData = await response.json();
      if (data.active_emergency) {
        setEmergencyActive(true);
        setEmergencyMessage(`🚨 EMERGENCY ACTIVE: ${data.active_emergency.emergency_type} - Green Corridor Engaged`);
      } else {
        setEmergencyActive(false);
        setEmergencyMessage('');
      }
    } catch (error) {
      console.error('Error checking emergency status:', error);
    }
  };

  const updateTraffic = async (intersectionId: number, roadId: number, vehicleCount: number) => {
    try {
      const response = await fetch('/api/traffic/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intersection_id: intersectionId,
          road_id: roadId,
          vehicle_count: vehicleCount
        })
      });
      await response.json();
      fetchSignalStatus(); // Refresh data
    } catch (error) {
      console.error('Error updating traffic:', error);
    }
  };

  const triggerEmergency = async () => {
    const startIntersection = (document.getElementById('startIntersection') as HTMLSelectElement).value;
    const endIntersection = (document.getElementById('endIntersection') as HTMLSelectElement).value;
    const emergencyType = (document.getElementById('emergencyType') as HTMLSelectElement).value;

    if (!startIntersection || !endIntersection) {
      alert('Please select both start and end intersections');
      return;
    }

    try {
      const response = await fetch('/api/emergency/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_intersection: parseInt(startIntersection),
          end_intersection: parseInt(endIntersection),
          emergency_type: emergencyType
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert(`🚨 ${emergencyType} Green Corridor Activated!\nRoute: ${data.route_path.join(' → ')}`);
        checkEmergencyStatus();
        fetchSignalStatus();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error triggering emergency:', error);
    }
  };

  const clearEmergency = async () => {
    try {
      const response = await fetch('/api/emergency/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      await response.json();
      alert('Emergency cleared - resuming normal traffic management');
      checkEmergencyStatus();
      fetchSignalStatus();
    } catch (error) {
      console.error('Error clearing emergency:', error);
    }
  };

  // Group signals by intersection
  const getIntersectionsWithSignals = (): IntersectionSignals => {
    const intersectionSignals: IntersectionSignals = {};
    signalStatus.forEach(signal => {
      const iid = signal.intersection_id;
      if (!intersectionSignals[iid]) {
        intersectionSignals[iid] = {
          intersection_name: signal.intersection_name,
          signals: []
        };
      }
      intersectionSignals[iid].signals.push(signal);
    });
    return intersectionSignals;
  };

  const intersectionsWithSignals = getIntersectionsWithSignals();

  // Calculate statistics
  const stats = {
    totalIntersections: Object.keys(intersectionsWithSignals).length,
    greenSignals: signalStatus.filter(s => s.signal_color === 'GREEN').length,
    redSignals: signalStatus.filter(s => s.signal_color === 'RED').length,
    yellowSignals: signalStatus.filter(s => s.signal_color === 'YELLOW').length,
    totalSignals: signalStatus.length
  };

  if (isLoading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Traffic Management System...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-text">
            <h1>🚦 Smart Traffic Management System</h1>
            <p>Green Corridor Emergency Response</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">🏙️</div>
              <div className="stat-info">
                <span className="stat-number">{stats.totalIntersections}</span>
                <span className="stat-label">Intersections</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚥</div>
              <div className="stat-info">
                <span className="stat-number">{stats.totalSignals}</span>
                <span className="stat-label">Signals</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">🟢</div>
              <div className="stat-info">
                <span className="stat-number">{stats.greenSignals}</span>
                <span className="stat-label">Green</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {emergencyActive && (
        <div className="emergency-banner">
          <div className="emergency-icon">🚨</div>
          <div className="emergency-content">
            <h3>EMERGENCY ACTIVE</h3>
            <p>{emergencyMessage}</p>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="emergency-controls">
          <div className="control-header">
            <h2>🚑 Emergency Vehicle Dispatch</h2>
            <div className="control-status">
              <span className={`status-indicator ${emergencyActive ? 'active' : 'inactive'}`}>
                {emergencyActive ? 'Active' : 'Standby'}
              </span>
            </div>
          </div>
          <div className="emergency-form">
            <div className="form-group">
              <label htmlFor="startIntersection">📍 Start Location</label>
              <select id="startIntersection">
                <option value="">Select Start Intersection</option>
                {intersections.map(intersection => (
                  <option key={intersection.intersection_id} value={intersection.intersection_id}>
                    {intersection.intersection_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="endIntersection">🎯 Destination</label>
              <select id="endIntersection">
                <option value="">Select End Intersection</option>
                {intersections.map(intersection => (
                  <option key={intersection.intersection_id} value={intersection.intersection_id}>
                    {intersection.intersection_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="emergencyType">🚨 Emergency Type</label>
              <select id="emergencyType">
                <option value="Ambulance">🚑 Ambulance</option>
                <option value="Fire Truck">🚒 Fire Truck</option>
                <option value="Police">🚔 Police</option>
              </select>
            </div>
            <div className="button-group">
              <button onClick={triggerEmergency} className="emergency-btn">
                <span className="btn-icon">🚨</span>
                Create Green Corridor
              </button>
              <button onClick={clearEmergency} className="clear-btn">
                <span className="btn-icon">✅</span>
                Clear Emergency
              </button>
            </div>
          </div>
        </div>

        <div className="traffic-overview">
          <h2>🗺️ Traffic Network Overview</h2>
          <div className="overview-stats">
            <div className="overview-card">
              <div className="overview-icon red">🔴</div>
              <div className="overview-info">
                <span className="overview-number">{stats.redSignals}</span>
                <span className="overview-label">Stopped</span>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon yellow">🟡</div>
              <div className="overview-info">
                <span className="overview-number">{stats.yellowSignals}</span>
                <span className="overview-label">Caution</span>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon green">🟢</div>
              <div className="overview-info">
                <span className="overview-number">{stats.greenSignals}</span>
                <span className="overview-label">Flowing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="intersections-container">
        <h2>🚦 Intersection Control</h2>
        {Object.keys(intersectionsWithSignals).map(intersectionId => {
          const id = parseInt(intersectionId);
          const intersection = intersectionsWithSignals[id];
          return (
            <div key={intersectionId} className="intersection">
              <div className="intersection-header">
                <h3>🏙️ {intersection.intersection_name}</h3>
                <div className="intersection-status">
                  <span className="intersection-signal-count">
                    {intersection.signals.length} signals
                  </span>
                </div>
              </div>
              <div className="signals-grid">
                {intersection.signals.map(signal => (
                  <div key={`${signal.intersection_id}-${signal.road_id}`} className="signal">
                    <div className="signal-header">
                      <strong className="road-name">🛣️ {signal.road_name}</strong>
                      <span className={`signal-light ${signal.signal_color.toLowerCase()}`}>
                        {signal.signal_color === 'GREEN' ? '🟢' : signal.signal_color === 'RED' ? '🔴' : '🟡'}
                      </span>
                    </div>
                    <div className="signal-info">
                      <small>Direction: <strong>{signal.direction}</strong></small>
                    </div>
                    <div className="signal-controls">
                      <input
                        type="number"
                        placeholder="Vehicle count"
                        defaultValue="0"
                        min="0"
                        onChange={(e) => {
                          const input = e.target as HTMLInputElement;
                          input.dataset.intersectionId = signal.intersection_id.toString();
                          input.dataset.roadId = signal.road_id.toString();
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector(`input[data-intersection-id="${signal.intersection_id}"][data-road-id="${signal.road_id}"]`) as HTMLInputElement;
                          if (input) {
                            updateTraffic(signal.intersection_id, signal.road_id, parseInt(input.value) || 0);
                          }
                        }}
                      >
                        📊 Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;