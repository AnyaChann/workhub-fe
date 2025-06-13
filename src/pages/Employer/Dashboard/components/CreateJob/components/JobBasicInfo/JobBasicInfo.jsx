import React from 'react';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import './JobBasicInfo.css';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const JobBasicInfo = ({
  title,
  location,
  description,
  experience,
  deadline,
  onChange,
  onDescriptionChange,
  errors
}) => {
  const experienceOptions = [
    { value: 'entry-level', label: 'Entry Level (0-2 years)' },
    { value: 'mid-level', label: 'Mid Level (2-5 years)' },
    { value: 'senior-level', label: 'Senior Level (5+ years)' },
    { value: 'executive', label: 'Executive/Director Level' }
  ];

  return (
    <div className="job-basic-info">
      {/* Job Title and Location */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Job Title <span className="required">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            placeholder="e.g. Senior Software Engineer"
            className={`form-input ${errors.title ? 'error' : ''}`}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Location <span className="required">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={onChange}
            placeholder="e.g. Ho Chi Minh City, Vietnam"
            className={`form-input ${errors.location ? 'error' : ''}`}
          />
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>
      </div>

      {/* Experience Level and Deadline */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Experience Level <span className="required">*</span>
          </label>
          <select
            name="experience"
            value={experience}
            onChange={onChange}
            className={`form-select ${errors.experience ? 'error' : ''}`}
          >
            <option value="">Select experience level</option>
            {experienceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.experience && <span className="error-message">{errors.experience}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Application Deadline <span className="required">*</span>
          </label>
          <input
            type="date"
            name="deadline"
            value={deadline}
            onChange={onChange}
            min={new Date().toISOString().split('T')[0]}
            className={`form-input ${errors.deadline ? 'error' : ''}`}
          />
          {errors.deadline && <span className="error-message">{errors.deadline}</span>}
        </div>
      </div>

      {/* Job Description */}
      <div className="form-group">
        <label className="form-label">
          Job Description <span className="required">*</span>
        </label>
        <RichTextEditor
          value={Array.isArray(description) ? description : initialValue}
          onChange={onDescriptionChange}
          placeholder="Describe the role, responsibilities, requirements, and benefits..."
          error={errors.description}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>
    </div>
  );
};

export default JobBasicInfo;