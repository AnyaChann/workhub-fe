import React from 'react';
import PayComparison from '../PayComparison/PayComparison';
import './PaySection.css';

const PaySection = ({ 
  salary_range,
  category_id,
  position_id,
  onChange,
  updateField,
  errors
}) => {
  const payTypeOptions = [
    { value: 'annual', label: 'Annual salary' },
    { value: 'hourly', label: 'Hourly rate' },
    { value: 'unpaid', label: 'Unpaid' }
  ];

  const handlePayTypeChange = (newPayType) => {
    updateField('salary_range', {
      ...salary_range,
      type: newPayType,
      min: newPayType === 'unpaid' ? '' : salary_range.min,
      max: newPayType === 'unpaid' ? '' : salary_range.max
    });
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    const field = name.replace('salary_', '');
    
    updateField('salary_range', {
      ...salary_range,
      [field]: value
    });
  };

  const handleDisplayToggle = (e) => {
    updateField('salary_range', {
      ...salary_range,
      display: e.target.checked
    });
  };

  return (
    <div className="pay-section">
      {/* Pay Type */}
      <div className="form-section">
        <label className="form-label">Compensation Type</label>
        <div className="pay-type-buttons">
          {payTypeOptions.map(option => (
            <button
              key={option.value}
              type="button"
              className={`pay-type-btn ${salary_range.type === option.value ? 'active' : ''}`}
              onClick={() => handlePayTypeChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pay Range */}
      {salary_range.type !== 'unpaid' && (
        <div className="form-section">
          <div className="pay-range-section">
            <div className="pay-range-inputs">
              <label className="form-label">
                Salary Range ({salary_range.type === 'hourly' ? 'per hour' : 'per year'})
              </label>
              <div className="salary-inputs">
                <input
                  type="number"
                  name="salary_min"
                  value={salary_range.min}
                  onChange={handleSalaryChange}
                  placeholder={`${salary_range.type === 'hourly' ? '$ Min salary' : '$ Min salary'}`}
                  className="form-input salary-input"
                />
                <span className="salary-range-separator">-</span>
                <input
                  type="number"
                  name="salary_max"
                  value={salary_range.max}
                  onChange={handleSalaryChange}
                  placeholder={`${salary_range.type === 'hourly' ? '$$ Max salary' : '$$ Max salary'}`}
                  className={`form-input salary-input ${errors.salary_max ? 'error' : ''}`}
                />
              </div>
              {errors.salary_max && <span className="error-message">{errors.salary_max}</span>}
            </div>
            
            <PayComparison
              minSalary={salary_range.min}
              maxSalary={salary_range.max}
              payType={salary_range.type}
              category_id={category_id}
              position_id={position_id}
            />
          </div>
          
          <div className="toggle-group">
            <label className="toggle-label">
              <span>Display salary range on job post</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={salary_range.display}
                  onChange={handleDisplayToggle}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
            <p className="toggle-description">
              When your salary range is not displayed, candidates can still see if the position matches their expectations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaySection;