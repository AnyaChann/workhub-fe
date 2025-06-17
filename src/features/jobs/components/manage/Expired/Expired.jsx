import React from 'react';
import JobsPageLayout from '../../../../dashboard/components/shared/JobsPageLayout/JobsPageLayout';

const Expired = ({ onCreateJob }) => {
  const emptyStateConfig = {
    icon: '⏰',
    title: 'You have no expired jobs',
    description: 'Jobs that have reached their expiration date will appear here.',
    showCreateButton: true,
    onCreateJob: onCreateJob
  };

  const sortOptions = [
    { value: 'updated_at', label: 'Edited at (most recent)' },
    { value: 'created_at', label: 'Created at (most recent)' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'deadline', label: 'Expired date' }
  ];

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
      console.log('Delete expired job:', job);
    }
  };

  const handleDuplicate = (job) => {
    console.log('Duplicate expired job:', job);
  };

  return (
    <JobsPageLayout
      pageTitle="Expired"
      pageType="expired"
      onCreateJob={onCreateJob}
      onRenew={handleRenew}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      emptyStateConfig={emptyStateConfig}
      initialDataCount={0}
      loadingDelay={600}
      searchPlaceholder="Search expired jobs"
      sortOptions={sortOptions}
    />
  );
};

export default Expired;