import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const getChartScales = (isDark = true) => ({
  y: {
    grid: {
      color: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(203, 213, 225, 0.6)',
    },
    ticks: {
      color: isDark ? '#94a3b8' : '#64748b',
      font: { size: 11 },
    },
  },
  x: {
    grid: {
      color: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(203, 213, 225, 0.6)',
    },
    ticks: {
      color: isDark ? '#94a3b8' : '#64748b',
      font: { size: 11 },
    },
  },
});

export const getChartLegend = (isDark = true) => ({
  position: 'top',
  labels: {
    color: isDark ? '#e2e8f0' : '#1e293b',
    boxWidth: 12,
    font: { size: 12 },
  },
});

export const defaultDarkScales = getChartScales(true);
export const defaultLegend = getChartLegend(true);
