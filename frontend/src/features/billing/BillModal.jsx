import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../../components/common';
import { extractErrorMessage } from '../../utils/formatters';

export default function BillModal({ isOpen, onClose, facilities = [], onSave, bill }) {
  const [facilityId, setFacilityId] = useState('');
  const [provider, setProvider] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [units, setUnits] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bill) {
      setFacilityId(bill.facility || '');
      setProvider(bill.provider || '');
      setPeriodStart(bill.period_start || '');
      setPeriodEnd(bill.period_end || '');
      setUnits(bill.units || '');
      setAmount(bill.amount || '');
      setDueDate(bill.due_date || '');
      setStatus(bill.status || 'pending');
    } else {
      setFacilityId(facilities.length > 0 ? facilities[0].id : '');
      setProvider('');
      const today = new Date().toISOString().slice(0, 10);
      setPeriodStart(today);
      setPeriodEnd(today);
      setUnits('');
      setAmount('');
      setDueDate(today);
      setStatus('pending');
    }
    setError('');
  }, [bill, facilities, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!facilityId || !provider.trim() || !amount) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSave({
        facility: Number(facilityId),
        provider: provider.trim(),
        period_start: periodStart,
        period_end: periodEnd,
        units: String(units || '0'),
        amount: String(amount),
        due_date: dueDate,
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
      title={bill ? 'Edit Utility Bill' : 'Record Utility Bill'}
    >
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

        <Input
          label="Utility Provider"
          placeholder="e.g. Pacific Clean Energy Co."
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Period Start"
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            required
          />
          <Input
            label="Period End"
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Total Units (kWh)"
            type="number"
            step="0.01"
            placeholder="e.g. 50000"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          />
          <Input
            label="Billed Amount ($)"
            type="number"
            step="0.01"
            placeholder="e.g. 7500.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' },
              { value: 'overdue', label: 'Overdue' },
            ]}
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-brand-borderSubtle">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {bill ? 'Save Changes' : 'Record Bill'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
