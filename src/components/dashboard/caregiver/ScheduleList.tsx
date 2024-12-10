import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, MapPin, DollarSign } from 'lucide-react';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { toast } from 'sonner';
import { Location } from '../../../types/hire';

interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  startTime: string;
  specialtyRequired: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  totalAmount: number;
  duration: number;
  location?: Location;
  createdAt: string;
  updatedAt: string;
  paymentStatus?: 'pending' | 'completed';
  reviewStatus?: 'pending' | 'completed';
}

interface Notification {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
}

interface ScheduleListProps {
  appointments: Appointment[];
  onStatusChange: () => void;
  type?: 'pending' | 'accepted' | 'completed';
}

export default function ScheduleList({ 
  appointments,
  onStatusChange,
  type = 'pending' 
}: ScheduleListProps) {
  const [loading, setLoading] = React.useState<string | null>(null);

  const createNotification = async (notification: Notification) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    if (loading) return;
    setLoading(appointmentId);

    try {
      const appointmentRef = doc(db, 'hireRequests', appointmentId);
      const appointment = appointments.find(a => a.id === appointmentId);
      
      if (!appointment) {
        throw new Error('Agendamento não encontrado');
      }

      // Atualizar status do agendamento
      await updateDoc(appointmentRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Criar notificação para o cliente
      let notificationData: Notification = {
        userId: appointment.clientId,
        title: '',
        message: '',
        type: 'info',
        read: false,
        link: `/dashboard/appointments/${appointmentId}`
      };

      switch (newStatus) {
        case 'accepted':
          notificationData.title = 'Solicitação Aceita';
          notificationData.message = 'Seu agendamento foi confirmado! Confira os detalhes.';
          notificationData.type = 'success';
          break;
        case 'rejected':
          notificationData.title = 'Solicitação Recusada';
          notificationData.message = 'Infelizmente sua solicitação foi recusada.';
          notificationData.type = 'error';
          break;
        case 'completed':
          notificationData.title = 'Atendimento Concluído';
          notificationData.message = 'O atendimento foi marcado como concluído. Por favor, avalie o serviço.';
          notificationData.type = 'success';
          
          // Atualizar status de pagamento e avaliação
          await updateDoc(appointmentRef, {
            paymentStatus: 'pending',
            reviewStatus: 'pending'
          });
          break;
      }

      await createNotification(notificationData);
      
      toast.success('Status atualizado com sucesso!');
      onStatusChange();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatLocation = (location?: Location): string => {
    if (!location) return 'Localização não especificada';
    
    const parts = [
      location.address,
      location.complement,
      `${location.city}, ${location.state}`,
      `CEP: ${location.zipCode}`
    ].filter(Boolean);
    
    return parts.join(' - ');
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center">
          <Clock className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Nenhum agendamento {type === 'pending' ? 'pendente' : type === 'accepted' ? 'confirmado' : 'concluído'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {type === 'pending' 
            ? 'Você não tem novas solicitações de atendimento.'
            : type === 'accepted'
            ? 'Você não possui atendimentos confirmados no momento.'
            : 'Você não possui atendimentos concluídos.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
            type === 'pending' ? 'border-l-4 border-yellow-500' : 
            type === 'accepted' ? 'border-l-4 border-green-500' :
            'border-l-4 border-blue-500'
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {appointment.clientName}
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      {format(new Date(appointment.date), "dd 'de' MMMM", { locale: ptBR })} às {appointment.startTime}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{appointment.duration}h de duração</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{formatLocation(appointment.location)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{formatCurrency(appointment.totalAmount)}</span>
                  </div>
                </div>

                {appointment.description && (
                  <p className="mt-3 text-sm text-gray-600">
                    {appointment.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end space-y-2">
                {type === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'accepted')}
                      disabled={loading === appointment.id}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading === appointment.id ? 'Processando...' : 'Aceitar'}
                    </button>
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'rejected')}
                      disabled={loading === appointment.id}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading === appointment.id ? 'Processando...' : 'Recusar'}
                    </button>
                  </>
                )}
                
                {type === 'accepted' && (
                  <button
                    onClick={() => handleStatusChange(appointment.id, 'completed')}
                    disabled={loading === appointment.id}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading === appointment.id ? 'Processando...' : 'Concluir Atendimento'}
                  </button>
                )}

                {type === 'completed' && (
                  <div className="flex flex-col items-end space-y-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Concluído
                    </span>
                    {appointment.paymentStatus === 'completed' && (
                      <span className="text-sm text-gray-500">Pagamento Recebido</span>
                    )}
                    {appointment.reviewStatus === 'completed' && (
                      <span className="text-sm text-gray-500">Avaliado pelo Cliente</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Email:</span> {appointment.clientEmail}
                </div>
                <div>
                  <span className="font-medium">Telefone:</span> {appointment.clientPhone}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
