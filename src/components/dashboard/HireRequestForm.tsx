import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { hireService } from '../../services/hireService';
import { Caregiver } from '../../types/hire';
import { toast } from 'sonner';
import { Calendar, Clock } from 'lucide-react';

interface HireRequestFormProps {
  caregiver: Caregiver;
  onClose: () => void;
}

export default function HireRequestForm({ caregiver, onClose }: HireRequestFormProps) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    specialNeeds: '',
    date: '',
    startTime: '',
    duration: '4',
    specialtyRequired: caregiver.specialty || 'Enfermagem em Gerontologia e Geriatria',
    location: {
      address: '',
      complement: '',
      city: '',
      state: '',
      zipCode: '',
      instructions: ''
    },
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Você precisa estar logado para fazer uma solicitação');
      return;
    }

    try {
      setLoading(true);
      const request = {
        ...formData,
        clientId: user.uid,
        caregiverId: caregiver.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
        hourlyRate: caregiver.hourlyRate
      };

      await hireService.createRequest(request);
      toast.success('Solicitação enviada com sucesso!');
      onClose();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Calcula o valor total
  const totalValue = Number(formData.duration) * (caregiver.hourlyRate || 0);

  // Define a data mínima como hoje
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações do Paciente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Paciente
            </label>
            <input
              type="text"
              name="patientName"
              required
              className="w-full border rounded-lg p-2"
              placeholder="Nome completo do paciente"
              value={formData.patientName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Idade
            </label>
            <input
              type="number"
              name="patientAge"
              required
              min="0"
              max="150"
              className="w-full border rounded-lg p-2"
              value={formData.patientAge}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Necessidades Especiais
          </label>
          <textarea
            name="specialNeeds"
            rows={3}
            className="w-full border rounded-lg p-2"
            placeholder="Descreva qualquer necessidade especial ou condição médica relevante..."
            value={formData.specialNeeds}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data do Atendimento
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              name="date"
              required
              min={today}
              className="pl-10 w-full border rounded-lg p-2"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horário de Início
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="time"
              name="startTime"
              required
              className="pl-10 w-full border rounded-lg p-2"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duração (horas)
          </label>
          <select
            name="duration"
            required
            className="w-full border rounded-lg p-2"
            value={formData.duration}
            onChange={handleChange}
          >
            <option value="4">4 horas</option>
            <option value="6">6 horas</option>
            <option value="8">8 horas</option>
            <option value="12">12 horas</option>
            <option value="24">24 horas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Especialidade Requerida
          </label>
          <select
            name="specialtyRequired"
            required
            className="w-full border rounded-lg p-2"
            value={formData.specialtyRequired}
            onChange={handleChange}
          >
            <option value="Enfermagem em Gerontologia e Geriatria">
              Enfermagem em Gerontologia e Geriatria
            </option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Localização do Atendimento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              name="location.address"
              required
              className="w-full border rounded-lg p-2"
              placeholder="Rua, número"
              value={formData.location.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complemento
            </label>
            <input
              type="text"
              name="location.complement"
              className="w-full border rounded-lg p-2"
              placeholder="Apartamento, bloco, etc."
              value={formData.location.complement}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade
            </label>
            <input
              type="text"
              name="location.city"
              required
              className="w-full border rounded-lg p-2"
              value={formData.location.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <input
              type="text"
              name="location.state"
              required
              className="w-full border rounded-lg p-2"
              value={formData.location.state}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CEP
            </label>
            <input
              type="text"
              name="location.zipCode"
              required
              className="w-full border rounded-lg p-2"
              placeholder="00000-000"
              value={formData.location.zipCode}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instruções de Acesso
          </label>
          <textarea
            name="location.instructions"
            rows={2}
            className="w-full border rounded-lg p-2"
            placeholder="Instruções para chegar ao local..."
            value={formData.location.instructions}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          name="notes"
          rows={4}
          className="w-full border rounded-lg p-2"
          placeholder="Descreva necessidades específicas ou informações importantes..."
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Valor por hora:</p>
            <p className="text-lg font-medium">
              R$ {caregiver.hourlyRate?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Duração:</p>
            <p className="text-lg font-medium">{formData.duration}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Valor Total:</p>
            <p className="text-lg font-semibold text-indigo-600">
              R$ {totalValue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3 px-4 rounded-lg text-white font-medium
            ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}
          `}
        >
          {loading ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
      </div>
    </form>
  );
}
