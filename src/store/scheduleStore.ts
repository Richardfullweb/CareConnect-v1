import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    clientName: string;
    vehicle: string;
    service: string;
    notes?: string;
  };
}

interface ScheduleState {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  removeAppointment: (id: string) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      appointments: [],
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [...state.appointments, appointment],
        })),
      removeAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((app) => app.id !== id),
        })),
      updateAppointment: (id, updatedAppointment) =>
        set((state) => ({
          appointments: state.appointments.map((app) =>
            app.id === id ? { ...app, ...updatedAppointment } : app
          ),
        })),
    }),
    {
      name: 'schedule-storage',
    }
  )
);