import React, { useState, useEffect } from 'react';
import JobsList from '../../../../jobs/components/shared/JobsList/JobsList';
import JobsDebugPanel from '../JobsDebugPanel/JobsDebugPanel';
import PageHeader from '../PageHeader/PageHeader';
import SearchSection from '../SearchSection/SearchSection';
import { generateMockJobs, generateSingleMockJob } from '../../../../jobs/utils/mockJobsGenerator';
import './JobsPageLayout.css';

const JobsPageLayout = ({
  pageTitle,
  pageType, // 'active', 'drafts', 'expired'
  onCreateJob,
  onContinuePosting,
  onEdit,
  onDelete,
  onDuplicate,
  onRenew,
  emptyStateConfig,
  initialDataCount = 0,
  loadingDelay = 800,
  searchPlaceholder,
  sortOptions = []
}) => {
  const [showOnlyMyJobs, setShowOnlyMyJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  // Load initial data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (initialDataCount > 0) {
        const initialJobs = generateMockJobs(pageType, initialDataCount);
        setJobs(initialJobs);
      } else {
        setJobs([]);
      }
      setLoading(false);
    }, loadingDelay);
  }, [pageType, initialDataCount, loadingDelay]);

  // Keyboard shortcuts - only in development
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (process.env.NODE_ENV !== 'development') return;
      
      if (event.ctrlKey) {
        switch (event.key) {
          case 'd':
            event.preventDefault();
            setShowDebug(prev => !prev);
            break;
          case 'g':
            event.preventDefault();
            if (showDebug) handleGenerateMockData('mixed', 5);
            break;
          case 'c':
            event.preventDefault();
            if (showDebug) handleClearJobs();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDebug]);

  const handleGenerateMockData = (type, count) => {
    console.log(`🎯 Generating ${count} ${type} jobs for ${pageTitle} page`);
    const newJobs = generateMockJobs(type, count);
    
    // Filter jobs by page type
    const filteredJobs = newJobs.filter(job => job.status === pageType);
    
    setJobs(prev => [...filteredJobs, ...prev]);
  };

  const handleAddSampleJob = (type) => {
    console.log(`➕ Adding single ${type} job`);
    const newJob = generateSingleMockJob(pageType);
    setJobs(prev => [newJob, ...prev]);
  };

  const handleClearJobs = () => {
    console.log('🗑️ Clearing all jobs');
    setJobs([]);
  };

  // Filter jobs by page type for display
  const filteredJobs = jobs.filter(job => job.status === pageType);

  // Default sort options
  const defaultSortOptions = [
    { value: 'updated_at', label: 'Edited at (most recent)' },
    { value: 'created_at', label: 'Created at (most recent)' },
    { value: 'title', label: 'Title (A-Z)' }
  ];

  const finalSortOptions = sortOptions.length > 0 ? sortOptions : defaultSortOptions;

  return (
    <main className="dashboard-main">
      {/* Debug Panel - Only show in development and when enabled */}
      {showDebug && process.env.NODE_ENV === 'development' && (
        <JobsDebugPanel
          currentPage={pageTitle}
          jobs={jobs}
          onGenerateMockData={handleGenerateMockData}
          onClearJobs={handleClearJobs}
          onAddSampleJob={handleAddSampleJob}
          onClose={() => setShowDebug(false)}
        />
      )}

      <PageHeader
        title={pageTitle}
        showOnlyMyJobs={showOnlyMyJobs}
        onToggleMyJobs={setShowOnlyMyJobs}
        showDebug={showDebug}
        onToggleDebug={setShowDebug}
        onCreateJob={onCreateJob}
      />
      
      <SearchSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        placeholder={searchPlaceholder}
        sortOptions={finalSortOptions}
      />
      
      <div className="jobs-content">
        <JobsList
          jobs={filteredJobs}
          loading={loading}
          error={error}
          showOnlyMyJobs={showOnlyMyJobs}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onContinuePosting={onContinuePosting}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onRenew={onRenew}
          emptyStateConfig={emptyStateConfig}
        />
      </div>
    </main>
  );
};

export default JobsPageLayout;