import React from 'react';
import { formatCurrency } from '../utils/format';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface AppointmentNotificationProps {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: Date;
  duration: number; // em horas
  address: string;
  price: number;
  onAccept?: () => void;
  onReject?: () => void;
}

export default function AppointmentNotification({ 
  status, 
  date, 
  duration, 
  address, 
  price,
  onAccept,
  onReject
}: AppointmentNotificationProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          title: 'Agendamento Pendente',
          description: 'Aguardando confirmação do cuidador',
          buttonText: 'Ver detalhes',
          buttonClass: 'bg-indigo-600 hover:bg-indigo-700'
        };
      case 'confirmed':
        return {
          title: 'Agendamento Confirmado',
          description: 'O cuidador confirmou o atendimento',
          buttonText: 'Ver detalhes',
          buttonClass: 'bg-green-600 hover:bg-green-700'
        };
      case 'completed':
        return {
          title: 'Atendimento Concluído',
          description: 'Por favor, avalie o serviço',
          buttonText: 'Avaliar',
          buttonClass: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'cancelled':
        return {
          title: 'Agendamento Cancelado',
          description: 'Este agendamento foi cancelado',
          buttonText: 'Ver detalhes',
          buttonClass: 'bg-red-600 hover:bg-red-700'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);

  return (
    <div className="fixed top-4 right-4 w-96 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
      <div className="space-y-3">
        <div>
          <h3 className="font-medium text-gray-900">{statusInfo.title}</h3>
          <p className="text-sm text-gray-500">{statusInfo.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{duration}h de duração</span>
          </div>

          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 mt-0.5" />
            <span>{address}</span>
          </div>

          <div className="font-medium text-gray-900">
            {formatCurrency(price)}
          </div>
        </div>

        {status === 'pending' && (
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={onAccept}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Aceitar
            </Button>
            <Button 
              onClick={onReject}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Recusar
            </Button>
          </div>
        )}

        {status !== 'pending' && (
          <div className="flex justify-end">
            <button
              className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${statusInfo.buttonClass}`}
            >
              {statusInfo.buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
