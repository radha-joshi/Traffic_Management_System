import { useState, useEffect } from 'react';
import { DataItem } from '../mockData';

export function useSimulation(initialData: DataItem[]) {
  const [data, setData] = useState<DataItem[]>(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData =>
        prevData.map(item => {
          const shouldUpdateStatus = Math.random() < 0.3; // 30% chance to update status
          const shouldWiggleCoords = Math.random() < 0.5; // 50% chance to wiggle coords

          let newItem = { ...item };

          if (shouldUpdateStatus) {
            const statuses: DataItem['status'][] = ['active', 'inactive', 'maintenance', 'error'];
            newItem.status = statuses[Math.floor(Math.random() * statuses.length)];
          }

          if (shouldWiggleCoords) {
            newItem.lat += (Math.random() - 0.5) * 0.001; // Small wiggle
            newItem.lng += (Math.random() - 0.5) * 0.001;
          }

          newItem.timestamp = new Date();
          newItem.efficiency = Math.max(0, Math.min(100, newItem.efficiency + (Math.random() - 0.5) * 10));

          return newItem;
        })
      );
    }, 2000); // Every 2 seconds

    return () => clearInterval(interval);
  }, [initialData]);

  return data;
}