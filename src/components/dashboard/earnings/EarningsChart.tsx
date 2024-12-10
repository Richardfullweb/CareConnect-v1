import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EarningsChartProps {
  data: {
    labels: string[];
    earnings: number[];
  };
  period: 'week' | 'month' | 'year';
}

export default function EarningsChart({ data, period }: EarningsChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Ganhos (R$)',
        data: data.earnings,
        fill: true,
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `R$ ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `R$ ${value}`,
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
}