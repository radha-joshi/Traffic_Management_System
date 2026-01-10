import { useState, useEffect } from 'react';
import { DataItem } from '../mockData';

export function useSimulation(initialData: DataItem[]) {
  const [data, setData] = useState<DataItem[]>(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData =>
        prevData.map(item => {
          // Randomly update vehicle count slightly
          const newVehicles = Math.max(0, item.vehicles + (Math.random() - 0.5) * 10);
          return { ...item, vehicles: Math.round(newVehicles) };
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [initialData]);

  return data;
}