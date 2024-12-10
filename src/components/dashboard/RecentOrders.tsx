import React from 'react';
import { Package, MoreVertical } from 'lucide-react';

export default function RecentOrders() {
  const orders = [
    {
      id: '#ORD-2024-001',
      client: 'Auto Peças Silva',
      items: ['Filtro de Óleo', 'Pastilha de Freio'],
      total: 'R$ 456,90',
      status: 'pending',
      date: '15/03/2024'
    },
    {
      id: '#ORD-2024-002',
      client: 'Mecânica do João',
      items: ['Óleo Motor 5W30', 'Filtro de Ar'],
      total: 'R$ 289,50',
      status: 'processing',
      date: '15/03/2024'
    },
    {
      id: '#ORD-2024-003',
      client: 'Centro Automotivo Santos',
      items: ['Kit Embreagem', 'Correia Dentada'],
      total: 'R$ 1.245,00',
      status: 'completed',
      date: '14/03/2024'
    },
    {
      id: '#ORD-2024-004',
      client: 'Oficina Central',
      items: ['Vela de Ignição', 'Bobina'],
      total: 'R$ 567,80',
      status: 'completed',
      date: '14/03/2024'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'processing':
        return 'Em Processamento';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mt-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Pedidos Recentes</h2>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver Todos
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedido
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Itens
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.client}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.items.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}