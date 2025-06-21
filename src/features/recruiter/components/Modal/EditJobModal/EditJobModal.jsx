import React, { useState, useEffect } from 'react';
import { jobService } from '../../../services/jobService';
// ✅ Import các service riêng biệt như CreateJobPage
import { jobCategoryService } from '../../../services/jobCategoryService';
import { jobTypeService } from '../../../services/jobTypeService';
import { jobPositionService } from '../../../services/jobPositionService';
import { skillService } from '../../../services/skillService';
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
  
  const [optionsLoading, setOptionsLoading] = useState({
    categories: false,
    types: false,
    positions: false,
    skills: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ✅ Enhanced initialization to handle string values from API
  useEffect(() => {
    if (isOpen && job) {
      console.log('📝 EditJobModal: Loading job data:', job);
      console.log('📝 EditJobModal: Job structure analysis:', {
        id: job.id,
        title: job.title,
        category: job.category,
        type: job.type,
        position: job.position,
        skills: job.skills
      });
      
      // Format deadline for the date input (YYYY-MM-DD)
      let formattedDeadline = '';
      if (job.deadline) {
        try {
          const deadlineDate = new Date(job.deadline);
          formattedDeadline = deadlineDate.toISOString().split('T')[0];
        } catch (error) {
          console.warn('⚠️ Error formatting deadline:', error);
          formattedDeadline = '';
        }
      }
      
      // ✅ Find category ID by matching category name with options
      const findCategoryIdByName = (categoryName) => {
        if (!categoryName) return '';
        const category = formOptions.categories.find(
          cat => cat.name.toLowerCase() === categoryName.toLowerCase()
        );
        return category ? String(category.id) : '';
      };

      // ✅ Find type ID by matching type name with options
      const findTypeIdByName = (typeName) => {
        if (!typeName) return '';
        const type = formOptions.types.find(
          t => t.name.toLowerCase() === typeName.toLowerCase()
        );
        return type ? String(type.id) : '';
      };

      // ✅ Find position ID by matching position name with options
      const findPositionIdByName = (positionName) => {
        if (!positionName) return '';
        const position = formOptions.positions.find(
          pos => pos.name.toLowerCase() === positionName.toLowerCase()
        );
        return position ? String(position.id) : '';
      };

      // ✅ Find skill IDs by matching skill names with options
      const findSkillIdsByNames = (skillNames) => {
        if (!Array.isArray(skillNames)) return [];
        return skillNames.map(skillName => {
          const skill = formOptions.skills.find(
            s => s.name.toLowerCase() === skillName.toLowerCase()
          );
          return skill ? String(skill.id) : null;
        }).filter(id => id !== null);
      };

      // ✅ Set form data with matched IDs
      const categoryId = findCategoryIdByName(job.category);
      const typeId = findTypeIdByName(job.type);
      const positionId = findPositionIdByName(job.position);
      const skillIds = findSkillIdsByNames(job.skills);

      console.log('📝 EditJobModal: Matched IDs:', {
        categoryName: job.category,
        categoryId,
        typeName: job.type,
        typeId,
        positionName: job.position,
        positionId,
        skillNames: job.skills,
        skillIds
      });
      
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        salaryRange: job.salaryRange || '',
        experience: job.experience || '',
        deadline: formattedDeadline,
        postAt: job.postAt || 'STANDARD',
        
        // ✅ Use matched IDs
        categoryId: categoryId,
        typeId: typeId,
        positionId: positionId,
        
        // ✅ Use matched skill IDs
        skills: skillIds
      });
      
      console.log('📝 EditJobModal: Form data set:', {
        categoryId,
        typeId,
        positionId,
        skills: skillIds
      });
      
      // Reset error states
      setErrors({});
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, job, formOptions]); // ✅ Add formOptions as dependency

  // ✅ Load form options when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAllFormOptions();
    }
  }, [isOpen]);

  // ✅ Load positions when category changes
  useEffect(() => {
    if (isOpen && formData.categoryId) {
      loadPositionsByCategory(formData.categoryId);
    }
  }, [isOpen, formData.categoryId]);

  const loadAllFormOptions = async () => {
    console.log('📊 EditJobModal: Loading all form options...');
    
    try {
      // ✅ Load categories
      setOptionsLoading(prev => ({ ...prev, categories: true }));
      try {
        const categoriesData = await jobCategoryService.getAllJobCategories();
        console.log('📂 EditJobModal: Categories loaded:', categoriesData);
        
        let processedCategories = [];
        if (Array.isArray(categoriesData)) {
          processedCategories = categoriesData;
        } else if (categoriesData?.data && Array.isArray(categoriesData.data)) {
          processedCategories = categoriesData.data;
        }
        
        setFormOptions(prev => ({
          ...prev,
          categories: processedCategories.length > 0 ? processedCategories : [
            { id: 1, name: 'Công nghệ thông tin', description: 'Ngành liên quan đến lập trình...' },
            { id: 2, name: 'Marketing', description: 'Ngành tiếp thị và quảng cáo...' },
            { id: 3, name: 'Kinh doanh', description: 'Ngành kinh doanh và bán hàng...' },
            { id: 4, name: 'Thiết kế', description: 'Ngành thiết kế đồ họa, UI/UX...' }
          ]
        }));
      } catch (error) {
        console.error('❌ EditJobModal: Error loading categories:', error);
        setFormOptions(prev => ({
          ...prev,
          categories: [
            { id: 1, name: 'Công nghệ thông tin', description: 'Ngành liên quan đến lập trình...' },
            { id: 2, name: 'Marketing', description: 'Ngành tiếp thị và quảng cáo...' },
            { id: 3, name: 'Kinh doanh', description: 'Ngành kinh doanh và bán hàng...' },
            { id: 4, name: 'Thiết kế', description: 'Ngành thiết kế đồ họa, UI/UX...' }
          ]
        }));
      } finally {
        setOptionsLoading(prev => ({ ...prev, categories: false }));
      }

      // ✅ Load job types
      setOptionsLoading(prev => ({ ...prev, types: true }));
      try {
        const typesData = await jobTypeService.getAllJobTypes();
        console.log('💼 EditJobModal: Job types loaded:', typesData);
        
        let processedTypes = [];
        if (Array.isArray(typesData)) {
          processedTypes = typesData;
        } else if (typesData?.data && Array.isArray(typesData.data)) {
          processedTypes = typesData.data;
        }
        
        setFormOptions(prev => ({
          ...prev,
          types: processedTypes.length > 0 ? processedTypes : [
            { id: 1, name: 'Full-time', description: 'Làm việc toàn thời gian...' },
            { id: 2, name: 'Part-time', description: 'Làm việc bán thời gian...' },
            { id: 3, name: 'Contract', description: 'Làm việc theo hợp đồng...' },
            { id: 4, name: 'Internship', description: 'Thực tập sinh...' }
          ]
        }));
      } catch (error) {
        console.error('❌ EditJobModal: Error loading job types:', error);
        setFormOptions(prev => ({
          ...prev,
          types: [
            { id: 1, name: 'Full-time', description: 'Làm việc toàn thời gian...' },
            { id: 2, name: 'Part-time', description: 'Làm việc bán thời gian...' },
            { id: 3, name: 'Contract', description: 'Làm việc theo hợp đồng...' },
            { id: 4, name: 'Internship', description: 'Thực tập sinh...' }
          ]
        }));
      } finally {
        setOptionsLoading(prev => ({ ...prev, types: false }));
      }

      // ✅ Load positions
      setOptionsLoading(prev => ({ ...prev, positions: true }));
      try {
        const positionsData = await jobPositionService.getAllJobPositions();
        console.log('🎯 EditJobModal: Positions loaded:', positionsData);
        
        let processedPositions = [];
        if (Array.isArray(positionsData)) {
          processedPositions = positionsData;
        } else if (positionsData?.data && Array.isArray(positionsData.data)) {
          processedPositions = positionsData.data;
        }
        
        setFormOptions(prev => ({
          ...prev,
          positions: processedPositions.length > 0 ? processedPositions : [
            { id: 1, name: 'Backend Developer', description: 'Phát triển API phía server...' },
            { id: 2, name: 'Frontend Developer', description: 'Phát triển giao diện người dùng...' },
            { id: 3, name: 'Full Stack Developer', description: 'Phát triển cả frontend và backend...' },
            { id: 4, name: 'UI/UX Designer', description: 'Thiết kế giao diện và trải nghiệm...' },
            { id: 5, name: 'Product Manager', description: 'Quản lý sản phẩm...' }
          ]
        }));
      } catch (error) {
        console.error('❌ EditJobModal: Error loading positions:', error);
        setFormOptions(prev => ({
          ...prev,
          positions: [
            { id: 1, name: 'Backend Developer', description: 'Phát triển API phía server...' },
            { id: 2, name: 'Frontend Developer', description: 'Phát triển giao diện người dùng...' },
            { id: 3, name: 'Full Stack Developer', description: 'Phát triển cả frontend và backend...' },
            { id: 4, name: 'UI/UX Designer', description: 'Thiết kế giao diện và trải nghiệm...' },
            { id: 5, name: 'Product Manager', description: 'Quản lý sản phẩm...' }
          ]
        }));
      } finally {
        setOptionsLoading(prev => ({ ...prev, positions: false }));
      }

      // ✅ Load skills
      setOptionsLoading(prev => ({ ...prev, skills: true }));
      try {
        const skillsData = await skillService.getAllSkills();
        console.log('🛠️ EditJobModal: Skills loaded:', skillsData);
        
        setFormOptions(prev => ({
          ...prev,
          skills: skillsData && skillsData.length > 0 ? skillsData : [
            { id: 1, name: 'Java', description: 'Lập trình hướng đối tượng với Java.' },
            { id: 2, name: 'JavaScript', description: 'Ngôn ngữ lập trình web...' },
            { id: 3, name: 'React', description: 'Thư viện JavaScript cho UI...' },
            { id: 4, name: 'Node.js', description: 'JavaScript runtime cho backend...' },
            { id: 5, name: 'Python', description: 'Ngôn ngữ lập trình đa năng...' },
            { id: 6, name: 'Spring Boot', description: 'Framework Java cho web app...' },
            { id: 7, name: 'MySQL', description: 'Hệ quản trị cơ sở dữ liệu...' },
            { id: 8, name: 'Docker', description: 'Containerization platform...' }
          ]
        }));
      } catch (error) {
        console.error('❌ EditJobModal: Error loading skills:', error);
        setFormOptions(prev => ({
          ...prev,
          skills: [
            { id: 1, name: 'Java', description: 'Lập trình hướng đối tượng với Java.' },
            { id: 2, name: 'JavaScript', description: 'Ngôn ngữ lập trình web...' },
            { id: 3, name: 'React', description: 'Thư viện JavaScript cho UI...' },
            { id: 4, name: 'Node.js', description: 'JavaScript runtime cho backend...' },
            { id: 5, name: 'Python', description: 'Ngôn ngữ lập trình đa năng...' },
            { id: 6, name: 'Spring Boot', description: 'Framework Java cho web app...' },
            { id: 7, name: 'MySQL', description: 'Hệ quản trị cơ sở dữ liệu...' },
            { id: 8, name: 'Docker', description: 'Containerization platform...' }
          ]
        }));
      } finally {
        setOptionsLoading(prev => ({ ...prev, skills: false }));
      }

      console.log('✅ EditJobModal: All form options loaded successfully');
    } catch (error) {
      console.error('❌ EditJobModal: Error loading form options:', error);
    }
  };

  const loadPositionsByCategory = async (categoryId) => {
    try {
      console.log('🎯 EditJobModal: Loading positions for category:', categoryId);
      setOptionsLoading(prev => ({ ...prev, positions: true }));
      
      const positionsData = await jobPositionService.getJobPositionsByCategory(categoryId);
      console.log('🎯 EditJobModal: Category positions loaded:', positionsData);
      
      let processedPositions = [];
      if (Array.isArray(positionsData)) {
        processedPositions = positionsData;
      } else if (positionsData?.data && Array.isArray(positionsData.data)) {
        processedPositions = positionsData.data;
      }
      
      if (processedPositions.length > 0) {
        setFormOptions(prev => ({
          ...prev,
          positions: processedPositions
        }));
        
        // Reset position selection if current selection is not in new list
        if (formData.positionId && !processedPositions.some(p => p.id == formData.positionId)) {
          console.log('🎯 EditJobModal: Resetting position selection - not in category');
          setFormData(prev => ({ ...prev, positionId: '' }));
        }
      }
    } catch (error) {
      console.error('❌ EditJobModal: Error loading positions by category:', error);
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
      // ✅ Prepare data for API - convert IDs back to names for string-based API
      const selectedCategory = formOptions.categories.find(cat => cat.id == formData.categoryId);
      const selectedType = formOptions.types.find(type => type.id == formData.typeId);
      const selectedPosition = formOptions.positions.find(pos => pos.id == formData.positionId);
      const selectedSkills = formOptions.skills.filter(skill => 
        formData.skills.includes(skill.id)
      );

      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salaryRange: formData.salaryRange,
        experience: formData.experience,
        deadline: formData.deadline,
        
        // ✅ Send strings not objects for API
        category: selectedCategory?.name || '',
        type: selectedType?.name || '',
        position: selectedPosition?.name || '',
        skills: selectedSkills.map(skill => skill.name),
        
        // ✅ Also include names for service mapping
        categoryName: selectedCategory?.name || '',
        typeName: selectedType?.name || '',
        positionName: selectedPosition?.name || '',
        skillNames: selectedSkills.map(skill => skill.name)
      };
      
      console.log('📤 EditJobModal: Submitting job update:', jobData);
      
      await jobService.editJob(job.id, jobData);
      
      setSuccessMessage('Job updated successfully!');
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(job.id);
        }, 1500);
      }
    } catch (error) {
      console.error('❌ EditJobModal: Failed to update job:', error);
      
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

        {/* ✅ Enhanced debug info */}
        {process.env.NODE_ENV === 'development' && job && (
          <div className="debug-info" style={{
            background: '#f3f4f6 !important',
            padding: '8px',
            margin: '8px 0',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontFamily: 'monospace'
          }}>
            <strong>🔍 Debug Info:</strong><br />
            <strong>Original Job:</strong> Cat="{job.category}" | Type="{job.type}" | Pos="{job.position}"<br />
            <strong>Form Values:</strong> CatID={formData.categoryId} | TypeID={formData.typeId} | PosID={formData.positionId}<br />
            <strong>Options Count:</strong> Categories={formOptions.categories.length} | Types={formOptions.types.length} | Positions={formOptions.positions.length} | Skills={formOptions.skills.length}<br />
            <details style={{ marginTop: '4px' }}>
              <summary>Job String Values</summary>
              <pre style={{ fontSize: '0.65rem', maxHeight: '100px', overflow: 'auto' }}>
                Category: "{job.category}"
                Type: "{job.type}"
                Position: "{job.position}"
                Skills: {JSON.stringify(job.skills)}
              </pre>
            </details>
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
                <label htmlFor="categoryId">
                  Job Category*
                  {optionsLoading.categories && <span className="loading-indicator"> ⏳</span>}
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={errors.categoryId ? 'error' : ''}
                  disabled={loading || optionsLoading.categories}
                >
                  <option value="">
                    {optionsLoading.categories ? 'Loading categories...' : 'Select Category'}
                  </option>
                  {formOptions.categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="typeId">
                  Employment Type*
                  {optionsLoading.types && <span className="loading-indicator"> ⏳</span>}
                </label>
                <select
                  id="typeId"
                  name="typeId"
                  value={formData.typeId}
                  onChange={handleInputChange}
                  className={errors.typeId ? 'error' : ''}
                  disabled={loading || optionsLoading.types}
                >
                  <option value="">
                    {optionsLoading.types ? 'Loading job types...' : 'Select Type'}
                  </option>
                  {formOptions.types.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                {errors.typeId && <div className="error-message">{errors.typeId}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="positionId">
                  Position Level*
                  {optionsLoading.positions && <span className="loading-indicator"> ⏳</span>}
                </label>
                <select
                  id="positionId"
                  name="positionId"
                  value={formData.positionId}
                  onChange={handleInputChange}
                  className={errors.positionId ? 'error' : ''}
                  disabled={loading || optionsLoading.positions}
                >
                  <option value="">
                    {optionsLoading.positions ? 'Loading positions...' : 'Select Position'}
                  </option>
                  {formOptions.positions.map(position => (
                    <option key={position.id} value={position.id}>{position.name}</option>
                  ))}
                </select>
                {errors.positionId && <div className="error-message">{errors.positionId}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="skills">
                Required Skills
                {optionsLoading.skills && <span className="loading-indicator"> ⏳</span>}
              </label>
              <select
                id="skills"
                name="skills"
                multiple
                value={formData.skills}
                onChange={handleSkillChange}
                disabled={loading || optionsLoading.skills}
                size="6"
              >
                {formOptions.skills.map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </select>
              <div className="form-help">Hold Ctrl (or Cmd) to select multiple skills</div>
            </div>
          </div>
          
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
              disabled={loading || Object.values(optionsLoading).some(Boolean)}
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