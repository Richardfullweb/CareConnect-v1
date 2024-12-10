import React from 'react';
import { CreditCard, Clock } from 'lucide-react';
import type { ServiceRequest } from '../../types';
import PaymentModal from './PaymentModal';

interface PaymentSummaryProps {
  serviceRequest: ServiceRequest;
  hourlyRate: number;
}

export default function PaymentSummary({ serviceRequest, hourlyRate }: PaymentSummaryProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);

  const calculateTotal = () => {
    const hours = 2; // In a real app, this would come from the service request duration
    const subtotal = hourlyRate * hours;
    const serviceFee = subtotal * 0.1; // 10% service fee
    return {
      subtotal,
      serviceFee,
      total: subtotal + serviceFee
    };
  };

  const { subtotal, serviceFee, total } = calculateTotal();

  const handlePaymentSuccess = () => {
    // In a real app, this would update the service request status
    console.log('Payment successful for service request:', serviceRequest.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pagamento</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-2" />
            <span>Valor por hora</span>
          </div>
          <span className="text-gray-900">R$ {hourlyRate.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">R$ {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-gray-600">Taxa de serviço</span>
            <button
              className="ml-1 text-gray-400 hover:text-gray-500"
              title="Taxa para manutenção da plataforma"
            >
              ?
            </button>
          </div>
          <span className="text-gray-900">R$ {serviceFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center py-2 text-lg font-semibold">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>

        <button
          onClick={() => setIsPaymentModalOpen(true)}
          className="w-full btn-primary flex items-center justify-center"
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Realizar Pagamento
        </button>

        <p className="text-sm text-gray-500 text-center">
          Ao confirmar, você concorda com nossos termos de serviço e política de privacidade
        </p>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        serviceRequest={serviceRequest}
        totalAmount={total}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}