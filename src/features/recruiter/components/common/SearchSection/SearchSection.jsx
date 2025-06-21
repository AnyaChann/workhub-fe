import React, { useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/scale.css';
import './SearchSection.css';

const SearchSection = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
  placeholder = 'Tìm kiếm...',
  showResults = false,
  resultsCount = 0,
  totalCount = 0,
  showViewToggle = true,
  storageKey = 'activeJobs' // Key để lưu vào localStorage
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Mới nhất', tooltip: 'Hiển thị công việc mới được đăng trước' },
    { value: 'oldest', label: 'Cũ nhất', tooltip: 'Hiển thị công việc cũ được đăng trước' },
    { value: 'deadline', label: 'Hạn nộp', tooltip: 'Sắp xếp theo hạn nộp hồ sơ gần nhất' },
    { value: 'applications', label: 'Nhiều ứng viên', tooltip: 'Hiển thị công việc có nhiều ứng viên nhất' },
    { value: 'title', label: 'Tiêu đề (A-Z)', tooltip: 'Sắp xếp theo thứ tự bảng chữ cái' }
  ];

  const viewModes = [
    { 
      mode: 'cell', 
      label: 'Bảng', 
      tooltip: 'Hiển thị dưới dạng bảng với thông tin chi tiết',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3h18v18H3V3z" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M3 9h18" stroke="currentColor" strokeWidth="2" />
          <path d="M3 15h18" stroke="currentColor" strokeWidth="2" />
          <path d="M9 3v18" stroke="currentColor" strokeWidth="2" />
          <path d="M15 3v18" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    { 
      mode: 'grid', 
      label: 'Lưới', 
      tooltip: 'Hiển thị dưới dạng thẻ lưới (mặc định)',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    { 
      mode: 'list', 
      label: 'Danh sách', 
      tooltip: 'Hiển thị dưới dạng danh sách dọc',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
          <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
          <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" />
          <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" />
          <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" />
          <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    }
  ];

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem(`${storageKey}_preferences`);
    if (savedPreferences) {
      try {
        const { sortBy: savedSortBy, viewMode: savedViewMode } = JSON.parse(savedPreferences);

        // Apply saved sort if different from current
        if (savedSortBy && savedSortBy !== sortBy && onSortChange) {
          onSortChange(savedSortBy);
        }

        // Apply saved view mode if different from current
        if (savedViewMode && savedViewMode !== viewMode && onViewModeChange) {
          onViewModeChange(savedViewMode);
        }
      } catch (error) {
        console.warn('Failed to parse saved preferences:', error);
      }
    }
  }, [onSortChange, onViewModeChange, sortBy, storageKey, viewMode]);

  // Save preferences to localStorage when they change
  const savePreferences = (newSortBy, newViewMode) => {
    try {
      const preferences = {
        sortBy: newSortBy,
        viewMode: newViewMode,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(`${storageKey}_preferences`, JSON.stringify(preferences));
      console.log('✅ Preferences saved:', preferences);
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  };

  const handleSortChange = (newSortBy) => {
    onSortChange(newSortBy);
    savePreferences(newSortBy, viewMode);
  };

  const handleViewModeChange = (newViewMode) => {
    onViewModeChange(newViewMode);
    savePreferences(sortBy, newViewMode);
  };

  const getCurrentSortOption = () => {
    return sortOptions.find(option => option.value === sortBy) || sortOptions[0];
  };

  return (
    <div className="search-section">
      <div className="search-controls">
        {/* Left side - Search */}
        <div className="search-bar">
          <div className="search-input-wrapper">
            <Tippy 
              content="Tìm kiếm theo tiêu đề, địa điểm, mô tả, danh mục, kỹ năng..."
              theme="light"
              animation="scale"
              delay={[500, 100]}
            >
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" />
              </svg>
            </Tippy>

            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />

            {searchQuery && (
              <Tippy 
                content="Xóa tìm kiếm"
                theme="light"
                animation="scale"
                delay={[300, 100]}
              >
                <button
                  className="clear-search-btn"
                  onClick={() => onSearchChange('')}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </Tippy>
            )}
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="controls-right">
          {/* Sort Controls */}
          <div className="sort-controls">
            <Tippy 
              content="Chọn cách sắp xếp danh sách công việc"
              theme="light"
              animation="scale"
              delay={[1000, 100]}
            >
              <label htmlFor="sort-select">Sắp xếp:</label>
            </Tippy>
            
            <Tippy 
              content={getCurrentSortOption().tooltip}
              theme="light"
              animation="scale"
              delay={[300, 100]}
            >
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Tippy>
          </div>

          {/* View Mode Toggle */}
          {showViewToggle && onViewModeChange && (
            <div className="view-controls">
              <Tippy 
                content="Chọn cách hiển thị danh sách"
                theme="light"
                animation="scale"
                delay={[500, 100]}
              >
                <span className="view-label">Hiển thị:</span>
              </Tippy>
              
              <div className="view-mode-toggle">
                {viewModes.map((view) => (
                  <Tippy 
                    key={view.mode}
                    content={view.tooltip}
                    theme="light"
                    animation="scale"
                    delay={[300, 100]}
                  >
                    <button
                      className={`view-btn ${viewMode === view.mode ? 'active' : ''}`}
                      onClick={() => handleViewModeChange(view.mode)}
                      aria-label={view.label}
                    >
                      {view.icon}
                    </button>
                  </Tippy>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {showResults && (
        <div className="search-results-info">
          <div className="results-text">
            {resultsCount > 0 ? (
              <>
                Tìm thấy <strong>{resultsCount.toLocaleString()}</strong> kết quả
                {searchQuery && (
                  <> cho "<span className="search-term">{searchQuery}</span>"</>
                )}
                <span className="total-info"> trong tổng số {totalCount.toLocaleString()}</span>
              </>
            ) : (
              <>
                Không tìm thấy kết quả nào
                {searchQuery && (
                  <> cho "<span className="search-term">{searchQuery}</span>"</>
                )}
              </>
            )}
          </div>

          {searchQuery && (
            <Tippy 
              content="Xóa tất cả bộ lọc tìm kiếm"
              theme="light"
              animation="scale"
              delay={[300, 100]}
            >
              <button
                className="clear-filters-btn"
                onClick={() => onSearchChange('')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                </svg>
                Xóa bộ lọc
              </button>
            </Tippy>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSection;