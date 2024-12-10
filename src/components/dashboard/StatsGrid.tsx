import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Car, Wrench } from 'lucide-react';

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Faturamento"
        value="R$ 45.289"
        change="+12.5%"
        trend="up"
        icon={<DollarSign className="h-6 w-6" />}
      />
      <StatCard
        title="Clientes Ativos"
        value="284"
        change="+4.3%"
        trend="up"
        icon={<Users className="h-6 w-6" />}
      />
      <StatCard
        title="Veículos em Serviço"
        value="12"
        change="-2.1%"
        trend="down"
        icon={<Car className="h-6 w-6" />}
      />
      <StatCard
        title="Serviços Concluídos"
        value="156"
        change="+8.2%"
        trend="up"
        icon={<Wrench className="h-6 w-6" />}
      />
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon 
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <div className="text-blue-600">
            {icon}
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium
          ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
          {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}