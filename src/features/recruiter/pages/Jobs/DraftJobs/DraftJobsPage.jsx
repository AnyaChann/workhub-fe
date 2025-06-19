import React from 'react';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import './DraftJobsPage.css';

const DraftJobsPage = ({ onCreateJob }) => {
  return (
    <div className="draftjobs-page">
      <PageHeader 
        title="DraftJobs"
        showCreateButton={true}
        onCreateJob={onCreateJob}
      />
      
      <div className="page-content">
        <p>DraftJobs page content goes here...</p>
      </div>
    </div>
  );
};

export default DraftJobsPage;
