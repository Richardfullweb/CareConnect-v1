import React, { useState, useEffect } from 'react';
import { caregiverService } from '../../services/caregiverService';
import { Caregiver } from '../../types/hire';
import { Search, Star, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface CaregiverSelectorProps {
  onSelect: (caregiver: Caregiver) => void;
}

export default function CaregiverSelector({ onSelect }: CaregiverSelectorProps) {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: '',
    minRating: 0,
    maxPrice: '',
    searchTerm: ''
  });

  // Lista de especialidades disponíveis
  const defaultSpecialties = [
    'Cuidador(a) de Idosos',
    'Enfermagem',
    'Fisioterapia',
    'Acompanhante',
    'Cuidados Especiais',
    'Técnico(a) de Enfermagem'
  ];

  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>(defaultSpecialties);

  useEffect(() => {
    const loadCaregivers = async () => {
      try {
        const caregivers = await caregiverService.searchCaregivers({});
        setCaregivers(caregivers);
      } catch (error) {
        console.error('Error loading caregivers:', error);
        toast.error('Erro ao carregar cuidadores');
      } finally {
        setLoading(false);
      }
    };

    loadCaregivers();
  }, []);

  useEffect(() => {
    // Atualiza a lista de especialidades disponíveis com base nos cuidadores carregados
    if (caregivers.length > 0) {
      const specialtiesSet = new Set<string>();
      
      // Adiciona as especialidades padrão
      defaultSpecialties.forEach(s => specialtiesSet.add(s));
      
      // Adiciona as especialidades dos cuidadores
      caregivers.forEach(caregiver => {
        if (caregiver.specialties) {
          caregiver.specialties.forEach(s => specialtiesSet.add(s));
        }
      });

      setAvailableSpecialties(Array.from(specialtiesSet).sort());
    }
  }, [caregivers]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredCaregivers = caregivers.filter(caregiver => {
    // Debug dos dados do cuidador
    console.log('Filtrando cuidador:', caregiver);

    const matchesSpecialty = !filters.specialty || 
      (caregiver.specialties && caregiver.specialties.includes(filters.specialty));
    
    const matchesRating = !filters.minRating || 
      (caregiver.rating && caregiver.rating >= filters.minRating);
    
    const matchesPrice = !filters.maxPrice || 
      (caregiver.hourlyRate && caregiver.hourlyRate <= parseFloat(filters.maxPrice));
    
    const matchesSearch = !filters.searchTerm || 
      caregiver.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (caregiver.specialties && caregiver.specialties.some(s => 
        s.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ));

    return matchesSpecialty && matchesRating && matchesPrice && matchesSearch;
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const caregivers = await caregiverService.searchCaregivers({
        specialty: filters.specialty,
        name: filters.searchTerm
      });
      setCaregivers(caregivers);
    } catch (error) {
      console.error('Error searching caregivers:', error);
      toast.error('Erro ao buscar cuidadores');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-10 w-full border rounded-lg p-2"
              placeholder="Nome ou especialidade..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Especialidade
          </label>
          <select
            value={filters.specialty}
            onChange={e => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Todas</option>
            {availableSpecialties.map(specialty => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avaliação Mínima
          </label>
          <select
            value={filters.minRating}
            onChange={e => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
            className="w-full border rounded-lg p-2"
          >
            <option value="0">Qualquer</option>
            <option value="3">3+ estrelas</option>
            <option value="4">4+ estrelas</option>
            <option value="4.5">4.5+ estrelas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor Máximo/hora
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="pl-10 w-full border rounded-lg p-2"
              placeholder="R$ Máximo"
              min="0"
              step="10"
            />
          </div>
        </div>
      </div>

      {/* Lista de Cuidadores */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : filteredCaregivers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum cuidador encontrado com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCaregivers.map(caregiver => (
            <div
              key={caregiver.id}
              className="border rounded-lg p-4 hover:border-indigo-500 transition-colors cursor-pointer"
              onClick={() => onSelect(caregiver)}
            >
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  {caregiver.photoURL ? (
                    <img
                      src={caregiver.photoURL}
                      alt={caregiver.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-gray-600">
                      {caregiver.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{caregiver.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {(caregiver.rating || 0).toFixed(1)} ({caregiver.totalReviews || 0} avaliações)
                  </div>
                  <p className="text-indigo-600 font-medium">
                    {formatCurrency(caregiver.hourlyRate || 0)}/hora
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Especialidades:</p>
                <div className="flex flex-wrap gap-2">
                  {caregiver.specialties?.map(specialty => (
                    <span
                      key={specialty}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
