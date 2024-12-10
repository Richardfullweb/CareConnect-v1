import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { toast } from 'sonner';

interface HireRequestFormProps {
  caregiverId: string;
  onSubmit: (data: any) => void;
}

interface ServiceLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
}

interface CaregiverData {
  specialties: string[];
  serviceLocations: ServiceLocation[];
  allowedDurations: number[];
  workSchedule: {
    [key: string]: {
      enabled: boolean;
      timeSlots: { start: string; end: string }[];
    };
  };
}

export default function HireRequestForm({ caregiverId, onSubmit }: HireRequestFormProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    specialNeeds: '',
    date: '',
    startTime: '',
    duration: '',
    specialtyRequired: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      complement: ''
    }
  });

  const [caregiverData, setCaregiverData] = useState<CaregiverData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCaregiverData = async () => {
      try {
        const caregiverDoc = await getDoc(doc(db, 'caregivers', caregiverId));
        if (caregiverDoc.exists()) {
          const data = caregiverDoc.data();
          // Usa specializations ou specialties, o que estiver disponível
          const specialties = data.specializations || data.specialties || [];
          console.log('Especialidades encontradas:', specialties);
          
          setCaregiverData({
            specialties: specialties,
            serviceLocations: data.serviceLocations || [],
            allowedDurations: data.allowedDurations || [4, 6, 8, 12],
            workSchedule: data.workSchedule || {}
          });
        } else {
          toast.error('Cuidador não encontrado');
        }
      } catch (error) {
        console.error('Error fetching caregiver data:', error);
        toast.error('Erro ao carregar dados do cuidador');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaregiverData();
  }, [caregiverId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationSelect = (location: ServiceLocation) => {
    setFormData(prev => ({
      ...prev,
      location: {
        address: location.address,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode,
        complement: location.complement || ''
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações do Paciente */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações do Paciente</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Paciente</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Idade</label>
          <input
            type="number"
            name="patientAge"
            value={formData.patientAge}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Necessidades Especiais</label>
          <textarea
            name="specialNeeds"
            value={formData.specialNeeds}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>
      </div>

      {/* Detalhes do Atendimento */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Detalhes do Atendimento</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Horário de Início</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Duração</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione a duração</option>
            {caregiverData?.allowedDurations.map((duration) => (
              <option key={duration} value={duration}>
                {duration} horas
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Especialidade Requerida</label>
          <select
            name="specialtyRequired"
            value={formData.specialtyRequired}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione a especialidade</option>
            {caregiverData?.specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Local do Atendimento */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Local do Atendimento</h3>
        
        {/* Lista de locais salvos */}
        {caregiverData?.serviceLocations && caregiverData.serviceLocations.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione um local salvo
            </label>
            <div className="space-y-2">
              {caregiverData.serviceLocations.map((location, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left p-3 border rounded-md hover:bg-gray-50"
                >
                  <p className="font-medium">{location.address}</p>
                  <p className="text-sm text-gray-600">
                    {location.city}, {location.state} - {location.zipCode}
                  </p>
                  {location.complement && (
                    <p className="text-sm text-gray-500">
                      Complemento: {location.complement}
                    </p>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Ou preencha um novo endereço:</p>
            </div>
          </div>
        )}

        {/* Formulário de novo endereço */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <input
              type="text"
              name="location.zipCode"
              value={formData.location.zipCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Complemento</label>
            <input
              type="text"
              name="location.complement"
              value={formData.location.complement}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Enviar Solicitação
        </button>
      </div>
    </form>
  );
}
