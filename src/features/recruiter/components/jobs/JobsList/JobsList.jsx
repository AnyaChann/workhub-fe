import React from 'react';
import JobCard from '../JobCard/JobCard';
import './JobsList.css';

const JobsList = ({ 
  jobs = [], 
  loading = false, 
  error = null,
  emptyStateConfig = {},
  onEdit,
  onDelete,
  onDuplicate,
  onViewApplications,
  onContinuePosting,
  showActions = true,
  showApplicationCount = false,
  isDraftView = false
}) => {
  
  // Loading state
  if (loading) {
    return (
      <div className="jobs-list-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="jobs-list-container">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h3>Failed to load jobs</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!jobs.length) {
    const {
      icon = '📋',
      title = 'No jobs found',
      description = 'Start by creating your first job posting.',
      showCreateButton = true,
      onCreateJob
    } = emptyStateConfig;

    return (
      <div className="jobs-list-container">
        <div className="empty-state">
          <span className="empty-icon">{icon}</span>
          <h3 className="empty-title">{title}</h3>
          <p className="empty-description">{description}</p>
          {showCreateButton && onCreateJob && (
            <button 
              className="create-job-btn"
              onClick={onCreateJob}
            >
              ➕ Create Your First Job
            </button>
          )}
        </div>
      </div>
    );
  }

  // Jobs list
  return (
    <div className="jobs-list-container">
      <div className="jobs-list">
        {/* List Header */}
        <div className="list-header">
          <div className="list-stats">
            <span className="jobs-count">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
            </span>
            {isDraftView && (
              <span className="draft-notice">
                📝 Draft jobs are not visible to candidates
              </span>
            )}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onViewApplications={onViewApplications}
              onContinuePosting={onContinuePosting}
              showActions={showActions}
              showApplicationCount={showApplicationCount}
              isDraftView={isDraftView}
            />
          ))}
        </div>

        {/* List Footer */}
        <div className="list-footer">
          <div className="pagination-info">
            Showing {jobs.length} jobs
          </div>
          
          {/* Future: Add pagination controls here */}
          <div className="pagination-controls">
            {/* Pagination will be added later */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsList;