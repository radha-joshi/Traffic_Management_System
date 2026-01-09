export interface DataItem {
  id: string;
  timestamp: Date;
  lat: number;
  lng: number;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  efficiency: number; // 0-100
}

export function generateMockData(): DataItem[] {
  const statuses: DataItem['status'][] = ['active', 'inactive', 'maintenance', 'error'];
  const data: DataItem[] = [];

  for (let i = 0; i < 20; i++) {
    data.push({
      id: `item-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time within last 24 hours
      lat: 40.7128 + (Math.random() - 0.5) * 0.1, // Around NYC
      lng: -74.0060 + (Math.random() - 0.5) * 0.1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      efficiency: Math.floor(Math.random() * 101),
    });
  }

  return data;
}