import React, { useEffect } from 'react';
import { useCategoriesAndPositions } from '../../../../../recruiter/hooks/useCategoriesAndPositions';
import './CategorySection.css';

const CategorySection = ({ 
  category_id, 
  position_id, 
  onChange, 
  errors 
}) => {
  const { 
    categories, 
    positions,
    filteredPositions, 
    loading, 
    error, 
    filterPositionsByCategory 
  } = useCategoriesAndPositions();

  // Filter positions when category changes
  useEffect(() => {
    if (positions.length > 0) {
      console.log('CategorySection: Filtering positions for category:', category_id);
      filterPositionsByCategory(category_id);
    }
  }, [category_id, positions.length]);

  // Debug effect
  useEffect(() => {
    console.log('CategorySection Debug:');
    console.log('- Selected category_id:', category_id);
    console.log('- All positions:', positions);
    console.log('- Filtered positions:', filteredPositions);
    console.log('- Categories:', categories);
  }, [category_id, positions, filteredPositions, categories]);

  // Handle category change
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    console.log('Category changed from', category_id, 'to', newCategory);
    onChange(e); // Call parent onChange
    
    // Reset position when category changes
    if (newCategory !== category_id) {
      const positionResetEvent = {
        target: {
          name: 'position_id',
          value: ''
        }
      };
      onChange(positionResetEvent);
    }
  };

  if (loading) {
    return (
      <div className="category-section">
        <div className="loading-state">
          <span>Loading categories and positions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="category-section">
      <div className="form-row highlighted-row">
        <div className="form-group">
          <label className="form-label">
            Category <span className="required">*</span>
          </label>
          <select
            name="category_id"
            value={category_id}
            onChange={handleCategoryChange}
            className={`form-select ${errors.category_id ? 'error' : ''}`}
            disabled={loading}
          >
            <option value="">Select a category</option>
            {categories.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.category_id && <span className="error-message">{errors.category_id}</span>}
          <small className="field-help">
            Choose the job category that best fits this position
          </small>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Position <span className="required">*</span>
          </label>
          <select
            name="position_id"
            value={position_id}
            onChange={onChange}
            className={`form-select ${errors.position_id ? 'error' : ''}`}
            disabled={loading || !category_id}
          >
            <option value="">
              {!category_id ? 'Select category first' : 'Select position'}
            </option>
            {filteredPositions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.position_id && <span className="error-message">{errors.position_id}</span>}
          <small className="field-help">
            {!category_id 
              ? 'Please select a category first' 
              : `Choose from ${filteredPositions.length} available positions`
            }
          </small>
        </div>
      </div>

      {/* Debug panel - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-panel" style={{
          margin: '16px 0',
          padding: '12px',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          fontSize: '12px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Debug Info:</h4>
          <div><strong>Selected Category ID:</strong> {category_id || 'None'}</div>
          <div><strong>Total Positions:</strong> {positions.length}</div>
          <div><strong>Filtered Positions:</strong> {filteredPositions.length}</div>
          <div><strong>Sample Position:</strong> {positions[0] ? JSON.stringify(positions[0]) : 'None'}</div>
          <div><strong>Categories:</strong> {categories.map(c => `${c.id}:${c.name}`).join(', ')}</div>
        </div>
      )}

      {error && (
        <div className="api-error-notice">
          <small>⚠️ Using cached data (API temporarily unavailable)</small>
        </div>
      )}
    </div>
  );
};

export default CategorySection;