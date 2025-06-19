import React, { useState, useEffect } from 'react';
import JobCard from '../JobCard/JobCard';
import { JobsLoadingSpinner } from '../../../../../shared/components/LoadingSpinner/LoadingSpinner';
import './JobsList.css';

const JobsList = ({ 
  jobs = [], 
  loading = false, 
  error = null,
  showOnlyMyJobs = false,
  searchQuery = '',
  sortBy = 'updated_at',
  onContinuePosting,
  onEdit,
  onDelete,
  onDuplicate,
  onRenew,
  emptyStateConfig
}) => {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Filter and sort jobs
  useEffect(() => {
    let filtered = [...jobs];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.companyName && job.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by "only my jobs" (assuming we have a user context)
    if (showOnlyMyJobs) {
      // Add user filtering logic here when user context is available
      // filtered = filtered.filter(job => job.recruiter_id === currentUserId);
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updated_at':
        case 'most_recent':
          return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [jobs, searchQuery, showOnlyMyJobs, sortBy]);

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="jobs-list-container">
        <JobsLoadingSpinner message="Loading jobs..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="jobs-list-container">
        <div className="error-state">
          <div className="error-icon">âš ï¸</div>
          <h3>Error loading jobs</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredJobs.length === 0) {
    if (searchQuery.trim()) {
      return (
        <div className="jobs-list-container">
          <div className="empty-state">
            <div className="empty-icon">ðŸ”</div>
            <h2 className="empty-title">No jobs found</h2>
            <p className="empty-description">
              No jobs match your search criteria. Try adjusting your search terms.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="jobs-list-container">
        <div className="empty-state">
          <div className="empty-icon">{emptyStateConfig?.icon || 'ðŸ“‹'}</div>
          <h2 className="empty-title">{emptyStateConfig?.title || 'No jobs found'}</h2>
          <p className="empty-description">
            {emptyStateConfig?.description || 'No jobs available at the moment.'}
          </p>
          {emptyStateConfig?.showCreateButton && (
            <button className="post-job-btn" onClick={emptyStateConfig.onCreateJob}>
              + Post a new job
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-list-container">
      {/* Results summary */}
      <div className="results-summary">
        <span className="results-count">
          {indexOfFirstJob + 1} - {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
        </span>
      </div>

      {/* Jobs list */}
      <div className="jobs-list">
        {currentJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onContinuePosting={onContinuePosting}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onRenew={onRenew}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn prev-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isVisible =
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

              if (!isVisible) {
                if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                  return <span key={pageNumber} className="page-dots">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={pageNumber}
                  className={`page-btn ${currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            className="page-btn next-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsList;
