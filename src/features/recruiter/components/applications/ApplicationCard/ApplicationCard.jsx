import React, { useState } from 'react';
import './ApplicationCard.css';

const ApplicationCard = ({ application, onStatusUpdate, onDownload, onContact, viewMode = 'grid' }) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!application) {
    console.error('ApplicationCard: application prop is required');
    return null;
  }

  console.log('📋 ApplicationCard received application:', application);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const getTimeAgo = (dateString) => {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Hôm nay';
      if (diffDays === 1) return 'Hôm qua';
      if (diffDays < 7) return `${diffDays} ngày trước`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} tuần trước`;
      return `${Math.ceil(diffDays / 30)} tháng trước`;
    } catch (error) {
      console.error('Time ago calculation error:', error);
      return '';
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (updatingStatus) return;
    
    try {
      setUpdatingStatus(true);
      console.log('🔄 ApplicationCard handleStatusChange:', {
        applicationId: application.applicationId,
        newStatus,
        currentStatus: application.status,
        fullApplication: application
      });
      
      await onStatusUpdate(application.applicationId, newStatus);
    } catch (error) {
      console.error('Status update failed:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          class: 'status-pending',
          label: 'Chờ xử lý',
          icon: '⏳',
          color: '#f59e0b'
        };
      case 'accepted':
        return {
          class: 'status-accepted',
          label: 'Đã chấp nhận',
          icon: '✅',
          color: '#10b981'
        };
      case 'rejected':
        return {
          class: 'status-rejected',
          label: 'Đã từ chối',
          icon: '❌',
          color: '#ef4444'
        };
      case 'reviewing':
        return {
          class: 'status-reviewing',
          label: 'Đang xem xét',
          icon: '👁️',
          color: '#3b82f6'
        };
      case 'interviewed':
        return {
          class: 'status-interviewed',
          label: 'Đã phỏng vấn',
          icon: '🎯',
          color: '#8b5cf6'
        };
      default:
        return {
          class: 'status-unknown',
          label: 'Không xác định',
          icon: '❓',
          color: '#6b7280'
        };
    }
  };

  const statusInfo = getStatusInfo(application.status);
  const candidateInitials = application.userFullname
    ?.split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'UN';

  return (
    <div className={`cv-application-card ${viewMode} ${statusInfo.class}`}>
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-banner">
          <span>🐛 ID: {application.applicationId} | Status: {application.status}</span>
        </div>
      )}
      
      {/* CV Header */}
      <div className="cv-header">
        <div className="candidate-profile">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {candidateInitials}
            </div>
            <div className="status-indicator" style={{ backgroundColor: statusInfo.color }}>
              <span>{statusInfo.icon}</span>
            </div>
          </div>
          
          <div className="profile-info">
            <h2 className="candidate-name">
              {application.userFullname || 'Không rõ tên'}
            </h2>
            <div className="candidate-title">
              Ứng viên cho vị trí <strong>{application.jobTitle}</strong>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span className="contact-text">{application.userEmail || 'Không có email'}</span>
              </div>
              {application.userPhone && (
                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <span className="contact-text">{application.userPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="application-status">
          <div className={`status-badge ${statusInfo.class}`}>
            <span className="status-icon">{statusInfo.icon}</span>
            <span className="status-text">{statusInfo.label}</span>
          </div>
          <div className="application-date">
            <span className="date-label">Ứng tuyển:</span>
            <span className="date-value">{getTimeAgo(application.appliedAt)}</span>
          </div>
        </div>
      </div>

      {/* CV Body */}
      <div className="cv-body">
        {/* Application Summary */}
        <div className="cv-section">
          <h3 className="section-title">
            <span className="section-icon">📋</span>
            Thông tin ứng tuyển
          </h3>
          <div className="section-content">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Ngày ứng tuyển:</span>
                <span className="info-value">{formatDate(application.appliedAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Vị trí:</span>
                <span className="info-value">{application.jobTitle}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Trạng thái:</span>
                <span className={`info-value status-text ${statusInfo.class}`}>
                  {statusInfo.icon} {statusInfo.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="cv-section">
            <h3 className="section-title">
              <span className="section-icon">✍️</span>
              Thư xin việc
            </h3>
            <div className="section-content">
              <div className="cover-letter">
                <p>"{application.coverLetter}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Resume Files */}
        {application.resumeFile && application.resumeFile.length > 0 && (
          <div className="cv-section">
            <h3 className="section-title">
              <span className="section-icon">📄</span>
              Hồ sơ đính kèm
            </h3>
            <div className="section-content">
              <div className="resume-files">
                {Array.isArray(application.resumeFile) && application.resumeFile.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-info">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{file}</span>
                    </div>
                    <button 
                      className="file-download"
                      onClick={onDownload}
                      title="Tải xuống file"
                    >
                      📥
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CV Actions */}
      <div className="cv-actions">
        {/* Status Update Section */}
        <div className="status-update-section">
          <h4 className="action-title">Cập nhật trạng thái ứng tuyển</h4>
          <div className="status-buttons">
            <button
              className={`status-action-btn pending ${application.status === 'pending' ? 'active' : ''}`}
              onClick={() => handleStatusChange('pending')}
              disabled={updatingStatus || application.status === 'pending'}
              title="Đặt trạng thái chờ xử lý"
            >
              <span className="btn-icon">⏳</span>
              <span className="btn-text">Chờ xử lý</span>
            </button>
            
            <button
              className={`status-action-btn reviewing ${application.status === 'reviewing' ? 'active' : ''}`}
              onClick={() => handleStatusChange('reviewing')}
              disabled={updatingStatus || application.status === 'reviewing'}
              title="Đặt trạng thái đang xem xét"
            >
              <span className="btn-icon">👁️</span>
              <span className="btn-text">Xem xét</span>
            </button>
            
            <button
              className={`status-action-btn interviewed ${application.status === 'interviewed' ? 'active' : ''}`}
              onClick={() => handleStatusChange('interviewed')}
              disabled={updatingStatus || application.status === 'interviewed'}
              title="Đặt trạng thái đã phỏng vấn"
            >
              <span className="btn-icon">🎯</span>
              <span className="btn-text">Đã PV</span>
            </button>
            
            <button
              className={`status-action-btn accepted ${application.status === 'accepted' ? 'active' : ''}`}
              onClick={() => handleStatusChange('accepted')}
              disabled={updatingStatus || application.status === 'accepted'}
              title="Chấp nhận ứng viên"
            >
              <span className="btn-icon">✅</span>
              <span className="btn-text">Chấp nhận</span>
            </button>
            
            <button
              className={`status-action-btn rejected ${application.status === 'rejected' ? 'active' : ''}`}
              onClick={() => handleStatusChange('rejected')}
              disabled={updatingStatus || application.status === 'rejected'}
              title="Từ chối ứng viên"
            >
              <span className="btn-icon">❌</span>
              <span className="btn-text">Từ chối</span>
            </button>
          </div>
          
          {updatingStatus && (
            <div className="status-updating">
              <span className="update-icon">🔄</span>
              <span className="update-text">Đang cập nhật trạng thái...</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h4 className="action-title">Thao tác nhanh</h4>
          <div className="quick-actions">
            <button 
              className="quick-action-btn primary"
              onClick={onContact}
              disabled={!application.userEmail || application.userEmail === 'Không có email'}
              title="Gửi email cho ứng viên"
            >
              <span className="btn-icon">📧</span>
              <span className="btn-text">Liên hệ</span>
            </button>
            
            {application.resumeFile && application.resumeFile.length > 0 && (
              <button 
                className="quick-action-btn secondary"
                onClick={onDownload}
                title="Tải xuống CV"
              >
                <span className="btn-icon">📥</span>
                <span className="btn-text">Tải CV</span>
              </button>
            )}
            
            <button 
              className="quick-action-btn secondary"
              onClick={() => console.log('Schedule interview for:', application.userFullname)}
              title="Đặt lịch phỏng vấn"
            >
              <span className="btn-icon">📅</span>
              <span className="btn-text">Đặt lịch PV</span>
            </button>
          </div>
        </div>
      </div>

      {/* CV Footer */}
      <div className="cv-footer">
        <div className="footer-info">
          <span className="footer-text">
            Ứng tuyển ID: {application.applicationId || application.id}
          </span>
          <span className="footer-divider">•</span>
          <span className="footer-text">
            Cập nhật lần cuối: {formatDate(application.appliedAt)}
          </span>
        </div>
        {application.canUpdate === false && (
          <div className="warning-notice">
            <span className="warning-icon">⚠️</span>
            <span className="warning-text">Không thể cập nhật trạng thái</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;