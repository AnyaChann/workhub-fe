import React, { useState, useEffect } from 'react';
import JobsList from '../JobsList/JobsList';
import JobsDebugPanel from '../JobsDebugPanel/JobsDebugPanel';
import { generateMockJobs, generateSingleMockJob } from '../../../../../utils/mockJobsGenerator';
import '../ActiveJobs/ActiveJobs.css';

const Expired = ({ onCreateJob }) => {
  const [showOnlyMyJobs, setShowOnlyMyJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false); // ✅ Disabled by default

  // Load initial data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Start with empty array - no expired jobs initially
      setJobs([]);
      setLoading(false);
    }, 600);
  }, []);

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
    console.log(`🎯 Generating ${count} ${type} jobs for Expired page`);
    const newJobs = generateMockJobs(type, count);
    
    // Filter only expired jobs for this page
    const expiredJobs = newJobs.filter(job => job.status === 'expired');
    
    setJobs(prev => [...expiredJobs, ...prev]);
  };

  const handleAddSampleJob = (type) => {
    console.log(`➕ Adding single ${type} job`);
    const newJob = generateSingleMockJob('expired'); // Always generate expired for this page
    setJobs(prev => [newJob, ...prev]);
  };

  const handleClearJobs = () => {
    console.log('🗑️ Clearing all jobs');
    setJobs([]);
  };

  const handleRenew = (job) => {
    console.log('Renew job:', job);
    // Navigate to renewal/checkout page
  };

  const handleEdit = (job) => {
    console.log('Edit expired job:', job);
    // Navigate to edit job page
  };

  const handleDelete = (job) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      setJobs(prev => prev.filter(j => j.id !== job.id));
      console.log('Delete expired job:', job);
    }
  };

  const handleDuplicate = (job) => {
    const duplicatedJob = {
      ...job,
      id: Date.now(),
      title: `${job.title} (Copy)`,
      status: 'draft',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
      applications: 0,
      views: 0
    };
    setJobs(prev => [duplicatedJob, ...prev]);
    console.log('Duplicate expired job:', duplicatedJob);
  };

  // Filter only expired jobs for display
  const expiredJobs = jobs.filter(job => job.status === 'expired');

  const emptyStateConfig = {
    icon: '⏰',
    title: 'You have no expired jobs',
    description: 'Jobs that have reached their expiration date will appear here.',
    showCreateButton: true,
    onCreateJob: onCreateJob
  };

  return (
    <main className="dashboard-main">
      {/* Debug Panel - Only show in development and when enabled */}
      {showDebug && process.env.NODE_ENV === 'development' && (
        <JobsDebugPanel
          currentPage="Expired"
          jobs={jobs}
          onGenerateMockData={handleGenerateMockData}
          onClearJobs={handleClearJobs}
          onAddSampleJob={handleAddSampleJob}
          onClose={() => setShowDebug(false)}
        />
      )}

      <div className="main-header">
        <h1 className="page-title">Expired</h1>
        
        <div className="page-controls">
          {/* Debug Toggle Button - Only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <button
              className={`debug-toggle-btn ${showDebug ? 'debug-active' : ''}`}
              onClick={() => setShowDebug(!showDebug)}
              title="Toggle Debug Panel (Ctrl+D) - Development Only"
            >
              🐛 Debug {showDebug ? '(ON)' : '(OFF)'}
            </button>
          )}

          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={showOnlyMyJobs}
              onChange={(e) => setShowOnlyMyJobs(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Only jobs posted by me</span>
          </label>
        </div>
      </div>
      
      <div className="search-section">
        <div className="search-controls">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input 
              type="text"
              placeholder="Search expired jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by</label>
            <select 
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="updated_at">Edited at (most recent)</option>
              <option value="created_at">Created at (most recent)</option>
              <option value="title">Title (A-Z)</option>
              <option value="deadline">Expired date</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="jobs-content">
        <JobsList
          jobs={expiredJobs}
          loading={loading}
          error={error}
          showOnlyMyJobs={showOnlyMyJobs}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onRenew={handleRenew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          emptyStateConfig={emptyStateConfig}
        />
      </div>
    </main>
  );
};

export default Expired;