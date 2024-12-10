import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';

interface Service {
  id: string;
  clientName: string;
  clientImage: string;
  date: string;
  duration: number;
  amount: number;
  status: 'completed' | 'pending_payment';
}

interface ServicesListProps {
  services: Service[];
}

export default function ServicesList({ services }: ServicesListProps) {
  return (
    <div className="divide-y divide-gray-200">
      {services.map((service) => (
        <div key={service.id} className="p-6 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={service.clientImage}
                alt={service.clientName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="text-sm font-medium text-gray-900">{service.clientName}</h4>
                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(service.date).toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{service.duration}h</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                R$ {service.amount.toFixed(2)}
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  service.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {service.status === 'completed' ? 'Pago' : 'Aguardando Pagamento'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}