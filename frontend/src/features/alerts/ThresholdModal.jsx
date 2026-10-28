import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../../components/common';
import { ALERT_SEVERITIES } from '../../constants';
import { extractErrorMessage } from '../../utils/formatters';

export default function ThresholdModal({ isOpen, onClose, facilities = [], meters = [], onSave }) {
  const [facilityId, setFacilityId] = useState('');
  const [meterId, setMeterId] = useState('');
  const [metric, setMetric] = useState('consumption');
  const [operator, setOperator] = useState('gt');
  const [value, setValue] = useState('');
  const [severity, setSeverity] = useState('warning');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFacilityId(facilities.length > 0 ? facilities[0].id : '');
      setMeterId('');
      setMetric('consumption');
      setOperator('gt');
      setValue('');
      setSeverity('warning');
      setError('');
    }
  }, [isOpen, facilities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value || isNaN(value)) {
      setError('Please provide a valid numeric threshold trigger value.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSave({
        facility: facilityId ? Number(facilityId) : null,
        meter: meterId ? Number(meterId) : null,
        metric,
        operator,
        value: String(value),
        severity,
        active: true,
      });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Consumption Threshold Rule">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-brand-critical/15 border border-brand-critical/30 text-brand-critical px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Facility Scope"
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
            options={facilities.map((f) => ({ value: f.id, label: f.name }))}
            placeholder="Entire Facility"
          />

          <Select
            label="Specific Meter (Optional)"
            value={meterId}
            onChange={(e) => setMeterId(e.target.value)}
            options={meters
              .filter((m) => !facilityId || String(m.facility) === String(facilityId) || String(m.facility_details?.id) === String(facilityId))
              .map((m) => ({ value: m.id, label: m.meter_code }))}
            placeholder="All Facility Meters"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Metric"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            options={[
              { value: 'consumption', label: 'Energy Consumption (kWh)' },
              { value: 'cost', label: 'Cost Amount ($)' },
              { value: 'demand', label: 'Peak Demand' },
            ]}
            required
          />

          <Select
            label="Condition"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            options={[
              { value: 'gt', label: 'Greater Than (>)' },
              { value: 'gte', label: 'Greater or Equal (>=)' },
              { value: 'lt', label: 'Less Than (<)' },
            ]}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Trigger Value"
            type="number"
            step="0.01"
            placeholder="e.g. 2000.00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />

          <Select
            label="Severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            options={ALERT_SEVERITIES}
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-brand-borderSubtle">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Save Rule
          </Button>
        </div>
      </form>
    </Modal>
  );
}
