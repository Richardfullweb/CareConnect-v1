import React from 'react';
import { HireRequest } from '../../types/hire';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

interface RequestStatusProps {
  request: HireRequest;
  onEvaluate?: (request: HireRequest) => void;
}

export default function RequestStatus({ request, onEvaluate }: RequestStatusProps) {
  const getStatusInfo = () => {
    switch (request.status) {
      case 'pending':
        return {
          icon: <Clock className="h-6 w-6 text-yellow-500" />,
          title: 'Aguardando Resposta',
          description: 'O cuidador ainda não respondeu sua solicitação.',
          color: 'text-yellow-500'
        };
      case 'accepted':
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
          title: 'Solicitação Aceita',
          description: 'O cuidador aceitou sua solicitação. Aguarde o contato.',
          color: 'text-green-500'
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-6 w-6 text-red-500" />,
          title: 'Solicitação Recusada',
          description: 'Infelizmente o cuidador não está disponível. Tente outro profissional.',
          color: 'text-red-500'
        };
      case 'completed':
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-blue-500" />,
          title: 'Atendimento Concluído',
          description: request.evaluation 
            ? 'Obrigado pela sua avaliação!' 
            : 'Por favor, avalie o serviço prestado.',
          color: 'text-blue-500'
        };
      default:
        return {
          icon: <AlertCircle className="h-6 w-6 text-gray-500" />,
          title: 'Status Desconhecido',
          description: 'Não foi possível determinar o status da solicitação.',
          color: 'text-gray-500'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-4">
        {statusInfo.icon}
        <div>
          <h3 className={`font-medium ${statusInfo.color}`}>
            {statusInfo.title}
          </h3>
          <p className="text-sm text-gray-600">
            {statusInfo.description}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Data: </span>
          {format(new Date(request.date), "dd 'de' MMMM 'de' yyyy", {
            locale: ptBR
          })}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Horário: </span>
          {request.startTime} ({request.duration}h)
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Valor Total: </span>
          R$ {request.totalAmount ? request.totalAmount.toFixed(2) : '0.00'}
        </p>
      </div>

      {request.status === 'completed' && !request.evaluation && (
        <button
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => onEvaluate?.(request)}
        >
          Avaliar Serviço
        </button>
      )}
    </div>
  );
}
