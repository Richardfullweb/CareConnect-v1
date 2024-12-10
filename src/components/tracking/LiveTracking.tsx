import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { LocationService } from '../../services/LocationService';
import LocationMap from '../maps/LocationMap';
import type { Caregiver } from '../../types';

interface LiveTrackingProps {
  caregiver: Caregiver;
  serviceRequestId: string;
}

export default function LiveTracking({ caregiver, serviceRequestId }: LiveTrackingProps) {
  const [caregiverLocation, setCaregiverLocation] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userLocation, setUserLocation] = React.useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const initializeTracking = async () => {
      try {
        const coords = await LocationService.getCurrentLocation();
        setUserLocation([coords.latitude, coords.longitude]);
        
        // Subscribe to caregiver's location updates
        LocationService.subscribeToUpdates(caregiver.id, (location) => {
          setCaregiverLocation(location);
        });
      } catch (error) {
        console.error('Error initializing tracking:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTracking();

    return () => {
      LocationService.unsubscribeFromUpdates(caregiver.id);
    };
  }, [caregiver.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="text-center p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-700">
          Por favor, habilite a localização no seu navegador para acompanhar o cuidador.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">Acompanhamento em Tempo Real</h3>
        
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={caregiver.profileImage}
            alt={caregiver.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-medium">{caregiver.name}</p>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{caregiver.address}</span>
            </div>
          </div>
        </div>

        {caregiverLocation ? (
          <div className="flex items-center text-green-600 mb-4">
            <Navigation className="h-5 w-5 mr-2" />
            <span>Cuidador em movimento</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-600 mb-4">
            <Navigation className="h-5 w-5 mr-2" />
            <span>Aguardando atualização de localização...</span>
          </div>
        )}

        <div className="h-[400px] rounded-lg overflow-hidden">
          <LocationMap
            center={userLocation}
            caregivers={caregiverLocation ? [{
              ...caregiver,
              location: [caregiverLocation.latitude, caregiverLocation.longitude]
            }] : []}
            showRadius={false}
          />
        </div>
      </div>
    </div>
  );
}