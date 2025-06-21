import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { jobService } from '../../../services/jobService';
import { packageService, jobServiceExtension } from '../../../services/packageService';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import JobForm from '../../../components/forms/JobForm/JobForm';
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
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Package information state
  const [userPackage, setUserPackage] = useState(null);
  const [packageLoading, setPackageLoading] = useState(false);
  const [packageError, setPackageError] = useState(null);
  const [remainingPosts, setRemainingPosts] = useState(0);
  const [availablePostTypes, setAvailablePostTypes] = useState([]);
  const [packageStats, setPackageStats] = useState(null);

  // Load package when user is available
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

  // Enhanced loadUserPackage
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

  // Get initial data for editing draft
  const getInitialData = () => {
    const draftData = location.state?.jobData;
    if (draftData) {
      console.log('📝 Loading draft data:', draftData);
      
      // Format deadline for date input
      let formattedDeadline = '';
      if (draftData.deadline) {
        try {
          const deadlineDate = new Date(draftData.deadline);
          formattedDeadline = deadlineDate.toISOString().split('T')[0];
        } catch (error) {
          console.warn('⚠️ Error formatting deadline:', error);
        }
      }

      return {
        title: draftData.title || '',
        description: draftData.description || '',
        salaryRange: draftData.salaryRange || '',
        experience: draftData.experience || '',
        location: draftData.location || '',
        deadline: formattedDeadline,
        postAt: draftData.postAt || '',
        categoryId: draftData.categoryId || '',
        typeId: draftData.typeId || '',
        positionId: draftData.positionId || '',
        skills: draftData.skills || [],
        // Include string values for auto-matching
        category: draftData.category,
        type: draftData.type,
        position: draftData.position
      };
    }
    return null;
  };

  // Submit handlers
  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      // Package validation
      const packageValidation = packageService.validatePackageForJobPosting(userPackage, formData.postAt);
      if (!packageValidation.isValid) {
        throw new Error(packageValidation.error);
      }
      
      const selectedPostType = availablePostTypes.find(pt => pt.type === formData.postAt);
      if (!selectedPostType?.isAvailable) {
        throw new Error('Selected post type is not available');
      }
      
      // Prepare job payload
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
        skills: formData.selectedSkills || formData.skills
      };
      
      console.log('📤 Submitting job with payload:', jobPayload);
      
      if (isModal && onSave) {
        await onSave({ ...jobPayload, status: 'active' });
      } else {
        const response = await jobService.createJob(jobPayload);
        console.log('✅ Job created successfully:', response);
        
        // Reload package to update remaining posts
        await loadUserPackage();
        
        navigate('/recruiter/jobs/active');
      }
      
    } catch (error) {
      console.error('❌ Error creating job:', error);
      setSubmitError(error.message || 'Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      // Prepare draft payload
      const draftPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        salaryRange: formData.salaryRange.trim() || 'Competitive',
        experience: formData.experience.trim() || 'Not specified',
        location: formData.location.trim(),
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        postAt: formData.postAt || 'STANDARD',
        category: formData.categoryId ? {
          id: parseInt(formData.categoryId)
        } : null,
        type: formData.typeId ? {
          id: parseInt(formData.typeId)
        } : null,
        position: formData.positionId ? {
          id: parseInt(formData.positionId)
        } : null,
        skills: formData.selectedSkills || formData.skills || [],
        status: 'draft'
      };
      
      console.log('💾 Saving draft with payload:', draftPayload);
      
      if (isModal && onSave) {
        await onSave(draftPayload);
      } else {
        const response = await jobService.createJob(draftPayload);
        console.log('✅ Draft saved successfully:', response);
        
        navigate('/recruiter/jobs/drafts');
      }
      
    } catch (error) {
      console.error('❌ Error saving draft:', error);
      setSubmitError(error.message || 'Failed to save draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate('/recruiter/jobs/active');
    }
  };

  const handleUpgradePackage = () => navigate('/recruiter/account/billing');

  // Debug function
  const handleDebugInfo = () => {
    console.log('🐛 Debug Info:', {
      user,
      userPackage,
      remainingPosts,
      availablePostTypes,
      packageStats
    });
    
    alert(`Debug Info:
User: ${user ? `✅ ID: ${user.id}` : '❌ Not loaded'}
Package: ${userPackage ? `✅ ${userPackage.servicePackage?.name}` : '❌ Not loaded'}
Remaining Posts: ${remainingPosts}
Available Post Types: ${availablePostTypes.length}

Check console for full details.`);
  };

  // Show loading if auth is still loading
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

  // Show error if no user after loading
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
      
      {/* Package Information Banner */}
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

      {/* Job Form */}
      <JobForm
        initialData={getInitialData()}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onSaveAsDraft={handleSaveAsDraft}
        isSubmitting={isSubmitting}
        submitError={submitError}
        mode="create"
        showPackageInfo={false} // We handle package info above
        showPostTypes={true}
        user={user}
        userPackage={userPackage}
        remainingPosts={remainingPosts}
        availablePostTypes={availablePostTypes}
      />

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