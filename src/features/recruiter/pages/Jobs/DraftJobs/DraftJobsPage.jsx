import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { jobService } from '../../../services/jobService';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import SearchSection from '../../../components/common/SearchSection/SearchSection';
import JobsList from '../../../components/jobs/JobsList/JobsList';
import './DraftJobsPage.css';

const DraftJobsPage = ({ onCreateJob, onContinuePosting }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  
  const { user } = useAuth();

  useEffect(() => {
    loadDraftJobs();
  }, []);

  const loadDraftJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Loading draft jobs...');
      const response = await jobService.getRecruiterJobs();
      
      // Filter only draft jobs
      const draftJobs = Array.isArray(response) 
        ? response.filter(job => job.status === 'draft')
        : [];
      
      console.log('✅ Draft jobs loaded:', draftJobs.length);
      setJobs(draftJobs);
      
    } catch (err) {
      console.error('❌ Error loading draft jobs:', err);
      setError(err.message || 'Failed to load draft jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Continue posting (publish draft)
  const handleContinuePosting = async (job) => {
    console.log('📝 Continue posting job:', job);
    
    try {
      // Update job status to active/published
      const updatedJob = {
        ...job,
        status: 'active'
      };
      
      await jobService.updateJob(job.id, updatedJob);
      
      // Remove from drafts and refresh
      loadDraftJobs();
      
      console.log('✅ Job published successfully');
    } catch (err) {
      console.error('❌ Error publishing job:', err);
      alert('Failed to publish job. Please try again.');
    }
  };

  const handleEditJob = async (job) => {
    console.log('✏️ Edit draft job:', job);
    if (onContinuePosting) {
      onContinuePosting(job);
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Are you sure you want to delete the draft "${job.title}"?`)) {
      return;
    }

    try {
      await jobService.deleteJob(job.id);
      setJobs(prevJobs => prevJobs.filter(j => j.id !== job.id));
      console.log('✅ Draft job deleted');
    } catch (err) {
      console.error('❌ Error deleting draft job:', err);
      alert('Failed to delete job. Please try again.');
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  const filteredAndSortedJobs = jobs
    .filter(job => {
      if (!searchQuery) return true;
      return job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             job.location?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'updated_at':
          return new Date(b.updated_at || b.updatedAt) - new Date(a.updated_at || a.updatedAt);
        case 'created_at':
          return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div className="draft-jobs-page">
      <PageHeader 
        title="Draft Jobs"
        subtitle={`${filteredAndSortedJobs.length} draft job${filteredAndSortedJobs.length !== 1 ? 's' : ''}`}
        showCreateButton={true}
        onCreateJob={onCreateJob}
        createButtonText="Create New Job"
      />
      
      <SearchSection 
        placeholder="Search draft jobs..."
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        sortOptions={[
          { value: 'updated_at', label: 'Recently Modified' },
          { value: 'created_at', label: 'Recently Created' },
          { value: 'title', label: 'Job Title (A-Z)' }
        ]}
      />
      
      <JobsList 
        jobs={filteredAndSortedJobs}
        loading={loading}
        error={error}
        emptyStateConfig={{
          icon: '📝',
          title: 'No draft jobs found',
          description: searchQuery 
            ? `No draft jobs match "${searchQuery}".`
            : 'Your saved drafts will appear here. Start creating a job to save as draft.',
          showCreateButton: !searchQuery,
          onCreateJob: onCreateJob
        }}
        onEdit={handleEditJob}
        onDelete={handleDeleteJob}
        onContinuePosting={handleContinuePosting}
        showActions={true}
        isDraftView={true}
      />

      <div className="page-actions">
        <button 
          className="refresh-btn"
          onClick={loadDraftJobs}
          disabled={loading}
        >
          {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
    </div>
  );
};

export default DraftJobsPage;