import React, { useState } from 'react';
import './JobCard.css';

const JobCard = ({ 
  job, 
  onContinuePosting, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onRenew,
  showActions = true 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
      return null;
    }
    
    const { min, max, type, display } = salaryRange;
    
    if (!display) return null;
    
    const formatAmount = (amount) => {
      if (type === 'hourly') {
        return `$${amount}`;
      }
      return `$${parseInt(amount).toLocaleString()}`;
    };
    
    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)}`;
    } else if (min) {
      return `From ${formatAmount(min)}`;
    } else if (max) {
      return `Up to ${formatAmount(max)}`;
    }
    
    return null;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { label: 'Active', className: 'status-active' },
      'draft': { label: 'Draft', className: 'status-draft' },
      'expired': { label: 'Expired', className: 'status-expired' },
      'closed': { label: 'Closed', className: 'status-closed' },
      'pending_payment': { label: 'Pending Payment', className: 'status-pending' }
    };
    
    return statusConfig[status] || { label: status, className: 'status-default' };
  };

  const getJobTypeLabel = (typeId) => {
    const jobTypes = {
      1: 'Full time',
      2: 'Part time', 
      3: 'Contract',
      4: 'Casual',
      5: 'Internship',
      6: 'Trainee'
    };
    return jobTypes[typeId] || 'Unknown';
  };

  const statusBadge = getStatusBadge(job.status);
  const salary = formatSalary(job.salary_range);

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-meta">
          <div className="job-dates">
            <span className="job-created">
              Created {formatDate(job.created_at)} • Updated {formatDate(job.updated_at || job.created_at)}
            </span>
          </div>
          
          {showActions && (
            <div className="job-actions">
              <button 
                className="action-menu-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                ⋯
              </button>
              
              {showDropdown && (
                <div className="action-dropdown">
                  {job.status === 'draft' && (
                    <button 
                      className="dropdown-action"
                      onClick={() => {
                        onContinuePosting?.(job);
                        setShowDropdown(false);
                      }}
                    >
                      Continue posting
                    </button>
                  )}
                  
                  <button 
                    className="dropdown-action"
                    onClick={() => {
                      onEdit?.(job);
                      setShowDropdown(false);
                    }}
                  >
                    Edit
                  </button>
                  
                  <button 
                    className="dropdown-action"
                    onClick={() => {
                      onDuplicate?.(job);
                      setShowDropdown(false);
                    }}
                  >
                    Duplicate
                  </button>
                  
                  {job.status === 'expired' && (
                    <button 
                      className="dropdown-action"
                      onClick={() => {
                        onRenew?.(job);
                        setShowDropdown(false);
                      }}
                    >
                      Renew
                    </button>
                  )}
                  
                  <hr className="dropdown-divider" />
                  
                  <button 
                    className="dropdown-action delete-action"
                    onClick={() => {
                      onDelete?.(job);
                      setShowDropdown(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="job-card-content">
        <div className="job-main-info">
          <h3 className="job-title">{job.title}</h3>
          <div className="job-company">{job.companyName || 'ABC'}</div>
          
          <div className="job-details">
            <span className="job-type">
              {getJobTypeLabel(job.type_id)} • {job.experience} • {job.location}
            </span>
            {salary && (
              <span className="job-salary">{salary}</span>
            )}
          </div>
        </div>

        <div className="job-card-actions">
          {job.status === 'draft' ? (
            <button 
              className="continue-btn"
              onClick={() => onContinuePosting?.(job)}
            >
              Continue posting
            </button>
          ) : job.status === 'expired' ? (
            <button 
              className="renew-btn"
              onClick={() => onRenew?.(job)}
            >
              Renew
            </button>
          ) : (
            <button 
              className="view-btn"
              onClick={() => onEdit?.(job)}
            >
              View job
            </button>
          )}
        </div>
      </div>

      <div className="job-card-footer">
        <div className="job-stats">
          <span className="stat-item">
            <strong>{job.applications || 0}</strong> applications
          </span>
          <span className="stat-item">
            <strong>{job.views || 0}</strong> views
          </span>
        </div>
        
        <div className="job-status">
          <span className={`status-badge ${statusBadge.className}`}>
            {statusBadge.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;