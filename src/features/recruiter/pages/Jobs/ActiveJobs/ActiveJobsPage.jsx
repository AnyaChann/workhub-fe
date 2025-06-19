import React from 'react';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import SearchSection from '../../../components/common/SearchSection/SearchSection';
import JobsList from '../../../components/jobs/JobsList/JobsList';
import './ActiveJobsPage.css';

const ActiveJobsPage = ({ onCreateJob }) => {
  return (
    <div className="active-jobs-page">
      <PageHeader 
        title="Active Jobs"
        showCreateButton={true}
        onCreateJob={onCreateJob}
        createButtonText="Create New Job"
      />
      
      <SearchSection 
        placeholder="Search active jobs..."
        sortOptions={[
          { value: 'updated_at', label: 'Recently Updated' },
          { value: 'created_at', label: 'Recently Created' },
          { value: 'title', label: 'Job Title (A-Z)' },
          { value: 'applications', label: 'Most Applications' }
        ]}
      />
      
      <JobsList 
        status="active"
        emptyMessage="No active jobs found"
        emptyDescription="Create your first job posting to get started"
        onCreateJob={onCreateJob}
      />
    </div>
  );
};

export default ActiveJobsPage;
