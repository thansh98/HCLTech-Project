import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../../components/common';
import { FACILITY_CATEGORIES } from '../../constants';
import { extractErrorMessage } from '../../utils/formatters';

export default function FacilityModal({ isOpen, onClose, facility, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('commercial');
  const [status, setStatus] = useState('active');
  const [locationDescription, setLocationDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (facility) {
      setName(facility.name || '');
      setCategory(facility.category || 'commercial');
      setStatus(facility.status || 'active');
      setLocationDescription(facility.location_description || '');
    } else {
      setName('');
      setCategory('commercial');
      setStatus('active');
      setLocationDescription('');
    }
    setError('');
  }, [facility, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Facility name is required.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSave({
        name: name.trim(),
        category,
        status,
        location_description: locationDescription.trim(),
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
      title={facility ? 'Edit Facility' : 'Register New Facility'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-brand-critical/15 border border-brand-critical/30 text-brand-critical px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        <Input
          label="Facility Name"
          placeholder="e.g. HQ Technology Campus"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={FACILITY_CATEGORIES}
            required
          />

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'maintenance', label: 'Maintenance' },
            ]}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Location Description
          </label>
          <textarea
            rows={3}
            placeholder="Address, Sector, or campus building coordinates"
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-brand-border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-brand-borderSubtle">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {facility ? 'Save Changes' : 'Create Facility'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
