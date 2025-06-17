import React from 'react';
import './SearchSection.css';

const SearchSection = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  placeholder = 'Search jobs',
  sortOptions = []
}) => {
  const defaultSortOptions = [
    { value: 'updated_at', label: 'Edited at (most recent)' },
    { value: 'created_at', label: 'Created at (most recent)' },
    { value: 'title', label: 'Title (A-Z)' }
  ];

  const finalSortOptions = sortOptions.length > 0 ? sortOptions : defaultSortOptions;

  return (
    <div className="search-section">
      <div className="search-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by</label>
          <select 
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            {finalSortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;