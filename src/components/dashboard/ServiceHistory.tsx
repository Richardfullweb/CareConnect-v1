import React from 'react';
import { Clock } from 'lucide-react';

export default function ServiceHistory() {
  const services = [
    {
      id: 1,
      client: 'Carlos Oliveira',
      service: 'Troca de Óleo',
      vehicle: 'Honda Civic 2020',
      status: 'completed',
      date: '2024-03-15'
    },
    {
      id: 2,
      client: 'Ana Silva',
      service: 'Revisão Completa',
      vehicle: 'Toyota Corolla 2021',
      status: 'in_progress',
      date: '2024-03-15'
    },
    {
      id: 3,
      client: 'Pedro Santos',
      service: 'Troca de Pastilhas',
      vehicle: 'Jeep Compass 2022',
      status: 'scheduled',
      date: '2024-03-16'
    },
    {
      id: 4,
      client: 'Maria Costa',
      service: 'Alinhamento',
      vehicle: 'VW Golf 2019',
      status: 'scheduled',
      date: '2024-03-16'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'scheduled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in_progress':
        return 'Em Andamento';
      case 'scheduled':
        return 'Agendado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Histórico de Serviços</h2>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver Todos
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{service.client}</p>
              <p className="text-sm text-gray-500">{service.vehicle}</p>
              <p className="text-sm text-gray-500">{service.service}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(service.status)}`}>
                {getStatusText(service.status)}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(service.date).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}