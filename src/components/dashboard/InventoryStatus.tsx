import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';

export default function InventoryStatus() {
  const items = [
    { name: 'Filtro de Óleo', stock: 45, min: 20, status: 'normal' },
    { name: 'Pastilha de Freio', stock: 8, min: 15, status: 'low' },
    { name: 'Óleo Motor 5W30', stock: 25, min: 10, status: 'normal' },
    { name: 'Correia Dentada', stock: 12, min: 5, status: 'normal' },
    { name: 'Vela de Ignição', stock: 4, min: 20, status: 'low' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Status do Inventário</h2>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver Todos
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.name}</span>
                {item.status === 'low' && (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <p className="text-sm text-gray-500">Min: {item.min} unidades</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    item.status === 'low' ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(item.stock / Math.max(item.min * 2, 30)) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">
                {item.stock} un
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}