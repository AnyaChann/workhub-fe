import React, { useState, useEffect, useRef } from 'react';
import { applicationService } from '../../../services/applicationService';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load applications count when component mounts
  useEffect(() => {
    if (job.id && !isDraftView) {
      loadApplicationsCount();
    }
  }, [job.id, isDraftView]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadApplicationsCount = async () => {
    try {
      setLoadingApplications(true);
      
      // Skip loading for mock jobs
      if (String(job.id).startsWith('mock-')) {
        const mockCount = Math.floor(Math.random() * 15) + 1;
        setApplicationsCount(mockCount);
        return;
      }

      console.log('Loading applications count for job:', job.id);
      const applications = await applicationService.getJobApplications(job.id);
      const count = Array.isArray(applications) ? applications.length : 0;
      setApplicationsCount(count);
      
    } catch (error) {
      console.warn('Failed to load applications count:', error);
      setApplicationsCount(0);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsLoading(true);
    try {
      onEdit(job);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    if (onDelete) {
      setIsLoading(true);
      try {
        await onDelete(job);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleViewApplications = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    if (onViewApplications) onViewApplications(job);
  };

  const handleContinuePosting = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    if (onContinuePosting) onContinuePosting(job);
  };

  const handleDuplicate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    if (onDuplicate) onDuplicate(job);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Helper functions
  const getDisplayValue = (value, fallback = 'Chưa xác định') => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.name) return value.name;
    return String(value);
  };

  const getTruncatedValue = (value, maxLength = 15) => {
    const displayValue = getDisplayValue(value);
    if (displayValue === 'Chưa xác định') return displayValue;
    return displayValue.length > maxLength
      ? `${displayValue.substring(0, maxLength)}...`
      : displayValue;
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return {
          className: 'status-active',
          text: 'Đang tuyển',
          color: '#10b981'
        };
      case 'draft':
        return {
          className: 'status-draft',
          text: 'Nháp',
          color: '#f59e0b'
        };
      case 'expired':
        return {
          className: 'status-expired',
          text: 'Hết hạn',
          color: '#ef4444'
        };
      case 'archived':
        return {
          className: 'status-archived',
          text: 'Lưu trữ',
          color: '#6b7280'
        };
      default:
        return {
          className: 'status-unknown',
          text: status,
          color: '#6b7280'
        };
    }
  };

  const statusConfig = getStatusConfig(job.status);

  // Safe property access with fallbacks
  const displayLocation = getDisplayValue(job.displayLocation || job.location);
  const displaySalary = getDisplayValue(job.displaySalary || job.salaryRange, 'Thỏa thuận');
  const displayExperience = getDisplayValue(job.displayExperience || job.experience, 'Không yêu cầu');
  const displayCategory = getDisplayValue(job.displayCategory || job.category);
  const displayType = getDisplayValue(job.displayType || job.type);
  const displayPosition = getDisplayValue(job.displayPosition || job.position);

  // Calculate deadline urgency
  const getDeadlineUrgency = () => {
    if (!job.daysUntilDeadline) return null;
    if (job.daysUntilDeadline <= 0) return 'expired';
    if (job.daysUntilDeadline <= 3) return 'urgent';
    if (job.daysUntilDeadline <= 7) return 'warning';
    return 'normal';
  };

  const deadlineUrgency = getDeadlineUrgency();

  return (
    <div className={`job-card ${job.status} ${isDraftView ? 'draft-view' : ''} ${isExpanded ? 'expanded' : ''}`}>
      {/* Header */}
      <div className="job-header">
        <div className="job-main-info">
          <div className="title-section">
            <div className="title-row">
              <h3 className="job-title" title={job.title}>
                {job.title || 'Untitled Job'}
              </h3>
              
              {/* Actions Dropdown */}
              {showActions && (
                <div className="actions-dropdown" ref={dropdownRef}>
                  <button
                    className="dropdown-trigger"
                    onClick={toggleDropdown}
                    disabled={isLoading}
                    aria-label="Tùy chọn"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      {isDraftView ? (
                        <>
                          <button
                            className="dropdown-item primary"
                            onClick={handleContinuePosting}
                            disabled={isLoading}
                          >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 7h10v3l5-4-5-4v3H5v6h2V7z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Đăng tin
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={handleEdit}
                            disabled={isLoading}
                          >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Chỉnh sửa
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="dropdown-item primary"
                            onClick={handleViewApplications}
                            disabled={isLoading}
                          >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Xem ứng viên
                            {applicationsCount > 0 && (
                              <span className="item-badge">{applicationsCount > 99 ? '99+' : applicationsCount}</span>
                            )}
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={handleEdit}
                            disabled={isLoading}
                          >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Chỉnh sửa
                          </button>
                          {/* <button
                            className="dropdown-item"
                            onClick={handleDuplicate}
                            disabled={isLoading}
                          >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Nhân bản
                          </button> */}
                        </>
                      )}
                      
                      <div className="dropdown-divider"></div>
                      
                      <button
                        className="dropdown-item danger"
                        onClick={handleDelete}
                        disabled={isLoading}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/>
                          <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2"/>
                          <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="job-meta">
              <span className="job-id">#{job.id}</span>
              <span 
                className={`job-status ${statusConfig.className}`}
                style={{ color: statusConfig.color }}
              >
                {statusConfig.text}
              </span>
              {job.isRecent && <span className="new-tag">Mới</span>}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-label">Địa điểm</span>
              <span className="stat-value" title={displayLocation}>
                {getTruncatedValue(displayLocation, 18)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lương</span>
              <span className="stat-value" title={displaySalary}>
                {getTruncatedValue(displaySalary, 18)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Kinh nghiệm</span>
              <span className="stat-value" title={displayExperience}>
                {getTruncatedValue(displayExperience, 18)}
              </span>
            </div>
            <div className={`stat-item deadline ${deadlineUrgency}`}>
              <span className="stat-label">Hạn nộp</span>
              <span className="stat-value">
                {formatDate(job.deadline)}
                {job.daysUntilDeadline !== undefined && (
                  <span className={`days-left ${deadlineUrgency}`}>
                    ({job.daysUntilDeadline > 0 
                      ? `${job.daysUntilDeadline} ngày`
                      : job.daysUntilDeadline === 0 
                        ? 'hôm nay' 
                        : 'hết hạn'
                    })
                  </span>
                )}
              </span>
            </div>
            {!isDraftView && (
              <div className="stat-item applications">
                <span className="stat-label">Ứng viên</span>
                <span className="stat-value">
                  {loadingApplications ? '...' : applicationsCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="job-tags">
        <span className="tag category" title={`Danh mục: ${displayCategory}`}>
          {getTruncatedValue(displayCategory, 20)}
        </span>
        <span className="tag type" title={`Loại hình: ${displayType}`}>
          {getTruncatedValue(displayType, 15)}
        </span>
        <span className="tag position" title={`Vị trí: ${displayPosition}`}>
          {getTruncatedValue(displayPosition, 18)}
        </span>
        {job.postAt && job.postAt !== 'STANDARD' && (
          <span className="tag premium">{job.postAt}</span>
        )}
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="job-skills">
          <div className="skills-list">
            {Array.isArray(job.skills) ? (
              <>
                {job.skills.slice(0, isExpanded ? job.skills.length : 4).map((skill, index) => (
                  <span key={index} className="skill-item" title={skill}>
                    {typeof skill === 'string' ? skill : skill.name || skill}
                  </span>
                ))}
                {job.skills.length > 4 && !isExpanded && (
                  <span className="skill-item more">
                    +{job.skills.length - 4} kỹ năng khác
                  </span>
                )}
              </>
            ) : (
              <span className="skills-text">
                {job.skills.length > 0 ? job.skills.join(', ') : 'Không yêu cầu kỹ năng cụ thể'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Expandable Content */}
      {isExpanded && job.description && (
        <div className="job-description">
          <h4>Mô tả công việc</h4>
          <p>{job.description}</p>
        </div>
      )}

      {/* Footer */}
      <div className="job-footer">
        <div className="footer-left">
          <span className="created-date">
            Tạo ngày {formatDate(job.createdAt)}
          </span>
        </div>
        <div className="footer-right">
          <button
            className="expand-btn"
            onClick={toggleExpanded}
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            <span className={`arrow ${isExpanded ? 'up' : 'down'}`}>
              ▼
            </span>
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default JobCard;