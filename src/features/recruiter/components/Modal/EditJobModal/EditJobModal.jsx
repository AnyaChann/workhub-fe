import React, { useState } from 'react';
import { jobService } from '../../../services/jobService';
import JobForm from '../../forms/JobForm/JobForm';
import './EditJobModal.css';

const EditJobModal = ({ isOpen, onClose, job, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('📤 EditJobModal: Submitting job update:', formData);
      
      // Prepare data for API
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salaryRange: formData.salaryRange,
        experience: formData.experience,
        deadline: formData.deadline,
        
        // Send string values for API compatibility
        category: formData.category,
        type: formData.type,
        position: formData.position,
        skills: formData.skillNames || formData.skills?.map(s => s.name) || []
      };
      
      await jobService.editJob(job.id, jobData);
      
      setSuccessMessage('Job updated successfully!');
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(job.id);
        }
      }, 1500);
      
    } catch (error) {
      console.error('❌ EditJobModal: Failed to update job:', error);
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

  return (
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
    </div>
  );
};

export default EditJobModal;