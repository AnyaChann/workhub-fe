import React from 'react';
import { InlineLoadingSpinner } from '../../../../../../../components/LoadingSpinner/LoadingSpinner';
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
        {/* Left actions if needed */}
      </div>
      
      <div className="actions-right">
        <button 
          type="button" 
          className={`next-btn ${isValid ? 'enabled' : 'disabled'}`}
          onClick={onNext}
          disabled={!isValid || loading}
        >
          {loading ? (
            <InlineLoadingSpinner message="Creating..." size="small" />
          ) : (
            'Next →'
          )}
        </button>
      </div>
    </div>
  );
};

export default FormActions;