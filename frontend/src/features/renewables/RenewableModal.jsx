import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../../components/common';
import { RENEWABLE_SOURCES } from '../../constants';
import { extractErrorMessage } from '../../utils/formatters';

export default function RenewableModal({ isOpen, onClose, facilities = [], onSave }) {
  const [facilityId, setFacilityId] = useState('');
  const [sourceType, setSourceType] = useState('solar');
  const [recordTime, setRecordTime] = useState('');
  const [generatedEnergy, setGeneratedEnergy] = useState('');
  const [unit, setUnit] = useState('kWh');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFacilityId(facilities.length > 0 ? facilities[0].id : '');
      setSourceType('solar');
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
      setRecordTime(localISOTime);
      setGeneratedEnergy('');
      setUnit('kWh');
      setError('');
    }
  }, [isOpen, facilities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!facilityId) {
      setError('Please select a facility.');
      return;
    }
    if (!generatedEnergy || isNaN(generatedEnergy)) {
      setError('Please enter a valid numeric generated energy value.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSave({
        facility: Number(facilityId),
        source_type: sourceType,
        record_time: new Date(recordTime).toISOString(),
        generated_energy: String(generatedEnergy),
        unit,
      });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Renewable Energy Generation">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-brand-critical/15 border border-brand-critical/30 text-brand-critical px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        <Select
          label="Facility"
          value={facilityId}
          onChange={(e) => setFacilityId(e.target.value)}
          options={facilities.map((f) => ({ value: f.id, label: f.name }))}
          required
        />

        <Select
          label="Renewable Source"
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          options={RENEWABLE_SOURCES}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Generated Energy"
            type="number"
            step="0.01"
            placeholder="e.g. 850.00"
            value={generatedEnergy}
            onChange={(e) => setGeneratedEnergy(e.target.value)}
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
          label="Generation Timestamp"
          type="datetime-local"
          value={recordTime}
          onChange={(e) => setRecordTime(e.target.value)}
          required
        />

        <div className="flex justify-end space-x-3 pt-3 border-t border-brand-borderSubtle">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Record Generation
          </Button>
        </div>
      </form>
    </Modal>
  );
}
