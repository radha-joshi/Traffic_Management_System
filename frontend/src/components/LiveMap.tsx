import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DataItem } from '../mockData';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LiveMapProps {
  data: DataItem[];
}

const LiveMap: React.FC<LiveMapProps> = ({ data }) => {
  useEffect(() => {
    // Leaflet Icon Fix for CRA
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);

  const getMarkerColor = (status: DataItem['status']) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'blue';
      case 'maintenance': return 'orange';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[40.7128, -74.0060]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.map(item => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={new L.Icon({
              iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${getMarkerColor(item.status)}.png`,
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div>
                <strong>ID:</strong> {item.id}<br />
                <strong>Status:</strong> {item.status}<br />
                <strong>Efficiency:</strong> {item.efficiency}%<br />
                <strong>Timestamp:</strong> {item.timestamp.toLocaleString()}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;