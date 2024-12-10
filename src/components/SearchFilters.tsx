import React from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { LocationService } from '../services/LocationService';
import type { Caregiver } from '../types';

interface SearchFiltersProps {
  onFilterChange: (filters: {
    search: string;
    careType: string;
    availability: string;
    coordinates?: { latitude: number; longitude: number };
    radius?: number;
  }) => void;
  initialFilters?: {
    search?: string;
    careType?: string;
    availability?: string;
  };
}

export default function SearchFilters({ onFilterChange, initialFilters = {} }: SearchFiltersProps) {
  const [search, setSearch] = React.useState(initialFilters.search || '');
  const [careType, setCareType] = React.useState(initialFilters.careType || '');
  const [availability, setAvailability] = React.useState(initialFilters.availability || '');
  const [radius, setRadius] = React.useState(5); // in kilometers
  const [isLocating, setIsLocating] = React.useState(false);

  // Debounce search to avoid too many updates
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, careType, availability, radius]);

  const handleLocationDetection = async () => {
    setIsLocating(true);
    try {
      const coords = await LocationService.getCurrentLocation();
      handleFilterChange({
        coordinates: {
          latitude: coords.latitude,
          longitude: coords.longitude
        }
      });
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Não foi possível detectar sua localização. Por favor, permita o acesso à localização ou digite manualmente.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleFilterChange = (additionalFilters = {}) => {
    onFilterChange({
      search,
      careType,
      availability,
      radius: radius * 1000, // convert to meters
      ...additionalFilters
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearFilters = () => {
    setSearch('');
    setCareType('');
    setAvailability('');
    setRadius(5);
    handleFilterChange();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar por nome ou localização..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleLocationDetection}
              disabled={isLocating}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-50"
              title="Usar minha localização"
            >
              <MapPin className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex space-x-4">
          <select
            value={careType}
            onChange={(e) => setCareType(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tipo de Cuidado</option>
            <option value="elderly">Cuidado com Idosos</option>
            <option value="special_needs">Necessidades Especiais</option>
            <option value="medical">Cuidados Médicos</option>
            <option value="physiotherapy">Fisioterapia</option>
            <option value="nursing">Enfermagem</option>
          </select>

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Disponibilidade</option>
            <option value="available">Disponível Agora</option>
            <option value="scheduled">Agendamento</option>
          </select>

          <div className="w-40">
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
              <option value="50">50 km</option>
            </select>
          </div>

          <button 
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-2" />
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}