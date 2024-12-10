import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { toast } from 'sonner';
import { Clock, Save } from 'lucide-react';

interface WorkScheduleManagerProps {
  caregiverId: string;
}

type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

interface TimeSlot {
  start: string;
  end: string;
}

interface WorkSchedule {
  [key in DayOfWeek]: TimeSlot[];
}

const DAYS_OF_WEEK: { key: DayOfWeek; label: string }[] = [
  { key: 'sunday', label: 'Domingo' },
  { key: 'monday', label: 'Segunda' },
  { key: 'tuesday', label: 'Terça' },
  { key: 'wednesday', label: 'Quarta' },
  { key: 'thursday', label: 'Quinta' },
  { key: 'friday', label: 'Sexta' },
  { key: 'saturday', label: 'Sábado' },
];

const DEFAULT_SCHEDULE: WorkSchedule = {
  sunday: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
};

export default function WorkScheduleManager({ caregiverId }: WorkScheduleManagerProps) {
  const [schedule, setSchedule] = useState<WorkSchedule>(DEFAULT_SCHEDULE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const docRef = doc(db, 'caregivers', caregiverId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSchedule(data.workSchedule || DEFAULT_SCHEDULE);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching work schedule:', error);
        toast.error('Erro ao carregar horários de trabalho');
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [caregiverId]);

  const handleAddTimeSlot = (day: DayOfWeek) => {
    setSchedule(prev => ({
      ...prev,
      [day]: [...prev[day], { start: '09:00', end: '17:00' }],
    }));
  };

  const handleRemoveTimeSlot = (day: DayOfWeek, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const handleTimeChange = (
    day: DayOfWeek,
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'caregivers', caregiverId);
      await updateDoc(docRef, {
        workSchedule: schedule,
      });
      toast.success('Horários salvos com sucesso!');
    } catch (error) {
      console.error('Error saving work schedule:', error);
      toast.error('Erro ao salvar horários');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Horários de Trabalho</h3>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {DAYS_OF_WEEK.map(({ key, label }) => (
          <div key={key} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900">{label}</h4>
              <button
                onClick={() => handleAddTimeSlot(key)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Adicionar Horário
              </button>
            </div>

            {schedule[key].length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhum horário definido para {label.toLowerCase()}
              </p>
            ) : (
              <div className="space-y-2">
                {schedule[key].map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md"
                  >
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(e) =>
                        handleTimeChange(key, index, 'start', e.target.value)
                      }
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-gray-500">até</span>
                    <input
                      type="time"
                      value={slot.end}
                      onChange={(e) =>
                        handleTimeChange(key, index, 'end', e.target.value)
                      }
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleRemoveTimeSlot(key, index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
