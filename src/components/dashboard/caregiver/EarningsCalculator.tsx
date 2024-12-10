import React from 'react';
import { Calculator } from 'lucide-react';

interface EarningsCalculatorProps {
  hourlyRate: number;
  completedAppointments: number;
  totalHours: number;
}

export default function EarningsCalculator({ 
  hourlyRate, 
  completedAppointments,
  totalHours 
}: EarningsCalculatorProps) {
  const totalEarnings = hourlyRate * totalHours;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Ganhos do Mês</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total de Atendimentos */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">
            Atendimentos Concluídos
          </div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {completedAppointments}
          </div>
        </div>

        {/* Total de Horas */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">
            Total de Horas
          </div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {totalHours}h
          </div>
        </div>

        {/* Total de Ganhos */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">
            Total de Ganhos
          </div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            R$ {totalEarnings.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        * Baseado no valor hora de R$ {hourlyRate.toFixed(2)}
      </div>
    </div>
  );
}
