import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { jobService } from '../../../services/jobService';
import { packageService } from '../../../services/packageService';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import './CreateJobPage.css';

const CreateJobPage = ({ 
  onClose, 
  onSave, 
  isModal = false, 
  isLoading = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // ✅ Form state based on API structure
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salaryRange: '',
    experience: '',
    location: '',
    deadline: '',
    postAt: '', // Will be set based on user's package
    categoryId: '',
    typeId: '',
    positionId: '',
    skills: []
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // ✅ Package information state
  const [userPackage, setUserPackage] = useState(null);
  const [packageLoading, setPackageLoading] = useState(true);
  const [packageError, setPackageError] = useState(null);
  const [remainingPosts, setRemainingPosts] = useState(0);
  const [availablePostTypes, setAvailablePostTypes] = useState([]);
  
  // Dropdown options states remain the same...
  const [categories, setCategories] = useState([
    { id: 1, name: 'Công nghệ thông tin', description: 'Ngành liên quan đến lập trình...' },
    { id: 2, name: 'Marketing', description: 'Ngành tiếp thị và quảng cáo...' },
    { id: 3, name: 'Kinh doanh', description: 'Ngành kinh doanh và bán hàng...' },
    { id: 4, name: 'Thiết kế', description: 'Ngành thiết kế đồ họa, UI/UX...' }
  ]);
  
  const [types, setTypes] = useState([
    { id: 1, name: 'Full-time', description: 'Làm việc toàn thời gian...' },
    { id: 2, name: 'Part-time', description: 'Làm việc bán thời gian...' },
    { id: 3, name: 'Contract', description: 'Làm việc theo hợp đồng...' },
    { id: 4, name: 'Internship', description: 'Thực tập sinh...' }
  ]);
  
  const [positions, setPositions] = useState([
    { id: 1, name: 'Backend Developer', description: 'Phát triển API phía server...' },
    { id: 2, name: 'Frontend Developer', description: 'Phát triển giao diện người dùng...' },
    { id: 3, name: 'Full Stack Developer', description: 'Phát triển cả frontend và backend...' },
    { id: 4, name: 'UI/UX Designer', description: 'Thiết kế giao diện và trải nghiệm...' },
    { id: 5, name: 'Product Manager', description: 'Quản lý sản phẩm...' }
  ]);
  
  const [availableSkills, setAvailableSkills] = useState([
    { id: 1, name: 'Java', description: 'Lập trình hướng đối tượng với Java.' },
    { id: 2, name: 'JavaScript', description: 'Ngôn ngữ lập trình web...' },
    { id: 3, name: 'React', description: 'Thư viện JavaScript cho UI...' },
    { id: 4, name: 'Node.js', description: 'JavaScript runtime cho backend...' },
    { id: 5, name: 'Python', description: 'Ngôn ngữ lập trình đa năng...' },
    { id: 6, name: 'Spring Boot', description: 'Framework Java cho web app...' },
    { id: 7, name: 'MySQL', description: 'Hệ quản trị cơ sở dữ liệu...' },
    { id: 8, name: 'Docker', description: 'Containerization platform...' }
  ]);
  
  const [selectedSkills, setSelectedSkills] = useState([]);

  // ✅ Load user package information
  useEffect(() => {
    loadUserPackage();
  }, [user]);

  const loadUserPackage = async () => {
    try {
      setPackageLoading(true);
      setPackageError(null);
      
      console.log('📦 Loading user package information...');
      
      // Get user's current active package
      const packageInfo = await packageService.getUserActivePackage();
      console.log('📦 User package info:', packageInfo);
      
      if (!packageInfo) {
        setPackageError('No active package found. Please purchase a package to post jobs.');
        return;
      }
      
      setUserPackage(packageInfo);
      
      // ✅ Calculate available post types and remaining posts
      const features = packageInfo.servicePackage?.features || [];
      console.log('🔧 Package features:', features);
      
      // Get remaining job posts
      const currentJobCount = await jobService.getUserJobCount();
      console.log('📊 Current job count:', currentJobCount);
      
      // Calculate remaining posts based on package limits
      let totalLimit = 0;
      const postTypes = [];
      
      features.forEach(feature => {
        if (feature.jobPostLimit && feature.jobPostLimit > 0) {
          totalLimit += feature.jobPostLimit;
          
          // Add post type option
          if (feature.postAt) {
            postTypes.push({
              type: feature.postAt,
              name: getPostTypeName(feature.postAt),
              description: feature.description,
              remaining: Math.max(0, feature.jobPostLimit - (currentJobCount[feature.postAt] || 0))
            });
          }
        }
      });
      
      setAvailablePostTypes(postTypes);
      setRemainingPosts(Math.max(0, totalLimit - currentJobCount.total));
      
      // ✅ Set default post type based on available options
      if (postTypes.length > 0) {
        // Find the first available post type with remaining posts
        const availableType = postTypes.find(pt => pt.remaining > 0);
        if (availableType) {
          setFormData(prev => ({
            ...prev,
            postAt: availableType.type
          }));
        }
      }
      
    } catch (error) {
      console.error('❌ Error loading user package:', error);
      setPackageError(error.message || 'Failed to load package information');
    } finally {
      setPackageLoading(false);
    }
  };

  // ✅ Helper function to get post type display name
  const getPostTypeName = (postType) => {
    const typeNames = {
      'standard': 'Standard Post',
      'premium': 'Premium Post',
      'urgent': 'Urgent Post',
      'proposal': 'Proposal Post'
    };
    return typeNames[postType] || postType;
  };

  // ✅ Helper function to get post type icon and color
  const getPostTypeStyle = (postType) => {
    const styles = {
      'standard': { icon: '📝', color: '#6b7280', bgColor: '#f3f4f6' },
      'premium': { icon: '⭐', color: '#f59e0b', bgColor: '#fef3c7' },
      'urgent': { icon: '🚨', color: '#ef4444', bgColor: '#fecaca' },
      'proposal': { icon: '💼', color: '#8b5cf6', bgColor: '#ede9fe' }
    };
    return styles[postType] || styles.standard;
  };

  // ✅ Load draft data if editing (existing code remains the same)
  useEffect(() => {
    const draftData = location.state?.jobData;
    if (draftData) {
      console.log('📝 Loading draft data:', draftData);
      setFormData({
        title: draftData.title || '',
        description: draftData.description || '',
        salaryRange: draftData.salaryRange || '',
        experience: draftData.experience || '',
        location: draftData.location || '',
        deadline: draftData.deadline ? draftData.deadline.split('T')[0] : '',
        postAt: draftData.postAt || '',
        categoryId: draftData.categoryId || '',
        typeId: draftData.typeId || '',
        positionId: draftData.positionId || '',
        skills: draftData.skills || []
      });
      setSelectedSkills(draftData.skills || []);
    }
  }, [location.state]);

  // ✅ Form handlers (existing code remains the same)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => {
      const isSelected = prev.some(s => s.id === skill.id);
      if (isSelected) {
        return prev.filter(s => s.id !== skill.id);
      } else {
        return [...prev, skill];
      }
    });
  };

  // ✅ Enhanced form validation with package checks
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Job title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!formData.deadline) {
      errors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate <= today) {
        errors.deadline = 'Deadline must be in the future';
      }
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
    }
    
    if (!formData.typeId) {
      errors.typeId = 'Job type is required';
    }
    
    if (!formData.positionId) {
      errors.positionId = 'Position is required';
    }
    
    // ✅ Package validation
    if (!userPackage) {
      errors.package = 'No active package found. Please purchase a package to post jobs.';
    } else if (remainingPosts <= 0) {
      errors.package = 'You have reached your job posting limit. Please upgrade your package.';
    } else if (!formData.postAt) {
      errors.postAt = 'Post type is required';
    } else {
      // Check if selected post type is available
      const selectedPostType = availablePostTypes.find(pt => pt.type === formData.postAt);
      if (!selectedPostType || selectedPostType.remaining <= 0) {
        errors.postAt = 'Selected post type is not available in your package';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Submit handlers (enhanced with package validation)
  const handleSubmit = async (status = 'active') => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      // ✅ Double-check package limits before submitting
      if (remainingPosts <= 0) {
        throw new Error('You have reached your job posting limit');
      }
      
      const selectedPostType = availablePostTypes.find(pt => pt.type === formData.postAt);
      if (!selectedPostType || selectedPostType.remaining <= 0) {
        throw new Error('Selected post type is not available');
      }
      
      // ✅ Prepare API payload according to the structure
      const jobPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        salaryRange: formData.salaryRange.trim() || 'Competitive',
        experience: formData.experience.trim() || 'Not specified',
        location: formData.location.trim(),
        deadline: new Date(formData.deadline).toISOString(),
        postAt: formData.postAt, // Set by user's package
        category: {
          id: parseInt(formData.categoryId)
        },
        type: {
          id: parseInt(formData.typeId)
        },
        position: {
          id: parseInt(formData.positionId)
        },
        skills: selectedSkills
      };
      
      console.log('📤 Submitting job with payload:', jobPayload);
      
      if (isModal && onSave) {
        // Modal mode - call parent handler
        await onSave({ ...jobPayload, status });
      } else {
        // Page mode - call API directly
        const response = await jobService.createJob(jobPayload);
        console.log('✅ Job created successfully:', response);
        
        // Refresh package info after successful creation
        await loadUserPackage();
        
        if (status === 'draft') {
          navigate('/recruiter/jobs/drafts');
        } else {
          navigate('/recruiter/jobs/active');
        }
      }
      
    } catch (error) {
      console.error('❌ Error creating job:', error);
      setSubmitError(error.message || 'Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = () => {
    handleSubmit('draft');
  };

  const handlePublish = () => {
    handleSubmit('active');
  };

  const handleCancel = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate('/recruiter/jobs/active');
    }
  };

  // ✅ Handle package upgrade
  const handleUpgradePackage = () => {
    navigate('/recruiter/account/billing');
  };

  return (
    <div className="create-job-page">
      {!isModal && (
        <PageHeader 
          title="Create New Job"
          subtitle="Fill in the details to post a new job"
          showBackButton={true}
          onBack={handleCancel}
        />
      )}
      
      {/* ✅ Package Information Banner */}
      <div className="package-info-banner">
        {packageLoading ? (
          <div className="package-loading">
            <div className="loading-spinner-small"></div>
            <span>Loading package information...</span>
          </div>
        ) : packageError ? (
          <div className="package-error">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              <strong>Package Error:</strong> {packageError}
              <button 
                className="upgrade-btn" 
                onClick={handleUpgradePackage}
              >
                🎯 Purchase Package
              </button>
            </div>
          </div>
        ) : userPackage ? (
          <div className="package-active">
            <div className="package-main-info">
              <span className="package-icon">📦</span>
              <div className="package-details">
                <h4 className="package-name">{userPackage.servicePackage?.name}</h4>
                <p className="package-description">{userPackage.description}</p>
              </div>
            </div>
            
            <div className="package-limits">
              <div className="limit-item">
                <span className="limit-label">Remaining Posts:</span>
                <span className={`limit-value ${remainingPosts <= 0 ? 'depleted' : remainingPosts <= 2 ? 'low' : 'good'}`}>
                  {remainingPosts}
                </span>
              </div>
              
              <div className="limit-item">
                <span className="limit-label">Expires:</span>
                <span className="limit-value">
                  {new Date(userPackage.expirationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {remainingPosts <= 2 && (
              <button 
                className="upgrade-btn" 
                onClick={handleUpgradePackage}
              >
                🚀 Upgrade Package
              </button>
            )}
          </div>
        ) : null}
      </div>
      
      <div className="create-job-content">
        <form className="create-job-form" onSubmit={(e) => e.preventDefault()}>
          {/* Basic Information section remains the same... */}
          <div className="form-section">
            <h3 className="section-title">📋 Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Job Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`form-input ${formErrors.title ? 'error' : ''}`}
                placeholder="e.g. Senior Java Developer"
                disabled={isSubmitting || isLoading || packageLoading}
              />
              {formErrors.title && (
                <span className="error-message">{formErrors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Job Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`form-textarea ${formErrors.description ? 'error' : ''}`}
                placeholder="Describe the job responsibilities, requirements, and what you're looking for in a candidate..."
                rows={6}
                disabled={isSubmitting || isLoading || packageLoading}
              />
              {formErrors.description && (
                <span className="error-message">{formErrors.description}</span>
              )}
            </div>
          </div>

          {/* ✅ Enhanced Job Details with Post Type Selection */}
          <div className="form-section">
            <h3 className="section-title">💼 Job Details</h3>
            
            {/* Category and Type row remains the same... */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoryId" className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={`form-select ${formErrors.categoryId ? 'error' : ''}`}
                  disabled={isSubmitting || isLoading || packageLoading}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <span className="error-message">{formErrors.categoryId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="typeId" className="form-label">
                  Job Type <span className="required">*</span>
                </label>
                <select
                  id="typeId"
                  name="typeId"
                  value={formData.typeId}
                  onChange={handleInputChange}
                  className={`form-select ${formErrors.typeId ? 'error' : ''}`}
                  disabled={isSubmitting || isLoading || packageLoading}
                >
                  <option value="">Select job type</option>
                  {types.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {formErrors.typeId && (
                  <span className="error-message">{formErrors.typeId}</span>
                )}
              </div>
            </div>

            {/* Position and Post Type row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="positionId" className="form-label">
                  Position <span className="required">*</span>
                </label>
                <select
                  id="positionId"
                  name="positionId"
                  value={formData.positionId}
                  onChange={handleInputChange}
                  className={`form-select ${formErrors.positionId ? 'error' : ''}`}
                  disabled={isSubmitting || isLoading || packageLoading}
                >
                  <option value="">Select a position</option>
                  {positions.map(position => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </select>
                {formErrors.positionId && (
                  <span className="error-message">{formErrors.positionId}</span>
                )}
              </div>

              {/* ✅ Enhanced Post Type Selection */}
              <div className="form-group">
                <label htmlFor="postAt" className="form-label">
                  Post Type <span className="required">*</span>
                </label>
                <div className="post-type-selection">
                  {availablePostTypes.length > 0 ? (
                    availablePostTypes.map(postType => {
                      const style = getPostTypeStyle(postType.type);
                      const isSelected = formData.postAt === postType.type;
                      const isAvailable = postType.remaining > 0;
                      
                      return (
                        <div
                          key={postType.type}
                          className={`post-type-option ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                          onClick={() => {
                            if (isAvailable && !isSubmitting && !isLoading && !packageLoading) {
                              setFormData(prev => ({ ...prev, postAt: postType.type }));
                            }
                          }}
                          style={{
                            borderColor: isSelected ? style.color : '#e2e8f0',
                            backgroundColor: isSelected ? style.bgColor : 'white'
                          }}
                        >
                          <div className="post-type-header">
                            <span className="post-type-icon">{style.icon}</span>
                            <span className="post-type-name">{postType.name}</span>
                            <span className={`post-type-remaining ${!isAvailable ? 'depleted' : ''}`}>
                              {isAvailable ? `${postType.remaining} left` : 'Depleted'}
                            </span>
                          </div>
                          <p className="post-type-description">{postType.description}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-post-types">
                      <span className="warning-icon">⚠️</span>
                      <p>No post types available in your package</p>
                    </div>
                  )}
                </div>
                {formErrors.postAt && (
                  <span className="error-message">{formErrors.postAt}</span>
                )}
              </div>
            </div>

            {/* Location and Deadline row remains the same... */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`form-input ${formErrors.location ? 'error' : ''}`}
                  placeholder="e.g. Ho Chi Minh City, Vietnam"
                  disabled={isSubmitting || isLoading || packageLoading}
                />
                {formErrors.location && (
                  <span className="error-message">{formErrors.location}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="deadline" className="form-label">
                  Application Deadline <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className={`form-input ${formErrors.deadline ? 'error' : ''}`}
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  disabled={isSubmitting || isLoading || packageLoading}
                />
                {formErrors.deadline && (
                  <span className="error-message">{formErrors.deadline}</span>
                )}
              </div>
            </div>

            {/* Salary and Experience row remains the same... */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salaryRange" className="form-label">
                  Salary Range
                </label>
                <input
                  type="text"
                  id="salaryRange"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. $1000 - $1500"
                  disabled={isSubmitting || isLoading || packageLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="experience" className="form-label">
                  Experience Required
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. 2+ years experience"
                  disabled={isSubmitting || isLoading || packageLoading}
                />
              </div>
            </div>
          </div>

          {/* Skills section remains the same... */}
          <div className="form-section">
            <h3 className="section-title">🛠️ Required Skills</h3>
            <p className="section-description">
              Select the skills that are required for this position
            </p>
            
            <div className="skills-container">
              <div className="available-skills">
                <h4>Available Skills</h4>
                <div className="skills-grid">
                  {availableSkills.map(skill => (
                    <button
                      key={skill.id}
                      type="button"
                      className={`skill-item ${selectedSkills.some(s => s.id === skill.id) ? 'selected' : ''}`}
                      onClick={() => handleSkillToggle(skill)}
                      disabled={isSubmitting || isLoading || packageLoading}
                    >
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-description">{skill.description}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedSkills.length > 0 && (
                <div className="selected-skills">
                  <h4>Selected Skills ({selectedSkills.length})</h4>
                  <div className="selected-skills-list">
                    {selectedSkills.map(skill => (
                      <span key={skill.id} className="selected-skill">
                        {skill.name}
                        <button
                          type="button"
                          className="remove-skill"
                          onClick={() => handleSkillToggle(skill)}
                          disabled={isSubmitting || isLoading || packageLoading}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Enhanced Error Display */}
          {(submitError || formErrors.package) && (
            <div className="submit-error">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{submitError || formErrors.package}</span>
              {formErrors.package && (
                <button 
                  className="upgrade-btn-inline" 
                  onClick={handleUpgradePackage}
                >
                  🎯 View Packages
                </button>
              )}
            </div>
          )}

          {/* ✅ Enhanced Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </button>
            
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleSaveAsDraft}
              disabled={isSubmitting || isLoading || packageLoading || !userPackage}
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </button>
            
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePublish}
              disabled={isSubmitting || isLoading || packageLoading || !userPackage || remainingPosts <= 0}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Job'}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Overlay */}
      {(isSubmitting || isLoading) && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Creating your job posting...</p>
        </div>
      )}
    </div>
  );
};

export default CreateJobPage;