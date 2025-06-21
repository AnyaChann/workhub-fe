import { useState } from 'react';

const initialSlateValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export const useCreateJobForm = (initialData = {}) => {
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    location: '',
    description: initialSlateValue,
    
    // Company Info (không lưu vào DB jobs table)
    companyName: '',
    showCompanyNameAndLogo: true,
    
    // Job Details
    categoryId: '',
    position_id: '',
    type_id: '', // job type (full-time, part-time, etc.)
    experience: 'entry-level', // entry-level, mid-level, senior-level, executive
    
    // Salary
    salary_range: {
      min: '',
      max: '',
      type: 'annual', // annual, hourly
      display: true
    },
    
    // Dates
    deadline: '',
    post_at: new Date().toISOString().split('T')[0], // default to today
    
    // Status & Meta
    status: 'draft', // draft, active, closed, expired
    recruiter_id: null, // sẽ được set từ user context
    
    // Additional (optional)
    payDescription: '',
    referenceNumber: '',
    
    ...initialData,
    // Ensure description is always array
    description: Array.isArray(initialData.description)
      ? initialData.description
      : initialSlateValue,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested salary_range updates
    if (name.startsWith('salary_')) {
      const field = name.replace('salary_', '');
      setFormData(prev => ({
        ...prev,
        salary_range: {
          ...prev.salary_range,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({
      ...prev,
      description: Array.isArray(content) ? content : initialSlateValue
    }));
    
    if (errors.description) {
      setErrors(prev => ({
        ...prev,
        description: ''
      }));
    }
  };

  const updateField = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Job location is required';
    }
    
    if (
      !Array.isArray(formData.description) ||
      !formData.description.length ||
      !formData.description.some(block => 
        block.children && 
        block.children.some(child => child.text && child.text.trim())
      )
    ) {
      newErrors.description = 'Job description is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    if (!formData.position_id) {
      newErrors.position_id = 'Position is required';
    }
    
    if (!formData.type_id) {
      newErrors.type_id = 'Job type is required';
    }
    
    if (!formData.experience) {
      newErrors.experience = 'Experience level is required';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Application deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }
    
    // Salary validation
    if (formData.salary_range.min && formData.salary_range.max) {
      const min = parseFloat(formData.salary_range.min);
      const max = parseFloat(formData.salary_range.max);
      if (min >= max) {
        newErrors.salary_max = 'Maximum salary must be greater than minimum salary';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Convert form data to API format
  const getApiPayload = () => {
    return {
      title: formData.title,
      location: formData.location,
      description: formData.description,
      categoryId: parseInt(formData.categoryId),
      position_id: parseInt(formData.position_id),
      type_id: parseInt(formData.type_id),
      experience: formData.experience,
      salary_range: {
        min: formData.salary_range.min ? parseFloat(formData.salary_range.min) : null,
        max: formData.salary_range.max ? parseFloat(formData.salary_range.max) : null,
        type: formData.salary_range.type,
        display: formData.salary_range.display
      },
      deadline: formData.deadline,
      post_at: formData.post_at,
      status: formData.status,
      recruiter_id: formData.recruiter_id
    };
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleDescriptionChange,
    updateField,
    validateForm,
    getApiPayload,
    setErrors,
    setFormData // ✅ Thêm method này
  };
};