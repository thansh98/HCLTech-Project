import React, { useEffect, useState } from 'react';
import { facilityService } from './facilityService';
import FacilityList from './FacilityList';
import FacilityModal from './FacilityModal';
import { Header } from '../../components/layout';
import { SearchBar, Select } from '../../components/common';
import { FACILITY_CATEGORIES } from '../../constants';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const data = await facilityService.getFacilities({
        search: search || undefined,
        category: categoryFilter || undefined,
      });
      setFacilities(data);
    } catch (err) {
      console.error('Failed to load facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [categoryFilter]);

  const handleSearch = () => {
    fetchFacilities();
  };

  const handleOpenCreate = () => {
    setSelectedFacility(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fac) => {
    setSelectedFacility(fac);
    setIsModalOpen(true);
  };

  const handleDelete = async (fac) => {
    if (window.confirm(`Are you sure you want to delete ${fac.name}?`)) {
      try {
        await facilityService.deleteFacility(fac.id);
        fetchFacilities();
      } catch (err) {
        alert('Failed to delete facility.');
      }
    }
  };

  const handleSave = async (formData) => {
    if (selectedFacility) {
      await facilityService.updateFacility(selectedFacility.id, formData);
    } else {
      await facilityService.createFacility(formData);
    }
    fetchFacilities();
  };

  return (
    <div>
      <Header
        title="Facilities Management"
        subtitle="Manage locations, enterprise buildings, and renewable power infrastructure."
      />

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="w-full sm:w-72">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
            placeholder="Search facilities..."
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={FACILITY_CATEGORIES}
            placeholder="All Categories"
          />
        </div>
      </div>

      <FacilityList
        facilities={facilities}
        loading={loading}
        onAddNew={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <FacilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        facility={selectedFacility}
        onSave={handleSave}
      />
    </div>
  );
}
