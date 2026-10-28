import React from 'react';
import { Card } from '../../components/common';
import EnergyConsumptionChart from '../../components/charts/EnergyConsumptionChart';

export default function ConsumptionChart({ trends, loading }) {
  if (loading) {
    return (
      <Card className="mt-6" title="Energy Trends (Last 7 Days)">
        <div className="h-80 flex items-center justify-center text-slate-500 animate-pulse text-xs">
          Loading energy analytics...
        </div>
      </Card>
    );
  }

  const labels = trends?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const consumptionData = trends?.consumption || [0, 0, 0, 0, 0, 0, 0];
  const renewablesData = trends?.renewables || [0, 0, 0, 0, 0, 0, 0];

  return (
    <Card
      className="mt-6"
      title="Energy Consumption vs. Renewable Generation"
      subtitle="7-day aggregated telemetry from active grid meters"
    >
      <EnergyConsumptionChart
        labels={labels}
        consumptionData={consumptionData}
        renewablesData={renewablesData}
        height="h-80"
      />
    </Card>
  );
}
