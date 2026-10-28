import React, { useEffect, useState } from 'react';
import { alertService } from './alertService';
import { facilityService } from '../facilities/facilityService';
import { meterService } from '../meters/meterService';
import AlertList from './AlertList';
import ThresholdList from './ThresholdList';
import ThresholdModal from './ThresholdModal';
import { Header } from '../../components/layout';
import { Select } from '../../components/common';
import { ALERT_SEVERITIES } from '../../constants';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [thresholds, setThresholds] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [alertsData, thresholdsData, facilitiesData, metersData] = await Promise.all([
        alertService.getAlerts({
          status: statusFilter || undefined,
          severity: severityFilter || undefined,
        }),
        alertService.getThresholds(),
        facilityService.getFacilities(),
        meterService.getMeters(),
      ]);
      setAlerts(alertsData);
      setThresholds(thresholdsData);
      setFacilities(facilitiesData);
      setMeters(metersData);
    } catch (err) {
      console.error('Failed to load alerts data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, severityFilter]);

  const handleAcknowledge = async (id) => {
    try {
      await alertService.acknowledgeAlert(id);
      loadData();
    } catch (err) {
      alert('Failed to acknowledge alert.');
    }
  };

  const handleResolve = async (id) => {
    try {
      await alertService.resolveAlert(id);
      loadData();
    } catch (err) {
      alert('Failed to resolve alert.');
    }
  };

  const handleSaveThreshold = async (formData) => {
    await alertService.createThreshold(formData);
    loadData();
  };

  return (
    <div>
      <Header
        title="Alerts & Threshold Protection"
        subtitle="Real-time incident response, automated threshold triggers, and alert mitigation."
      />

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'new', label: 'New Alerts' },
              { value: 'acknowledged', label: 'Acknowledged' },
              { value: 'resolved', label: 'Resolved' },
            ]}
            placeholder="All Alert Statuses"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            options={ALERT_SEVERITIES}
            placeholder="All Severities"
          />
        </div>
      </div>

      <div className="space-y-6">
        <AlertList
          alerts={alerts}
          loading={loading}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
        />

        <ThresholdList
          thresholds={thresholds}
          loading={loading}
          onAddNew={() => setIsModalOpen(true)}
        />
      </div>

      <ThresholdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        facilities={facilities}
        meters={meters}
        onSave={handleSaveThreshold}
      />
    </div>
  );
}
