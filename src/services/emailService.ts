import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

interface EmailParams {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
}

export const sendEmail = async (params: EmailParams) => {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      params,
      EMAILJS_PUBLIC_KEY
    );
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Templates de email pré-definidos
export const emailTemplates = {
  welcomeEmail: (name: string) => ({
    subject: 'Bem-vindo ao MechanicAI!',
    message: `Olá ${name},\n\nSeja bem-vindo ao MechanicAI! Estamos muito felizes em tê-lo conosco.`
  }),
  
  orderConfirmation: (orderId: string, items: string[]) => ({
    subject: `Pedido ${orderId} Confirmado`,
    message: `Seu pedido ${orderId} foi confirmado!\n\nItens:\n${items.join('\n')}`
  }),
  
  serviceReminder: (clientName: string, service: string, date: string) => ({
    subject: 'Lembrete de Serviço',
    message: `Olá ${clientName},\n\nLembramos que você tem um agendamento para ${service} no dia ${date}.`
  }),
  
  lowStockAlert: (item: string, quantity: number) => ({
    subject: 'Alerta de Estoque Baixo',
    message: `O item "${item}" está com estoque baixo (${quantity} unidades). Considere fazer um novo pedido.`
  })
};