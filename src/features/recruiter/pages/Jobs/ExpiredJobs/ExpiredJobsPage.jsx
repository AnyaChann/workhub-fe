import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { jobService } from '../../../services/jobService';
import { mockDataService } from '../../../services/mockDataService';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import SearchSection from '../../../components/common/SearchSection/SearchSection';
import JobsList from '../../../components/jobs/JobsList/JobsList';
import PageFooter from '../../../components/common/PageFooter/PageFooter';
import PopUp from '../../../components/common/PopUp/PopUp';
import ErrorBanner from '../../../components/common/ErrorBanner/ErrorBanner';
import NotificationToast from '../../../components/common/NotificationToast/NotificationToast';
import EditJobModal from '../../../components/Modal/EditJobModal/EditJobModal';
import './ExpiredJobsPage.css';

const ExpiredJobsPage = ({ onCreateJob }) => {
  // State management
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load initial preferences from localStorage
  const getInitialPreferences = () => {
    try {
      const savedPreferences = localStorage.getItem('expiredJobs_preferences');
      if (savedPreferences) {
        const { sortBy, viewMode } = JSON.parse(savedPreferences);
        return {
          sortBy: sortBy || 'newest',
          viewMode: viewMode || 'list'
        };
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return { sortBy: 'newest', viewMode: 'list' };
  };

  const initialPreferences = getInitialPreferences();
  const [sortBy, setSortBy] = useState(initialPreferences.sortBy);
  const [viewMode, setViewMode] = useState(initialPreferences.viewMode);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [usingMockData, setUsingMockData] = useState(false);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showReactivateConfirm, setShowReactivateConfirm] = useState(false);
  const [jobToReactivate, setJobToReactivate] = useState(null);
  const [notification, setNotification] = useState(null);

  const { user, isRecruiter } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  // Apply sorting whenever sortBy changes
  useEffect(() => {
    if (jobs.length > 0) {
      applySorting(sortBy);
    }
  }, [sortBy]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const applySorting = (sortOption) => {
    const sorted = [...jobs].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'expiredDate':
          return new Date(b.expiredAt || b.deadline) - new Date(a.expiredAt || a.deadline);
        case 'applications':
          return (b.applicationsCount || 0) - (a.applicationsCount || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    setJobs(sorted);
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingMockData(false);

      if (!isRecruiter()) {
        throw new Error('User is not authorized as recruiter');
      }

      console.log('📋 Loading expired jobs from API...');
      const response = await jobService.getRecruiterJobs();

      const expiredJobs = Array.isArray(response)
        ? response.filter(job => {
          const isExpired = job.status === 'expired' || 
            job.isExpired || 
            (job.deadline && new Date(job.deadline) < new Date());
          return isExpired;
        })
        : [];

      console.log('✅ Expired jobs loaded:', expiredJobs.length);

      setAllJobs(expiredJobs);
      setJobs(expiredJobs);
      setLastUpdated(new Date());

    } catch (err) {
      console.error('❌ Error loading expired jobs:', err);

      let errorMessage = 'Failed to load expired jobs';
      let shouldShowMockData = false;

      if (err.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.status === 403) {
        errorMessage = 'Access denied. You need recruiter permissions.';
      } else if (err.status === 404) {
        errorMessage = 'Jobs endpoint not found. Please check API configuration.';
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
        console.log('🔄 Using mock data for expired jobs...');
        const mockJobs = mockDataService.getExpiredJobs();
        
        // Add applications count to mock jobs
        const jobsWithApplications = mockJobs.map(job => ({
          ...job,
          applicationsCount: mockDataService.getApplicationsCount(job.id)
        }));

        setAllJobs(jobsWithApplications);
        setJobs(jobsWithApplications);
        setUsingMockData(true);
        setLastUpdated(new Date());
      }

    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    console.log('🔄 Retrying to load expired jobs...');
    await loadJobs();
  };

  const handleEditJob = (job) => {
    console.log('🖊️ Edit expired job triggered:', job);
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (jobId) => {
    console.log('✅ Edit success for job ID:', jobId);
    setIsEditModalOpen(false);
    setSelectedJob(null);
    showNotification('Job updated successfully!');
    loadJobs();
  };

  const handleDeleteJob = (job) => {
    setJobToDelete(job);
    setShowDeleteConfirm(true);
  };

  const handleReactivateJob = (job) => {
    setJobToReactivate(job);
    setShowReactivateConfirm(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      console.log('🗑️ Deleting expired job:', jobToDelete.id);

      if (jobToDelete.id.toString().startsWith('mock-')) {
        console.log('🔄 Deleting mock job (local only)');
        const updatedJobs = allJobs.filter(j => j.id !== jobToDelete.id);
        setAllJobs(updatedJobs);
        setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));
        showNotification(`Job "${jobToDelete.title}" deleted successfully!`);
      } else {
        await jobService.deleteJob(jobToDelete.id);
        const updatedJobs = allJobs.filter(j => j.id !== jobToDelete.id);
        setAllJobs(updatedJobs);
        setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));
        showNotification(`Job "${jobToDelete.title}" deleted successfully!`);
      }

      console.log('✅ Expired job deleted successfully');

    } catch (err) {
      console.error('❌ Error deleting expired job:', err);

      let errorMessage = 'Failed to delete job. Please try again.';

      if (err.status === 403) {
        errorMessage = 'You do not have permission to delete this job.';
      } else if (err.status === 404) {
        errorMessage = 'This job could not be found. It may have been deleted already.';
        const updatedJobs = allJobs.filter(j => j.id !== jobToDelete.id);
        setAllJobs(updatedJobs);
        setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));
      } else if (err.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      }

      showNotification(errorMessage, 'error');
    } finally {
      setShowDeleteConfirm(false);
      setJobToDelete(null);
    }
  };

  const confirmReactivateJob = async () => {
    if (!jobToReactivate) return;

    try {
      console.log('🔄 Reactivating job:', jobToReactivate.id);

      if (jobToReactivate.id.toString().startsWith('mock-')) {
        console.log('🔄 Reactivating mock job (local only)');
        const updatedJob = {
          ...jobToReactivate,
          status: 'active',
          isExpired: false,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        };
        
        // Remove from expired list
        const updatedJobs = allJobs.filter(j => j.id !== jobToReactivate.id);
        setAllJobs(updatedJobs);
        setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));
        showNotification(`Job "${jobToReactivate.title}" reactivated successfully!`);
      } else {
        const updatedJob = {
          ...jobToReactivate,
          status: 'active',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        };
        
        await jobService.updateJob(jobToReactivate.id, updatedJob);
        
        // Remove from expired list
        const updatedJobs = allJobs.filter(j => j.id !== jobToReactivate.id);
        setAllJobs(updatedJobs);
        setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));
        showNotification(`Job "${jobToReactivate.title}" reactivated successfully!`);
      }

      console.log('✅ Job reactivated successfully');

    } catch (err) {
      console.error('❌ Error reactivating job:', err);
      showNotification('Failed to reactivate job. Please try again.', 'error');
    } finally {
      setShowReactivateConfirm(false);
      setJobToReactivate(null);
    }
  };

  const handleDuplicateJob = async (job) => {
    console.log('📄 Duplicate expired job:', job);
    showNotification('Duplicate job feature coming soon!', 'info');
  };

  const handleViewApplications = async (job) => {
    console.log('👁️ View applications for expired job:', job.id);
    navigate(`/recruiter/dashboard/jobs/${job.id}/applications?jobTitle=${encodeURIComponent(job.title)}`);
  };

  const filterJob = (job, query) => {
    if (!query) return true;
    const searchTerms = query.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchTerms) ||
      job.location?.toLowerCase().includes(searchTerms) ||
      job.description?.toLowerCase().includes(searchTerms) ||
      job.displaySalary?.toLowerCase().includes(searchTerms) ||
      job.category?.toLowerCase().includes(searchTerms) ||
      job.type?.toLowerCase().includes(searchTerms) ||
      job.position?.toLowerCase().includes(searchTerms)
    );
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    const filtered = allJobs.filter(job => filterJob(job, query));
    setJobs(filtered);
  };

  const handleSortChange = (sortOption) => {
    console.log('🔄 Sort changed to:', sortOption);
    setSortBy(sortOption);
    applySorting(sortOption);
  };

  const handleViewModeChange = (mode) => {
    console.log('🔄 View mode changed to:', mode);
    setViewMode(mode);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  // Footer quick actions
  const footerQuickActions = [
    {
      label: 'Đăng công việc mới',
      icon: '➕',
      onClick: onCreateJob,
      variant: 'primary',
      tooltip: 'Tạo tin tuyển dụng mới'
    },
    {
      label: 'Làm mới',
      icon: '🔄',
      onClick: handleRetry,
      variant: 'secondary',
      disabled: loading,
      loading: loading,
      tooltip: loading ? 'Đang tải...' : 'Tải lại danh sách công việc hết hạn'
    },
    {
      label: 'Xuất Excel',
      icon: '📊',
      onClick: () => showNotification('Export feature coming soon!', 'info'),
      variant: 'secondary',
      tooltip: 'Xuất danh sách ra file Excel',
      disabled: jobs.length === 0
    }
  ];

  // Footer stats
  const footerStats = [
    { label: 'Tổng hết hạn', value: allJobs.length, color: '#ef4444' },
    { label: 'Đang hiển thị', value: currentJobs.length, color: '#10b981' },
    { label: 'Đang tìm kiếm', value: searchQuery ? jobs.length : 'Không', color: searchQuery ? '#f59e0b' : '#6b7280' },
    { label: 'Trang hiện tại', value: `${currentPage}/${totalPages}`, color: '#8b5cf6' }
  ];

  // Delete confirmation icon and actions
  const deleteIcon = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
      <line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" strokeWidth="2"/>
      <line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" strokeWidth="2"/>
    </svg>
  );

  const deleteActions = (
    <>
      <button 
        className="btn-secondary"
        onClick={() => setShowDeleteConfirm(false)}
      >
        Hủy bỏ
      </button>
      <button 
        className="btn-danger"
        onClick={confirmDeleteJob}
      >
        Xóa công việc
      </button>
    </>
  );

  // Reactivate confirmation icon and actions
  const reactivateIcon = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 4v6h6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const reactivateActions = (
    <>
      <button 
        className="btn-secondary"
        onClick={() => setShowReactivateConfirm(false)}
      >
        Hủy bỏ
      </button>
      <button 
        className="btn-success"
        onClick={confirmReactivateJob}
      >
        Kích hoạt lại
      </button>
    </>
  );

  return (
    <div className="expired-jobs-page">
      <PageHeader
        title="Công việc hết hạn"
        subtitle={jobs.length > 0 ? `${jobs.length.toLocaleString()} công việc hết hạn` : 'Chưa có công việc hết hạn'}
        onCreateJob={onCreateJob}
        showStats={true}
        stats={[
          { label: 'Tổng cộng', value: allJobs.length, color: '#ef4444' },
          { label: 'Đang hiển thị', value: jobs.length, color: '#f59e0b' },
          { label: 'Trang hiện tại', value: `${currentPage}/${totalPages}`, color: '#8b5cf6' }
        ]}
        breadcrumbs={[
          { label: 'Dashboard', href: '/recruiter/dashboard' },
          { label: 'Công việc', href: '/recruiter/dashboard/jobs' },
          { label: 'Hết hạn' }
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
        placeholder="Tìm kiếm theo tiêu đề, địa điểm, mô tả, danh mục..."
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        sortOptions={[
          { value: 'newest', label: 'Mới nhất' },
          { value: 'oldest', label: 'Cũ nhất' },
          { value: 'expiredDate', label: 'Ngày hết hạn' },
          { value: 'applications', label: 'Số ứng tuyển' },
          { value: 'title', label: 'Tiêu đề A-Z' }
        ]}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showResults={jobs.length !== allJobs.length}
        resultsCount={jobs.length}
        totalCount={allJobs.length}
        showViewToggle={true}
        storageKey="expiredJobs"
      />

      <JobsList
        jobs={currentJobs}
        loading={loading}
        error={null}
        emptyStateConfig={{
          icon: searchQuery ? 'search' : 'expired',
          title: searchQuery ? 'Không tìm thấy công việc phù hợp' : 'Chưa có công việc hết hạn',
          description: searchQuery
            ? `Không có công việc hết hạn nào phù hợp với "${searchQuery}". Thử điều chỉnh từ khóa tìm kiếm.`
            : 'Các công việc đã hết hạn sẽ xuất hiện ở đây. Bạn có thể kích hoạt lại hoặc tạo công việc mới.',
          showCreateButton: !searchQuery,
          onCreateJob: onCreateJob
        }}
        onEdit={handleEditJob}
        onDelete={handleDeleteJob}
        onDuplicate={handleDuplicateJob}
        onViewApplications={handleViewApplications}
        onReactivate={handleReactivateJob}
        showActions={true}
        showApplicationCount={true}
        viewMode={viewMode}
        isExpiredView={true}
      />

      {/* Page Footer with Pagination */}
      <PageFooter
        // Pagination props
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={jobs.length}
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
        className={`expired-jobs-footer ${loading ? 'loading' : ''} ${error ? 'error' : 'success'}`}
      />

      {/* Edit Job Modal */}
      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        job={selectedJob}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Popup */}
      <PopUp
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Xác nhận xóa công việc hết hạn"
        type="danger"
        icon={deleteIcon}
        actions={deleteActions}
        size="medium"
      >
        <p>Bạn có chắc chắn muốn xóa công việc hết hạn <strong>"{jobToDelete?.title}"</strong>?</p>
        <p>Tất cả dữ liệu liên quan sẽ bị mất vĩnh viễn.</p>
      </PopUp>

      {/* Reactivate Confirmation Popup */}
      <PopUp
        isOpen={showReactivateConfirm}
        onClose={() => setShowReactivateConfirm(false)}
        title="Kích hoạt lại công việc"
        type="success"
        icon={reactivateIcon}
        actions={reactivateActions}
        size="medium"
      >
        <p>Bạn có muốn kích hoạt lại công việc <strong>"{jobToReactivate?.title}"</strong>?</p>
        <p>Công việc sẽ được đăng lại với thời hạn 30 ngày từ hôm nay.</p>
      </PopUp>

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
};

export default ExpiredJobsPage;