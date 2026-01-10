import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DataItem } from '../mockData';

// CDN Images (Keeps it from crashing)
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const getIcon = (status: string) => {
  let color = 'blue';
  if (status === 'Slow') color = 'red';
  else if (status === 'Moderate') color = 'orange';
  else if (status === 'Efficient') color = 'green';

  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

interface LiveMapProps {
  data: DataItem[];
  startPoint: DataItem | null;
  endPoint: DataItem | null;
}

const LiveMap: React.FC<LiveMapProps> = ({ data, startPoint, endPoint }) => {
  const centerPos: [number, number] = [21.1458, 79.0882];

  const routePositions: [number, number][] = [];
  if (startPoint && endPoint) {
    routePositions.push([startPoint.lat, startPoint.lng], [endPoint.lat, endPoint.lng]);
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={centerPos} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        {data.map((item) => (
          <Marker key={item.id} position={[item.lat, item.lng]} icon={getIcon(item.status)}>
            <Popup>{item.location} - {item.status} ({item.vehicles} vehicles)</Popup>
          </Marker>
        ))}

        {routePositions.length > 0 && (
          <Polyline positions={routePositions} color="blue" weight={5} opacity={0.7} />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveMap;