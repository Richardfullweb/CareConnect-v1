import React from 'react';
import { Clock, DollarSign, FileText, User, CreditCard, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentCardProps {
  appointment: {
    id?: string;
    date: string;
    time: string;
    duration: number;
    description?: string;
    status: string;
    totalAmount: number;
    caregiverId: string;
    specialRequirements?: string;
    isPaid?: boolean;
    isReviewed?: boolean;
  };
  caregiverInfo?: {
    id: string;
    name: string;
    email: string;
    available: boolean;
  };
  onPayment: () => void;
  onReview: () => void;
}

export default function AppointmentCard({
  appointment,
  caregiverInfo,
  onPayment,
  onReview
}: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'accepted':
        return 'Aceito';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="space-y-4 flex-1">
          {/* Data e Status */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {format(new Date(appointment.date), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                appointment.status
              )}`}
            >
              {getStatusText(appointment.status)}
            </span>
          </div>

          {/* Detalhes do Agendamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {/* Horário e Duração */}
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{appointment.time} ({appointment.duration}h)</span>
              </div>

              {/* Valor */}
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>R$ {(appointment.totalAmount || 0).toFixed(2)}</span>
                {appointment.isPaid && (
                  <span className="ml-2 text-xs text-green-600 font-medium">
                    (Pago)
                  </span>
                )}
              </div>

              {/* Cuidador */}
              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2" />
                <span>{caregiverInfo?.name || 'Carregando...'}</span>
              </div>
            </div>

            <div className="space-y-2">
              {/* Descrição */}
              {appointment.description && (
                <div className="flex items-start text-gray-600">
                  <FileText className="h-5 w-5 mr-2 mt-0.5" />
                  <span>{appointment.description}</span>
                </div>
              )}

              {/* Requisitos Especiais */}
              {appointment.specialRequirements && (
                <div className="flex items-start text-gray-600">
                  <FileText className="h-5 w-5 mr-2 mt-0.5" />
                  <span>{appointment.specialRequirements}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="mt-4 flex justify-end space-x-2">
        {appointment.status === 'accepted' && !appointment.isPaid && (
          <button
            onClick={onPayment}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Realizar Pagamento
          </button>
        )}

        {appointment.status === 'completed' && !appointment.isReviewed && (
          <button
            onClick={onReview}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Star className="h-4 w-4 mr-2" />
            Avaliar Serviço
          </button>
        )}
      </div>
    </div>
  );
}
