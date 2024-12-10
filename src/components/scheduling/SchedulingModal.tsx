import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Calendar } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { useAuthContext } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregiver: any;
}

export default function SchedulingModal({ isOpen, onClose, caregiver }: SchedulingModalProps) {
  const { user } = useAuthContext();
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Gerar horários disponíveis (8h às 18h, intervalos de 1h)
  const availableTimes = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Gerar próximos 30 dias disponíveis
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return format(date, 'yyyy-MM-dd');
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Você precisa estar logado para agendar');
      return;
    }

    setLoading(true);
    try {
      // Garantir que temos um valor válido para hourlyRate
      const hourlyRate = caregiver.hourlyRate || caregiver.price || 0;

      const appointmentData = {
        caregiverId: caregiver.id,
        clientId: user.uid,
        clientName: user.displayName || 'Cliente',
        caregiverName: caregiver.name,
        date,
        time,
        description,
        status: 'pending',
        createdAt: new Date().toISOString(),
        hourlyRate,
      };

      console.log('Dados do agendamento:', appointmentData);
      await addDoc(collection(db, 'appointments'), appointmentData);
      
      toast.success('Agendamento realizado com sucesso!');
      onClose();
      setDate('');
      setTime('');
      setDescription('');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast.error('Erro ao realizar agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    Agendar Atendimento
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Data
                    </label>
                    <select
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Selecione uma data</option>
                      {availableDates.map((date) => (
                        <option key={date} value={date}>
                          {format(new Date(date), "dd 'de' MMMM", { locale: ptBR })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      Horário
                    </label>
                    <select
                      id="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Selecione um horário</option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Descrição do Atendimento
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Descreva as necessidades do atendimento..."
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Agendando...
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
                          Confirmar Agendamento
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
