import React from 'react';
import { useJobTypes } from '../../../../../../../hooks/useJobTypes';
import './JobTypeSection.css';

const JobTypeSection = ({ 
  type_id, 
  onChange, 
  errors 
}) => {
  const { jobTypes, loading, error } = useJobTypes();

  if (loading) {
    return (
      <div className="job-type-section">
        <div className="loading-state">
          <span>Loading job types...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="job-type-section">
      <div className="form-group">
        <label className="form-label">
          Employment Type <span className="required">*</span>
        </label>
        <select
          name="type_id"
          value={type_id}
          onChange={onChange}
          className={`form-select ${errors.type_id ? 'error' : ''}`}
          disabled={loading}
        >
          <option value="">Select employment type</option>
          {jobTypes.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {errors.type_id && <span className="error-message">{errors.type_id}</span>}
        <small className="field-help">
          Choose the type of employment (Full-time, Part-time, Contract, etc.)
        </small>
      </div>

      {error && (
        <div className="api-error-notice">
          <small>⚠️ Using cached job types (API temporarily unavailable)</small>
        </div>
      )}
    </div>
  );
};

export default JobTypeSection;