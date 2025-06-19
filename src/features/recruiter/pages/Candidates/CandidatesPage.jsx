import React from 'react';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import './CandidatesPage.css';

const CandidatesPage = () => {
  return (
    <div className="candidates-page">
      <PageHeader title="Candidates" />
      
      <div className="page-content">
        <p>Candidates page content goes here...</p>
      </div>
    </div>
  );
};

export default CandidatesPage;
