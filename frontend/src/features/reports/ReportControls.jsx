import React, { useState } from 'react';
import { Card, Button } from '../../components/common';
import { reportService } from './reportService';
import { extractErrorMessage } from '../../utils/formatters';

export default function ReportControls({ selectedFacility }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    setDownloading(true);
    setError('');
    try {
      const data = await reportService.exportReadingsCSV({
        facility: selectedFacility || undefined,
      });

      const url = window.URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `energy_readings_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(extractErrorMessage(err) || 'Failed to export CSV report.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card
      title="Data Export & Reporting Center"
      subtitle="Generate audit-ready CSV raw telemetry and operational summaries"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Energy Reading Telemetry History (CSV)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg">
            Includes meter codes, facility IDs, reading timestamps, numeric values, units, and verification sources.
          </p>
          {error && <p className="text-xs text-brand-critical mt-2">{error}</p>}
        </div>

        <Button
          onClick={handleExport}
          loading={downloading}
          variant="secondary"
          size="md"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV Telemetry
        </Button>
      </div>
    </Card>
  );
}
