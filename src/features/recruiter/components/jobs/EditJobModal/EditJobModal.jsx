import React, { useState, useEffect } from 'react';
import { jobService } from '../../../services/jobService';
import './EditJobModal.css';

const EditJobModal = ({ isOpen, onClose, job, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salaryRange: '',
    experience: '',
    deadline: '',
    categoryId: '',
    typeId: '',
    positionId: '',
    postAt: '',
    skills: []
  });

  const [formOptions, setFormOptions] = useState({
    categories: [],
    types: [],
    positions: [],
    skills: []
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Khởi tạo form data từ job được truyền vào
  useEffect(() => {
    if (isOpen && job) {
      // Format deadline for the date input (YYYY-MM-DD)
      let formattedDeadline = '';
      if (job.deadline) {
        const deadlineDate = new Date(job.deadline);
        formattedDeadline = deadlineDate.toISOString().split('T')[0];
      }
      
      // Map job data to form fields
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        salaryRange: job.salaryRange || '',
        experience: job.experience || '',
        deadline: formattedDeadline,
        postAt: job.postAt || '',
        
        // Handle nested objects or direct IDs
        categoryId: job.category?.id || job.categoryId || '',
        typeId: job.type?.id || job.typeId || '',
        positionId: job.position?.id || job.positionId || '',
        
        // Handle skills array
        skills: Array.isArray(job.skills) 
          ? job.skills.map(skill => typeof skill === 'object' ? skill.id : skill)
          : []
      });
      
      // Reset error states
      setErrors({});
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, job]);

  // Load form options when modal opens
  useEffect(() => {
    if (isOpen) {
      loadFormOptions();
    }
  }, [isOpen]);

  const loadFormOptions = async () => {
    try {
      const options = await jobService.getJobFormOptions();
      setFormOptions({
        categories: Array.isArray(options.categories) ? options.categories : [],
        types: Array.isArray(options.types) ? options.types : [],
        positions: Array.isArray(options.positions) ? options.positions : [],
        skills: Array.isArray(options.skills) ? options.skills : []
      });
    } catch (error) {
      console.error('Failed to load form options:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSkillChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      option => parseInt(option.value)
    );
    
    setFormData(prev => ({
      ...prev,
      skills: selectedOptions
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Job location is required';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Application deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a job category';
    }
    
    if (!formData.typeId) {
      newErrors.typeId = 'Please select a job type';
    }
    
    if (!formData.positionId) {
      newErrors.positionId = 'Please select a job position';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setErrorMessage('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Prepare data for API
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salaryRange: formData.salaryRange,
        experience: formData.experience,
        deadline: formData.deadline,
        postAt: formData.postAt,
        
        // Format category, type, position as objects with IDs
        category: { id: parseInt(formData.categoryId) },
        type: { id: parseInt(formData.typeId) },
        position: { id: parseInt(formData.positionId) },
        
        // Format skills as array of objects with IDs
        skills: formData.skills.map(skillId => ({ id: parseInt(skillId) }))
      };
      
      await jobService.editJob(job.id, jobData);
      
      setSuccessMessage('Job updated successfully!');
      
      // Notify parent component about the successful update
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(job.id);
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to update job:', error);
      
      // Handle validation errors from API
      if (error.validationErrors) {
        setErrors(error.validationErrors);
      }
      
      setErrorMessage(error.message || 'Failed to update job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-job-modal-overlay">
      <div className="modal-container edit-job-modal">
        <div className="modal-header">
          <h2>Edit Job</h2>
          <button className="close-button" onClick={onClose} disabled={loading}>×</button>
        </div>

        {errorMessage && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span className="alert-message">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            <span className="alert-message">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-job-form">
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Job Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? 'error' : ''}
                disabled={loading}
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                className={errors.description ? 'error' : ''}
                disabled={loading}
              ></textarea>
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location*</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={errors.location ? 'error' : ''}
                  disabled={loading}
                />
                {errors.location && <div className="error-message">{errors.location}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="deadline">Application Deadline*</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className={errors.deadline ? 'error' : ''}
                  disabled={loading}
                />
                {errors.deadline && <div className="error-message">{errors.deadline}</div>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Job Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salaryRange">Salary Range</label>
                <input
                  type="text"
                  id="salaryRange"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleInputChange}
                  placeholder="e.g. $50,000 - $70,000"
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="experience">Experience Required</label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g. 2+ years"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoryId">Job Category*</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={errors.categoryId ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {formOptions.categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="typeId">Employment Type*</label>
                <select
                  id="typeId"
                  name="typeId"
                  value={formData.typeId}
                  onChange={handleInputChange}
                  className={errors.typeId ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Select Type</option>
                  {formOptions.types.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                {errors.typeId && <div className="error-message">{errors.typeId}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="positionId">Position Level*</label>
                <select
                  id="positionId"
                  name="positionId"
                  value={formData.positionId}
                  onChange={handleInputChange}
                  className={errors.positionId ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Select Position</option>
                  {formOptions.positions.map(position => (
                    <option key={position.id} value={position.id}>{position.name}</option>
                  ))}
                </select>
                {errors.positionId && <div className="error-message">{errors.positionId}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="skills">Required Skills</label>
              <select
                id="skills"
                name="skills"
                multiple
                value={formData.skills}
                onChange={handleSkillChange}
                disabled={loading}
              >
                {formOptions.skills.map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </select>
              <div className="form-help">Hold Ctrl (or Cmd) to select multiple skills</div>
            </div>
          </div>
          
          {/* <div className="form-section">
            <h3 className="section-title">Posting Options</h3>
            
            <div className="form-group radio-group">
              <label className="radio-group-label">Post Type</label>
              <div className="radio-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="postAt"
                    value="standard"
                    checked={formData.postAt === 'standard'}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <div className="radio-content">
                    <span className="radio-title">Standard</span>
                    <span className="radio-description">Regular job listing</span>
                  </div>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="postAt"
                    value="featured"
                    checked={formData.postAt === 'featured'}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <div className="radio-content">
                    <span className="radio-title">Featured</span>
                    <span className="radio-description">Priority placement in search results</span>
                  </div>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="postAt"
                    value="premium"
                    checked={formData.postAt === 'premium'}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <div className="radio-content">
                    <span className="radio-title">Premium</span>
                    <span className="radio-description">Highlighted listing with top placement</span>
                  </div>
                </label>
              </div>
            </div>
          </div> */}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;