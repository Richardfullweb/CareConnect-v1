import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import SchedulingModal from '../scheduling/SchedulingModal';

interface CaregiverSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface Caregiver {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  hourlyRate: number;
  available: boolean;
  location: string;
  experience: number;
}

export default function CaregiverSearchModal({ isOpen, onClose, userId }: CaregiverSearchModalProps) {
  const [caregivers, setCaregivers] = React.useState<Caregiver[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({
    specialty: '',
    minRating: 0,
    maxPrice: 1000,
    location: '',
    availableOnly: false
  });
  const [selectedCaregiver, setSelectedCaregiver] = React.useState<Caregiver | null>(null);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = React.useState(false);

  const searchCaregivers = async () => {
    setLoading(true);
    try {
      console.log('Iniciando busca de cuidadores...');
      const caregiversRef = collection(db, 'cuidadores');
      
      // Fazer uma busca simples primeiro
      const snapshot = await getDocs(query(caregiversRef));
      console.log('Total de cuidadores encontrados:', snapshot.size);
      
      let results = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Caregiver));

      setCaregivers(results);
    } catch (error) {
      console.error('Erro ao buscar cuidadores:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar profissionais ao abrir o modal
  React.useEffect(() => {
    if (isOpen) {
      searchCaregivers();
    }
  }, [isOpen]);

  // Buscar quando os filtros mudarem
  React.useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        searchCaregivers();
      }, 500); // Debounce de 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [filters, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Buscar Cuidadores</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialidade
              </label>
              <select
                className="w-full border rounded-lg p-2"
                value={filters.specialty}
                onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
              >
                <option value="">Todas</option>
                <option value="idosos">Idosos</option>
                <option value="alzheimer">Alzheimer</option>
                <option value="parkison">Parkison</option>
                <option value="acamados">Acamados</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avaliação Mínima
              </label>
              <select
                className="w-full border rounded-lg p-2"
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
              >
                <option value="0">Todas</option>
                <option value="3">3+ estrelas</option>
                <option value="4">4+ estrelas</option>
                <option value="4.5">4.5+ estrelas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço Máximo/hora
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="text-sm text-gray-600">R$ {filters.maxPrice}</div>
            </div>
          </div>

          {/* Lista de Cuidadores */}
          <div className="overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : caregivers.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhum cuidador encontrado
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tente ajustar seus filtros de busca.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caregivers.map((caregiver) => (
                  <div
                    key={caregiver.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{caregiver.name}</h3>
                        <p className="text-sm text-gray-600">{caregiver.specialty}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">R$ {caregiver.hourlyRate}/hora</div>
                        <div className="text-sm text-yellow-500">
                          {'★'.repeat(Math.floor(caregiver.rating))}
                          {caregiver.rating % 1 >= 0.5 ? '½' : ''}
                          {'☆'.repeat(5 - Math.ceil(caregiver.rating))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <div>📍 {caregiver.location}</div>
                      <div>💼 {caregiver.experience} anos de experiência</div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => {
                          setSelectedCaregiver(caregiver);
                          setIsSchedulingModalOpen(true);
                        }}
                        className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition-colors"
                      >
                        Agendar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Agendamento */}
      {selectedCaregiver && (
        <SchedulingModal
          isOpen={isSchedulingModalOpen}
          onClose={() => {
            setIsSchedulingModalOpen(false);
            setSelectedCaregiver(null);
          }}
          caregiver={selectedCaregiver}
        />
      )}
    </div>
  );
}
