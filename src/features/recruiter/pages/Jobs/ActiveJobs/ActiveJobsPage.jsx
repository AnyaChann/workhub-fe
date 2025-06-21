import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { jobService } from '../../../services/jobService';
import { mockDataService } from '../../../services/mockDataService';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import SearchSection from '../../../components/common/SearchSection/SearchSection';
import JobsList from '../../../components/jobs/JobsList/JobsList';
import PopUp from '../../../components/common/PopUp/PopUp';
import ErrorBanner from '../../../components/common/ErrorBanner/ErrorBanner';
import NotificationToast from '../../../components/common/NotificationToast/NotificationToast';
import Pagination from '../../../components/common/Pagination/Pagination';
import EditJobModal from '../../../components/Modal/EditJobModal/EditJobModal';
import './ActiveJobsPage.css';

const ActiveJobsPage = ({ onCreateJob }) => {
  // State management
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load initial preferences from localStorage
  const getInitialPreferences = () => {
    try {
      const savedPreferences = localStorage.getItem('activeJobs_preferences');
      if (savedPreferences) {
        const { sortBy, viewMode } = JSON.parse(savedPreferences);
        return {
          sortBy: sortBy || 'newest',
          viewMode: viewMode || 'grid'
        };
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return { sortBy: 'newest', viewMode: 'grid' };
  };

  const initialPreferences = getInitialPreferences();
  const [sortBy, setSortBy] = useState(initialPreferences.sortBy);
  const [viewMode, setViewMode] = useState(initialPreferences.viewMode);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [usingMockData, setUsingMockData] = useState(false);
  const showViewToggle = true; // Define the variable

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
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

      console.log('📋 Loading recruiter jobs from API...');
      const response = await jobService.getRecruiterJobs();

      const activeJobs = Array.isArray(response)
        ? response.filter(job => {
          const isActive = job.status === 'active' ||
            (!job.status && !job.isExpired);
          return isActive;
        })
        : [];

      console.log('✅ Active jobs loaded:', activeJobs.length);

      setAllJobs(activeJobs);
      setJobs(activeJobs);

    } catch (err) {
      console.error('❌ Error loading jobs:', err);

      let errorMessage = 'Failed to load jobs';
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
        console.log('🔄 Using mock data for development...');
        const mockJobs = mockDataService.getActiveJobs();
        
        // Add applications count to mock jobs
        const jobsWithApplications = mockJobs.map(job => ({
          ...job,
          applicationsCount: mockDataService.getApplicationsCount(job.id)
        }));

        setAllJobs(jobsWithApplications);
        setJobs(jobsWithApplications);
        setUsingMockData(true);
      }

    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    console.log('🔄 Retrying to load jobs...');
    await loadJobs();
  };

  const handleEditJob = (job) => {
    console.log('🖊️ Edit job triggered:', job);
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

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      console.log('🗑️ Deleting job:', jobToDelete.id);

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

      console.log('✅ Job deleted successfully');

    } catch (err) {
      console.error('❌ Error deleting job:', err);

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

  const handleDuplicateJob = async (job) => {
    console.log('📄 Duplicate job:', job);
    showNotification('Duplicate job feature coming soon!', 'info');
  };

  const handleViewApplications = async (job) => {
    console.log('👁️ View applications for job:', job.id);
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

  return (
    <div className="active-jobs-page">
      <PageHeader
        title="Công việc đang tuyển"
        subtitle={jobs.length > 0 ? `${jobs.length.toLocaleString()} công việc` : 'Chưa có công việc nào'}
        onCreateJob={onCreateJob}
        showStats={true}
        stats={[
          { label: 'Tổng cộng', value: allJobs.length, color: '#3b82f6' },
          { label: 'Đang hiển thị', value: jobs.length, color: '#10b981' },
          { label: 'Trang hiện tại', value: `${currentPage}/${totalPages}`, color: '#f59e0b' }
        ]}
        breadcrumbs={[
          { label: 'Dashboard', href: '/recruiter/dashboard' },
          { label: 'Công việc', href: '/recruiter/dashboard/jobs' },
          { label: 'Đang tuyển' }
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
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showResults={jobs.length !== allJobs.length}
        resultsCount={jobs.length}
        totalCount={allJobs.length}
        showViewToggle={true}
        storageKey="activeJobs"
      />

      {/* Debug Info - Remove after testing */}
      {/* <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        margin: '10px 0', 
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        <strong>Debug Info:</strong><br/>
        Current View Mode: {viewMode}<br/>
        Current Sort: {sortBy}<br/>
        Show View Toggle: {showViewToggle ? 'Yes' : 'No'}<br/>
        Jobs Count: {currentJobs.length}
      </div> */}

      <JobsList
        jobs={currentJobs}
        loading={loading}
        error={null}
        emptyStateConfig={{
          icon: searchQuery ? 'search' : 'empty',
          title: searchQuery ? 'Không tìm thấy công việc phù hợp' : 'Chưa có công việc nào',
          description: searchQuery
            ? `Không có công việc nào phù hợp với "${searchQuery}". Thử điều chỉnh từ khóa tìm kiếm.`
            : 'Bắt đầu bằng cách đăng tin tuyển dụng đầu tiên để tìm kiếm ứng viên tài năng.',
          showCreateButton: !searchQuery,
          onCreateJob: onCreateJob
        }}
        onEdit={handleEditJob}
        onDelete={handleDeleteJob}
        onDuplicate={handleDuplicateJob}
        onViewApplications={handleViewApplications}
        showActions={true}
        showApplicationCount={true}
        viewMode={viewMode}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={jobs.length}
        showInfo={true}
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
        title="Xác nhận xóa công việc"
        type="danger"
        icon={deleteIcon}
        actions={deleteActions}
        size="medium"
      >
        <p>Bạn có chắc chắn muốn xóa công việc <strong>"{jobToDelete?.title}"</strong>?</p>
        <p>Tất cả dữ liệu liên quan sẽ bị mất vĩnh viễn.</p>
      </PopUp>

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
};

export default ActiveJobsPage;