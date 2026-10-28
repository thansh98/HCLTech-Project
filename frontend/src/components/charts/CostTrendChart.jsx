import React from 'react';
import BarChart from './BarChart';

export default function CostTrendChart({
  labels = [],
  costData = [],
  height = 'h-80',
}) {
  const datasets = [
    {
      label: 'Energy Cost (₹)',
      data: costData,
      backgroundColor: 'rgba(245, 158, 11, 0.75)', // Amber Blaze
      borderColor: '#f59e0b',
      borderWidth: 1,
      borderRadius: 6,
    },
  ];

  return <BarChart labels={labels} datasets={datasets} height={height} />;
}
