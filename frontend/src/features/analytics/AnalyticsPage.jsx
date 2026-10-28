import React, { useEffect, useState } from 'react';
import { analyticsService } from './analyticsService';
import { facilityService } from '../facilities/facilityService';
import { Header } from '../../components/layout';
import { Card, Select } from '../../components/common';
import EnergyConsumptionChart from '../../components/charts/EnergyConsumptionChart';
import CostTrendChart from '../../components/charts/CostTrendChart';
import { formatNumber, formatCurrency } from '../../utils/formatters';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [costAnalysis, setCostAnalysis] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [timeRange, setTimeRange] = useState('7');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    facilityService.getFacilities().then(setFacilities).catch(console.error);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [sumData, trData, costData] = await Promise.all([
          analyticsService.getSummary(selectedFacility || null),
          analyticsService.getTrends(Number(timeRange), selectedFacility || null),
          analyticsService.getCosts(selectedFacility || null),
        ]);
        if (isMounted) {
          setSummary(sumData);
          setTrends(trData);
          setCostAnalysis(costData);
        }
      } catch (err) {
        console.error('Failed to load analytics data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAnalytics();
    return () => {
      isMounted = false;
    };
  }, [selectedFacility, timeRange]);

  const costLabels = costAnalysis?.facilities_cost?.map((f) => f.facility_name) || [];
  const costValues = costAnalysis?.facilities_cost?.map((f) => f.amount) || [];

  return (
    <div>
      <Header
        title="Energy Analytics & Sustainability Intelligence"
        subtitle="In-depth trend analysis, facility cost distribution, and clean energy efficiency KPIs."
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="w-full sm:w-64">
          <Select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            options={facilities.map((f) => ({ value: f.id, label: f.name }))}
            placeholder="All Managed Facilities"
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: '7', label: 'Last 7 Days' },
              { value: '14', label: 'Last 14 Days' },
              { value: '30', label: 'Last 30 Days' },
            ]}
          />
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card className="border-t-2 border-t-brand-primary">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Sustainability Ratio</p>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {summary?.renewable_percentage || 0}%
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            {formatNumber(summary?.total_renewable_kwh)} kWh total clean power
          </p>
        </Card>

        <Card className="border-t-2 border-t-brand-secondary">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Net Grid Load</p>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatNumber(summary?.total_consumption_kwh)} <span className="text-sm text-slate-500 dark:text-slate-400">kWh</span>
          </div>
          <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
            Average demand across active grid points
          </p>
        </Card>

        <Card className="border-t-2 border-t-amber-500">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Energy Cost</p>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatCurrency(summary?.total_cost || 0)}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Aggregated utility billing statements
          </p>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card
          title="Telemetry Load & Generation Trend"
          subtitle={`Aggregated consumption and renewable output over ${timeRange} days`}
        >
          {loading ? (
            <div className="h-80 flex items-center justify-center text-slate-500 text-xs animate-pulse">
              Calculating trend curves...
            </div>
          ) : (
            <EnergyConsumptionChart
              labels={trends?.labels || []}
              consumptionData={trends?.consumption || []}
              renewablesData={trends?.renewables || []}
              height="h-80"
            />
          )}
        </Card>

        <Card
          title="Facility Utility Cost Distribution"
          subtitle="Cumulative utility spend across enterprise facilities"
        >
          {loading ? (
            <div className="h-80 flex items-center justify-center text-slate-500 text-xs animate-pulse">
              Loading cost metrics...
            </div>
          ) : costValues.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-slate-400 text-xs">
              No billing records found for this scope.
            </div>
          ) : (
            <CostTrendChart
              labels={costLabels}
              costData={costValues}
              height="h-80"
            />
          )}
        </Card>
      </div>
    </div>
  );
}
