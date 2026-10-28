import React, { useEffect, useState } from 'react';
import { billingService } from './billingService';
import { facilityService } from '../facilities/facilityService';
import BillingList from './BillingList';
import BillModal from './BillModal';
import { Header } from '../../components/layout';
import { Select } from '../../components/common';

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facilityFilter, setFacilityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [billsData, facilitiesData] = await Promise.all([
        billingService.getBills({
          facility: facilityFilter || undefined,
          status: statusFilter || undefined,
        }),
        facilityService.getFacilities(),
      ]);
      setBills(billsData);
      setFacilities(facilitiesData);
    } catch (err) {
      console.error('Failed to load bills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [facilityFilter, statusFilter]);

  const handleOpenCreate = () => {
    setSelectedBill(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setSelectedBill(b);
    setIsModalOpen(true);
  };

  const handleDelete = async (b) => {
    if (window.confirm(`Are you sure you want to delete the bill for ${b.provider}?`)) {
      try {
        await billingService.deleteBill(b.id);
        loadData();
      } catch (err) {
        alert('Failed to delete bill.');
      }
    }
  };

  const handleStatusChange = async (b, newStatus) => {
    try {
      await billingService.updateBill(b.id, { status: newStatus });
      loadData();
    } catch (err) {
      alert('Failed to update bill status.');
    }
  };

  const handleSave = async (formData) => {
    if (selectedBill) {
      await billingService.updateBill(selectedBill.id, formData);
    } else {
      await billingService.createBill(formData);
    }
    loadData();
  };

  return (
    <div>
      <Header
        title="Utility Billing & Energy Tariffs"
        subtitle="Manage electricity invoices, tariff structures, and utility statement tracking."
      />

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="w-full sm:w-60">
          <Select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            options={facilities.map((f) => ({ value: f.id, label: f.name }))}
            placeholder="All Facilities"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' },
              { value: 'overdue', label: 'Overdue' },
            ]}
            placeholder="All Statuses"
          />
        </div>
      </div>

      <BillingList
        bills={bills}
        loading={loading}
        onAddNew={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <BillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        facilities={facilities}
        bill={selectedBill}
        onSave={handleSave}
      />
    </div>
  );
}
