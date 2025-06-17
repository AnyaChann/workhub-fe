import React, { useState, useRef, useEffect } from 'react';
import './CreateJob.css';
import { InlineLoadingSpinner, ButtonLoadingSpinner } from '../../../../shared/components/LoadingSpinner/LoadingSpinner';

// Components
import CompanySection from './components/CompanySection/CompanySection';
import JobBasicInfo from './components/JobBasicInfo/JobBasicInfo';
import JobTypeSection from './components/JobTypeSection/JobTypeSection';
import CategorySection from './components/CategorySection/CategorySection';
import PaySection from './components/PaySection/PaySection';
import FormActions from './components/FormActions/FormActions';
import JobCheckout from './components/JobCheckout/JobCheckout';
import DebugPanel from './components/DebugPanel/DebugPanel';

// Hooks
import { useCreateJobForm } from '../../../../shared/hooks/useCreateJobForm';

const CreateJob = ({ onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [completedJobData, setCompletedJobData] = useState(null);
  const [showDebug, setShowDebug] = useState(false); //  Disabled by default
  const dropdownRef = useRef(null);

  const {
    formData,
    errors,
    handleInputChange,
    handleDescriptionChange,
    updateField,
    validateForm,
    getApiPayload,
    setFormData
  } = useCreateJobForm();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debug keyboard shortcut (Ctrl + D)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (process.env.NODE_ENV !== 'development') return;
      
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        setShowDebug(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isFormValid = () => {
    return formData.title.trim() &&
      formData.location.trim() &&
      Array.isArray(formData.description) &&
      formData.description.length &&
      formData.description.some(block =>
        block.children &&
        block.children.some(child => child.text && child.text.trim())
      ) &&
      formData.type_id &&
      formData.category_id &&
      formData.position_id &&
      formData.experience &&
      formData.deadline;
  };

  const handleAutoFill = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 30); // 30 days from now

    const autoFillData = {
      // Basic Info
      title: 'Senior Software Engineer - React/Node.js',
      location: 'Ho Chi Minh City, Vietnam',
      experience: 'senior-level',
      deadline: tomorrow.toISOString().split('T')[0],
      
      // Company Info
      companyName: 'TechCorp Vietnam',
      showCompanyNameAndLogo: true,
      
      // Job Details
      category_id: '1', // Technology
      position_id: '1', // Software Engineer
      type_id: '1', // Assuming Full-time is ID 1
      
      // Salary
      salary_range: {
        min: '50000',
        max: '80000',
        type: 'annual',
        display: true
      },
      
      // Description - Rich text format
      description: [
        {
          type: 'paragraph',
          children: [
            { text: 'We are looking for a ' },
            { text: 'Senior Software Engineer', bold: true },
            { text: ' to join our dynamic team and help build cutting-edge web applications.' }
          ],
        },
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
        {
          type: 'paragraph',
          children: [
            { text: 'Key Responsibilities:', bold: true }
          ],
        },
        {
          type: 'paragraph',
          children: [
            { text: 'â€¢ Develop and maintain React.js applications\nâ€¢ Build scalable Node.js backend services\nâ€¢ Collaborate with cross-functional teams\nâ€¢ Mentor junior developers\nâ€¢ Participate in code reviews and technical planning' }
          ],
        },
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
        {
          type: 'paragraph',
          children: [
            { text: 'Requirements:', bold: true }
          ],
        },
        {
          type: 'paragraph',
          children: [
            { text: 'â€¢ 5+ years of experience in software development\nâ€¢ Strong proficiency in React.js and Node.js\nâ€¢ Experience with TypeScript, Redux, and REST APIs\nâ€¢ Knowledge of database design (SQL/NoSQL)\nâ€¢ Excellent problem-solving skills\nâ€¢ Bachelor\'s degree in Computer Science or related field' }
          ],
        },
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
        {
          type: 'paragraph',
          children: [
            { text: 'What We Offer:', bold: true }
          ],
        },
        {
          type: 'paragraph',
          children: [
            { text: 'â€¢ Competitive salary and benefits\nâ€¢ Flexible working hours\nâ€¢ Professional development opportunities\nâ€¢ Modern office environment\nâ€¢ Health insurance and annual bonus' }
          ],
        }
      ],
      
      // Dates
      post_at: new Date().toISOString().split('T')[0],
      status: 'draft',
      recruiter_id: null
    };

    setFormData(autoFillData);
    console.log('Auto-filled form with sample data');
  };

  const handleClearForm = () => {
    const emptyData = {
      title: '',
      location: '',
      description: [{ type: 'paragraph', children: [{ text: '' }] }],
      companyName: '',
      showCompanyNameAndLogo: true,
      category_id: '',
      position_id: '',
      type_id: '',
      experience: 'entry-level',
      salary_range: {
        min: '',
        max: '',
        type: 'annual',
        display: true
      },
      deadline: '',
      post_at: new Date().toISOString().split('T')[0],
      status: 'draft',
      recruiter_id: null
    };

    setFormData(emptyData);
    console.log('Form cleared');
  };

  const handleSaveAsDraft = async () => {
    setLoading(true);
    setShowDropdown(false);
    try {
      const jobData = {
        ...getApiPayload(),
        status: 'draft',
        created_at: new Date().toISOString()
      };

      if (onSave) {
        await onSave(jobData);
      }

      console.log('Saved as draft:', jobData);
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardConfirm = () => {
    setShowDiscardModal(false);
    setShowDropdown(false);
    if (onClose) {
      onClose();
    }
  };

  const handleDiscardCancel = () => {
    setShowDiscardModal(false);
  };

  const handleNext = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const jobData = {
          ...getApiPayload(),
          status: 'pending_payment',
          created_at: new Date().toISOString()
        };

        setCompletedJobData(jobData);
        setShowCheckout(true);

        console.log('Job ready for checkout:', jobData);
      } catch (error) {
        console.error('Error preparing job for checkout:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackFromCheckout = () => {
    setShowCheckout(false);
    setCompletedJobData(null);
  };

  const handlePaymentComplete = async (paymentData) => {
    setLoading(true);
    try {
      const finalJobData = {
        ...paymentData.jobData,
        status: 'active',
        plan: paymentData.plan,
        planDetails: paymentData.planDetails,
        billingInfo: paymentData.billingInfo,
        pricing: paymentData.pricing,
        startDate: paymentData.startDate,
        expiryDate: paymentData.expiryDate
      };

      if (onSave) {
        await onSave(finalJobData);
      }

      console.log('Job posted successfully:', finalJobData);
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show checkout if user completed job form
  if (showCheckout && completedJobData) {
    return (
      <JobCheckout
        jobData={completedJobData}
        onBack={handleBackFromCheckout}
        onPayment={handlePaymentComplete}
      />
    );
  }

  return (
    <div className="create-job-container">
      {/* Debug Panel - Only show in development and when enabled */}
      {showDebug && process.env.NODE_ENV === 'development' && (
        <DebugPanel
          formData={formData}
          errors={errors}
          isValid={isFormValid()}
          onAutoFill={handleAutoFill}
          onClear={handleClearForm}
          onClose={() => setShowDebug(false)}
        />
      )}

      <div className="create-job-header">
        <div className="header-content">
          <h1 className="page-title">Create New Job Posting</h1>

          <div className="header-actions">
            {/* Debug Toggle Button (Development only) */}
            {process.env.NODE_ENV === 'development' && (
              <button
                className="debug-toggle-btn"
                onClick={() => setShowDebug(!showDebug)}
                title="Toggle Debug Panel (Ctrl+D)"
              >
                ðŸ› Debug
              </button>
            )}

            {/* Save as Draft Dropdown */}
            <div className="save-draft-dropdown" ref={dropdownRef}>
              <div className="dropdown-trigger">
                <button
                  className="save-draft-btn header-save-btn"
                  onClick={handleSaveAsDraft}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save as draft'}
                </button>
                <button
                  className="dropdown-arrow-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                  disabled={loading}
                >
                  <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>â–¼</span>
                </button>
              </div>

              {showDropdown && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item discard-item"
                    onClick={() => setShowDiscardModal(true)}
                  >
                    <span className="dropdown-icon">ðŸ—‘ï¸</span>
                    Discard job post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="create-job-content">
        <form className="job-form">
          <CompanySection
            companyName={formData.companyName}
            showCompanyNameAndLogo={formData.showCompanyNameAndLogo}
            onChange={handleInputChange}
            error={errors.companyName}
          />

          <JobBasicInfo
            title={formData.title}
            location={formData.location}
            description={formData.description}
            experience={formData.experience}
            deadline={formData.deadline}
            onChange={handleInputChange}
            onDescriptionChange={handleDescriptionChange}
            errors={errors}
          />

          <JobTypeSection
            type_id={formData.type_id}
            onChange={handleInputChange}
            errors={errors}
          />

          <CategorySection
            category_id={formData.category_id}
            position_id={formData.position_id}
            onChange={handleInputChange}
            errors={errors}
          />

          <PaySection
            salary_range={formData.salary_range}
            category_id={formData.category_id}
            position_id={formData.position_id}
            onChange={handleInputChange}
            updateField={updateField}
            errors={errors}
          />

          <FormActions
            onSaveAsDraft={handleSaveAsDraft}
            onNext={handleNext}
            onClose={onClose}
            isValid={isFormValid()}
            loading={loading}
          />
        </form>
      </div>

      {/* Discard Confirmation Modal */}
      {showDiscardModal && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Discard job post?</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to discard this job post? All your changes will be lost.</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={handleDiscardCancel}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDiscardConfirm}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateJob;
