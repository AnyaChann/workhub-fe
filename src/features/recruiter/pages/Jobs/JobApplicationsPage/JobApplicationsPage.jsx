import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { applicationService } from '../../../services/applicationService';
import { mockDataService } from '../../../services/mockDataService';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import SearchSection from '../../../components/common/SearchSection/SearchSection';
import PageFooter from '../../../components/common/PageFooter/PageFooter';
import ApplicationCard from '../../../components/applications/ApplicationCard/ApplicationCard';
import ErrorBanner from '../../../components/common/ErrorBanner/ErrorBanner';
import NotificationToast from '../../../components/common/NotificationToast/NotificationToast';
import PopUp from '../../../components/common/PopUp/PopUp';
import { PageLoadingSpinner } from '../../../../../shared/components/LoadingSpinner/LoadingSpinner';
import './JobApplicationsPage.css';

const JobApplicationsPage = () => {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isRecruiter } = useAuth();
  const jobTitle = searchParams.get('jobTitle') || 'Unknown Job';
  
  // State management
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Load initial preferences from localStorage
  const getInitialPreferences = () => {
    try {
      const savedPreferences = localStorage.getItem('jobApplications_preferences');
      if (savedPreferences) {
        const { sortBy, viewMode, filterBy } = JSON.parse(savedPreferences);
        return {
          sortBy: sortBy || 'appliedAt',
          viewMode: viewMode || 'grid',
          filterBy: filterBy || 'all'
        };
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return { sortBy: 'appliedAt', viewMode: 'grid', filterBy: 'all' };
  };

  const initialPreferences = getInitialPreferences();
  const [sortBy, setSortBy] = useState(initialPreferences.sortBy);
  const [viewMode, setViewMode] = useState(initialPreferences.viewMode);
  const [filterBy, setFilterBy] = useState(initialPreferences.filterBy);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Modal states
  const [notification, setNotification] = useState(null);
  const [showStatusUpdateConfirm, setShowStatusUpdateConfirm] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState(null);

  useEffect(() => {
    if (jobId) {
      loadJobApplications();
    }
  }, [jobId]);

  // Apply filtering and sorting whenever dependencies change
  useEffect(() => {
    filterAndSortApplications();
  }, [allApplications, searchQuery, sortBy, filterBy]);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      const preferences = { sortBy, viewMode, filterBy };
      localStorage.setItem('jobApplications_preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }, [sortBy, viewMode, filterBy]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const loadJobApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingMockData(false);

      if (!isRecruiter()) {
        throw new Error('User is not authorized as recruiter');
      }

      console.log('📋 Loading applications for job:', jobId);
      const applicationsData = await applicationService.getJobApplications(jobId);
      
      console.log('📋 Applications loaded:', applicationsData.length);

      // Normalize applications data
      const normalizedApplications = applicationsData.map((app, index) => {
        // Try to find real applicationId
        let applicationId = null;
        let applicationIdSource = null;
        
        const appIdCandidates = [
          { key: 'applicationId', value: app.applicationId },
          { key: 'id', value: app.id },
          { key: 'application_id', value: app.application_id },
          { key: 'appId', value: app.appId },
          { key: 'app_id', value: app.app_id },
          { key: 'application.id', value: app.application?.id },
          { key: 'userApplicationId', value: app.userApplicationId }
        ];
        
        for (const candidate of appIdCandidates) {
          if (candidate.value !== null && 
              candidate.value !== undefined && 
              candidate.value !== '' &&
              !String(candidate.value).includes('@')) {
            
            applicationId = candidate.value;
            applicationIdSource = candidate.key;
            break;
          }
        }

        return {
          id: app.id || `temp_${index}`,
          applicationId: applicationId,
          applicationIdSource: applicationIdSource,
          canUpdate: !!applicationId,
          
          // Job info
          jobTitle: app.jobTitle || jobTitle || 'Unknown Job',
          jobId: jobId,
          
          // User info
          userFullname: app.userFullname || app.fullname || app.candidateName || app.name || 'Unknown Candidate',
          userEmail: app.userEmail || app.email || app.candidate_email || 'No email',
          userPhone: app.userPhone || app.phone || app.candidate_phone || null,
          userId: app.userId || app.user_id || app.candidateId || null,
          
          // Application info
          status: app.status || 'pending',
          appliedAt: app.appliedAt || app.applied_at || app.createdAt || app.created_at || new Date().toISOString(),
          
          // Resume info
          resumeFile: app.resumeFile || app.resume_file || app.files || app.attachments || [],
          resumeId: app.resumeId || app.resume_id || null,
          
          // Additional fields
          coverLetter: app.coverLetter || app.cover_letter || null,
          notes: app.notes || null,
          
          // Debug info
          _originalData: app
        };
      });

      const updatableCount = normalizedApplications.filter(app => app.canUpdate).length;
      const nonUpdatableCount = normalizedApplications.length - updatableCount;
      
      console.log(`📋 Applications summary: ${normalizedApplications.length} total, ${updatableCount} updatable, ${nonUpdatableCount} non-updatable`);
      
      if (nonUpdatableCount > 0) {
        console.warn(`⚠️ ${nonUpdatableCount} applications cannot be updated due to missing applicationId`);
      }

      setAllApplications(normalizedApplications);
      setApplications(normalizedApplications);
      setLastUpdated(new Date());

    } catch (err) {
      console.error('❌ Error loading job applications:', err);

      let errorMessage = 'Failed to load applications';
      let shouldShowMockData = false;

      if (err.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.status === 403) {
        errorMessage = 'Access denied. You need recruiter permissions.';
      } else if (err.status === 404) {
        errorMessage = 'Job not found or no applications available.';
        shouldShowMockData = true;
      } else if (err.status === 500) {
        errorMessage = 'Server error. The backend service is experiencing issues.';
        shouldShowMockData = true;
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
        shouldShowMockData = true;
      } else {
        errorMessage = err.message || 'Unknown error occurred';
        shouldShowMockData = true;
      }

      setError(errorMessage);

      if (shouldShowMockData && process.env.NODE_ENV === 'development') {
        console.log('🔄 Using mock data for job applications...');
        const mockApplications = mockDataService.getJobApplications(jobId);
        
        setAllApplications(mockApplications);
        setApplications(mockApplications);
        setUsingMockData(true);
        setLastUpdated(new Date());
      }

    } finally {
      setLoading(false);
    }
  };

  const filterAndSortApplications = () => {
    let filtered = [...allApplications];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.userFullname.toLowerCase().includes(query) ||
        app.userEmail.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query) ||
        app.coverLetter?.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (filterBy !== 'all') {
      filtered = filtered.filter(app => app.status === filterBy);
    }
    
    // Sort applications
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'appliedAt':
          return new Date(b.appliedAt) - new Date(a.appliedAt);
        case 'oldest':
          return new Date(a.appliedAt) - new Date(b.appliedAt);
        case 'name':
          return a.userFullname.localeCompare(b.userFullname);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    
    setApplications(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleRetry = async () => {
    console.log('🔄 Retrying to load job applications...');
    await loadJobApplications();
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setStatusUpdateData({ applicationId, newStatus });
    setShowStatusUpdateConfirm(true);
  };

  const confirmStatusUpdate = async () => {
    if (!statusUpdateData) return;

    const { applicationId, newStatus } = statusUpdateData;

    try {
      const originalApplication = allApplications.find(app => app.applicationId === applicationId);
      
      console.log('🔄 Status update requested:', {
        applicationId,
        newStatus,
        jobId,
        originalApplication
      });
      
      // Validate applicationId
      if (!applicationId || applicationId === 'undefined' || applicationId === 'null') {
        throw new Error('Invalid applicationId: ' + applicationId);
      }
      
      // Check if this is mock data
      if (String(applicationId).startsWith('mock_')) {
        console.log('🧪 Mock data detected - simulating status update');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update mock data locally
        setAllApplications(prev => prev.map(app => 
          app.applicationId === applicationId 
            ? { ...app, status: newStatus }
            : app
        ));
        
        showNotification(`Application status updated to "${newStatus}" successfully!`);
        return;
      }
      
      console.log('🔄 Calling real API...');
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      
      // Update local state
      setAllApplications(prev => prev.map(app => 
        app.applicationId === applicationId 
          ? { ...app, status: newStatus }
          : app
      ));
      
      console.log('✅ Status updated successfully');
      showNotification(`Application status updated to "${newStatus}" successfully!`);
      
    } catch (error) {
      console.error('❌ Status update failed:', error);
      
      let errorMessage = 'Failed to update application status: ' + error.message;
      
      if (error.message.includes('403')) {
        errorMessage += '\n\nPossible causes:\n- Invalid applicationId\n- No permission to update this application\n- Application belongs to different recruiter';
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setShowStatusUpdateConfirm(false);
      setStatusUpdateData(null);
    }
  };

  const handleDownloadResume = async (application) => {
    try {
      console.log('📥 Download requested for:', {
        applicationId: application.applicationId,
        resumeFile: application.resumeFile,
        resumeId: application.resumeId
      });
      
      // Mock data handling
      if (String(application.applicationId).startsWith('mock_')) {
        console.log('🧪 Mock download - would download:', application.resumeFile[0]);
        showNotification('Mock: File download simulated - ' + (application.resumeFile[0] || 'No file'), 'info');
        return;
      }
      
      if (application.resumeFile && application.resumeFile.length > 0) {
        const fileName = application.resumeFile[0];
        await applicationService.downloadResumeByApplication(application.applicationId, fileName);
        showNotification('Resume downloaded successfully!');
      } else {
        showNotification('No resume file available for download', 'warning');
      }
    } catch (error) {
      console.error('Download failed:', error);
      showNotification('Failed to download resume: ' + error.message, 'error');
    }
  };

  const handleContactCandidate = (application) => {
    console.log('📧 Contact candidate:', application.userEmail);
    
    const subject = `Regarding your application for ${application.jobTitle}`;
    const body = `Hello ${application.userFullname},%0D%0A%0D%0AThank you for your application for the ${application.jobTitle} position.%0D%0A%0D%0ABest regards`;
    
    window.location.href = `mailto:${application.userEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sortOption) => {
    console.log('🔄 Sort changed to:', sortOption);
    setSortBy(sortOption);
  };

  const handleViewModeChange = (mode) => {
    console.log('🔄 View mode changed to:', mode);
    setViewMode(mode);
  };

  const handleFilterChange = (filter) => {
    console.log('🔄 Filter changed to:', filter);
    setFilterBy(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToJobs = () => {
    navigate('/recruiter/dashboard/jobs');
  };

  // Calculate pagination
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = applications.slice(startIndex, endIndex);

  // Get status counts
  const getStatusCounts = () => {
    return {
      all: allApplications.length,
      pending: allApplications.filter(app => app.status === 'pending').length,
      accepted: allApplications.filter(app => app.status === 'accepted').length,
      rejected: allApplications.filter(app => app.status === 'rejected').length,
      reviewing: allApplications.filter(app => app.status === 'reviewing').length,
      interviewed: allApplications.filter(app => app.status === 'interviewed').length
    };
  };

  const statusCounts = getStatusCounts();

  // Footer quick actions
  const footerQuickActions = [
    {
      label: 'Quay lại danh sách jobs',
      icon: '←',
      onClick: handleBackToJobs,
      variant: 'secondary',
      tooltip: 'Quay lại danh sách công việc'
    },
    {
      label: 'Làm mới',
      icon: '🔄',
      onClick: handleRetry,
      variant: 'secondary',
      disabled: loading,
      loading: loading,
      tooltip: loading ? 'Đang tải...' : 'Tải lại danh sách ứng tuyển'
    },
    {
      label: 'Xuất Excel',
      icon: '📊',
      onClick: () => showNotification('Export feature coming soon!', 'info'),
      variant: 'secondary',
      tooltip: 'Xuất danh sách ra file Excel',
      disabled: applications.length === 0
    }
  ];

  // Footer stats
  const footerStats = [
    { label: 'Tổng ứng tuyển', value: allApplications.length, color: '#3b82f6' },
    { label: 'Đang hiển thị', value: currentApplications.length, color: '#10b981' },
    { label: 'Pending', value: statusCounts.pending, color: '#f59e0b' },
    { label: 'Accepted', value: statusCounts.accepted, color: '#10b981' },
    { label: 'Rejected', value: statusCounts.rejected, color: '#ef4444' }
  ];

  // Status update confirmation
  const statusUpdateIcon = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 12l2 2 4-4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2"/>
    </svg>
  );

  const statusUpdateActions = (
    <>
      <button 
        className="btn-secondary"
        onClick={() => setShowStatusUpdateConfirm(false)}
      >
        Hủy bỏ
      </button>
      <button 
        className="btn-primary"
        onClick={confirmStatusUpdate}
      >
        Cập nhật
      </button>
    </>
  );

  if (loading) {
    return <PageLoadingSpinner message="Loading applications..." />;
  }

  return (
    <div className="job-applications-page">
      <PageHeader 
        title={`Ứng tuyển cho "${decodeURIComponent(jobTitle)}"`}
        subtitle={applications.length > 0 
          ? `${applications.length.toLocaleString()} ứng tuyển${allApplications.length !== applications.length ? ` (từ ${allApplications.length} tổng cộng)` : ''}`
          : 'Chưa có ứng tuyển nào'
        }
        showBackButton={true}
        onBackClick={handleBackToJobs}
        showStats={true}
        stats={[
          { label: 'Tổng cộng', value: allApplications.length, color: '#3b82f6' },
          { label: 'Pending', value: statusCounts.pending, color: '#f59e0b' },
          { label: 'Accepted', value: statusCounts.accepted, color: '#10b981' },
          { label: 'Rejected', value: statusCounts.rejected, color: '#ef4444' }
        ]}
        breadcrumbs={[
          { label: 'Dashboard', href: '/recruiter/dashboard' },
          { label: 'Công việc', href: '/recruiter/dashboard/jobs' },
          { label: 'Ứng tuyển' }
        ]}
      />

      {/* Error Banner */}
      {error && (
        <ErrorBanner
          error={error}
          onRetry={handleRetry}
          showMockDataNotice={usingMockData}
        />
      )}

      <SearchSection 
        placeholder="Tìm kiếm theo tên ứng viên, email, trạng thái..."
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        sortOptions={[
          { value: 'appliedAt', label: 'Ứng tuyển gần nhất' },
          { value: 'oldest', label: 'Ứng tuyển cũ nhất' },
          { value: 'name', label: 'Tên ứng viên A-Z' },
          { value: 'status', label: 'Trạng thái' }
        ]}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showResults={applications.length !== allApplications.length}
        resultsCount={applications.length}
        totalCount={allApplications.length}
        showViewToggle={true}
        storageKey="jobApplications"
      />
      
      {/* Status filter tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filterBy === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          Tất cả ({statusCounts.all})
        </button>
        <button 
          className={`filter-tab ${filterBy === 'pending' ? 'active' : ''}`}
          onClick={() => handleFilterChange('pending')}
        >
          Pending ({statusCounts.pending})
        </button>
        <button 
          className={`filter-tab ${filterBy === 'accepted' ? 'active' : ''}`}
          onClick={() => handleFilterChange('accepted')}
        >
          Accepted ({statusCounts.accepted})
        </button>
        <button 
          className={`filter-tab ${filterBy === 'rejected' ? 'active' : ''}`}
          onClick={() => handleFilterChange('rejected')}
        >
          Rejected ({statusCounts.rejected})
        </button>
        {statusCounts.reviewing > 0 && (
          <button 
            className={`filter-tab ${filterBy === 'reviewing' ? 'active' : ''}`}
            onClick={() => handleFilterChange('reviewing')}
          >
            Reviewing ({statusCounts.reviewing})
          </button>
        )}
        {statusCounts.interviewed > 0 && (
          <button 
            className={`filter-tab ${filterBy === 'interviewed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('interviewed')}
          >
            Interviewed ({statusCounts.interviewed})
          </button>
        )}
      </div>

      {/* Applications content */}
      <div className="applications-container">
        {currentApplications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>
              {searchQuery 
                ? 'Không tìm thấy ứng tuyển phù hợp'
                : filterBy !== 'all'
                ? `Không có ứng tuyển với trạng thái "${filterBy}"`
                : 'Chưa có ứng tuyển nào'
              }
            </h3>
            <p>
              {searchQuery 
                ? `Không có ứng tuyển nào phù hợp với "${searchQuery}". Thử điều chỉnh từ khóa tìm kiếm.`
                : filterBy !== 'all'
                ? 'Thử chọn tab trạng thái khác để xem ứng tuyển.'
                : allApplications.length === 0
                ? 'Chưa có ứng viên nào ứng tuyển vào công việc này.'
                : 'Thử điều chỉnh bộ lọc để xem ứng tuyển.'
              }
            </p>
            {searchQuery && (
              <button 
                className="btn-secondary"
                onClick={() => setSearchQuery('')}
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        ) : (
          <div className={`applications-grid ${viewMode}`}>
            {currentApplications.map(application => (
              <ApplicationCard
                key={application.id}
                application={application}
                onStatusUpdate={handleStatusUpdate}
                onDownload={() => handleDownloadResume(application)}
                onContact={() => handleContactCandidate(application)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Page Footer with Pagination */}
      <PageFooter
        // Pagination props
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={applications.length}
        showInfo={true}
        forceShowPagination={true}
        
        // Footer content props
        showFooterInfo={true}
        showQuickActions={false}
        quickActions={footerQuickActions}
        showLastUpdated={true}
        lastUpdated={lastUpdated}
        showStats={false}
        stats={footerStats}
        
        // Styling
        variant="detailed"
        className={`job-applications-footer ${loading ? 'loading' : ''} ${error ? 'error' : 'success'}`}
      />

      {/* Status Update Confirmation Popup */}
      <PopUp
        isOpen={showStatusUpdateConfirm}
        onClose={() => setShowStatusUpdateConfirm(false)}
        title="Xác nhận cập nhật trạng thái"
        type="info"
        icon={statusUpdateIcon}
        actions={statusUpdateActions}
        size="medium"
      >
        {statusUpdateData && (
          <p>
            Bạn có chắc chắn muốn cập nhật trạng thái ứng tuyển thành <strong>"{statusUpdateData.newStatus}"</strong>?
          </p>
        )}
      </PopUp>

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
};

export default JobApplicationsPage;