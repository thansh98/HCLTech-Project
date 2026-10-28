import React from 'react';
import './chartSetup';
import { Line } from 'react-chartjs-2';
import { getChartScales, getChartLegend } from './chartSetup';
import { useTheme } from '../../context/ThemeContext';

export default function LineChart({
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
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}
