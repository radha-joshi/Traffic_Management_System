import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// CDN Images (Keeps it from crashing)
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ACCEPT ANYTHING (No Interfaces)
const LiveMap = ({ data }: { data: any }) => {
  const centerPos: [number, number] = [21.1458, 79.0882];

  return (
    <div style={{ height: '400px', width: '100%', marginBottom: '20px', border: '2px solid black' }}>
      <MapContainer center={centerPos} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        {/* Safety check: Only map if data is an array */}
        {Array.isArray(data) && data.map((item: any) => (
          <Marker key={item.id} position={[item.lat, item.lng]} icon={icon}>
            <Popup>{item.location} - {item.status}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;