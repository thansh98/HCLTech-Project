import React, { useEffect, useState } from 'react';
import { reportService } from './reportService';
import { facilityService } from '../facilities/facilityService';
import ReportControls from './ReportControls';
import { Header } from '../../components/layout';
import { Card, Select } from '../../components/common';
import { formatNumber, formatCurrency } from '../../utils/formatters';

export default function ReportsPage() {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    facilityService.getFacilities().then(setFacilities).catch(console.error);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadReport = async () => {
      setLoading(true);
      try {
        const res = await reportService.getExecutiveSummary(selectedFacility || null);
        if (isMounted) setSummaryData(res.summary);
      } catch (err) {
        console.error('Failed to load summary report:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadReport();
    return () => {
      isMounted = false;
    };
  }, [selectedFacility]);

  return (
    <div>
      <Header
        title="Reports & Compliance Data"
        subtitle="Export telemetry data feeds for ESG reporting, utility billing audits, and regulatory filings."
      />

      <div className="w-full sm:w-64 mb-6">
        <Select
          value={selectedFacility}
          onChange={(e) => setSelectedFacility(e.target.value)}
          options={facilities.map((f) => ({ value: f.id, label: f.name }))}
          placeholder="All Facilities"
        />
      </div>

      <div className="space-y-6">
        <ReportControls selectedFacility={selectedFacility} />

        <Card
          title="Executive Performance Summary"
          subtitle="Instant metrics summary for ESG and sustainability stakeholder reviews"
        >
          {loading ? (
            <div className="py-6 text-center text-slate-400 text-xs animate-pulse">
              Compiling summary report...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-2">
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-brand-borderSubtle transition-colors duration-200">
                <span className="text-xs text-slate-400 block font-medium">Clean Energy Ratio</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                  {summaryData?.renewable_percentage || 0}%
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {formatNumber(summaryData?.total_renewable_kwh)} kWh total
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-brand-borderSubtle transition-colors duration-200">
                <span className="text-xs text-slate-400 block font-medium">Total Power Drawn</span>
                <span className="text-2xl font-bold text-cyan-400 mt-1 block">
                  {formatNumber(summaryData?.total_consumption_kwh)} kWh
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  From active meters
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-brand-borderSubtle transition-colors duration-200">
                <span className="text-xs text-slate-400 block font-medium">Utility Invoicing</span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">
                  {formatCurrency(summaryData?.total_cost || 0)}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Billed utility amount
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-brand-borderSubtle transition-colors duration-200">
                <span className="text-xs text-slate-400 block font-medium">Open Incidents</span>
                <span className="text-2xl font-bold text-red-400 mt-1 block">
                  {summaryData?.active_alerts || 0}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Active threshold breaches
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
