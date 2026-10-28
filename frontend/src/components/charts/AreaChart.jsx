import React from 'react';
import LineChart from './LineChart';

export default function AreaChart({ labels, datasets, height, options }) {
  // Ensure fill: true is set on each dataset
  const areaDatasets = datasets.map((ds) => ({
    fill: true,
    tension: 0.35,
    ...ds,
  }));

  return (
    <LineChart
      labels={labels}
      datasets={areaDatasets}
      height={height}
      options={options}
    />
  );
}
