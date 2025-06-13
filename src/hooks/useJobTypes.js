import { useState, useEffect } from 'react';
import { jobTypeService } from '../services/jobTypeService';

export const useJobTypes = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback data với format đúng
  const fallbackJobTypes = [
    { id: 1, name: 'Full-time', description: 'Full-time employment' },
    { id: 2, name: 'Part-time', description: 'Part-time employment' },
    { id: 3, name: 'Contract', description: 'Contract work' },
    { id: 4, name: 'Internship', description: 'Internship position' },
    { id: 5, name: 'Freelance', description: 'Freelance contract work' }
  ];

  const fallbackContractTypes = [
    { id: 10, name: 'Permanent', description: 'Permanent contract' },
    { id: 11, name: 'Temporary', description: 'Temporary contract' },
    { id: 12, name: 'Fixed-term', description: 'Fixed-term contract' },
    { id: 13, name: 'Casual', description: 'Casual employment' }
  ];

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await jobTypeService.getAllJobTypes();
        
        console.log('Job types API response:', response);
        
        if (response && Array.isArray(response)) {
          // API trả về array trực tiếp với format {id, name, description}
          
          // Phân loại dựa trên name hoặc description (hoặc có thể có field type khác)
          const jobs = response.filter(type => {
            const nameOrDesc = (type.name + ' ' + type.description).toLowerCase();
            return nameOrDesc.includes('full-time') || 
                   nameOrDesc.includes('part-time') || 
                   nameOrDesc.includes('contract') || 
                   nameOrDesc.includes('internship') || 
                   nameOrDesc.includes('freelance');
          });
          
          // Nếu API không có contract types riêng, dùng fallback
          // Hoặc có thể cần call API khác cho contract types
          setJobTypes(jobs.length > 0 ? jobs : fallbackJobTypes);
          setContractTypes(fallbackContractTypes); // Dùng fallback cho contract types
          
        } else if (response && response.data && Array.isArray(response.data)) {
          // Nếu response có wrapper { data: [...] }
          const jobs = response.data;
          setJobTypes(jobs.length > 0 ? jobs : fallbackJobTypes);
          setContractTypes(fallbackContractTypes);
          
        } else {
          // Fallback nếu format không như mong đợi
          console.warn('Unexpected API response format, using fallback data');
          setJobTypes(fallbackJobTypes);
          setContractTypes(fallbackContractTypes);
        }
        
      } catch (err) {
        console.error('Failed to fetch job types:', err);
        setError(err.message || 'Failed to load job types');
        
        // Fallback to static data
        setJobTypes(fallbackJobTypes);
        setContractTypes(fallbackContractTypes);
      } finally {
        setLoading(false);
      }
    };

    fetchJobTypes();
  }, []);

  const refetchJobTypes = async () => {
    // Gọi lại fetchJobTypes
    setLoading(true);
    try {
      const response = await jobTypeService.getAllJobTypes();
      
      if (response && Array.isArray(response)) {
        const jobs = response.filter(type => {
          const nameOrDesc = (type.name + ' ' + type.description).toLowerCase();
          return nameOrDesc.includes('full-time') || 
                 nameOrDesc.includes('part-time') || 
                 nameOrDesc.includes('contract') || 
                 nameOrDesc.includes('internship') || 
                 nameOrDesc.includes('freelance');
        });
        
        setJobTypes(jobs.length > 0 ? jobs : fallbackJobTypes);
        setContractTypes(fallbackContractTypes);
      }
    } catch (err) {
      setError(err.message || 'Failed to load job types');
      setJobTypes(fallbackJobTypes);
      setContractTypes(fallbackContractTypes);
    } finally {
      setLoading(false);
    }
  };

  return {
    jobTypes,
    contractTypes,
    loading,
    error,
    refetchJobTypes
  };
};