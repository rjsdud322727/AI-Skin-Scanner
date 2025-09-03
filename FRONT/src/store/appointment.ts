import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppointmentState, Appointment } from '@/types';

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],
      isLoading: false,

      addAppointment: (appointmentData: Omit<Appointment, 'id'>) => {
        const newAppointment: Appointment = {
          ...appointmentData,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }));
      },

      updateAppointment: (id: string, updates: Partial<Appointment>) => {
        set((state) => ({
          appointments: state.appointments.map(appointment =>
            appointment.id === id ? { ...appointment, ...updates } : appointment
          ),
        }));
      },

      deleteAppointment: (id: string) => {
        set((state) => ({
          appointments: state.appointments.filter(appointment => appointment.id !== id),
        }));
      },
    }),
    {
      name: 'appointment-storage',
      partialize: (state) => ({ 
        appointments: state.appointments 
      }),
    }
  )
); 