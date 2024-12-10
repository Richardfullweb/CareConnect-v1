import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import AppointmentNotification from './AppointmentNotification';
import { createAppointmentMessage } from '../utils/messages';

interface AppointmentNotificationsProps {
  userId: string;
}

export function AppointmentNotifications({ userId }: AppointmentNotificationsProps) {
  const { notifications } = useNotifications(userId);

  const handleAcceptAppointment = async (notificationId: string, appointmentData: any) => {
    try {
      // Aqui você adicionaria a lógica para atualizar o status do agendamento no banco de dados
      
      // Criar mensagem de confirmação
      await createAppointmentMessage(
        userId,
        'appointment_accepted',
        appointmentData
      );
    } catch (error) {
      console.error('Erro ao aceitar agendamento:', error);
    }
  };

  const handleRejectAppointment = async (notificationId: string, appointmentData: any) => {
    try {
      // Aqui você adicionaria a lógica para atualizar o status do agendamento no banco de dados
      
      // Criar mensagem de cancelamento
      await createAppointmentMessage(
        userId,
        'appointment_cancelled',
        appointmentData
      );
    } catch (error) {
      console.error('Erro ao recusar agendamento:', error);
    }
  };

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <AppointmentNotification
          key={notification.id}
          type={notification.type}
          date={notification.appointmentData.date}
          duration={notification.appointmentData.duration}
          address={notification.appointmentData.address}
          price={notification.appointmentData.price}
          onAccept={() => handleAcceptAppointment(notification.id, notification.appointmentData)}
          onReject={() => handleRejectAppointment(notification.id, notification.appointmentData)}
        />
      ))}
    </div>
  );
}
