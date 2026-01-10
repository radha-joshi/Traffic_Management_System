import React from 'react';
import { Chart } from 'react-google-charts';

// ACCEPT ANYTHING
const Dashboard = ({ data }: { data: any }) => {
  if (!data || data.length === 0) return <div>Loading Stats...</div>;

  const chartData = [
    ["Status", "Count"],
    ["Efficient", data.filter((d: any) => d.status === "Efficient").length],
    ["Moderate", data.filter((d: any) => d.status === "Moderate").length],
    ["Slow", data.filter((d: any) => d.status === "Slow").length],
  ];

  // Signal status data
  const signalStatus = {
    "Sitabuldi Main Road": "green",
    "Dharampeth": "green",
    "Sadar": "red",
    "Itwari": "red"
  };

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      overflowY: 'auto',
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '30px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        fontSize: '2.5em'
      }}>
        🚦 Traffic Dashboard
      </h2>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#ffd700' }}>📊 Traffic Status</h3>
        <Chart
          chartType="PieChart"
          data={chartData}
          options={{
            title: "Traffic Status",
            backgroundColor: 'transparent',
            titleTextStyle: { color: 'white' },
            legend: { textStyle: { color: 'white' } },
            colors: ['#4CAF50', '#FF9800', '#F44336']
          }}
          width={"100%"}
          height={"300px"}
        />
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#ffd700' }}>🛣️ Active Route</h3>
        <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>NH44 to Wockhardt Hospital, Shankar Nagar</p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#ffd700' }}>📍 Current Location</h3>
        <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#4CAF50' }}>Dharampeth</p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '15px',
        padding: '20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#ffd700' }}>🚦 Signal Status</h3>
        {Object.entries(signalStatus).map(([location, color]) => (
          <div key={location} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px',
            padding: '10px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            transition: 'transform 0.2s'
          }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: color,
                marginRight: '15px',
                boxShadow: `0 0 20px ${color}`,
                animation: color === 'green' ? 'pulse 2s infinite' : 'none'
              }}
            ></div>
            <span style={{ fontSize: '1.1em', fontWeight: '500' }}>{location}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 20px green; }
          50% { box-shadow: 0 0 30px green, 0 0 40px green; }
          100% { box-shadow: 0 0 20px green; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;