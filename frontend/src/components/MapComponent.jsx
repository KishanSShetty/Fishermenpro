import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Red Icon for Emergency
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom Green Icon for Safe
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const MapComponent = ({ boats }) => {
  // Center map on the first emergency boat, or first boat, or default location
  const emergencyBoat = boats.find(b => b.status === 1);
  const centerBoat = emergencyBoat || boats[0];
  const center = centerBoat ? [centerBoat.latitude, centerBoat.longitude] : [12.9716, 77.5946]; // Default to Bangalore if no boats
  
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white/50">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {boats.map(boat => (
          <Marker 
            key={boat.boat_no} 
            position={[boat.latitude, boat.longitude]}
            icon={boat.status === 1 ? redIcon : greenIcon}
          >
            <Popup>
              <div className="font-bold text-lg mb-1">Boat #{boat.boat_no}</div>
              <div className={`font-semibold ${boat.status === 1 ? 'text-red-600' : 'text-green-600'}`}>
                Status: {boat.status === 1 ? 'EMERGENCY' : 'SAFE'}
              </div>
              <div className="text-sm mt-2 text-gray-600">
                Lat: {boat.latitude}<br/>
                Lng: {boat.longitude}
              </div>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${boat.latitude},${boat.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-center bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors"
              >
                Navigate
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
