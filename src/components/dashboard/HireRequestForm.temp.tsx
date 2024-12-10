import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { hireService } from '../../services/hireService';
import { toast } from 'sonner';
import { Calendar, Clock } from 'lucide-react';
import { Location, Caregiver } from '../../types/hire';

interface HireRequestFormProps {
  caregiver: Caregiver;
  onRequestCreated: () => void;
}

interface HireRequest {
  id?: string;
  caregiverId: string;
  clientId: string;
  date: string;
  startTime: string;
  duration: number;
  specialtyRequired: string;
  location: Location;
  notes: string;
  status: RequestStatus;
  totalAmount: number;
  createdAt: string;
  paymentStatus: PaymentStatus;
  evaluationStatus: EvaluationStatus;
  patientName: string;
  patientAge: number;
  specialNeeds?: string;
}

type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
type PaymentStatus = 'pending' | 'completed';
type EvaluationStatus = 'pending' | 'completed';

export default function HireRequestForm({ caregiver, onRequestCreated }: HireRequestFormProps) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    duration: '4',
    specialtyRequired: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      complement: '',
      instructions: ''
    },
    notes: '',
    patientName: '',
    patientAge: '',
    specialNeeds: ''
  });

  useEffect(() => {
    if (caregiver && caregiver.specialties?.length > 0) {
      setFormData(prev => ({
        ...prev,
        specialtyRequired: caregiver.specialties[0]
      }));
    }
  }, [caregiver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Você precisa estar logado para fazer uma solicitação');
      return;
    }

    try {
      setLoading(true);
      
      // Validações
      if (!formData.date || !formData.startTime || !formData.duration || 
          !formData.specialtyRequired || !formData.location.address || 
          !formData.location.city || !formData.location.state || 
          !formData.location.zipCode || !formData.patientName) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      // Validar data
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        toast.error('A data selecionada deve ser futura');
        return;
      }

      // Calcular valor total
      const totalAmount = caregiver.hourlyRate ? caregiver.hourlyRate * Number(formData.duration) : 0;

      const request: HireRequest = {
        caregiverId: caregiver.id,
        clientId: user.uid,
        date: formData.date,
        startTime: formData.startTime,
        duration: Number(formData.duration),
        specialtyRequired: formData.specialtyRequired,
        location: formData.location,
        notes: formData.notes,
        status: 'pending',
        totalAmount,
        createdAt: new Date().toISOString(),
        paymentStatus: 'pending',
        evaluationStatus: 'pending',
        patientName: formData.patientName,
        patientAge: Number(formData.patientAge) || 0,
        specialNeeds: formData.specialNeeds
      };

      // Criar solicitação
      const requestId = await hireService.createRequest(request);
      
      toast.success('Solicitação enviada com sucesso!');
      onRequestCreated();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Erro ao enviar solicitação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('location')) {
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [name.split('.')[1]]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalAmount = caregiver.hourlyRate ? caregiver.hourlyRate * Number(formData.duration) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações do Paciente */}
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
              value={formData.patientName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
              placeholder="Nome completo do paciente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Idade
            </label>
            <input
              type="number"
              name="patientAge"
              value={formData.patientAge}
              onChange={handleChange}
              required
              min="0"
              max="150"
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Necessidades Especiais
          </label>
          <textarea
            name="specialNeeds"
            value={formData.specialNeeds}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-lg p-2"
            placeholder="Descreva qualquer necessidade especial ou condição médica relevante..."
          />
        </div>
      </div>

      {/* Data e Hora */}
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
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="pl-10 w-full border rounded-lg p-2"
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
              value={formData.startTime}
              onChange={handleChange}
              required
              className="pl-10 w-full border rounded-lg p-2"
            />
          </div>
        </div>
      </div>

      {/* Duração e Especialidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duração (horas)
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
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
            value={formData.specialtyRequired}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          >
            {caregiver.specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Localização */}
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
              value={formData.location.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
              placeholder="Rua, número"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complemento
            </label>
            <input
              type="text"
              name="location.complement"
              value={formData.location.complement}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Apartamento, bloco, etc."
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
              value={formData.location.city}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CEP
            </label>
            <input
              type="text"
              name="location.zipCode"
              value={formData.location.zipCode}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
              placeholder="00000-000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instruções de Acesso
          </label>
          <textarea
            name="location.instructions"
            value={formData.location.instructions}
            onChange={handleChange}
            rows={2}
            className="w-full border rounded-lg p-2"
            placeholder="Instruções para chegar ao local..."
          />
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded-lg p-2"
          placeholder="Descreva necessidades específicas ou informações importantes..."
        />
      </div>

      {/* Resumo do Valor */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Valor por hora:</p>
            <p className="text-lg font-medium">{formatCurrency(caregiver.hourlyRate || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Duração:</p>
            <p className="text-lg font-medium">{formData.duration}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Valor Total:</p>
            <p className="text-lg font-semibold text-indigo-600">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
      </div>

      {/* Botão de Envio */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3 px-4 rounded-lg text-white font-medium
            ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'}
          `}
        >
          {loading ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
      </div>
    </form>
  );
}
