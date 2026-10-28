import React, { useState } from 'react';
import { Modal, Button } from '../../components/common';
import { readingService } from './readingService';
import { extractErrorMessage } from '../../utils/formatters';

export default function CSVUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resultMsg, setResultMsg] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setResultMsg('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CSV file to upload.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await readingService.uploadCSV(file);
      setResultMsg(res.message || 'File uploaded successfully.');
      setTimeout(() => {
        onUploadSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Energy Readings (CSV)">
      <form onSubmit={handleUpload} className="space-y-4">
        {error && (
          <div className="bg-brand-critical/15 border border-brand-critical/30 text-brand-critical px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        {resultMsg && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3 py-2 rounded-lg text-xs">
            {resultMsg}
          </div>
        )}

        <div className="border-2 border-dashed border-brand-border rounded-xl p-6 text-center hover:border-brand-primary/50 transition-colors">
          <input
            type="file"
            accept=".csv"
            id="csv-upload"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
            <svg className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-xs font-semibold text-brand-primary">
              {file ? file.name : 'Click to select CSV file'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Expected columns: Meter Code, Reading Time, Value, Unit</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-brand-borderSubtle">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting} disabled={!file}>
            Upload & Process
          </Button>
        </div>
      </form>
    </Modal>
  );
}
