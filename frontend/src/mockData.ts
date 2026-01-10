export interface DataItem {
  id: number;
  location: string;
  lat: number;
  lng: number;
  status: 'Slow' | 'Efficient' | 'Moderate';
  vehicles: number;
}

export const HARDCODED_DATA: DataItem[] = [
  { id: 1, location: "Sitabuldi Main Road", lat: 21.1458, lng: 79.0882, status: "Slow", vehicles: 45 },
  { id: 2, location: "Dharampeth", lat: 21.1358, lng: 79.0700, status: "Efficient", vehicles: 12 },
  { id: 3, location: "Sadar", lat: 21.1600, lng: 79.0900, status: "Moderate", vehicles: 28 },
  { id: 4, location: "Itwari", lat: 21.1550, lng: 79.1100, status: "Slow", vehicles: 55 }
];

export function generateMockData(): DataItem[] {
  return HARDCODED_DATA;
}