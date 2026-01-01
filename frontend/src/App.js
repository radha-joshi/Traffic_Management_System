import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [intersections, setIntersections] = useState([]);
  const [signalStatus, setSignalStatus] = useState([]);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');

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
      const response = await fetch('/intersections');
      const data = await response.json();
      setIntersections(data);
    } catch (error) {
      console.error('Error fetching intersections:', error);
    }
  };

  const fetchSignalStatus = async () => {
    try {
      const response = await fetch('/signal/status');
      const data = await response.json();
      setSignalStatus(data);
    } catch (error) {
      console.error('Error fetching signal status:', error);
    }
  };

  const checkEmergencyStatus = async () => {
    try {
      const response = await fetch('/emergency/status');
      const data = await response.json();
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

  const updateTraffic = async (intersectionId, roadId, vehicleCount) => {
    try {
      const response = await fetch('/traffic/update', {
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
      const data = await response.json();
      console.log(data);
      fetchSignalStatus(); // Refresh data
    } catch (error) {
      console.error('Error updating traffic:', error);
    }
  };

  const triggerEmergency = async () => {
    const startIntersection = document.getElementById('startIntersection').value;
    const endIntersection = document.getElementById('endIntersection').value;
    const emergencyType = document.getElementById('emergencyType').value;

    if (!startIntersection || !endIntersection) {
      alert('Please select both start and end intersections');
      return;
    }

    try {
      const response = await fetch('/emergency/trigger', {
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
      const response = await fetch('/emergency/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      const data = await response.json();
      alert('Emergency cleared - resuming normal traffic management');
      checkEmergencyStatus();
      fetchSignalStatus();
    } catch (error) {
      console.error('Error clearing emergency:', error);
    }
  };

  // Group signals by intersection
  const getIntersectionsWithSignals = () => {
    const intersectionSignals = {};
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚦 Smart Traffic Management System</h1>
        <p>Green Corridor Emergency Response</p>
      </header>

      {emergencyActive && (
        <div className="emergency-banner">
          <span>{emergencyMessage}</span>
        </div>
      )}

      <div className="emergency-controls">
        <h2>🚨 Emergency Vehicle Dispatch</h2>
        <div className="emergency-form">
          <select id="startIntersection">
            <option value="">Select Start Intersection</option>
            {intersections.map(intersection => (
              <option key={intersection.intersection_id} value={intersection.intersection_id}>
                {intersection.intersection_name}
              </option>
            ))}
          </select>
          <select id="endIntersection">
            <option value="">Select End Intersection</option>
            {intersections.map(intersection => (
              <option key={intersection.intersection_id} value={intersection.intersection_id}>
                {intersection.intersection_name}
              </option>
            ))}
          </select>
          <select id="emergencyType">
            <option value="Ambulance">🚑 Ambulance</option>
            <option value="Fire Truck">🚒 Fire Truck</option>
            <option value="Police">🚔 Police</option>
          </select>
          <button onClick={triggerEmergency} className="emergency-btn">
            🚨 Create Green Corridor
          </button>
          <button onClick={clearEmergency} className="clear-btn">
            ✅ Clear Emergency
          </button>
        </div>
      </div>

      <div className="intersections-container">
        {Object.keys(intersectionsWithSignals).map(intersectionId => {
          const intersection = intersectionsWithSignals[intersectionId];
          return (
            <div key={intersectionId} className="intersection">
              <h3>{intersection.intersection_name}</h3>
              <div className="signals-grid">
                {intersection.signals.map(signal => (
                  <div key={`${signal.intersection_id}-${signal.road_id}`} className="signal">
                    <strong>{signal.road_name}</strong><br />
                    <span className={`signal-light ${signal.signal_color.toLowerCase()}`}>
                      {signal.signal_color}
                    </span><br />
                    <small>Direction: {signal.direction}</small><br />
                    <input
                      type="number"
                      placeholder="Vehicle count"
                      defaultValue="0"
                      onChange={(e) => {
                        const input = e.target;
                        input.dataset.intersectionId = signal.intersection_id;
                        input.dataset.roadId = signal.road_id;
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector(`input[data-intersection-id="${signal.intersection_id}"][data-road-id="${signal.road_id}"]`);
                        if (input) {
                          updateTraffic(signal.intersection_id, signal.road_id, parseInt(input.value) || 0);
                        }
                      }}
                    >
                      Update
                    </button>
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