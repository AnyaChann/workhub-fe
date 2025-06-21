import React from 'react';
import './ResumeCard.css';

const ResumeCard = ({ resume, onReview, onDownload, onContact }) => {
  // ✅ Kiểm tra an toàn cho resume và resume.user
  if (!resume) {
    console.error('ResumeCard: resume prop is required');
    return null;
  }

  // ✅ Cung cấp default values cho user object
  const user = resume.user || {};
  const userFullname = user.fullname || 'Unknown Candidate';
  const userEmail = user.email || 'No email provided';
  const userPhone = user.phone || null;
  const userAvatar = user.avatar || null;
  const userStatus = user.status || 'unknown';
  const userCreatedAt = user.createdAt || resume.createdAt;

  // ✅ Cung cấp default values cho resume fields
  const resumeTitle = resume.title || 'Untitled Resume';
  const resumeContent = resume.content || 'No description available';
  const resumeSkills = resume.skills || [];
  const resumeFiles = resume.file || [];
  const isGenerated = resume.isGenerated || false;
  const createdAt = resume.createdAt || new Date().toISOString();

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
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
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    } catch (error) {
      console.error('Time ago calculation error:', error);
      return '';
    }
  };

  // ✅ Safe handlers với kiểm tra functions
  const handleReview = () => {
    if (typeof onReview === 'function') {
      onReview(resume);
    } else {
      console.warn('onReview is not a function');
    }
  };

  const handleDownload = () => {
    if (typeof onDownload === 'function') {
      onDownload(resume);
    } else {
      console.warn('onDownload is not a function');
    }
  };

  const handleContact = () => {
    if (typeof onContact === 'function') {
      onContact(resume);
    } else {
      console.warn('onContact is not a function');
    }
  };

  return (
    <div className="resume-card">
      {/* Header */}
      <div className="resume-header">
        <div className="candidate-info">
          <div className="candidate-avatar">
            {userAvatar ? (
              <img src={userAvatar} alt={userFullname} onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }} />
            ) : null}
            <div 
              className="avatar-placeholder"
              style={{ display: userAvatar ? 'none' : 'flex' }}
            >
              {userFullname.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="candidate-details">
            <h3 className="candidate-name">{userFullname}</h3>
            <p className="candidate-email">{userEmail}</p>
            {userPhone && (
              <p className="candidate-phone">{userPhone}</p>
            )}
          </div>
        </div>
        
        <div className="resume-meta">
          <div className="resume-type">
            {isGenerated ? (
              <span className="type-badge generated">🤖 AI Generated</span>
            ) : (
              <span className="type-badge uploaded">📁 Uploaded</span>
            )}
          </div>
          <div className="resume-date">
            <span className="date-text">{getTimeAgo(createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Resume content */}
      <div className="resume-content">
        <h4 className="resume-title">{resumeTitle}</h4>
        <p className="resume-description">
          {resumeContent.length > 200 
            ? `${resumeContent.substring(0, 200)}...`
            : resumeContent
          }
        </p>
        
        {/* Skills */}
        {resumeSkills.length > 0 && (
          <div className="resume-skills">
            <div className="skills-label">Skills:</div>
            <div className="skills-list">
              {resumeSkills.slice(0, 4).map((skill, index) => (
                <span key={skill.id || index} className="skill-tag">
                  {skill.name || 'Unknown Skill'}
                </span>
              ))}
              {resumeSkills.length > 4 && (
                <span className="skill-tag more">
                  +{resumeSkills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="resume-actions">
        <button 
          className="action-btn review-btn"
          onClick={handleReview}
          title="Review this resume"
        >
          <span className="btn-icon">⭐</span>
          <span className="btn-text">Review</span>
        </button>
        
        {resumeFiles.length > 0 && (
          <button 
            className="action-btn download-btn"
            onClick={handleDownload}
            title="Download resume file"
          >
            <span className="btn-icon">📥</span>
            <span className="btn-text">Download</span>
          </button>
        )}
        
        <button 
          className="action-btn contact-btn"
          onClick={handleContact}
          title="Contact candidate"
          disabled={!userEmail || userEmail === 'No email provided'}
        >
          <span className="btn-icon">📧</span>
          <span className="btn-text">Contact</span>
        </button>
      </div>

      {/* Footer */}
      <div className="resume-footer">
        <div className="submission-date">
          Submitted on {formatDate(createdAt)}
        </div>
        <div className="candidate-status">
          <span className={`status-badge ${userStatus}`}>
            {userStatus === 'verified' ? '✓ Verified' : 
             userStatus === 'pending' ? '⏳ Pending' :
             userStatus === 'unknown' ? '❓ Unknown' : userStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;