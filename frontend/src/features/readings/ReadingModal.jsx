import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../../components/common';
import { extractErrorMessage } from '../../utils/formatters';

export default function ReadingModal({ isOpen, onClose, meters = [], onSave }) {
  const [meterId, setMeterId] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('kWh');
  const [source, setSource] = useState('manual');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMeterId(meters.length > 0 ? meters[0].id : '');
      const now = new Date();
      // Format to datetime-local string (YYYY-MM-DDTHH:MM)
      const offset = now.getTimezoneOffset() * 60000;
      const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
      setReadingTime(localISOTime);
      setValue('');
      setSource('manual');
      if (meters.length > 0) setUnit(meters[0].unit || 'kWh');
      setError('');
    }
  }, [isOpen, meters]);

  const handleMeterChange = (id) => {
    setMeterId(id);
    const m = meters.find((item) => String(item.id) === String(id));
    if (m) setUnit(m.unit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!meterId) {
      setError('Please select a meter.');
      return;
    }
    if (!value || isNaN(value)) {
      setError('Please enter a valid numeric reading value.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSave({
        meter: Number(meterId),
        reading_time: new Date(readingTime).toISOString(),
        value: String(value),
        unit,
        source,
      });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Energy Reading">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-brand-critical/15 border border-brand-critical/30 text-brand-critical px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        <Select
          label="Smart Meter"
          value={meterId}
          onChange={(e) => handleMeterChange(e.target.value)}
          options={meters.map((m) => ({
            value: m.id,
            label: `${m.meter_code} (${m.energy_type} - ${m.facility_details?.name || m.facility})`,
          }))}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Reading Value"
            type="number"
            step="0.01"
            placeholder="e.g. 1450.50"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />

          <Input
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>

        <Input
          label="Timestamp"
          type="datetime-local"
          value={readingTime}
          onChange={(e) => setReadingTime(e.target.value)}
          required
        />

        <Select
          label="Data Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          options={[
            { value: 'manual', label: 'Manual Entry' },
            { value: 'smart_meter', label: 'Smart Meter Telemetry' },
            { value: 'csv_import', label: 'Batch Import' },
          ]}
          required
        />

        <div className="flex justify-end space-x-3 pt-3 border-t border-brand-borderSubtle">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Save Reading
          </Button>
        </div>
      </form>
    </Modal>
  );
}
