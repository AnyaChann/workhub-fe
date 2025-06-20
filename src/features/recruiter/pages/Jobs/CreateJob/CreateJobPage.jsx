import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { jobService } from '../../../services/jobService';
import { packageService, jobServiceExtension } from '../../../services/packageService';
import { jobCategoryService } from '../../../services/jobCategoryService';
import { jobTypeService } from '../../../services/jobTypeService';
import { jobPositionService } from '../../../services/jobPositionService';
import { skillService } from '../../../services/skillService';
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
  const { user, isLoading: authLoading } = useAuth();
  
  // ✅ Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salaryRange: '',
    experience: '',
    location: '',
    deadline: '',
    postAt: '',
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
  const [packageLoading, setPackageLoading] = useState(false);
  const [packageError, setPackageError] = useState(null);
  const [remainingPosts, setRemainingPosts] = useState(0);
  const [availablePostTypes, setAvailablePostTypes] = useState([]);
  const [packageStats, setPackageStats] = useState(null);
  
  // ✅ Dropdown options loaded from APIs
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [positions, setPositions] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // ✅ Loading states for dropdown data
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(false);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [dataLoadingError, setDataLoadingError] = useState(null);

  // ✅ Load all dropdown data when component mounts
  useEffect(() => {
    loadAllDropdownData();
  }, []);

  // ✅ Load package when user is available
  useEffect(() => {
    console.log('👤 User state changed:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authLoading 
    });
    
    if (!authLoading && user?.id) {
      console.log('✅ User loaded, loading package for user ID:', user.id);
      loadUserPackage();
    } else if (!authLoading && !user) {
      console.log('❌ No user found after auth loading completed');
      setPackageError('User not authenticated. Please log in again.');
    }
  }, [user, authLoading]);

  // ✅ Load all dropdown data from APIs with fallbacks
  const loadAllDropdownData = async () => {
    console.log('📊 Loading all dropdown data...');
    
    try {
      // Load categories
      setCategoriesLoading(true);
      try {
        const categoriesData = await jobCategoryService.getAllJobCategories();
        console.log('📂 Categories loaded:', categoriesData);
        
        let processedCategories = [];
        if (Array.isArray(categoriesData)) {
          processedCategories = categoriesData;
        } else if (categoriesData?.data && Array.isArray(categoriesData.data)) {
          processedCategories = categoriesData.data;
        }
        
        setCategories(processedCategories.length > 0 ? processedCategories : [
          { id: 1, name: 'Công nghệ thông tin', description: 'Ngành liên quan đến lập trình...' },
          { id: 2, name: 'Marketing', description: 'Ngành tiếp thị và quảng cáo...' },
          { id: 3, name: 'Kinh doanh', description: 'Ngành kinh doanh và bán hàng...' },
          { id: 4, name: 'Thiết kế', description: 'Ngành thiết kế đồ họa, UI/UX...' }
        ]);
      } catch (error) {
        console.error('❌ Error loading categories:', error);
        setCategories([
          { id: 1, name: 'Công nghệ thông tin', description: 'Ngành liên quan đến lập trình...' },
          { id: 2, name: 'Marketing', description: 'Ngành tiếp thị và quảng cáo...' },
          { id: 3, name: 'Kinh doanh', description: 'Ngành kinh doanh và bán hàng...' },
          { id: 4, name: 'Thiết kế', description: 'Ngành thiết kế đồ họa, UI/UX...' }
        ]);
      } finally {
        setCategoriesLoading(false);
      }

      // Load job types
      setTypesLoading(true);
      try {
        const typesData = await jobTypeService.getAllJobTypes();
        console.log('💼 Job types loaded:', typesData);
        
        let processedTypes = [];
        if (Array.isArray(typesData)) {
          processedTypes = typesData;
        } else if (typesData?.data && Array.isArray(typesData.data)) {
          processedTypes = typesData.data;
        }
        
        setTypes(processedTypes.length > 0 ? processedTypes : [
          { id: 1, name: 'Full-time', description: 'Làm việc toàn thời gian...' },
          { id: 2, name: 'Part-time', description: 'Làm việc bán thời gian...' },
          { id: 3, name: 'Contract', description: 'Làm việc theo hợp đồng...' },
          { id: 4, name: 'Internship', description: 'Thực tập sinh...' }
        ]);
      } catch (error) {
        console.error('❌ Error loading job types:', error);
        setTypes([
          { id: 1, name: 'Full-time', description: 'Làm việc toàn thời gian...' },
          { id: 2, name: 'Part-time', description: 'Làm việc bán thời gian...' },
          { id: 3, name: 'Contract', description: 'Làm việc theo hợp đồng...' },
          { id: 4, name: 'Internship', description: 'Thực tập sinh...' }
        ]);
      } finally {
        setTypesLoading(false);
      }

      // Load positions
      setPositionsLoading(true);
      try {
        const positionsData = await jobPositionService.getAllJobPositions();
        console.log('🎯 Positions loaded:', positionsData);
        
        let processedPositions = [];
        if (Array.isArray(positionsData)) {
          processedPositions = positionsData;
        } else if (positionsData?.data && Array.isArray(positionsData.data)) {
          processedPositions = positionsData.data;
        }
        
        setPositions(processedPositions.length > 0 ? processedPositions : [
          { id: 1, name: 'Backend Developer', description: 'Phát triển API phía server...' },
          { id: 2, name: 'Frontend Developer', description: 'Phát triển giao diện người dùng...' },
          { id: 3, name: 'Full Stack Developer', description: 'Phát triển cả frontend và backend...' },
          { id: 4, name: 'UI/UX Designer', description: 'Thiết kế giao diện và trải nghiệm...' },
          { id: 5, name: 'Product Manager', description: 'Quản lý sản phẩm...' }
        ]);
      } catch (error) {
        console.error('❌ Error loading positions:', error);
        setPositions([
          { id: 1, name: 'Backend Developer', description: 'Phát triển API phía server...' },
          { id: 2, name: 'Frontend Developer', description: 'Phát triển giao diện người dùng...' },
          { id: 3, name: 'Full Stack Developer', description: 'Phát triển cả frontend và backend...' },
          { id: 4, name: 'UI/UX Designer', description: 'Thiết kế giao diện và trải nghiệm...' },
          { id: 5, name: 'Product Manager', description: 'Quản lý sản phẩm...' }
        ]);
      } finally {
        setPositionsLoading(false);
      }

      // Load skills
      setSkillsLoading(true);
      try {
        const skillsData = await skillService.getAllSkills();
        console.log('🛠️ Skills loaded:', skillsData);
        
        setAvailableSkills(skillsData && skillsData.length > 0 ? skillsData : [
          { id: 1, name: 'Java', description: 'Lập trình hướng đối tượng với Java.' },
          { id: 2, name: 'JavaScript', description: 'Ngôn ngữ lập trình web...' },
          { id: 3, name: 'React', description: 'Thư viện JavaScript cho UI...' },
          { id: 4, name: 'Node.js', description: 'JavaScript runtime cho backend...' },
          { id: 5, name: 'Python', description: 'Ngôn ngữ lập trình đa năng...' },
          { id: 6, name: 'Spring Boot', description: 'Framework Java cho web app...' },
          { id: 7, name: 'MySQL', description: 'Hệ quản trị cơ sở dữ liệu...' },
          { id: 8, name: 'Docker', description: 'Containerization platform...' }
        ]);
      } catch (error) {
        console.error('❌ Error loading skills:', error);
        setAvailableSkills([
          { id: 1, name: 'Java', description: 'Lập trình hướng đối tượng với Java.' },
          { id: 2, name: 'JavaScript', description: 'Ngôn ngữ lập trình web...' },
          { id: 3, name: 'React', description: 'Thư viện JavaScript cho UI...' },
          { id: 4, name: 'Node.js', description: 'JavaScript runtime cho backend...' },
          { id: 5, name: 'Python', description: 'Ngôn ngữ lập trình đa năng...' },
          { id: 6, name: 'Spring Boot', description: 'Framework Java cho web app...' },
          { id: 7, name: 'MySQL', description: 'Hệ quản trị cơ sở dữ liệu...' },
          { id: 8, name: 'Docker', description: 'Containerization platform...' }
        ]);
      } finally {
        setSkillsLoading(false);
      }

      console.log('✅ All dropdown data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading dropdown data:', error);
      setDataLoadingError('Some form data failed to load. Using default options.');
    }
  };

  // ✅ Load positions when category changes
  useEffect(() => {
    if (formData.categoryId) {
      loadPositionsByCategory(formData.categoryId);
    }
  }, [formData.categoryId]);

  const loadPositionsByCategory = async (categoryId) => {
    try {
      console.log('🎯 Loading positions for category:', categoryId);
      setPositionsLoading(true);
      
      const positionsData = await jobPositionService.getJobPositionsByCategory(categoryId);
      console.log('🎯 Category positions loaded:', positionsData);
      
      let processedPositions = [];
      if (Array.isArray(positionsData)) {
        processedPositions = positionsData;
      } else if (positionsData?.data && Array.isArray(positionsData.data)) {
        processedPositions = positionsData.data;
      }
      
      if (processedPositions.length > 0) {
        setPositions(processedPositions);
        
        // Reset position selection if current selection is not in new list
        if (formData.positionId && !processedPositions.some(p => p.id == formData.positionId)) {
          setFormData(prev => ({ ...prev, positionId: '' }));
        }
      }
    } catch (error) {
      console.error('❌ Error loading positions by category:', error);
      // Keep existing positions if category-specific loading fails
    } finally {
      setPositionsLoading(false);
    }
  };

  // ✅ Enhanced loadUserPackage
  const loadUserPackage = async () => {
    try {
      setPackageLoading(true);
      setPackageError(null);
      
      console.log('📦 Loading package for user ID:', user?.id);
      
      if (!user?.id) {
        throw new Error('User ID not available. Please log in again.');
      }
      
      const packageInfo = await packageService.getUserActivePackage(user.id);
      console.log('📦 User package info:', packageInfo);
      
      if (!packageInfo) {
        setPackageError('No active package found. Please purchase a package to post jobs.');
        setUserPackage(null);
        setAvailablePostTypes([]);
        setRemainingPosts(0);
        setPackageStats(null);
        return;
      }
      
      setUserPackage(packageInfo);
      
      const currentJobCount = await jobServiceExtension.getUserJobCount();
      console.log('📊 Current job count:', currentJobCount);
      
      const remainingInfo = await packageService.calculateRemainingPosts(packageInfo, currentJobCount);
      console.log('📊 Remaining posts info:', remainingInfo);
      
      setAvailablePostTypes(remainingInfo.availableTypes);
      setRemainingPosts(remainingInfo.total);
      setPackageStats({
        totalLimit: remainingInfo.totalLimit,
        totalUsed: remainingInfo.totalUsed,
        byType: remainingInfo.byType
      });
      
      if (remainingInfo.availableTypes.length > 0 && !formData.postAt) {
        const availableType = remainingInfo.availableTypes.find(pt => pt.isAvailable);
        if (availableType) {
          setFormData(prev => ({
            ...prev,
            postAt: availableType.type
          }));
          console.log('📦 Set default post type:', availableType.type);
        }
      }
      
    } catch (error) {
      console.error('❌ Error loading user package:', error);
      setPackageError(error.message || 'Failed to load package information');
      setUserPackage(null);
      setAvailablePostTypes([]);
      setRemainingPosts(0);
      setPackageStats(null);
    } finally {
      setPackageLoading(false);
    }
  };

  // ✅ Load draft data if editing
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

  // ✅ Form handlers (unchanged)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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

  // ✅ Enhanced form validation
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
    } else {
      const packageValidation = packageService.validatePackageForJobPosting(userPackage, formData.postAt);
      
      if (!packageValidation.isValid) {
        errors.package = packageValidation.error;
      } else if (remainingPosts <= 0) {
        errors.package = 'You have reached your job posting limit. Please upgrade your package.';
      } else if (!formData.postAt) {
        errors.postAt = 'Post type is required';
      } else {
        const selectedPostType = availablePostTypes.find(pt => pt.type === formData.postAt);
        if (!selectedPostType) {
          errors.postAt = 'Selected post type is not available in your package';
        } else if (!selectedPostType.isAvailable) {
          errors.postAt = `You have no remaining ${selectedPostType.name} posts`;
        }
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Submit handlers (unchanged)
  const handleSubmit = async (status = 'active') => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      const packageValidation = packageService.validatePackageForJobPosting(userPackage, formData.postAt);
      if (!packageValidation.isValid) {
        throw new Error(packageValidation.error);
      }
      
      const selectedPostType = availablePostTypes.find(pt => pt.type === formData.postAt);
      if (!selectedPostType?.isAvailable) {
        throw new Error('Selected post type is not available');
      }
      
      const jobPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        salaryRange: formData.salaryRange.trim() || 'Competitive',
        experience: formData.experience.trim() || 'Not specified',
        location: formData.location.trim(),
        deadline: new Date(formData.deadline).toISOString(),
        postAt: formData.postAt,
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
        await onSave({ ...jobPayload, status });
      } else {
        const response = await jobService.createJob(jobPayload);
        console.log('✅ Job created successfully:', response);
        
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

  const handleSaveAsDraft = () => handleSubmit('draft');
  const handlePublish = () => handleSubmit('active');
  const handleCancel = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate('/recruiter/jobs/active');
    }
  };
  const handleUpgradePackage = () => navigate('/recruiter/account/billing');

  // ✅ Helper functions
  const getPostTypeName = (postType) => packageService.getPostTypeName(postType);
  const getPostTypeStyle = (postType) => {
    const styles = {
      'standard': { icon: '📝', color: '#6b7280', bgColor: '#f3f4f6' },
      'urgent': { icon: '🚨', color: '#ef4444', bgColor: '#fecaca' },
      'proposal': { icon: '💼', color: '#8b5cf6', bgColor: '#ede9fe' }
    };
    return styles[postType] || styles.standard;
  };

  // ✅ Calculate disable states
  const isFormDisabled = isSubmitting || isLoading;
  const isDropdownDisabled = isFormDisabled || categoriesLoading || typesLoading;
  const isSkillsDisabled = isFormDisabled || skillsLoading;
  const isPositionDisabled = isFormDisabled || positionsLoading;
  
  // ✅ Can submit logic
  const canSubmit = !isFormDisabled && userPackage && remainingPosts > 0;
  const canSaveDraft = !isFormDisabled; // Can always save draft regardless of package

  // ✅ Debug function
  const handleDebugInfo = () => {
    console.log('🐛 Debug Info:', {
      user,
      userPackage,
      formData,
      categories: categories.length,
      types: types.length,
      positions: positions.length,
      skills: availableSkills.length,
      selectedSkills: selectedSkills.length,
      canSubmit,
      canSaveDraft,
      remainingPosts
    });
    
    alert(`Debug Info:
User: ${user ? `✅ ID: ${user.id}` : '❌ Not loaded'}
Package: ${userPackage ? `✅ ${userPackage.servicePackage?.name}` : '❌ Not loaded'}
Remaining Posts: ${remainingPosts}
Can Submit: ${canSubmit}
Can Save Draft: ${canSaveDraft}
Data: Categories(${categories.length}), Types(${types.length}), Positions(${positions.length}), Skills(${availableSkills.length})

Check console for full details.`);
  };

  // ✅ Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="create-job-page">
        <div className="package-loading">
          <div className="loading-spinner-small"></div>
          <span>Loading user information...</span>
        </div>
      </div>
    );
  }

  // ✅ Show error if no user after loading
  if (!authLoading && !user) {
    return (
      <div className="create-job-page">
        <div className="package-error">
          <span className="error-icon">⚠️</span>
          <div className="error-content">
            <strong>Authentication Error:</strong> Please log in to create jobs.
            <button 
              className="upgrade-btn" 
              onClick={() => navigate('/login')}
            >
              🔐 Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-job-page">
      {!isModal && (
        <PageHeader 
          title="Create New Job"
          subtitle="Fill in the details to post a new job"
          showBackButton={true}
          onBack={handleCancel}
          actions={
            process.env.NODE_ENV === 'development' ? (
              <button 
                className="btn btn-outline btn-sm"
                onClick={handleDebugInfo}
              >
                🐛 Debug Info
              </button>
            ) : null
          }
        />
      )}
      
      {/* ✅ Data Loading Error Banner */}
      {dataLoadingError && (
        <div className="data-loading-error">
          <span className="warning-icon">⚠️</span>
          <span>{dataLoadingError}</span>
          <button 
            className="btn btn-outline btn-sm" 
            onClick={loadAllDropdownData}
          >
            🔄 Retry
          </button>
        </div>
      )}
      
      {/* ✅ Package Information Banner với better messaging */}
      <div className="package-info-banner">
        {packageLoading ? (
          <div className="package-loading">
            <div className="loading-spinner-small"></div>
            <span>Loading package information for user {user?.email}...</span>
          </div>
        ) : packageError ? (
          <div className="package-error">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              <strong>Package Required:</strong> {packageError}
              <p className="package-help-text">
                You can still fill out the job form, but you'll need an active package to publish jobs.
              </p>
              <div className="error-actions">
                <button 
                  className="upgrade-btn" 
                  onClick={handleUpgradePackage}
                >
                  🎯 Purchase Package
                </button>
                <button 
                  className="btn btn-outline btn-sm" 
                  onClick={loadUserPackage}
                  disabled={packageLoading}
                >
                  🔄 Retry
                </button>
              </div>
            </div>
          </div>
        ) : userPackage ? (
          <div className="package-active">
            <div className="package-main-info">
              <span className="package-icon">📦</span>
              <div className="package-details">
                <h4 className="package-name">{userPackage.servicePackage?.name}</h4>
                <p className="package-description">{userPackage.description}</p>
                <div className="package-meta">
                  <span className="package-meta-item">
                    👤 User: {user?.email}
                  </span>
                  <span className="package-meta-item">
                    💰 ${userPackage.price}
                  </span>
                  <span className="package-meta-item">
                    📅 Expires: {new Date(userPackage.expirationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="package-limits">
              <div className="limit-item">
                <span className="limit-label">Remaining Posts:</span>
                <span className={`limit-value ${remainingPosts <= 0 ? 'depleted' : remainingPosts <= 2 ? 'low' : 'good'}`}>
                  {remainingPosts}
                </span>
              </div>
              
              {packageStats && (
                <div className="limit-item">
                  <span className="limit-label">Total Used:</span>
                  <span className="limit-value">
                    {packageStats.totalUsed} / {packageStats.totalLimit}
                  </span>
                </div>
              )}
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
          {/* ✅ Basic Information - Always enabled */}
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
                placeholder="Describe the job responsibilities, requirements, and what you're looking for in a candidate..."
                rows={6}
                disabled={isFormDisabled}
              />
              {formErrors.description && (
                <span className="error-message">{formErrors.description}</span>
              )}
            </div>
          </div>

          {/* ✅ Job Details - Form enabled, submission conditional */}
          <div className="form-section">
            <h3 className="section-title">💼 Job Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoryId" className="form-label">
                  Category <span className="required">*</span>
                  {categoriesLoading && <span className="loading-indicator">⏳</span>}
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
                    {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                  </option>
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
                  {typesLoading && <span className="loading-indicator">⏳</span>}
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
                    {typesLoading ? 'Loading job types...' : 'Select job type'}
                  </option>
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="positionId" className="form-label">
                  Position <span className="required">*</span>
                  {positionsLoading && <span className="loading-indicator">⏳</span>}
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
                    {positionsLoading ? 'Loading positions...' : 'Select a position'}
                  </option>
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

            {/* ✅ Post Type Selection - Show but indicate package requirement */}
            <div className="form-group">
              <label className="form-label">
                Post Type <span className="required">*</span>
                {!userPackage && <span className="package-required">(Package Required)</span>}
              </label>
              <div className="post-type-selection">
                {availablePostTypes.length > 0 ? (
                  availablePostTypes.map(postType => {
                    const style = getPostTypeStyle(postType.type);
                    const isSelected = formData.postAt === postType.type;
                    const isAvailable = postType.isAvailable;
                    
                    return (
                      <div
                        key={postType.type}
                        className={`post-type-option ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''} ${!userPackage ? 'package-required-item' : ''}`}
                        onClick={() => {
                          if (isAvailable && !isFormDisabled && userPackage) {
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
                            {postType.remaining} / {postType.limit}
                          </span>
                        </div>
                        <p className="post-type-description">{postType.description}</p>
                        {!isAvailable && (
                          <div className="post-type-unavailable">
                            <span>No posts remaining</span>
                          </div>
                        )}
                        {!userPackage && (
                          <div className="post-type-package-required">
                            <span>Package required</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : !userPackage ? (
                  <div className="no-package-message">
                    <span className="warning-icon">📦</span>
                    <div className="no-package-content">
                      <h4>Package Required</h4>
                      <p>Purchase a package to see available post types and limits.</p>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={handleUpgradePackage}
                      >
                        🎯 View Packages
                      </button>
                    </div>
                  </div>
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

          {/* ✅ Skills Section - Always enabled */}
          <div className="form-section">
            <h3 className="section-title">
              🛠️ Required Skills
              {skillsLoading && <span className="loading-indicator">⏳</span>}
            </h3>
            <p className="section-description">
              Select the skills that are required for this position
            </p>
            
            <div className="skills-container">
              <div className="available-skills">
                <h4>Available Skills ({availableSkills.length})</h4>
                {skillsLoading ? (
                  <div className="skills-loading">
                    <div className="loading-spinner-small"></div>
                    <span>Loading skills...</span>
                  </div>
                ) : (
                  <div className="skills-grid">
                    {availableSkills.map(skill => (
                      <button
                        key={skill.id}
                        type="button"
                        className={`skill-item ${selectedSkills.some(s => s.id === skill.id) ? 'selected' : ''}`}
                        onClick={() => handleSkillToggle(skill)}
                        disabled={isSkillsDisabled}
                      >
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-description">{skill.description}</span>
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

          {/* ✅ Error Display */}
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

          {/* ✅ Form Actions with smart disable logic */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isFormDisabled}
            >
              Cancel
            </button>
            
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleSaveAsDraft}
              disabled={!canSaveDraft}
              title={!canSaveDraft ? "Cannot save draft while submitting" : "Save as draft"}
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </button>
            
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePublish}
              disabled={!canSubmit}
              title={!canSubmit ? (!userPackage ? "Package required to publish" : remainingPosts <= 0 ? "No remaining posts" : "Cannot publish") : "Publish job"}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Job'}
              {!userPackage && !isSubmitting && (
                <span className="btn-hint"> (Package Required)</span>
              )}
              {userPackage && remainingPosts <= 0 && !isSubmitting && (
                <span className="btn-hint"> (No Posts Left)</span>
              )}
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