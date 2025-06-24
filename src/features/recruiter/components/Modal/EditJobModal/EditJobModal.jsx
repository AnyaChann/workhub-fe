import React, { useState } from 'react';
import { jobService } from '../../../services/jobService';
import JobForm from '../../forms/JobForm/JobForm';
import { prepareJobDataForAPI } from '../../../utils/jobDataUtils';
import './EditJobModal.css';
import ReactDOM from 'react-dom';

const EditJobModal = ({ isOpen, onClose, job, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('📤 EditJobModal: Raw form data received:', formData);
      console.log('📤 Original job data:', job);
      
      // Pass original job data to preserve backend structure
      const jobData = prepareJobDataForAPI(formData, job);
      
      console.log('📤 Prepared job data:', jobData);

      await jobService.editJob(job.id, jobData);

      setSuccessMessage('Job updated successfully!');

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(job.id);
        }
      }, 1500);

    } catch (error) {
      console.error('❌ EditJobModal: Failed to update job:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.message || 'Failed to update job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;
  
  return ReactDOM.createPortal(
    <div className="edit-job-modal-overlay">
      <div className="modal-container edit-job-modal">
        <div className="modal-header">
          <h2>Edit Job</h2>
          <button
            className="close-button"
            onClick={handleCancel}
            disabled={loading}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span className="alert-message">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            <span className="alert-message">{successMessage}</span>
          </div>
        )}

        <JobForm
          initialData={job}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={loading}
          submitError={error}
          mode="edit"
          showPackageInfo={false}
          showPostTypes={false}
        />
      </div>
    </div>,
    document.body
  );
};

export default EditJobModal;