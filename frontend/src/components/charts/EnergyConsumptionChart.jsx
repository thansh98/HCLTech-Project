import React from 'react';
import AreaChart from './AreaChart';

export default function EnergyConsumptionChart({
  labels = [],
  consumptionData = [],
  renewablesData = [],
  height = 'h-80',
}) {
  const datasets = [
    {
      label: 'Total Consumption (kWh)',
      data: consumptionData,
      borderColor: '#06b6d4', // Electric Cyan
      backgroundColor: 'rgba(6, 182, 212, 0.15)',
      pointBackgroundColor: '#06b6d4',
      pointBorderColor: '#0f172a',
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: 'Renewable Generation (kWh)',
      data: renewablesData,
      borderColor: '#10b981', // Neon Emerald
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#0f172a',
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ];

  return <AreaChart labels={labels} datasets={datasets} height={height} />;
}
