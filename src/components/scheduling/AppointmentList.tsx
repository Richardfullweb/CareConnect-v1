import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Appointment {
  id: string;
  date: Date;
  time: string;
  duration: number;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reminder: boolean;
  reminderTime?: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onStatusChange: (id: string, status: Appointment['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function AppointmentList({
  appointments,
  onStatusChange,
  onDelete
}: AppointmentListProps) {
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    setIsUpdating(id);
    try {
      await onStatusChange(id, status);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsUpdating(id);
    try {
      await onDelete(id);
    } finally {
      setIsUpdating(null);
    }
  };

  const getPriorityColor = (priority: Appointment['priority']) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum agendamento
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Você não possui nenhum agendamento para este período.
          </p>
        </div>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-full ${getStatusColor(appointment.status)}`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {format(appointment.date, "dd 'de' MMMM", { locale: ptBR })}
                  </h4>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{appointment.time} ({appointment.duration}h)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                  {appointment.priority === 'low' ? 'Baixa' : appointment.priority === 'medium' ? 'Média' : 'Alta'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status === 'pending' ? 'Pendente' :
                   appointment.status === 'confirmed' ? 'Confirmado' :
                   appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                </span>
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-600">{appointment.description}</p>

            {appointment.reminder && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Lembrete {appointment.reminderTime} minutos antes</span>
              </div>
            )}

            <div className="mt-4 flex justify-end space-x-2">
              {appointment.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                    disabled={isUpdating === appointment.id}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Confirmar
                  </button>
                  <button
                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                    disabled={isUpdating === appointment.id}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancelar
                  </button>
                </>
              )}
              {appointment.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusChange(appointment.id, 'completed')}
                  disabled={isUpdating === appointment.id}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Concluir
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}