import React from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface AppointmentCalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  appointments: Array<{
    date: Date;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  }>;
}

export default function AppointmentCalendar({
  selectedDate,
  onSelect,
  appointments
}: AppointmentCalendarProps) {
  const appointmentDates = appointments.map(apt => apt.date);

  const getDateStyle = (date: Date) => {
    const appointment = appointments.find(
      apt => format(apt.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    if (!appointment) return undefined;

    const styles = {
      pending: 'bg-yellow-100 text-yellow-900',
      confirmed: 'bg-green-100 text-green-900',
      completed: 'bg-blue-100 text-blue-900',
      cancelled: 'bg-red-100 text-red-900'
    };

    return styles[appointment.status];
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-4">
        <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Calendário</h2>
      </div>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        locale={ptBR}
        modifiers={{
          hasAppointment: appointmentDates
        }}
        modifiersStyles={{
          hasAppointment: {
            fontWeight: 'bold'
          }
        }}
        styles={{
          day: { margin: 0 },
          caption: { color: '#4F46E5' },
          nav: { color: '#4F46E5' }
        }}
        className="border rounded-lg p-2"
        components={{
          DayContent: ({ date }) => (
            <div className={`p-2 rounded-full ${getDateStyle(date)}`}>
              {format(date, 'd')}
            </div>
          )
        }}
      />
      <div className="mt-4 space-y-2">
        <div className="text-sm text-gray-600">Legenda:</div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-100 mr-2" />
            <span className="text-sm">Pendente</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-100 mr-2" />
            <span className="text-sm">Confirmado</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-100 mr-2" />
            <span className="text-sm">Concluído</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-100 mr-2" />
            <span className="text-sm">Cancelado</span>
          </div>
        </div>
      </div>
    </div>
  );
}