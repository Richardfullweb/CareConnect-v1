import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { useScheduleStore } from '../../store/scheduleStore';
import { toast } from 'react-toastify';

export default function Calendar() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const { appointments, addAppointment } = useScheduleStore();
  const [formData, setFormData] = React.useState({
    clientName: '',
    vehicle: '',
    service: '',
    notes: ''
  });

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const newAppointment = {
      id: crypto.randomUUID(),
      title: `${formData.clientName} - ${formData.service}`,
      start: selectedDate,
      end: new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
      extendedProps: {
        clientName: formData.clientName,
        vehicle: formData.vehicle,
        service: formData.service,
        notes: formData.notes
      }
    };

    addAppointment(newAppointment);
    toast.success('Agendamento criado com sucesso!');
    setIsModalOpen(false);
    setFormData({ clientName: '', vehicle: '', service: '', notes: '' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Calendário de Agendamentos</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        locale="pt-br"
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia'
        }}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={appointments}
        select={handleDateSelect}
        eventContent={(eventInfo) => (
          <div className="p-1">
            <div className="font-semibold">{eventInfo.event.title}</div>
            <div className="text-xs">
              {format(eventInfo.event.start!, 'HH:mm')} - {format(eventInfo.event.end!, 'HH:mm')}
            </div>
          </div>
        )}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Novo Agendamento</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Veículo
                </label>
                <input
                  type="text"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serviço
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione um serviço</option>
                  <option value="Troca de Óleo">Troca de Óleo</option>
                  <option value="Revisão Completa">Revisão Completa</option>
                  <option value="Alinhamento">Alinhamento</option>
                  <option value="Balanceamento">Balanceamento</option>
                  <option value="Troca de Pastilhas">Troca de Pastilhas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}