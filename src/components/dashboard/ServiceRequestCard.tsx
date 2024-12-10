import React from 'react';
import { Calendar, Clock, MapPin, User, Check, X } from 'lucide-react';
import { NotificationService } from '../../services/NotificationService';
import { toast } from 'sonner';
import type { ServiceRequest } from '../../types';

interface ServiceRequestCardProps {
  request: ServiceRequest;
  userRole: 'client' | 'caregiver';
}

export default function ServiceRequestCard({ request, userRole }: ServiceRequestCardProps) {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleAccept = async () => {
    setIsUpdating(true);
    try {
      // In a real app, this would make an API call to update the request status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Notify the client
      await NotificationService.notifyRequestAccepted(request, {
        email: 'client@example.com', // In a real app, this would come from the request data
        userId: request.clientId
      });
      
      toast.success('Solicitação aceita com sucesso!');
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Erro ao aceitar solicitação. Tente novamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    setIsUpdating(true);
    try {
      // In a real app, this would make an API call to update the request status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Notify the client
      await NotificationService.notifyRequestRejected(request, {
        email: 'client@example.com', // In a real app, this would come from the request data
        userId: request.clientId
      });
      
      toast.success('Solicitação recusada.');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Erro ao recusar solicitação. Tente novamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: ServiceRequest['status']) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      pending: 'Pendente',
      accepted: 'Aceito',
      rejected: 'Recusado',
      completed: 'Concluído'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={`https://i.pravatar.cc/40?u=${request.id}`}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {userRole === 'client' ? 'Cuidador' : 'Cliente'} #{request.id.slice(0, 8)}
            </h3>
            <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date(request.date).toLocaleDateString()}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{request.time}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {getStatusBadge(request.status)}
          
          {request.status === 'pending' && userRole === 'caregiver' && (
            <div className="flex space-x-2">
              <button
                onClick={handleAccept}
                disabled={isUpdating}
                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Aceitar
              </button>
              <button
                onClick={handleReject}
                disabled={isUpdating}
                className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <X className="h-4 w-4 mr-1" />
                )}
                Recusar
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-600">{request.description}</p>
    </div>
  );
}