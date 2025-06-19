import React from 'react';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import './CreateJobPage.css';

const CreateJobPage = ({ onCreateJob }) => {
  return (
    <div className="createjob-page">
      <PageHeader 
        title="CreateJob"
        showCreateButton={true}
        onCreateJob={onCreateJob}
      />
      
      <div className="page-content">
        <p>CreateJob page content goes here...</p>
      </div>
    </div>
  );
};

export default CreateJobPage;
