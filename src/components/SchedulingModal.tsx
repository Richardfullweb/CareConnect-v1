import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthContext } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { date: string; time: string; description: string }) => void;
  caregiver: any;
}

export default function SchedulingModal({
  isOpen,
  onClose,
  onSubmit,
  caregiver,
}: SchedulingModalProps) {
  const { user } = useAuthContext();
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Gerar horários disponíveis (exemplo: 8h às 18h, intervalos de 1h)
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
    if (!user) return;

    setLoading(true);
    try {
      // Criar o agendamento no Firestore
      const appointmentData = {
        caregiverId: caregiver.id,
        clientId: user.uid,
        date,
        time,
        description,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      onSubmit({ date, time, description });
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Agendar Atendimento
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
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

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin" />
                  ) : (
                    'Agendar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}