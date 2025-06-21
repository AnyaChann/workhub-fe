import React, { useState, useEffect } from 'react';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, resume, existingReview, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (existingReview) {
        setRating(existingReview.rating || 0);
        setComment(existingReview.comment || '');
      } else {
        setRating(0);
        setComment('');
      }
      setErrors({});
    }
  }, [isOpen, existingReview]);

  const handleStarClick = (starRating) => {
    setRating(starRating);
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: null }));
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!comment.trim()) {
      newErrors.comment = 'Please provide a comment';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit({
        rating,
        comment: comment.trim()
      });
    } catch (error) {
      console.error('Review submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !resume) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container review-modal">
        <div className="modal-header">
          <h2>Review Resume</h2>
          <button className="close-button" onClick={onClose} disabled={loading}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {/* Resume summary */}
          <div className="resume-summary">
            <div className="candidate-info">
              <div className="candidate-avatar">
                {resume.user.avatar ? (
                  <img src={resume.user.avatar} alt={resume.user.fullname} />
                ) : (
                  <div className="avatar-placeholder">
                    {resume.user.fullname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="candidate-details">
                <h3>{resume.user.fullname}</h3>
                <p className="resume-title">{resume.title}</p>
                <p className="candidate-email">{resume.user.email}</p>
              </div>
            </div>
          </div>

          {/* Review form */}
          <form onSubmit={handleSubmit} className="review-form">
            {/* Rating */}
            <div className="form-group">
              <label className="form-label">
                Rating* 
                <span className="rating-hint">(Click on stars to rate)</span>
              </label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= rating ? 'selected' : ''}`}
                    onClick={() => handleStarClick(star)}
                    disabled={loading}
                  >
                    ⭐
                  </button>
                ))}
                <span className="rating-text">
                  {rating > 0 && (
                    <>
                      {rating}/5 - {
                        rating === 1 ? 'Poor' :
                        rating === 2 ? 'Fair' :
                        rating === 3 ? 'Good' :
                        rating === 4 ? 'Very Good' :
                        'Excellent'
                      }
                    </>
                  )}
                </span>
              </div>
              {errors.rating && (
                <div className="error-message">{errors.rating}</div>
              )}
            </div>

            {/* Comment */}
            <div className="form-group">
              <label htmlFor="comment" className="form-label">
                Comment*
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={handleCommentChange}
                className={errors.comment ? 'error' : ''}
                placeholder="Provide detailed feedback about the candidate's qualifications, experience, and suitability for the role..."
                rows="6"
                disabled={loading}
              />
              <div className="character-count">
                {comment.length}/500 characters
              </div>
              {errors.comment && (
                <div className="error-message">{errors.comment}</div>
              )}
            </div>

            {/* Quick comment templates */}
            <div className="quick-comments">
              <label className="form-label">Quick Templates:</label>
              <div className="template-buttons">
                <button
                  type="button"
                  className="template-btn"
                  onClick={() => setComment("Strong technical background and relevant experience. Good fit for the role.")}
                  disabled={loading}
                >
                  Positive
                </button>
                <button
                  type="button"
                  className="template-btn"
                  onClick={() => setComment("Decent qualifications but lacks some key requirements. May need additional training.")}
                  disabled={loading}
                >
                  Neutral
                </button>
                <button
                  type="button"
                  className="template-btn"
                  onClick={() => setComment("Does not meet the minimum requirements for this position.")}
                  disabled={loading}
                >
                  Negative
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;