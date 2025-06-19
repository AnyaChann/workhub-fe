import React from 'react';
import './JobCard.css';

const JobCard = ({ 
  job, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onViewApplications, 
  onContinuePosting,
  showActions = true,
  showApplicationCount = false,
  isDraftView = false 
}) => {
  
  const handleEdit = () => {
    if (onEdit) onEdit(job);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(job);
  };

  const handleDuplicate = () => {
    if (onDuplicate) onDuplicate(job);
  };

  const handleViewApplications = () => {
    if (onViewApplications) onViewApplications(job);
  };

  const handleContinuePosting = () => {
    if (onContinuePosting) onContinuePosting(job);
  };

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { className: 'status-active', icon: '✅', text: 'Active' };
      case 'draft':
        return { className: 'status-draft', icon: '📝', text: 'Draft' };
      case 'expired':
        return { className: 'status-expired', icon: '⏰', text: 'Expired' };
      case 'archived':
        return { className: 'status-archived', icon: '📦', text: 'Archived' };
      default:
        return { className: 'status-unknown', icon: '❓', text: status };
    }
  };

  const statusConfig = getStatusConfig(job.status);

  return (
    <div className={`job-card ${job.status} ${isDraftView ? 'draft-view' : ''}`}>
      {/* Job Header */}
      <div className="job-header">
        <div className="job-title-section">
          <h3 className="job-title" title={job.title}>
            {job.title}
          </h3>
          <div className="job-meta">
            <span className="job-id">ID: {job.id}</span>
            <span className={`job-status ${statusConfig.className}`}>
              <span className="status-icon">{statusConfig.icon}</span>
              {statusConfig.text}
            </span>
          </div>
        </div>
        
        {showActions && (
          <div className="job-actions">
            {isDraftView ? (
              <>
                <button 
                  className="action-btn continue-btn"
                  onClick={handleContinuePosting}
                  title="Continue posting this job"
                >
                  📤 Continue
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={handleEdit}
                  title="Edit job"
                >
                  ✏️
                </button>
              </>
            ) : (
              <>
                <button 
                  className="action-btn view-btn"
                  onClick={handleViewApplications}
                  title="View applications"
                >
                  👥 Applications
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={handleEdit}
                  title="Edit job"
                >
                  ✏️
                </button>
                <button 
                  className="action-btn duplicate-btn"
                  onClick={handleDuplicate}
                  title="Duplicate job"
                >
                  📋
                </button>
              </>
            )}
            
            <button 
              className="action-btn delete-btn"
              onClick={handleDelete}
              title="Delete job"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Job Content */}
      <div className="job-content">
        {/* Job Details Grid */}
        <div className="job-details-grid">
          <div className="detail-item">
            <span className="detail-label">📍 Location</span>
            <span className="detail-value">{job.displayLocation}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">💰 Salary</span>
            <span className="detail-value">{job.displaySalary}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">🎯 Experience</span>
            <span className="detail-value">{job.displayExperience}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">📋 Post Type</span>
            <span className="detail-value">{job.postAt || 'Standard'}</span>
          </div>
        </div>

        {/* Job Description Preview */}
        {job.description && (
          <div className="job-description">
            <span className="description-label">📄 Description</span>
            <p className="description-text">
              {job.description.length > 150 
                ? `${job.description.substring(0, 150)}...` 
                : job.description
              }
            </p>
          </div>
        )}

        {/* Timeline Information */}
        <div className="job-timeline">
          <div className="timeline-item">
            <span className="timeline-label">Created</span>
            <span className="timeline-value">
              {formatDateTime(job.createdAt)}
              {job.isRecent && <span className="recent-badge">🆕 New</span>}
            </span>
          </div>
          
          <div className="timeline-item">
            <span className="timeline-label">Deadline</span>
            <span className={`timeline-value ${job.isExpired ? 'expired' : ''}`}>
              {formatDate(job.deadline)}
              {job.daysUntilDeadline !== undefined && (
                <span className={`days-badge ${job.daysUntilDeadline <= 3 ? 'urgent' : ''}`}>
                  {job.daysUntilDeadline > 0 
                    ? `${job.daysUntilDeadline} days left`
                    : job.daysUntilDeadline === 0 
                      ? 'Expires today' 
                      : 'Expired'
                  }
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Application Count (if applicable) */}
        {showApplicationCount && (
          <div className="application-stats">
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Applications</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Views</span>
            </div>
          </div>
        )}
      </div>

      {/* Job Footer */}
      <div className="job-footer">
        <div className="foreign-keys">
          <span className="fk-item" title="Category ID">Cat: {job.categoryId || 'N/A'}</span>
          <span className="fk-item" title="Position ID">Pos: {job.positionId || 'N/A'}</span>
          <span className="fk-item" title="Type ID">Type: {job.typeId || 'N/A'}</span>
        </div>
        
        {isDraftView && (
          <div className="draft-actions">
            <button 
              className="primary-action-btn"
              onClick={handleContinuePosting}
            >
              📤 Publish Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;