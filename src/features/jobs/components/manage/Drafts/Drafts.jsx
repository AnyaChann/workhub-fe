import React from 'react';
import JobsPageLayout from '../shared/JobsPageLayout/JobsPageLayout';

const Drafts = ({ onCreateJob, onContinuePosting }) => {
  const emptyStateConfig = {
    icon: '📝',
    title: 'You have no drafts',
    description: 'Save job drafts to publish later when you\'re ready.',
    showCreateButton: true,
    onCreateJob: onCreateJob
  };

  const sortOptions = [
    { value: 'updated_at', label: 'Edited at (most recent)' },
    { value: 'created_at', label: 'Created at (most recent)' },
    { value: 'title', label: 'Title (A-Z)' }
  ];

  const handleContinuePosting = (job) => {
    console.log('Continue posting job:', job);
    if (onContinuePosting) {
      onContinuePosting(job);
    }
  };

  const handleEdit = (job) => {
    console.log('Edit draft job:', job);
    if (onContinuePosting) {
      onContinuePosting(job);
    }
  };

  const handleDelete = (job) => {
    if (window.confirm(`Are you sure you want to delete the draft "${job.title}"?`)) {
      console.log('Delete draft job:', job);
    }
  };

  const handleDuplicate = (job) => {
    console.log('Duplicate draft job:', job);
  };

  return (
    <JobsPageLayout
      pageTitle="Drafts"
      pageType="draft"
      onCreateJob={onCreateJob}
      onContinuePosting={handleContinuePosting}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      emptyStateConfig={emptyStateConfig}
      initialDataCount={1}
      loadingDelay={800}
      searchPlaceholder="Search draft jobs"
      sortOptions={sortOptions}
    />
  );
};

export default Drafts;