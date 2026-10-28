import React from 'react';
import './chartSetup';
import { Doughnut } from 'react-chartjs-2';
import { defaultLegend } from './chartSetup';

export default function PieChart({
  labels = [],
  datasets = [],
  height = 'h-72',
  options = {},
}) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        ...defaultLegend,
        position: 'bottom',
      },
      ...options.plugins,
    },
    ...options,
  };

  const chartData = {
    labels,
    datasets,
  };

  return (
    <div className={`w-full ${height} flex items-center justify-center`}>
      <Doughnut options={chartOptions} data={chartData} />
    </div>
  );
}
