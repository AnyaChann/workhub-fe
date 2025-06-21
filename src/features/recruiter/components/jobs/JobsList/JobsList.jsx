import React from 'react';
import JobCard from '../JobCard/JobCard';
import EmptyState from '../../common/EmptyState/EmptyState';
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
  isDraftView = false,
  viewMode = 'grid'
}) => {
  
  // Loading state
  if (loading) {
    return (
      <div className="jobs-list-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <h3>Đang tải danh sách công việc...</h3>
          <p>Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="jobs-list-container">
        <EmptyState
          icon="error"
          title="Không thể tải danh sách công việc"
          description={error || 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.'}
          action={
            <button 
              className="btn"
              onClick={() => window.location.reload()}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Thử lại
            </button>
          }
        />
      </div>
    );
  }

  // Empty state
  if (!jobs.length) {
    const {
      icon = isDraftView ? 'draft' : 'empty',
      title = isDraftView ? 'Chưa có bản nháp nào' : 'Chưa có công việc nào',
      description = isDraftView 
        ? 'Bạn chưa có bản nháp nào được lưu. Tạo tin tuyển dụng mới để bắt đầu.' 
        : 'Bắt đầu bằng cách tạo tin tuyển dụng đầu tiên của bạn.',
      showCreateButton = true,
      onCreateJob
    } = emptyStateConfig;

    return (
      <div className="jobs-list-container">
        <EmptyState
          icon={icon}
          title={title}
          description={description}
          action={showCreateButton && onCreateJob ? (
            <button 
              className="btn success"
              onClick={onCreateJob}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {isDraftView ? 'Tạo bản nháp mới' : 'Tạo tin tuyển dụng đầu tiên'}
            </button>
          ) : null}
        />
      </div>
    );
  }

  // Jobs list
  return (
    <div className="jobs-list-container">
      <div className={`jobs-grid ${viewMode}`}>
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onEdit={() => onEdit(job)} 
            onDelete={() => onDelete(job)}
            onDuplicate={() => onDuplicate(job.id)}
            onViewApplications={() => onViewApplications(job)}
            onContinuePosting={onContinuePosting}
            showActions={showActions}
            showApplicationCount={showApplicationCount}
            isDraftView={isDraftView}
          />
        ))}
      </div>
    </div>
  );
};

export default JobsList;