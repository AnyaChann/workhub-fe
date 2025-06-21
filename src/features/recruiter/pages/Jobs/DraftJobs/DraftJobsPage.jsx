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
import './DraftJobsPage.css';

const DraftJobsPage = ({ onCreateJob, onContinuePosting }) => {
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
      const savedPreferences = localStorage.getItem('draftJobs_preferences');
      if (savedPreferences) {
        const { sortBy, viewMode } = JSON.parse(savedPreferences);
        return {
          sortBy: sortBy || 'updated_at',
          viewMode: viewMode || 'list'
        };
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return { sortBy: 'updated_at', viewMode: 'list' };
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
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [jobToPublish, setJobToPublish] = useState(null);
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
  }, [sortBy, jobs.length]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const applySorting = (sortOption) => {
    const sorted = [...jobs].sort((a, b) => {
      switch (sortOption) {
        case 'updated_at':
          return new Date(b.updatedAt || b.updated_at) - new Date(a.updatedAt || a.updated_at);
        case 'created_at':
          return new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
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

      console.log('📋 Loading draft jobs from API...');
      const response = await jobService.getRecruiterJobs();

      const draftJobs = Array.isArray(response)
        ? response.filter(job => job.status === 'draft')
        : [];

      console.log('✅ Draft jobs loaded:', draftJobs.length);

      setAllJobs(draftJobs);
      setJobs(draftJobs);
      setLastUpdated(new Date());

    } catch (err) {
      console.error('❌ Error loading draft jobs:', err);

      let errorMessage = 'Failed to load draft jobs';
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
        console.log('🔄 Using mock data for draft jobs...');
        const mockJobs = mockDataService.getDraftJobs();
        
        setAllJobs(mockJobs);
        setJobs(mockJobs);
        setUsingMockData(true);
        setLastUpdated(new Date());
      }

    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    console.log('🔄 Retrying to load draft jobs...');
    await loadJobs();
  };

  const handleEditJob = (job) => {
    console.log('🖊️ Edit draft job triggered:', job);
    if (onContinuePosting) {
      onContinuePosting(job);
    } else {
      setSelectedJob(job);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSuccess = (jobId) => {
    console.log('✅ Edit success for job ID:', jobId);
    setIsEditModalOpen(false);
    setSelectedJob(null);
    showNotification('Job draft updated successfully!');
    loadJobs();
  };

  const handleDeleteJob = (job) => {
    setJobToDelete(job);
    setShowDeleteConfirm(true);
  };

  const handleContinuePosting = (job) => {
    setJobToPublish(job);
    setShowPublishConfirm(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      console.log('🗑️ Deleting draft job:', jobToDelete.id);

      if (jobToDelete.id.toString().startsWith('mock-')) {
        console.log('🔄 Deleting mock job (local only)');
        const updatedJobs = allJobs.filter(j => j.id !== jobToDelete.id);
        setAllJobs(updatedJobs);
        setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));
        showNotification(`Draft "${jobToDelete.title}" deleted successfully!`);
      } else {
        await jobService.deleteJob(jobToDelete.id);
        const updatedJobs = allJobs.filter(j => j.id !== jobToDelete.id);
        setAllJobs(updatedJobs);
        setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));
        showNotification(`Draft "${jobToDelete.title}" deleted successfully!`);
      }

      console.log('✅ Draft job deleted successfully');

    } catch (err) {
      console.error('❌ Error deleting draft job:', err);

      let errorMessage = 'Failed to delete draft. Please try again.';

      if (err.status === 403) {
        errorMessage = 'You do not have permission to delete this draft.';
      } else if (err.status === 404) {
        errorMessage = 'This draft could not be found. It may have been deleted already.';
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

  const confirmPublishJob = async () => {
    if (!jobToPublish) return;

    try {
      console.log('📢 Publishing draft job:', jobToPublish.id);

      if (jobToPublish.id.toString().startsWith('mock-')) {
        console.log('🔄 Publishing mock job (local only)');
        // Remove from drafts list
        const updatedJobs = allJobs.filter(j => j.id !== jobToPublish.id);
        setAllJobs(updatedJobs);
        setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));
        showNotification(`Draft "${jobToPublish.title}" published successfully!`);
      } else {
        const updatedJob = {
          ...jobToPublish,
          status: 'active',
          publishedAt: new Date().toISOString()
        };
        
        await jobService.updateJob(jobToPublish.id, updatedJob);
        
        // Remove from drafts list
        const updatedJobs = allJobs.filter(j => j.id !== jobToPublish.id);
        setAllJobs(updatedJobs);
        setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));
        showNotification(`Draft "${jobToPublish.title}" published successfully!`);
      }

      console.log('✅ Draft job published successfully');

    } catch (err) {
      console.error('❌ Error publishing draft job:', err);
      showNotification('Failed to publish draft. Please try again.', 'error');
    } finally {
      setShowPublishConfirm(false);
      setJobToPublish(null);
    }
  };

  const handleDuplicateJob = async (job) => {
    console.log('📄 Duplicate draft job:', job);
    showNotification('Duplicate job feature coming soon!', 'info');
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
      tooltip: loading ? 'Đang tải...' : 'Tải lại danh sách bản nháp'
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
    { label: 'Tổng bản nháp', value: allJobs.length, color: '#f59e0b' },
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
        Xóa bản nháp
      </button>
    </>
  );

  // Publish confirmation icon and actions
  const publishIcon = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#10b981" strokeWidth="2" fill="none"/>
    </svg>
  );

  const publishActions = (
    <>
      <button 
        className="btn-secondary"
        onClick={() => setShowPublishConfirm(false)}
      >
        Hủy bỏ
      </button>
      <button 
        className="btn-success"
        onClick={confirmPublishJob}
      >
        Đăng ngay
      </button>
    </>
  );

  return (
    <div className="draft-jobs-page">
      <PageHeader
        title="Bản nháp công việc"
        subtitle={jobs.length > 0 ? `${jobs.length.toLocaleString()} bản nháp` : 'Chưa có bản nháp nào'}
        onCreateJob={onCreateJob}
        showStats={true}
        stats={[
          { label: 'Tổng cộng', value: allJobs.length, color: '#f59e0b' },
          { label: 'Đang hiển thị', value: jobs.length, color: '#10b981' },
          { label: 'Trang hiện tại', value: `${currentPage}/${totalPages}`, color: '#8b5cf6' }
        ]}
        breadcrumbs={[
          { label: 'Dashboard', href: '/recruiter/dashboard' },
          { label: 'Công việc', href: '/recruiter/dashboard/jobs' },
          { label: 'Bản nháp' }
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
          { value: 'updated_at', label: 'Sửa đổi gần nhất' },
          { value: 'created_at', label: 'Tạo gần nhất' },
          { value: 'title', label: 'Tiêu đề A-Z' }
        ]}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showResults={jobs.length !== allJobs.length}
        resultsCount={jobs.length}
        totalCount={allJobs.length}
        showViewToggle={true}
        storageKey="draftJobs"
      />

      <JobsList
        jobs={currentJobs}
        loading={loading}
        error={null}
        emptyStateConfig={{
          icon: searchQuery ? 'search' : 'draft',
          title: searchQuery ? 'Không tìm thấy bản nháp phù hợp' : 'Chưa có bản nháp nào',
          description: searchQuery
            ? `Không có bản nháp nào phù hợp với "${searchQuery}". Thử điều chỉnh từ khóa tìm kiếm.`
            : 'Các bản nháp công việc sẽ xuất hiện ở đây. Bắt đầu tạo một công việc mới để lưu bản nháp.',
          showCreateButton: !searchQuery,
          onCreateJob: onCreateJob
        }}
        onEdit={handleEditJob}
        onDelete={handleDeleteJob}
        onDuplicate={handleDuplicateJob}
        onContinuePosting={handleContinuePosting}
        showActions={true}
        showApplicationCount={false}
        viewMode={viewMode}
        isDraftView={true}
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
        className={`draft-jobs-footer ${loading ? 'loading' : ''} ${error ? 'error' : 'success'}`}
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
        title="Xác nhận xóa bản nháp"
        type="danger"
        icon={deleteIcon}
        actions={deleteActions}
        size="medium"
      >
        <p>Bạn có chắc chắn muốn xóa bản nháp <strong>"{jobToDelete?.title}"</strong>?</p>
        <p>Tất cả nội dung bản nháp sẽ bị mất vĩnh viễn.</p>
      </PopUp>

      {/* Publish Confirmation Popup */}
      <PopUp
        isOpen={showPublishConfirm}
        onClose={() => setShowPublishConfirm(false)}
        title="Đăng tin tuyển dụng"
        type="success"
        icon={publishIcon}
        actions={publishActions}
        size="medium"
      >
        <p>Bạn có muốn đăng tin tuyển dụng <strong>"{jobToPublish?.title}"</strong>?</p>
        <p>Tin tuyển dụng sẽ được công khai và ứng viên có thể bắt đầu ứng tuyển.</p>
      </PopUp>

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
};

export default DraftJobsPage;