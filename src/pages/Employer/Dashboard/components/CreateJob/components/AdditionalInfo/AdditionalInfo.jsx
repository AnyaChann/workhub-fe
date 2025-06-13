import React from 'react';
import './AdditionalInfo.css';

const AdditionalInfo = ({ 
  payDescription, 
  referenceNumber, 
  onChange 
}) => {
  const getCharacterCount = (text, maxLength = 50) => {
    const remaining = maxLength - (text?.length || 0);
    return remaining;
  };

  return (
    <div className="additional-info">
      {/* Pay Description */}
      <div className="form-group">
        <label className="form-label">
          Pay description <span className="optional">(optional)</span>
        </label>
        <textarea
          name="payDescription"
          value={payDescription}
          onChange={onChange}
          placeholder="Enter pay description"
          className="form-textarea"
          rows="3"
          maxLength="50"
        />
        <small className="character-count">
          {getCharacterCount(payDescription)} characters remaining
        </small>
      </div>

      {/* Reference Number */}
      <div className="form-group">
        <label className="form-label">
          Reference number <span className="optional">(optional)</span>
        </label>
        <input
          type="text"
          name="referenceNumber"
          value={referenceNumber}
          onChange={onChange}
          placeholder="Enter reference number"
          className="form-input"
        />
        <small className="field-description">For your internal reference</small>
      </div>
    </div>
  );
};

export default AdditionalInfo;