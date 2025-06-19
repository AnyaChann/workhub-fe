import React from 'react';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import './ExpiredJobsPage.css';

const ExpiredJobsPage = ({ onCreateJob }) => {
  return (
    <div className="expiredjobs-page">
      <PageHeader 
        title="ExpiredJobs"
        showCreateButton={true}
        onCreateJob={onCreateJob}
      />
      
      <div className="page-content">
        <p>ExpiredJobs page content goes here...</p>
      </div>
    </div>
  );
};

export default ExpiredJobsPage;
