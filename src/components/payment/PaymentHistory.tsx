import React from 'react';
import { Download, CreditCard, Calendar, Clock } from 'lucide-react';

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  serviceDate: string;
  duration: number;
  paymentMethod: {
    type: 'credit_card';
    last4: string;
    brand: string;
  };
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  const getStatusBadge = (status: Payment['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };

    const labels = {
      completed: 'Concluído',
      pending: 'Pendente',
      failed: 'Falhou'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const downloadReceipt = (paymentId: string) => {
    // In a real app, this would generate and download a PDF receipt
    console.log('Downloading receipt for payment:', paymentId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Histórico de Pagamentos</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {payments.map((payment) => (
          <div key={payment.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      •••• {payment.paymentMethod.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.paymentMethod.brand}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  R$ {payment.amount.toFixed(2)}
                </p>
                {getStatusBadge(payment.status)}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(payment.serviceDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{payment.duration}h</span>
                </div>
              </div>

              {payment.status === 'completed' && (
                <button
                  onClick={() => downloadReceipt(payment.id)}
                  className="flex items-center text-indigo-600 hover:text-indigo-500"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Recibo
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}