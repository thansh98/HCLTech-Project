import React, { useEffect, useState } from 'react';
import { readingService } from './readingService';
import { meterService } from '../meters/meterService';
import { facilityService } from '../facilities/facilityService';
import ReadingList from './ReadingList';
import ReadingModal from './ReadingModal';
import CSVUploadModal from './CSVUploadModal';
import { Header } from '../../components/layout';
import { Select } from '../../components/common';

export default function ReadingsPage() {
  const [readings, setReadings] = useState([]);
  const [meters, setMeters] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facilityFilter, setFacilityFilter] = useState('');
  const [meterFilter, setMeterFilter] = useState('');
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [readingsData, metersData, facilitiesData] = await Promise.all([
        readingService.getReadings({
          facility: facilityFilter || undefined,
          meter: meterFilter || undefined,
        }),
        meterService.getMeters(),
        facilityService.getFacilities(),
      ]);
      setReadings(readingsData);
      setMeters(metersData);
      setFacilities(facilitiesData);
    } catch (err) {
      console.error('Failed to load readings data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [facilityFilter, meterFilter]);

  const handleSaveReading = async (formData) => {
    await readingService.addReading(formData);
    loadData();
  };

  return (
    <div>
      <Header
        title="Meter Readings & Telemetry"
        subtitle="Live consumption data streams, smart grid uploads, and historical telemetry logs."
      />

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="w-full sm:w-60">
          <Select
            value={facilityFilter}
            onChange={(e) => {
              setFacilityFilter(e.target.value);
              setMeterFilter('');
            }}
            options={facilities.map((f) => ({ value: f.id, label: f.name }))}
            placeholder="All Facilities"
          />
        </div>
        <div className="w-full sm:w-60">
          <Select
            value={meterFilter}
            onChange={(e) => setMeterFilter(e.target.value)}
            options={meters
              .filter((m) => !facilityFilter || String(m.facility) === String(facilityFilter) || String(m.facility_details?.id) === String(facilityFilter))
              .map((m) => ({ value: m.id, label: `${m.meter_code} (${m.energy_type})` }))}
            placeholder="All Meters"
          />
        </div>
      </div>

      <ReadingList
        readings={readings}
        loading={loading}
        onAddNew={() => setIsReadingModalOpen(true)}
        onUploadCSV={() => setIsCSVModalOpen(true)}
      />

      <ReadingModal
        isOpen={isReadingModalOpen}
        onClose={() => setIsReadingModalOpen(false)}
        meters={meters}
        onSave={handleSaveReading}
      />

      <CSVUploadModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onUploadSuccess={loadData}
      />
    </div>
  );
}
