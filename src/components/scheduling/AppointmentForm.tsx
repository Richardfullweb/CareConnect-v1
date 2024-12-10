import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Clock, Calendar, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const appointmentSchema = z.object({
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  duration: z.number().min(1, 'Duração é obrigatória'),
  description: z.string().min(10, 'Descreva o atendimento com pelo menos 10 caracteres'),
  priority: z.enum(['low', 'medium', 'high']),
  reminder: z.boolean(),
  reminderTime: z.string().optional()
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  defaultDate?: Date;
}

export default function AppointmentForm({ onSubmit, defaultDate }: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : undefined,
      priority: 'medium',
      reminder: true,
      reminderTime: '30'
    }
  });

  const reminder = watch('reminder');

  const handleFormSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              {...register('date')}
              className="input-primary pl-10"
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Horário
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="time"
              {...register('time')}
              className="input-primary pl-10"
            />
          </div>
          {errors.time && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.time.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Duração (horas)
        </label>
        <select
          {...register('duration', { valueAsNumber: true })}
          className="mt-1 input-primary"
        >
          <option value={1}>1 hora</option>
          <option value={2}>2 horas</option>
          <option value={4}>4 horas</option>
          <option value={6}>6 horas</option>
          <option value={8}>8 horas</option>
          <option value={12}>12 horas</option>
        </select>
        {errors.duration && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.duration.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <div className="mt-1">
          <textarea
            {...register('description')}
            rows={4}
            className="input-primary"
            placeholder="Descreva os detalhes do atendimento..."
          />
        </div>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Prioridade
        </label>
        <select
          {...register('priority')}
          className="mt-1 input-primary"
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('reminder')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Ativar lembrete
          </label>
        </div>

        {reminder && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tempo do lembrete
            </label>
            <select
              {...register('reminderTime')}
              className="mt-1 input-primary"
            >
              <option value="15">15 minutos antes</option>
              <option value="30">30 minutos antes</option>
              <option value="60">1 hora antes</option>
              <option value="120">2 horas antes</option>
              <option value="1440">1 dia antes</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full btn-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              <span className="ml-2">Agendando...</span>
            </div>
          ) : (
            'Agendar Atendimento'
          )}
        </button>
      </div>
    </form>
  );
}