import React from 'react';
import JobsPageLayout from '../../../../dashboard/components/shared/JobsPageLayout/JobsPageLayout';

const ActiveJobs = ({ onCreateJob }) => {
  const emptyStateConfig = {
    icon: '📋',
    title: 'You have no active jobs',
    description: 'Start by posting your first job to find great candidates.',
    showCreateButton: true,
    onCreateJob: onCreateJob
  };

  const sortOptions = [
    { value: 'updated_at', label: 'Edited at (most recent)' },
    { value: 'created_at', label: 'Created at (most recent)' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'deadline', label: 'Deadline (earliest first)' }
  ];

  const handleEdit = (job) => {
    console.log('Edit job:', job);
    // Navigate to edit job page
  };

  const handleDelete = (job) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      console.log('Delete job:', job);
    }
  };

  const handleDuplicate = (job) => {
    console.log('Duplicate job:', job);
  };

  return (
    <JobsPageLayout
      pageTitle="Active jobs"
      pageType="active"
      onCreateJob={onCreateJob}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      emptyStateConfig={emptyStateConfig}
      initialDataCount={2}
      loadingDelay={1000}
      searchPlaceholder="Search active jobs"
      sortOptions={sortOptions}
    />
  );
};

export default ActiveJobs;