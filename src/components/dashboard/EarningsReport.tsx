import React from 'react';
import { Calendar, DollarSign, TrendingUp, Clock, Download } from 'lucide-react';
import { useEarnings } from '../../hooks/useEarnings';
import EarningsChart from './earnings/EarningsChart';
import ServicesList from './earnings/ServicesList';

interface EarningsReportProps {
  caregiverId: string;
}

export default function EarningsReport({ caregiverId }: EarningsReportProps) {
  const [period, setPeriod] = React.useState<'week' | 'month' | 'year'>('month');
  const { earnings, isLoading } = useEarnings(caregiverId, period);

  const downloadReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    console.log('Downloading report...');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Relatório de Ganhos</h2>
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="year">Este Ano</option>
          </select>
          <button
            onClick={downloadReport}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ganhos Totais</p>
              <p className="text-2xl font-semibold text-gray-900">
                R$ {earnings.totalEarnings.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {earnings.earningsChange >= 0 ? '+' : ''}
            {earnings.earningsChange}% vs. período anterior
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Atendimentos</p>
              <p className="text-2xl font-semibold text-gray-900">{earnings.totalServices}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {earnings.servicesChange >= 0 ? '+' : ''}
            {earnings.servicesChange}% vs. período anterior
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Média por Atendimento</p>
              <p className="text-2xl font-semibold text-gray-900">
                R$ {earnings.averagePerService.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {earnings.averageChange >= 0 ? '+' : ''}
            {earnings.averageChange}% vs. período anterior
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Horas Trabalhadas</p>
              <p className="text-2xl font-semibold text-gray-900">{earnings.totalHours}h</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {earnings.hoursChange >= 0 ? '+' : ''}
            {earnings.hoursChange}% vs. período anterior
          </p>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Ganhos</h3>
        <EarningsChart data={earnings.chartData} period={period} />
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Atendimentos Realizados</h3>
        </div>
        <ServicesList services={earnings.services} />
      </div>
    </div>
  );
}