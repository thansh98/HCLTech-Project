import React, { useState, useEffect } from 'react';
import { Modal, Select, Button } from '../../components/common';
import { extractErrorMessage } from '../../utils/formatters';

export default function UserRoleModal({ isOpen, onClose, user, onSave }) {
  const [role, setRole] = useState('viewer');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setRole(user.role || 'viewer');
      setError('');
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await onSave(user.id, role);
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Role for ${user?.username || 'User'}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-brand-critical/15 border border-brand-critical/30 text-brand-critical px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        <Select
          label="Select System Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { value: 'viewer', label: 'Viewer / Operator (Read-Only)' },
            { value: 'manager', label: 'Facility Manager (Operational Access)' },
            ...(user?.role === 'admin' || user?.is_superuser ? [{ value: 'admin', label: 'System Administrator (Full Control)' }] : []),
          ]}
          required
        />

        <div className="flex justify-end space-x-3 pt-3 border-t border-brand-borderSubtle">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Apply Role Change
          </Button>
        </div>
      </form>
    </Modal>
  );
}
