import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../../components/common';
import { ENERGY_TYPES } from '../../constants';
import { extractErrorMessage } from '../../utils/formatters';

export default function MeterModal({ isOpen, onClose, meter, facilities = [], onSave }) {
  const [meterCode, setMeterCode] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [energyType, setEnergyType] = useState('electricity');
  const [unit, setUnit] = useState('kWh');
  const [status, setStatus] = useState('active');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (meter) {
      setMeterCode(meter.meter_code || '');
      setFacilityId(meter.facility || meter.facility_details?.id || '');
      setEnergyType(meter.energy_type || 'electricity');
      setUnit(meter.unit || 'kWh');
      setStatus(meter.status || 'active');
    } else {
      setMeterCode('');
      setFacilityId(facilities.length > 0 ? facilities[0].id : '');
      setEnergyType('electricity');
      setUnit('kWh');
      setStatus('active');
    }
    setError('');
  }, [meter, facilities, isOpen]);

  const handleEnergyTypeChange = (typeVal) => {
    setEnergyType(typeVal);
    const match = ENERGY_TYPES.find((t) => t.value === typeVal);
    if (match) setUnit(match.unit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!meterCode.trim()) {
      setError('Meter code is required.');
      return;
    }
    if (!facilityId) {
      setError('Please select a facility.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSave({
        meter_code: meterCode.trim(),
        facility: Number(facilityId),
        energy_type: energyType,
        unit,
        status,
      });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={meter ? 'Edit Smart Meter' : 'Register New Meter'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-brand-critical/15 border border-brand-critical/30 text-brand-critical px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        <Input
          label="Meter Code"
          placeholder="e.g. MTR-MAIN-001"
          value={meterCode}
          onChange={(e) => setMeterCode(e.target.value)}
          required
        />

        <Select
          label="Assigned Facility"
          value={facilityId}
          onChange={(e) => setFacilityId(e.target.value)}
          options={facilities.map((f) => ({ value: f.id, label: f.name }))}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Energy Type"
            value={energyType}
            onChange={(e) => handleEnergyTypeChange(e.target.value)}
            options={ENERGY_TYPES}
            required
          />

          <Input
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>

        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'error', label: 'Error State' },
          ]}
          required
        />

        <div className="flex justify-end space-x-3 pt-3 border-t border-brand-borderSubtle">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {meter ? 'Save Changes' : 'Register Meter'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
