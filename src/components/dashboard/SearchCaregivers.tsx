import React, { useState } from 'react';
import { Search, Star, DollarSign } from 'lucide-react';
import CaregiverCard from '../CaregiverCard';

const specialties = [
  'Todas',
  'Acompanhante',
  'Cuidador(a) de Idosos',
  'Cuidados Especiais',
  'Enfermagem',
  'Enfermagem em Gerontologia e Geriatria',
  'Fisioterapia',
  'Técnico(a) de Enfermagem'
];

const ratings = [
  { value: '0', label: 'Qualquer' },
  { value: '3', label: '3+ estrelas' },
  { value: '4', label: '4+ estrelas' },
  { value: '4.5', label: '4.5+ estrelas' }
];

// Mock data for caregivers
const mockCaregivers = [
  {
    id: 1,
    name: 'Carlos Silva',
    rating: 4.9,
    reviews: 0,
    specialties: [],
    hourlyRate: 65,
  },
  {
    id: 2,
    name: 'Ana Paula',
    rating: 5.0,
    reviews: 0,
    specialties: ['Enfermagem em Gerontologia e Geriatria'],
    hourlyRate: 50,
  },
  {
    id: 3,
    name: 'Maria Santos',
    rating: 4.7,
    reviews: 0,
    specialties: [],
    hourlyRate: 45,
  },
  {
    id: 4,
    name: 'Ana Paula',
    rating: 4.8,
    reviews: 0,
    specialties: [],
    hourlyRate: 50,
  },
  {
    id: 5,
    name: 'Maria Julia',
    rating: 0.0,
    reviews: 0,
    specialties: [],
    hourlyRate: 65,
  },
];

export default function SearchCaregivers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [minRating, setMinRating] = useState('0');
  const [maxRate, setMaxRate] = useState('');

  const filteredCaregivers = mockCaregivers.filter(caregiver => {
    const matchesSearch = caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caregiver.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = !selectedSpecialty || caregiver.specialties.includes(selectedSpecialty);
    const matchesRating = !minRating || caregiver.rating >= parseFloat(minRating);
    const matchesRate = !maxRate || caregiver.hourlyRate <= parseFloat(maxRate);

    return matchesSearch && matchesSpecialty && matchesRating && matchesRate;
  });

  return (
    <div data-state="active" data-orientation="horizontal" role="tabpanel" aria-labelledby="radix-:r1:-trigger-search" id="radix-:r1:-content-search" tabIndex={0} className="mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                className="pl-10 w-full border rounded-lg p-2"
                placeholder="Nome ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Specialty filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
            <select
              className="w-full border rounded-lg p-2"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Rating filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avaliação Mínima</label>
            <select
              className="w-full border rounded-lg p-2"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              {ratings.map((rating) => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rate filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor Máximo/hora</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                className="pl-10 w-full border rounded-lg p-2"
                placeholder="R$ Máximo"
                min="0"
                step="10"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCaregivers.map((caregiver) => (
            <CaregiverCard key={caregiver.id} caregiver={caregiver} />
          ))}
        </div>
      </div>
    </div>
  );
}
