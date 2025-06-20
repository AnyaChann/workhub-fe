import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { jobService } from '../../../services/jobService';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import SearchSection from '../../../components/common/SearchSection/SearchSection';
import JobsList from '../../../components/jobs/JobsList/JobsList';
import EditJobModal from '../../../components/jobs/EditJobModal/EditJobModal';
import './ActiveJobsPage.css';

const ActiveJobsPage = ({ onCreateJob }) => {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [debugInfo, setDebugInfo] = useState({});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { user, isRecruiter } = useAuth();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Enhanced debugging info
      const debug = {
        timestamp: new Date().toISOString(),
        user: user ? { id: user.id, email: user.email, role: user.role } : null,
        isRecruiter: isRecruiter(),
        token: localStorage.getItem('accessToken') ? 'Present' : 'Missing',
        apiBaseUrl: process.env.REACT_APP_API_URL || 'Not set'
      };

      console.log('� Debug info before API call:', debug);
      setDebugInfo(debug);

      // ✅ Check if user is recruiter
      if (!isRecruiter()) {
        throw new Error('User is not authorized as recruiter');
      }

      // ✅ Test connection first (optional)
      console.log('🔌 Testing API connection...');
      const connectionTest = await jobService.testConnection();
      console.log('🔌 Connection test result:', connectionTest);

      // ✅ Attempt to get recruiter jobs
      console.log('�📋 Loading recruiter jobs from API...');
      const response = await jobService.getRecruiterJobs();

      console.log('📥 API Response:', response);

      // Filter active jobs
      const activeJobs = Array.isArray(response)
        ? response.filter(job => {
          const isActive = job.status === 'active' ||
            (!job.status && !job.isExpired);
          console.log(`Job ${job.id}: status=${job.status}, isActive=${isActive}`);
          return isActive;
        })
        : [];

      console.log('✅ Active jobs loaded:', activeJobs.length, activeJobs);

      setAllJobs(activeJobs);
      setJobs(activeJobs);

      // Update debug info with success
      setDebugInfo(prev => ({
        ...prev,
        success: true,
        jobCount: activeJobs.length,
        lastLoaded: new Date().toISOString()
      }));

    } catch (err) {
      console.error('❌ Error loading jobs:', err);

      // ✅ Enhanced error handling with specific messages
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
        shouldShowMockData = true; // Show mock data for 500 errors
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
        shouldShowMockData = true;
      } else {
        errorMessage = err.message || 'Unknown error occurred';
        shouldShowMockData = true;
      }

      setError(errorMessage);

      // Update debug info with error details
      setDebugInfo(prev => ({
        ...prev,
        error: {
          message: errorMessage,
          status: err.status,
          timestamp: new Date().toISOString(),
          originalError: err.originalError?.message
        }
      }));

      // ✅ Show mock data for development/demo purposes
      if (shouldShowMockData && process.env.NODE_ENV === 'development') {
        console.log('🔄 Using mock data for development...');

        const mockJobs = [
          {
            id: 'mock-1',
            title: 'Senior React Developer',
            description: 'We are looking for an experienced React developer to join our team. You will work on cutting-edge projects and collaborate with a talented team of developers.',
            location: 'Ho Chi Minh City',
            salaryRange: '1500 - 3000 USD',
            experience: '3+ years',
            deadline: '2024-07-31',
            postAt: 'PREMIUM',
            createdAt: '2024-06-20T10:00:00Z',
            categoryId: 1,
            positionId: 2,
            recruiterId: user?.id,
            typeId: 1,
            status: 'active',
            isExpired: false,
            daysUntilDeadline: 41,
            isRecent: true,
            displaySalary: '$1,500 - $3,000',
            displayLocation: 'Ho Chi Minh City',
            displayExperience: '3+ years'
          },
          {
            id: 'mock-2',
            title: 'UI/UX Designer',
            description: 'Creative designer needed for web and mobile applications. Join our design team and help create amazing user experiences.',
            location: 'Remote',
            salaryRange: '1000 - 2000 USD',
            experience: '2+ years',
            deadline: '2024-07-25',
            postAt: 'STANDARD',
            createdAt: '2024-06-18T14:30:00Z',
            categoryId: 2,
            positionId: 3,
            recruiterId: user?.id,
            typeId: 2,
            status: 'active',
            isExpired: false,
            daysUntilDeadline: 35,
            isRecent: true,
            displaySalary: '$1,000 - $2,000',
            displayLocation: 'Remote',
            displayExperience: '2+ years'
          },
          {
            id: 'mock-3',
            title: 'Backend Developer (Node.js)',
            description: 'Join our backend team to build scalable APIs and microservices. Experience with Node.js and databases required.',
            location: 'Da Nang',
            salaryRange: '1200 - 2500 USD',
            experience: '2-5 years',
            deadline: '2024-08-15',
            postAt: 'STANDARD',
            createdAt: '2024-06-15T09:00:00Z',
            categoryId: 1,
            positionId: 1,
            recruiterId: user?.id,
            typeId: 1,
            status: 'active',
            isExpired: false,
            daysUntilDeadline: 56,
            isRecent: false,
            displaySalary: '$1,200 - $2,500',
            displayLocation: 'Da Nang',
            displayExperience: '2-5 years'
          }
        ];

        setAllJobs(mockJobs);
        setJobs(mockJobs);

        setDebugInfo(prev => ({
          ...prev,
          usingMockData: true,
          mockJobCount: mockJobs.length
        }));
      }

    } finally {
      setLoading(false);
    }
  };

  // ✅ Enhanced retry function
  const handleRetry = async () => {
    console.log('🔄 Retrying to load jobs...');
    await loadJobs();
  };

  // ✅ Manual API test function
  const handleTestAPI = async () => {
    try {
      console.log('🧪 Testing API endpoints...');

      // Test basic connection
      const connectionTest = await jobService.testConnection();
      console.log('Connection test:', connectionTest);

      // Test auth
      try {
        const userInfo = await jobService.getCurrentUser();
        console.log('User info:', userInfo);
      } catch (authError) {
        console.log('Auth test failed:', authError.message);
      }

      alert('Check console for API test results');
    } catch (error) {
      console.error('API test failed:', error);
      alert('API test failed - check console for details');
    }
  };

  const handleEditJob = (job) => {
    console.log('🖊️ Edit job triggered:', job);
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  // Thêm hàm xử lý khi chỉnh sửa thành công
  const handleEditSuccess = (jobId) => {
    console.log('✅ Edit success for job ID:', jobId);
    setIsEditModalOpen(false);
    setSelectedJob(null);

    // Reload jobs after successful edit
    loadJobs();
  };

  // Cập nhật hàm handleDeleteJob để xử lý lỗi tốt hơn và hiển thị thông báo phù hợp

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      return;
    }

    try {
      console.log('🗑️ Deleting job:', job.id);

      if (job.id.toString().startsWith('mock-')) {
        console.log('🔄 Deleting mock job (local only)');
        const updatedJobs = allJobs.filter(j => j.id !== job.id);
        setAllJobs(updatedJobs);
        setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));
        return;
      }

      // Call deleteJob service with job ID
      await jobService.deleteJob(job.id);

      // Update UI after successful deletion
      const updatedJobs = allJobs.filter(j => j.id !== job.id);
      setAllJobs(updatedJobs);
      setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));

      // Show success notification
      const jobDeletedNotification = document.createElement('div');
      jobDeletedNotification.className = 'success-toast';
      jobDeletedNotification.innerHTML = `
          <span class="toast-icon">✅</span>
          <span class="toast-message">Job "${job.title}" deleted successfully</span>
        `;
      document.body.appendChild(jobDeletedNotification);

      setTimeout(() => {
        jobDeletedNotification.classList.add('show');
        setTimeout(() => {
          jobDeletedNotification.classList.remove('show');
          setTimeout(() => {
            jobDeletedNotification.remove();
          }, 300);
        }, 3000);
      }, 100);

      console.log('✅ Job deleted successfully');

    } catch (err) {
      console.error('❌ Error deleting job:', err);

      // Show appropriate error message based on error status
      let errorMessage = 'Failed to delete job. Please try again.';

      if (err.status === 403) {
        errorMessage = 'You do not have permission to delete this job.';
      } else if (err.status === 404) {
        errorMessage = 'This job could not be found. It may have been deleted already.';
        // If job not found, remove it from local state
        const updatedJobs = allJobs.filter(j => j.id !== job.id);
        setAllJobs(updatedJobs);
        setJobs(updatedJobs.filter(j => filterJob(j, searchQuery)));
      } else if (err.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      }

      alert(errorMessage);
    }
  };

  const handleDuplicateJob = async (job) => {
    console.log('� Duplicate job:', job);
    alert('Duplicate job feature coming soon!');
  };

  const handleViewApplications = async (job) => {
    console.log('👥 View applications for job:', job.id);
    alert(`View applications for: ${job.title}\nFeature coming soon!`);
  };

  const filterJob = (job, query) => {
    if (!query) return true;
    const searchTerms = query.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchTerms) ||
      job.location?.toLowerCase().includes(searchTerms) ||
      job.description?.toLowerCase().includes(searchTerms) ||
      job.displaySalary?.toLowerCase().includes(searchTerms)
    );
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const filtered = allJobs.filter(job => filterJob(job, query));
    setJobs(filtered);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);

    const sorted = [...jobs].sort((a, b) => {
      switch (sortOption) {
        case 'created_at':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'salary':
          return (b.salaryRange || '').localeCompare(a.salaryRange || '');
        default:
          return 0;
      }
    });

    setJobs(sorted);
  };

  return (
    <div className="active-jobs-page">
      <PageHeader
        title="Active Jobs"
        subtitle={`${jobs.length} active job${jobs.length !== 1 ? 's' : ''} ${allJobs.length !== jobs.length ? `(filtered from ${allJobs.length})` : ''}`}
        showCreateButton={true}
        onCreateJob={onCreateJob}
        createButtonText="➕ Create New Job"
      />

      {/* ✅ Enhanced error banner */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
            <div className="error-actions">
              <button onClick={handleRetry} className="retry-btn">
                🔄 Retry
              </button>
              <button onClick={handleTestAPI} className="test-btn">
                🧪 Test API
              </button>
            </div>
          </div>
          {debugInfo.usingMockData && (
            <div className="mock-data-notice">
              📋 Showing mock data for demonstration
            </div>
          )}
        </div>
      )}

      <SearchSection
        placeholder="Search jobs by title, location, description..."
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        sortOptions={[
          { value: 'created_at', label: 'Recently Created' },
          { value: 'deadline', label: 'Deadline (Earliest)' },
          { value: 'title', label: 'Title (A-Z)' },
          { value: 'salary', label: 'Salary Range' }
        ]}
      />

      <JobsList
        jobs={jobs}
        loading={loading}
        error={null} // Don't show error in JobsList since we handle it above
        emptyStateConfig={{
          icon: '📋',
          title: searchQuery ? 'No matching jobs found' : 'No active jobs found',
          description: searchQuery
            ? `No jobs match "${searchQuery}". Try adjusting your search.`
            : 'Start by posting your first job to find great candidates.',
          showCreateButton: !searchQuery,
          onCreateJob: onCreateJob
        }}
        onEdit={handleEditJob}
        onDelete={handleDeleteJob}
        onDuplicate={handleDuplicateJob}
        onViewApplications={handleViewApplications}
        showActions={true}
        showApplicationCount={true}
      />

      {/* Thêm EditJobModal vào component */}
      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        job={selectedJob}
        onSuccess={handleEditSuccess}
      />

      {/* ✅ Enhanced debug panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-panel">
          <h4>🐛 Debug Information</h4>
          <div className="debug-grid">
            <div className="debug-section">
              <h5>📊 Data</h5>
              <p><strong>Total jobs:</strong> {allJobs.length}</p>
              <p><strong>Filtered jobs:</strong> {jobs.length}</p>
              <p><strong>Search query:</strong> "{searchQuery}"</p>
              <p><strong>Sort by:</strong> {sortBy}</p>
              <p><strong>Using mock data:</strong> {debugInfo.usingMockData ? 'Yes' : 'No'}</p>
            </div>

            <div className="debug-section">
              <h5>🔐 Auth</h5>
              <p><strong>User ID:</strong> {debugInfo.user?.id || 'N/A'}</p>
              <p><strong>Email:</strong> {debugInfo.user?.email || 'N/A'}</p>
              <p><strong>Role:</strong> {debugInfo.user?.role || 'N/A'}</p>
              <p><strong>Is Recruiter:</strong> {debugInfo.isRecruiter ? 'Yes' : 'No'}</p>
              <p><strong>Token:</strong> {debugInfo.token}</p>
            </div>

            <div className="debug-section">
              <h5>🌐 API</h5>
              <p><strong>Base URL:</strong> {debugInfo.apiBaseUrl}</p>
              <p><strong>Last loaded:</strong> {debugInfo.lastLoaded ? new Date(debugInfo.lastLoaded).toLocaleTimeString() : 'Never'}</p>
              {debugInfo.error && (
                <div className="debug-error">
                  <p><strong>Error:</strong> {debugInfo.error.message}</p>
                  <p><strong>Status:</strong> {debugInfo.error.status}</p>
                  <p><strong>Time:</strong> {new Date(debugInfo.error.timestamp).toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          </div>

          <div className="debug-actions">
            <button onClick={handleRetry} className="debug-btn">
              🔄 Reload Jobs
            </button>
            <button onClick={handleTestAPI} className="debug-btn">
              🧪 Test API
            </button>
            <button onClick={() => console.log('Debug info:', debugInfo)} className="debug-btn">
              📋 Log Debug Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveJobsPage;