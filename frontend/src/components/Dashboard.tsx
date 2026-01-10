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

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>📊 Dashboard</h2>
      <Chart
        chartType="PieChart"
        data={chartData}
        options={{ title: "Traffic Status" }}
        width={"100%"}
        height={"300px"}
      />
    </div>
  );
};

export default Dashboard;