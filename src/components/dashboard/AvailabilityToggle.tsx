import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AvailabilityToggleProps {
  initialStatus?: 'available' | 'unavailable';
  onStatusChange: (status: 'available' | 'unavailable') => Promise<void>;
}

export default function AvailabilityToggle({ 
  initialStatus = 'available',
  onStatusChange 
}: AvailabilityToggleProps) {
  const [status, setStatus] = React.useState(initialStatus);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleToggle = async () => {
    const newStatus = status === 'available' ? 'unavailable' : 'available';
    setIsUpdating(true);

    try {
      await onStatusChange(newStatus);
      setStatus(newStatus);
      toast.success(`Status atualizado para ${newStatus === 'available' ? 'Disponível' : 'Indisponível'}`);
    } catch (error) {
      toast.error('Erro ao atualizar status. Tente novamente.');
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Status de Disponibilidade</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {status === 'available' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span className="font-medium">
            {status === 'available' ? 'Disponível' : 'Indisponível'}
          </span>
        </div>

        <button
          onClick={handleToggle}
          disabled={isUpdating}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            status === 'available' ? 'bg-green-500' : 'bg-gray-200'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="sr-only">Alterar disponibilidade</span>
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              status === 'available' ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        {status === 'available'
          ? 'Você está visível para novos atendimentos'
          : 'Você não está recebendo novas solicitações'}
      </p>
    </div>
  );
}