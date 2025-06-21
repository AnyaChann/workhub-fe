import React, { useState } from 'react';
import './ApplicationCard.css';

const ApplicationCard = ({ application, onStatusUpdate, onDownload, onContact }) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!application) {
    console.error('ApplicationCard: application prop is required');
    return null;
  }

  // ✅ Debug application data
  console.log('📋 ApplicationCard received application:', application);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    } catch (error) {
      console.error('Time ago calculation error:', error);
      return '';
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (updatingStatus) return;
    
    try {
      setUpdatingStatus(true);
      
      // ✅ Enhanced debugging
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-unknown';
    }
  };

  return (
    <div className="application-card">
      {/* ✅ Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-card-info" style={{
          background: '#fef3c7',
          padding: '8px',
          fontSize: '0.75rem',
          borderBottom: '1px solid #f59e0b'
        }}>
          <strong>Debug:</strong> ID={application.id} | AppID={application.applicationId} | Status={application.status}
        </div>
      )}
      
      {/* Header */}
      <div className="application-header">
        <div className="candidate-info">
          <div className="candidate-avatar">
            <div className="avatar-placeholder">
              {application.userFullname?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
          <div className="candidate-details">
            <h3 className="candidate-name">
              {application.userFullname || 'Unknown Candidate'}
            </h3>
            <p className="candidate-email">{application.userEmail || 'No email'}</p>
            {application.userPhone && (
              <p className="candidate-phone">{application.userPhone}</p>
            )}
          </div>
        </div>
        
        <div className="application-meta">
          <div className="application-status">
            <span className={`status-badge ${getStatusColor(application.status)}`}>
              {application.status || 'unknown'}
            </span>
          </div>
          <div className="application-date">
            <span className="date-text">{getTimeAgo(application.appliedAt)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="application-content">
        <div className="application-details">
          <div className="detail-item">
            <span className="detail-label">Applied for:</span>
            <span className="detail-value">{application.jobTitle}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Applied on:</span>
            <span className="detail-value">{formatDate(application.appliedAt)}</span>
          </div>
          {application.resumeFile && application.resumeFile.length > 0 && (
            <div className="detail-item">
              <span className="detail-label">Resume:</span>
              <span className="detail-value">
                📄 {application.resumeFile[0]} 
                {application.resumeFile.length > 1 && ` (+${application.resumeFile.length - 1} more)`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Actions */}
      <div className="status-actions">
        <label className="status-label">Update Status:</label>
        <div className="status-buttons">
          <button
            className={`status-btn pending ${application.status === 'pending' ? 'active' : ''}`}
            onClick={() => handleStatusChange('pending')}
            disabled={updatingStatus || application.status === 'pending'}
          >
            {updatingStatus && application.status !== 'pending' ? '⏳' : '⏳'} Pending
          </button>
          <button
            className={`status-btn accepted ${application.status === 'accepted' ? 'active' : ''}`}
            onClick={() => handleStatusChange('accepted')}
            disabled={updatingStatus || application.status === 'accepted'}
          >
            {updatingStatus && application.status !== 'accepted' ? '⏳' : '✅'} Accept
          </button>
          <button
            className={`status-btn rejected ${application.status === 'rejected' ? 'active' : ''}`}
            onClick={() => handleStatusChange('rejected')}
            disabled={updatingStatus || application.status === 'rejected'}
          >
            {updatingStatus && application.status !== 'rejected' ? '⏳' : '❌'} Reject
          </button>
        </div>
        
        {/* ✅ Loading indicator */}
        {updatingStatus && (
          <div className="status-updating">
            <span>🔄 Updating status...</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="application-actions">
        {application.resumeFile && application.resumeFile.length > 0 && (
          <button 
            className="action-btn download-btn"
            onClick={onDownload}
            title="Download resume"
          >
            <span className="btn-icon">📥</span>
            <span className="btn-text">Download</span>
          </button>
        )}
        
        <button 
          className="action-btn contact-btn"
          onClick={onContact}
          title="Contact candidate"
          disabled={!application.userEmail || application.userEmail === 'No email'}
        >
          <span className="btn-icon">📧</span>
          <span className="btn-text">Contact</span>
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;