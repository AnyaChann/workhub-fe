import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { jobService } from '../../../services/jobService';
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
  const [packageLimitError, setPackageLimitError] = useState('');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Check authentication when component mounts
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('❌ No user found, redirecting to login');
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Check package limitations when component mounts
  useEffect(() => {
    if (user && !authLoading) {
      checkPackageLimitations();
    }
  }, [user, authLoading]);

  // ✅ Check package limitations
  const checkPackageLimitations = async () => {
    try {
      console.log('📦 Checking package limitations for user:', user);

      // Check if user has an active package
      if (!user.activePackage || !user.activePackage.id) {
        setPackageLimitError('No active package found. Please purchase a package to post jobs.');
        setShowUpgradePrompt(true);
        return false;
      }

      // Get user's current job posting stats
      const userJobs = await jobService.getRecruiterJobs();
      const activeJobs = userJobs.filter(job => job.status === 'active');
      const draftJobs = userJobs.filter(job => job.status === 'draft');
      const totalJobs = activeJobs.length + draftJobs.length;

      const packageLimits = user.activePackage;
      console.log('📊 Package limits check:', {
        totalJobs,
        activeJobs: activeJobs.length,
        draftJobs: draftJobs.length,
        packageLimits,
        maxJobs: packageLimits.maxJobs,
        remainingJobs: packageLimits.maxJobs - totalJobs
      });

      // Check if package has expired
      if (packageLimits.expiresAt) {
        const expirationDate = new Date(packageLimits.expiresAt);
        const now = new Date();
        
        if (expirationDate < now) {
          setPackageLimitError('Your package has expired. Please renew your package to continue posting jobs.');
          setShowUpgradePrompt(true);
          return false;
        }
      }

      // Check if reached job posting limit
      if (totalJobs >= packageLimits.maxJobs) {
        setPackageLimitError(
          `You have reached your job posting limit (${packageLimits.maxJobs} jobs). Please upgrade your package to post more jobs.`
        );
        setShowUpgradePrompt(true);
        return false;
      }

      // Check if package is inactive
      if (packageLimits.status !== 'active') {
        setPackageLimitError('Your package is not active. Please contact support or renew your package.');
        setShowUpgradePrompt(true);
        return false;
      }

      // All checks passed
      setPackageLimitError('');
      setShowUpgradePrompt(false);
      return true;

    } catch (error) {
      console.error('❌ Error checking package limitations:', error);
      setPackageLimitError('Unable to verify your package status. Please try again or contact support.');
      return false;
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
      
      // ✅ Check package limitations before submitting
      const canPost = await checkPackageLimitations();
      if (!canPost) {
        setIsSubmitting(false);
        return;
      }

      // Prepare job payload
      const jobPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        salaryRange: formData.salaryRange.trim() || 'Competitive',
        experience: formData.experience.trim() || 'Not specified',
        location: formData.location.trim(),
        deadline: new Date(formData.deadline).toISOString(),
        category: {
          id: parseInt(formData.categoryId)
        },
        type: {
          id: parseInt(formData.typeId)
        },
        position: {
          id: parseInt(formData.positionId)
        },
        skills: formData.selectedSkills || formData.skills || []
      };
      
      console.log('📤 Submitting job with payload:', jobPayload);
      
      if (isModal && onSave) {
        await onSave({ ...jobPayload, status: 'active' });
      } else {
        const response = await jobService.createJob(jobPayload);
        console.log('✅ Job created successfully:', response);
        navigate('/recruiter/jobs/active');
      }
      
    } catch (error) {
      console.error('❌ Error creating job:', error);
      
      // ✅ Handle specific package-related errors
      if (error.response?.status === 402) { // Payment Required
        setPackageLimitError('Payment required. Your package may have expired or reached its limit.');
        setShowUpgradePrompt(true);
      } else if (error.response?.status === 403 && error.response?.data?.message?.includes('package')) {
        setPackageLimitError(error.response.data.message);
        setShowUpgradePrompt(true);
      } else if (error.response?.status === 429) { // Too Many Requests
        setPackageLimitError('You have reached your posting limit. Please upgrade your package.');
        setShowUpgradePrompt(true);
      } else {
        setSubmitError(error.message || 'Failed to create job. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      // ✅ Check package limitations for drafts too (optional)
      const canPost = await checkPackageLimitations();
      if (!canPost) {
        setIsSubmitting(false);
        return;
      }
      
      // Prepare draft payload
      const draftPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        salaryRange: formData.salaryRange.trim() || 'Competitive',
        experience: formData.experience.trim() || 'Not specified',
        location: formData.location.trim(),
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
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
      
      // ✅ Handle package-related errors for drafts
      if (error.response?.status === 402) {
        setPackageLimitError('Payment required. Your package may have expired or reached its limit.');
        setShowUpgradePrompt(true);
      } else if (error.response?.status === 403 && error.response?.data?.message?.includes('package')) {
        setPackageLimitError(error.response.data.message);
        setShowUpgradePrompt(true);
      } else if (error.response?.status === 429) {
        setPackageLimitError('You have reached your posting limit. Please upgrade your package.');
        setShowUpgradePrompt(true);
      } else {
        setSubmitError(error.message || 'Failed to save draft. Please try again.');
      }
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

  const handleUpgradePackage = () => {
    navigate('/recruiter/packages'); // Navigate to package upgrade page
  };

  const handleRetryPackageCheck = async () => {
    setPackageLimitError('');
    setShowUpgradePrompt(false);
    await checkPackageLimitations();
  };

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="create-job-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span>Loading user information...</span>
        </div>
      </div>
    );
  }

  // Show error if no user after loading
  if (!authLoading && !user) {
    return (
      <div className="create-job-page">
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <div className="error-content">
            <strong>Authentication Error:</strong> Please log in to create jobs.
            <button 
              className="btn btn-primary" 
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
        />
      )}

      {/* ✅ Package Limitation Error */}
      {packageLimitError && (
        <div className="package-error-banner">
          <div className="package-error-content">
            <span className="error-icon">📦</span>
            <div className="error-message">
              <strong>Package Limitation:</strong>
              <p>{packageLimitError}</p>
            </div>
            <div className="error-actions">
              {showUpgradePrompt && (
                <button 
                  className="btn btn-primary"
                  onClick={handleUpgradePackage}
                >
                  ⬆️ Upgrade Package
                </button>
              )}
              <button 
                className="btn btn-secondary"
                onClick={handleRetryPackageCheck}
              >
                🔄 Retry Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Package Info Display */}
      {user?.activePackage && !packageLimitError && (
        <div className="package-info-banner">
          <div className="package-info-content">
            <span className="info-icon">📋</span>
            <div className="package-details">
              <strong>Current Package: {user.activePackage.name}</strong>
              <p>
                Jobs remaining: {user.activePackage.maxJobs - (user.activePackage.usedJobs || 0)} 
                / {user.activePackage.maxJobs}
              </p>
              {user.activePackage.expiresAt && (
                <p>
                  Expires: {new Date(user.activePackage.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Job Form */}
      <JobForm
        initialData={getInitialData()}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onSaveAsDraft={handleSaveAsDraft}
        isSubmitting={isSubmitting}
        submitError={submitError}
        mode="create"
        showPackageInfo={false}
        showPostTypes={false}
        user={user}
        disabled={!!packageLimitError} // ✅ Disable form if package error
      />

      {/* Loading Overlay */}
      {(isSubmitting || isLoading) && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>
            {packageLimitError ? 'Checking package status...' : 'Creating your job posting...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateJobPage;