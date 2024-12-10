import React from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { User, MapPin } from 'lucide-react';
import type { Caregiver } from '../../types';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  center: [number, number];
  caregivers?: Caregiver[];
  selectedCaregiver?: Caregiver;
  onCaregiverSelect?: (caregiver: Caregiver) => void;
  showRadius?: boolean;
  radius?: number; // in meters
}

export default function LocationMap({
  center,
  caregivers = [],
  selectedCaregiver,
  onCaregiverSelect,
  showRadius = true,
  radius = 5000
}: LocationMapProps) {
  const userIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const caregiverIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="w-full h-[400px] rounded-lg shadow-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User's location */}
      <Marker position={center} icon={userIcon}>
        <Popup>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-blue-500" />
            <span>Sua localização</span>
          </div>
        </Popup>
      </Marker>

      {/* Search radius */}
      {showRadius && (
        <Circle
          center={center}
          radius={radius}
          pathOptions={{
            color: '#4F46E5',
            fillColor: '#4F46E5',
            fillOpacity: 0.1
          }}
        />
      )}

      {/* Caregivers */}
      {caregivers.map((caregiver) => (
        <Marker
          key={caregiver.id}
          position={[0, 0]} // This would come from caregiver.location in a real app
          icon={caregiverIcon}
          eventHandlers={{
            click: () => onCaregiverSelect?.(caregiver)
          }}
        >
          <Popup>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <img
                  src={caregiver.profileImage}
                  alt={caregiver.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{caregiver.name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{caregiver.address}</span>
              </div>
              <button
                onClick={() => onCaregiverSelect?.(caregiver)}
                className="w-full px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
              >
                Ver Perfil
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}