import React from 'react';
import './FormActions.css';

const FormActions = ({ 
  onSaveAsDraft, 
  onNext, 
  onClose,
  isValid = false,
  loading = false
}) => {
  return (
    <div className="form-actions">
      <div className="actions-left">
        {/* <button 
          type="button" 
          className="cancel-btn" 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className="save-draft-btn" 
          onClick={onSaveAsDraft}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save as draft'}
        </button> */}
      </div>
      
      <div className="actions-right">
        <button 
          type="button" 
          className={`next-btn ${isValid ? 'enabled' : 'disabled'}`}
          onClick={onNext}
          disabled={!isValid || loading}
        >
          {loading ? 'Creating...' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default FormActions;