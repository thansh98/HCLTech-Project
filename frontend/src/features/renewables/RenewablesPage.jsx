import React, { useEffect, useState } from 'react';
import { renewableService } from './renewableService';
import { facilityService } from '../facilities/facilityService';
import RenewableList from './RenewableList';
import RenewableModal from './RenewableModal';
import { Header } from '../../components/layout';
import { Card, Select } from '../../components/common';
import PieChart from '../../components/charts/PieChart';
import { RENEWABLE_SOURCES } from '../../constants';
import { formatNumber } from '../../utils/formatters';

export default function RenewablesPage() {
  const [records, setRecords] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facilityFilter, setFacilityFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, breakdownData, facilitiesData] = await Promise.all([
        renewableService.getRecords({
          facility: facilityFilter || undefined,
          source_type: sourceFilter || undefined,
        }),
        renewableService.getBreakdown(facilityFilter || null),
        facilityService.getFacilities(),
      ]);
      setRecords(recordsData);
      setBreakdown(breakdownData);
      setFacilities(facilitiesData);
    } catch (err) {
      console.error('Failed to load renewables data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [facilityFilter, sourceFilter]);

  const handleSave = async (formData) => {
    await renewableService.recordGeneration(formData);
    loadData();
  };

  const handleDelete = async (record) => {
    if (window.confirm('Delete this renewable generation record?')) {
      try {
        await renewableService.deleteRecord(record.id);
        loadData();
      } catch (err) {
        alert('Failed to delete record.');
      }
    }
  };

  const pieLabels = breakdown.map((b) => b.label);
  const pieValues = breakdown.map((b) => b.total_kwh);
  const totalCleanKwh = pieValues.reduce((acc, val) => acc + val, 0);

  return (
    <div>
      <Header
        title="Renewable Energy Management"
        subtitle="Telemetry tracking solar, wind, and on-site clean power generation assets."
      />

      {/* Top clean energy metrics and breakdown chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Total Clean Power Generated
            </h3>
            <div className="text-4xl font-black text-slate-900 dark:text-white mt-2">
              {formatNumber(totalCleanKwh)} <span className="text-lg font-normal text-slate-500 dark:text-slate-400">kWh</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              Aggregated across {breakdown.length} renewable generation technologies.
            </p>
          </div>

          <div className="mt-6 space-y-2 border-t border-brand-borderSubtle pt-4">
            {breakdown.map((item) => (
              <div key={item.source_type} className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{formatNumber(item.total_kwh)} kWh</span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          className="lg:col-span-2"
          title="Renewable Generation Mix"
          subtitle="Proportion of clean generation by source technology"
        >
          {totalCleanKwh === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
              No renewable generation recorded yet. Click Log Generation below.
            </div>
          ) : (
            <PieChart
              labels={pieLabels}
              datasets={[
                {
                  data: pieValues,
                  backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6'],
                  borderColor: '#0f172a',
                  borderWidth: 2,
                },
              ]}
              height="h-64"
            />
          )}
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="w-full sm:w-60">
          <Select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            options={facilities.map((f) => ({ value: f.id, label: f.name }))}
            placeholder="All Facilities"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            options={RENEWABLE_SOURCES}
            placeholder="All Sources"
          />
        </div>
      </div>

      <RenewableList
        records={records}
        loading={loading}
        onAddNew={() => setIsModalOpen(true)}
        onDelete={handleDelete}
      />

      <RenewableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        facilities={facilities}
        onSave={handleSave}
      />
    </div>
  );
}
