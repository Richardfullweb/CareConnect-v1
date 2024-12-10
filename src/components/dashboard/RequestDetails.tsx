import React from 'react';
import { HireRequest, RequestStatus } from '../../types/hire';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MapPin, Clock, Calendar, DollarSign, FileText, Star } from 'lucide-react';

interface RequestDetailsProps {
  request: HireRequest;
  onStatusUpdate?: (status: RequestStatus) => void;
  onEvaluate?: () => void;
}

export default function RequestDetails({ request, onStatusUpdate, onEvaluate }: RequestDetailsProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    pending: 'Pendente',
    accepted: 'Aceito',
    rejected: 'Recusado',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Status */}
      <div className="flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[request.status]
          }`}
        >
          {statusLabels[request.status]}
        </span>
        
        {request.status === 'completed' && !request.evaluation && onEvaluate && (
          <button
            onClick={onEvaluate}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
          >
            <Star className="h-4 w-4" />
            Avaliar Serviço
          </button>
        )}
      </div>

      {/* Data e Hora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Data</p>
            <p className="font-medium">
              {format(new Date(request.date), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Horário</p>
            <p className="font-medium">
              {request.startTime} ({request.duration}h)
            </p>
          </div>
        </div>
      </div>

      {/* Localização */}
      <div className="flex items-start gap-2">
        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
        <div>
          <p className="text-sm text-gray-500">Local do Atendimento</p>
          {request.location ? (
            <>
              <p className="font-medium">{request.location.address}</p>
              {request.location.complement && (
                <p className="text-sm text-gray-600">{request.location.complement}</p>
              )}
              <p className="text-sm text-gray-600">
                {request.location.city}, {request.location.state} - CEP: {request.location.zipCode}
              </p>
              {request.location.instructions && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Instruções: </span>
                  {request.location.instructions}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-600">Localização não especificada</p>
          )}
        </div>
      </div>

      {/* Valor */}
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Valor Total</p>
          <p className="font-medium">R$ {request.totalAmount}</p>
        </div>
      </div>

      {/* Observações */}
      {request.notes && (
        <div className="flex items-start gap-2">
          <FileText className="h-5 w-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Observações</p>
            <p className="text-gray-600">{request.notes}</p>
          </div>
        </div>
      )}

      {/* Avaliação */}
      {request.evaluation && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-500">Avaliação</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < request.evaluation!.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {format(new Date(request.evaluation.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR
                  })}
                </span>
              </div>
              {request.evaluation.comment && (
                <p className="text-gray-600 mt-1">{request.evaluation.comment}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ações */}
      {onStatusUpdate && request.status === 'pending' && (
        <div className="flex gap-3 border-t pt-4">
          <button
            onClick={() => onStatusUpdate('accepted')}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Aceitar
          </button>
          <button
            onClick={() => onStatusUpdate('rejected')}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            Recusar
          </button>
        </div>
      )}
    </div>
  );
}
