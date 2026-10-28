import React, { useEffect, useState } from 'react';
import { meterService } from './meterService';
import { facilityService } from '../facilities/facilityService';
import MeterList from './MeterList';
import MeterModal from './MeterModal';
import { Header } from '../../components/layout';
import { SearchBar, Select } from '../../components/common';
import { ENERGY_TYPES } from '../../constants';

export default function MetersPage() {
  const [meters, setMeters] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('');
  const [energyTypeFilter, setEnergyTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [metersData, facilitiesData] = await Promise.all([
        meterService.getMeters({
          search: search || undefined,
          facility: facilityFilter || undefined,
          energy_type: energyTypeFilter || undefined,
        }),
        facilityService.getFacilities(),
      ]);
      setMeters(metersData);
      setFacilities(facilitiesData);
    } catch (err) {
      console.error('Failed to load meters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [facilityFilter, energyTypeFilter]);

  const handleSearch = () => {
    loadData();
  };

  const handleOpenCreate = () => {
    setSelectedMeter(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setSelectedMeter(m);
    setIsModalOpen(true);
  };

  const handleDelete = async (m) => {
    if (window.confirm(`Are you sure you want to delete meter ${m.meter_code}?`)) {
      try {
        await meterService.deleteMeter(m.id);
        loadData();
      } catch (err) {
        alert('Failed to delete meter.');
      }
    }
  };

  const handleSave = async (formData) => {
    if (selectedMeter) {
      await meterService.updateMeter(selectedMeter.id, formData);
    } else {
      await meterService.createMeter(formData);
    }
    loadData();
  };

  return (
    <div>
      <Header
        title="Smart Meters"
        subtitle="Manage IoT grid meters, telemetry units, and energy data sources."
      />

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="w-full sm:w-72">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
            placeholder="Search meter code..."
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            options={facilities.map((f) => ({ value: f.id, label: f.name }))}
            placeholder="All Facilities"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={energyTypeFilter}
            onChange={(e) => setEnergyTypeFilter(e.target.value)}
            options={ENERGY_TYPES}
            placeholder="All Energy Types"
          />
        </div>
      </div>

      <MeterList
        meters={meters}
        loading={loading}
        onAddNew={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <MeterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        meter={selectedMeter}
        facilities={facilities}
        onSave={handleSave}
      />
    </div>
  );
}
