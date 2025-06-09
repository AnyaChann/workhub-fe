import React, { useState } from 'react';
import './CreateJob.css';
import RichTextEditor from './RichTextEditor/RichTextEditor';

const CreateJob = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    showCompanyNameAndLogo: true,
    jobTitle: '',
    jobLocation: '',
    jobDescription: '',
    jobType: '',
    contractType: '',
    category: '',
    occupation: '',
    payType: 'annual-salary',
    minSalary: '',
    maxSalary: '',
    displayPayRange: true,
    payDescription: '',
    referenceNumber: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({
      ...prev,
      jobDescription: content
    }));
    
    if (errors.jobDescription) {
      setErrors(prev => ({
        ...prev,
        jobDescription: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    
    if (!formData.jobLocation.trim()) {
      newErrors.jobLocation = 'Job location is required';
    }
    
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    }
    
    if (!formData.jobType) {
      newErrors.jobType = 'Job type is required';
    }
    
    if (!formData.contractType) {
      newErrors.contractType = 'Contract type is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.occupation) {
      newErrors.occupation = 'Occupation is required';
    }
    
    // Validate salary range if provided
    if (formData.minSalary && formData.maxSalary) {
      const min = parseFloat(formData.minSalary);
      const max = parseFloat(formData.maxSalary);
      if (min >= max) {
        newErrors.maxSalary = 'Maximum salary must be greater than minimum salary';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAsDraft = () => {
    const jobData = {
      ...formData,
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    
    if (onSave) {
      onSave(jobData);
    }
    
    console.log('Saved as draft:', jobData);
  };

  const handleNext = () => {
    if (validateForm()) {
      const jobData = {
        ...formData,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      if (onSave) {
        onSave(jobData);
      }
      
      console.log('Job created:', jobData);
      // TODO: Navigate to next step or close modal
    }
  };

  return (
    <div className="create-job-container">
      <div className="create-job-header">
        <div className="header-content">
          <h1 className="page-title">The basic job details</h1>
          <button className="save-draft-btn" onClick={handleSaveAsDraft}>
            Save as draft
          </button>
        </div>
      </div>
      
      <div className="create-job-content">
        <form className="job-form">
          {/* Company Name Section */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Select or enter company name"
                className={`form-input ${errors.companyName ? 'error' : ''}`}
              />
              {errors.companyName && <span className="error-message">{errors.companyName}</span>}
            </div>
            
            <div className="toggle-group">
              <label className="toggle-label">
                <span>Show company name and logo on ad</span>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    name="showCompanyNameAndLogo"
                    checked={formData.showCompanyNameAndLogo}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
          </div>

          {/* Job Title and Location */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">What is the job title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="Enter job title"
                className={`form-input ${errors.jobTitle ? 'error' : ''}`}
              />
              {errors.jobTitle && <span className="error-message">{errors.jobTitle}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Where is this job?</label>
              <input
                type="text"
                name="jobLocation"
                value={formData.jobLocation}
                onChange={handleInputChange}
                placeholder="Enter job location"
                className={`form-input ${errors.jobLocation ? 'error' : ''}`}
              />
              {errors.jobLocation && <span className="error-message">{errors.jobLocation}</span>}
            </div>
          </div>

          {/* Job Description */}
          <div className="form-group">
            <label className="form-label">Job description</label>
            <RichTextEditor
              value={formData.jobDescription}
              onChange={handleDescriptionChange}
              placeholder="Please add more detail to your job description"
              error={errors.jobDescription}
            />
            {errors.jobDescription && <span className="error-message">{errors.jobDescription}</span>}
          </div>

          {/* Job Type and Contract Type */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Job type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className={`form-select ${errors.jobType ? 'error' : ''}`}
              >
                <option value="">Select a job type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
              {errors.jobType && <span className="error-message">{errors.jobType}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Contract type</label>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleInputChange}
                className={`form-select ${errors.contractType ? 'error' : ''}`}
              >
                <option value="">Select a contract type</option>
                <option value="permanent">Permanent</option>
                <option value="temporary">Temporary</option>
                <option value="fixed-term">Fixed-term</option>
                <option value="casual">Casual</option>
              </select>
              {errors.contractType && <span className="error-message">{errors.contractType}</span>}
            </div>
          </div>

          {/* Category and Occupation */}
          <div className="form-row highlighted-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`form-select ${errors.category ? 'error' : ''}`}
              >
                <option value="">Select a category</option>
                <option value="technology">Technology</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
                <option value="design">Design</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Occupation</label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className={`form-select ${errors.occupation ? 'error' : ''}`}
              >
                <option value="">Select occupation</option>
                <option value="software-engineer">Software Engineer</option>
                <option value="product-manager">Product Manager</option>
                <option value="designer">Designer</option>
                <option value="data-analyst">Data Analyst</option>
                <option value="marketing-manager">Marketing Manager</option>
                <option value="sales-representative">Sales Representative</option>
              </select>
              {errors.occupation && <span className="error-message">{errors.occupation}</span>}
            </div>
          </div>

          {/* Pay Type */}
          <div className="form-section">
            <label className="form-label">Pay type</label>
            <div className="pay-type-buttons">
              <button
                type="button"
                className={`pay-type-btn ${formData.payType === 'annual-salary' ? 'active' : ''}`}
                onClick={() => handleInputChange({ target: { name: 'payType', value: 'annual-salary' } })}
              >
                Annual salary
              </button>
              <button
                type="button"
                className={`pay-type-btn ${formData.payType === 'hourly-rate' ? 'active' : ''}`}
                onClick={() => handleInputChange({ target: { name: 'payType', value: 'hourly-rate' } })}
              >
                Hourly rate
              </button>
              <button
                type="button"
                className={`pay-type-btn ${formData.payType === 'unpaid' ? 'active' : ''}`}
                onClick={() => handleInputChange({ target: { name: 'payType', value: 'unpaid' } })}
              >
                Unpaid
              </button>
            </div>
          </div>

          {/* Pay Range */}
          {formData.payType !== 'unpaid' && (
            <div className="form-section">
              <div className="pay-range-section">
                <div className="pay-range-inputs">
                  <label className="form-label">Pay range</label>
                  <div className="salary-inputs">
                    <input
                      type="number"
                      name="minSalary"
                      value={formData.minSalary}
                      onChange={handleInputChange}
                      placeholder="$ Min salary"
                      className="form-input salary-input"
                    />
                    <input
                      type="number"
                      name="maxSalary"
                      value={formData.maxSalary}
                      onChange={handleInputChange}
                      placeholder="$ Max salary"
                      className={`form-input salary-input ${errors.maxSalary ? 'error' : ''}`}
                    />
                  </div>
                  {errors.maxSalary && <span className="error-message">{errors.maxSalary}</span>}
                </div>
                
                <div className="pay-comparison">
                  <h4>Pay comparison</h4>
                  <div className="comparison-chart">
                    <div className="chart-placeholder">
                      <div className="chart-icon">📊</div>
                      <p>Analyses...</p>
                      <small>We can only have benchmarked data to provide detailed insights for this job.</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="toggle-group">
                <label className="toggle-label">
                  <span>Display pay range on job post</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      name="displayPayRange"
                      checked={formData.displayPayRange}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                </label>
                <p className="toggle-description">
                  When your pay range is not displayed, genuine candidates will still be shown on the job page.
                </p>
              </div>
            </div>
          )}

          {/* Pay Description */}
          <div className="form-group">
            <label className="form-label">
              Pay description <span className="optional">(optional)</span>
            </label>
            <textarea
              name="payDescription"
              value={formData.payDescription}
              onChange={handleInputChange}
              placeholder="Enter pay description"
              className="form-textarea"
              rows="3"
            />
            <small className="character-count">50 characters remaining</small>
          </div>

          {/* Reference Number */}
          <div className="form-group">
            <label className="form-label">
              Reference number <span className="optional">(optional)</span>
            </label>
            <input
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleInputChange}
              placeholder="Enter reference number"
              className="form-input"
            />
            <small className="field-description">For your internal reference</small>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="next-btn" onClick={handleNext}>
              Next →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;