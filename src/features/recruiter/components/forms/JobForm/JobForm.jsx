import React, { useState, useEffect } from 'react';
import { jobCategoryService } from '../../../services/jobCategoryService';
import { jobTypeService } from '../../../services/jobTypeService';
import { jobPositionService } from '../../../services/jobPositionService';
import { skillService } from '../../../services/skillService';
import './JobForm.css';

const JobForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  onSaveAsDraft = null,
  isSubmitting = false,
  submitError = '',
  mode = 'create', // 'create' or 'edit'
  showPackageInfo = false, // Disabled package system
  showPostTypes = false,   // Disabled post types
  user = null,
  disabled = false
}) => {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salaryRange: '',
    experience: '',
    location: '',
    deadline: '',
    categoryId: '',
    typeId: '',
    positionId: '',
    skills: []
  });

  const [formErrors, setFormErrors] = useState({});

  // ✅ Dropdown options
  const [formOptions, setFormOptions] = useState({
    categories: [],
    types: [],
    positions: [],
    skills: []
  });

  const [optionsLoading, setOptionsLoading] = useState({
    categories: false,
    types: false,
    positions: false,
    skills: false
  });

  const [selectedSkills, setSelectedSkills] = useState([]);

  // ✅ Initialize form data
  useEffect(() => {
    if (initialData) {
      console.log('📝 JobForm: Loading initial data:', initialData);

      // Format deadline for date input
      let formattedDeadline = '';
      if (initialData.deadline) {
        try {
          const deadlineDate = new Date(initialData.deadline);
          formattedDeadline = deadlineDate.toISOString().split('T')[0];
        } catch (error) {
          console.warn('⚠️ Error formatting deadline:', error);
        }
      }

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        salaryRange: initialData.salaryRange || '',
        experience: initialData.experience || '',
        location: initialData.location || '',
        deadline: formattedDeadline,
        categoryId: initialData.categoryId || '',
        typeId: initialData.typeId || '',
        positionId: initialData.positionId || '',
        skills: initialData.skills || []
      });

      if (initialData.skills) {
        setSelectedSkills(Array.isArray(initialData.skills) ? initialData.skills : []);
      }
    }
  }, [initialData]);

  // ✅ Load form options when component mounts
  useEffect(() => {
    loadAllFormOptions();
  }, []);

  // ✅ Auto-match IDs when options load (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && initialData && formOptions.categories.length > 0) {
      autoMatchFormIds();
    }
  }, [mode, initialData, formOptions]);

  // ✅ Load positions when category changes
  useEffect(() => {
    if (formData.categoryId) {
      loadPositionsByCategory(formData.categoryId);
    }
  }, [formData.categoryId]);

  // ✅ Auto-match string values to IDs for edit mode
  const autoMatchFormIds = () => {
    if (!initialData) return;

    const updates = {};

    // Match category
    if (initialData.category && !formData.categoryId) {
      const category = formOptions.categories.find(
        cat => cat.name.toLowerCase() === initialData.category.toLowerCase()
      );
      if (category) updates.categoryId = String(category.id);
    }

    // Match type
    if (initialData.type && !formData.typeId) {
      const type = formOptions.types.find(
        t => t.name.toLowerCase() === initialData.type.toLowerCase()
      );
      if (type) updates.typeId = String(type.id);
    }

    // Match position
    if (initialData.position && !formData.positionId) {
      const position = formOptions.positions.find(
        pos => pos.name.toLowerCase() === initialData.position.toLowerCase()
      );
      if (position) updates.positionId = String(position.id);
    }

    // Match skills
    if (initialData.skills && Array.isArray(initialData.skills) && formOptions.skills.length > 0) {
      const matchedSkills = initialData.skills.map(skillName => {
        const skill = formOptions.skills.find(
          s => s.name.toLowerCase() === skillName.toLowerCase()
        );
        return skill || null;
      }).filter(Boolean);

      if (matchedSkills.length > 0) {
        setSelectedSkills(matchedSkills);
        updates.skills = matchedSkills.map(s => s.id);
      }
    }

    if (Object.keys(updates).length > 0) {
      console.log('🔗 JobForm: Auto-matched IDs:', updates);
      setFormData(prev => ({ ...prev, ...updates }));
    }
  };

  const loadAllFormOptions = async () => {
    console.log('📊 JobForm: Loading all form options...');

    try {
      // Load categories
      setOptionsLoading(prev => ({ ...prev, categories: true }));
      try {
        const categoriesData = await jobCategoryService.getAllJobCategories();
        const processedCategories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];

        setFormOptions(prev => ({
          ...prev,
          categories: processedCategories
        }));
        console.log('✅ Categories loaded:', processedCategories.length);
      } catch (error) {
        console.error('❌ Error loading categories:', error);
        setFormOptions(prev => ({ ...prev, categories: [] }));
      } finally {
        setOptionsLoading(prev => ({ ...prev, categories: false }));
      }

      // Load job types
      setOptionsLoading(prev => ({ ...prev, types: true }));
      try {
        const typesData = await jobTypeService.getAllJobTypes();
        const processedTypes = Array.isArray(typesData) ? typesData : typesData?.data || [];

        setFormOptions(prev => ({
          ...prev,
          types: processedTypes
        }));
        console.log('✅ Job types loaded:', processedTypes.length);
      } catch (error) {
        console.error('❌ Error loading job types:', error);
        setFormOptions(prev => ({ ...prev, types: [] }));
      } finally {
        setOptionsLoading(prev => ({ ...prev, types: false }));
      }

      // Load positions
      setOptionsLoading(prev => ({ ...prev, positions: true }));
      try {
        const positionsData = await jobPositionService.getAllJobPositions();
        const processedPositions = Array.isArray(positionsData) ? positionsData : positionsData?.data || [];

        setFormOptions(prev => ({
          ...prev,
          positions: processedPositions
        }));
        console.log('✅ Positions loaded:', processedPositions.length);
      } catch (error) {
        console.error('❌ Error loading positions:', error);
        setFormOptions(prev => ({ ...prev, positions: [] }));
      } finally {
        setOptionsLoading(prev => ({ ...prev, positions: false }));
      }

      // Load skills
      setOptionsLoading(prev => ({ ...prev, skills: true }));
      try {
        const skillsData = await skillService.getAllSkills();
        const processedSkills = Array.isArray(skillsData) ? skillsData : skillsData?.data || [];

        setFormOptions(prev => ({
          ...prev,
          skills: processedSkills
        }));
        console.log('✅ Skills loaded:', processedSkills.length);
      } catch (error) {
        console.error('❌ Error loading skills:', error);
        setFormOptions(prev => ({ ...prev, skills: [] }));
      } finally {
        setOptionsLoading(prev => ({ ...prev, skills: false }));
      }

      console.log('✅ JobForm: All form options loaded successfully');
    } catch (error) {
      console.error('❌ JobForm: Error loading form options:', error);
    }
  };

  const loadPositionsByCategory = async (categoryId) => {
    try {
      console.log('🎯 JobForm: Loading positions for category:', categoryId);
      setOptionsLoading(prev => ({ ...prev, positions: true }));

      const positionsData = await jobPositionService.getJobPositionsByCategory(categoryId);
      const processedPositions = Array.isArray(positionsData) ? positionsData : positionsData?.data || [];

      setFormOptions(prev => ({
        ...prev,
        positions: processedPositions
      }));

      // Reset position selection if current selection is not in new list
      if (formData.positionId && !processedPositions.some(p => p.id == formData.positionId)) {
        console.log('🎯 JobForm: Resetting position selection - not in category');
        setFormData(prev => ({ ...prev, positionId: '' }));
      }
    } catch (error) {
      console.error('❌ JobForm: Error loading positions by category:', error);
      setFormOptions(prev => ({ ...prev, positions: [] }));
    } finally {
      setOptionsLoading(prev => ({ ...prev, positions: false }));
    }
  };

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
      let newSkills;

      if (isSelected) {
        newSkills = prev.filter(s => s.id !== skill.id);
      } else {
        newSkills = [...prev, skill];
      }

      // Update form data skills array
      setFormData(prevForm => ({
        ...prevForm,
        skills: newSkills.map(s => s.id)
      }));

      return newSkills;
    });
  };

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare data for submission
    const selectedCategory = formOptions.categories.find(cat => cat.id == formData.categoryId);
    const selectedType = formOptions.types.find(type => type.id == formData.typeId);
    const selectedPosition = formOptions.positions.find(pos => pos.id == formData.positionId);

    const submitData = {
      ...formData,
      // For API compatibility - include both IDs and names
      category: selectedCategory?.name || '',
      type: selectedType?.name || '',
      position: selectedPosition?.name || '',
      skills: selectedSkills,
      skillNames: selectedSkills.map(skill => skill.name),

      // Form metadata
      selectedCategory,
      selectedType,
      selectedPosition,
      selectedSkills
    };

    console.log('📤 JobForm: Submitting data:', submitData);
    onSubmit(submitData);
  };

  const handleSaveAsDraft = (e) => {
    e.preventDefault();

    if (onSaveAsDraft) {
      const selectedCategory = formOptions.categories.find(cat => cat.id == formData.categoryId);
      const selectedType = formOptions.types.find(type => type.id == formData.typeId);
      const selectedPosition = formOptions.positions.find(pos => pos.id == formData.positionId);

      const draftData = {
        ...formData,
        category: selectedCategory?.name || '',
        type: selectedType?.name || '',
        position: selectedPosition?.name || '',
        skills: selectedSkills,
        skillNames: selectedSkills.map(skill => skill.name),
        status: 'draft'
      };

      console.log('💾 JobForm: Saving as draft:', draftData);
      onSaveAsDraft(draftData);
    }
  };

  // Calculate states
  const isFormDisabled = isSubmitting || disabled;
  const isDropdownDisabled = isFormDisabled || optionsLoading.categories || optionsLoading.types;
  const isSkillsDisabled = isFormDisabled || optionsLoading.skills;
  const isPositionDisabled = isFormDisabled || optionsLoading.positions;

  return (
    <div className="job-form">
      <form onSubmit={handleSubmit} className="job-form-container">
        {/* Basic Information */}
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
              disabled={isFormDisabled}
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
              placeholder="Describe the job responsibilities, requirements, and what you're looking for..."
              rows={6}
              disabled={isFormDisabled}
            />
            {formErrors.description && (
              <span className="error-message">{formErrors.description}</span>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="form-section">
          <h3 className="section-title">💼 Job Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoryId" className="form-label">
                Category <span className="required">*</span>
                {optionsLoading.categories && <span className="loading-indicator">⏳</span>}
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className={`form-select ${formErrors.categoryId ? 'error' : ''}`}
                disabled={isDropdownDisabled}
              >
                <option value="">
                  {optionsLoading.categories ? 'Loading categories...' : 'Select a category'}
                </option>
                {formOptions.categories.map(category => (
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
                {optionsLoading.types && <span className="loading-indicator">⏳</span>}
              </label>
              <select
                id="typeId"
                name="typeId"
                value={formData.typeId}
                onChange={handleInputChange}
                className={`form-select ${formErrors.typeId ? 'error' : ''}`}
                disabled={isDropdownDisabled}
              >
                <option value="">
                  {optionsLoading.types ? 'Loading job types...' : 'Select job type'}
                </option>
                {formOptions.types.map(type => (
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="positionId" className="form-label">
                Position <span className="required">*</span>
                {optionsLoading.positions && <span className="loading-indicator">⏳</span>}
              </label>
              <select
                id="positionId"
                name="positionId"
                value={formData.positionId}
                onChange={handleInputChange}
                className={`form-select ${formErrors.positionId ? 'error' : ''}`}
                disabled={isPositionDisabled}
              >
                <option value="">
                  {optionsLoading.positions ? 'Loading positions...' : 'Select a position'}
                </option>
                {formOptions.positions.map(position => (
                  <option key={position.id} value={position.id}>
                    {position.name}
                  </option>
                ))}
              </select>
              {formErrors.positionId && (
                <span className="error-message">{formErrors.positionId}</span>
              )}
            </div>

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
                disabled={isFormDisabled}
              />
              {formErrors.location && (
                <span className="error-message">{formErrors.location}</span>
              )}
            </div>
          </div>

          <div className="form-row">
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
                disabled={isFormDisabled}
              />
              {formErrors.deadline && (
                <span className="error-message">{formErrors.deadline}</span>
              )}
            </div>

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
                disabled={isFormDisabled}
              />
            </div>
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
              disabled={isFormDisabled}
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="form-section">
          <h3 className="section-title">
            🛠️ Required Skills
            {optionsLoading.skills && <span className="loading-indicator">⏳</span>}
          </h3>
          <p className="section-description">
            Select the skills required for this position
          </p>

          <div className="skills-container">
            <div className="available-skills">
              <h4>Available Skills ({formOptions.skills.length})</h4>
              {optionsLoading.skills ? (
                <div className="skills-loading">
                  <div className="loading-spinner-small"></div>
                  <span>Loading skills...</span>
                </div>
              ) : formOptions.skills.length === 0 ? (
                <div className="no-skills">
                  <span className="warning-icon">📝</span>
                  <p>No skills available. Please contact admin to add skills.</p>
                </div>
              ) : (
                <div className="skills-grid">
                  {formOptions.skills.map(skill => (
                    <button
                      key={skill.id}
                      type="button"
                      className={`skill-item ${selectedSkills.some(s => s.id === skill.id) ? 'selected' : ''}`}
                      onClick={() => handleSkillToggle(skill)}
                      disabled={isSkillsDisabled}
                    >
                      <span className="skill-name">{skill.name}</span>
                      {skill.description && (
                        <span className="skill-description">{skill.description}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
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
                        disabled={isSkillsDisabled}
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

        {/* Error Display */}
        {submitError && (
          <div className="submit-error">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{submitError}</span>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isFormDisabled}
          >
            Cancel
          </button>

          {onSaveAsDraft && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleSaveAsDraft}
              disabled={isFormDisabled}
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isFormDisabled}
          >
            {isSubmitting ? (
              mode === 'edit' ? 'Updating...' : 'Publishing...'
            ) : (
              mode === 'edit' ? 'Update Job' : 'Publish Job'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;