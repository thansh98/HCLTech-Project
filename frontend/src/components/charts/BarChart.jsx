import React from 'react';
import './chartSetup';
import { Bar } from 'react-chartjs-2';
import { getChartScales, getChartLegend } from './chartSetup';
import { useTheme } from '../../context/ThemeContext';

export default function BarChart({
  labels = [],
  datasets = [],
  height = 'h-72',
  options = {},
}) {
  const { isDark } = useTheme();
  const themeScales = getChartScales(isDark);
  const themeLegend = getChartLegend(isDark);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: themeLegend,
      ...options.plugins,
    },
    scales: {
      ...themeScales,
      ...options.scales,
    },
    ...options,
  };

  const chartData = {
    labels,
    datasets,
  };

  return (
    <div className={`w-full ${height}`}>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}
