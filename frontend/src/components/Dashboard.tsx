import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DataItem } from '../mockData';

interface DashboardProps {
  data: DataItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('Loading AI analysis...');

  useEffect(() => {
    const analyzeData = async () => {
      try {
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Analyze this dataset of ${data.length} items with statuses: ${JSON.stringify(data.map(d => ({ id: d.id, status: d.status, efficiency: d.efficiency })))}. Provide a strategic analysis of the system's performance and recommendations.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        setAiAnalysis(response.text());
      } catch (error) {
        console.error('Error with Gemini API:', error);
        setAiAnalysis('Error loading AI analysis. Please check your API key.');
      }
    };

    analyzeData();
  }, [data]);

  // Prepare data for Pie Chart
  const statusCounts = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    ['Status', 'Count'],
    ...Object.entries(statusCounts).map(([status, count]) => [status, count])
  ];

  return (
    <div style={{ padding: '20px', height: '100vh', overflowY: 'auto' }}>
      <h2>Dashboard</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>AI Strategic Analysis (Gemini)</h3>
        <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px' }}>
          {aiAnalysis}
        </div>
      </div>

      <div>
        <h3>Status Distribution (Google Charts)</h3>
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          data={chartData}
          options={{
            title: 'Item Status Distribution',
            pieHole: 0.4,
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;