import { useState, useEffect, useCallback } from 'react';
import { jobCategoryService } from '../services/jobCategoryService';
import { jobPositionService } from '../services/jobPositionService';

export const useCategoriesAndPositions = () => {
  const [categories, setCategories] = useState([]);
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback data với format đúng từ API
  const fallbackCategories = [
    { id: 1, name: 'Technology', description: 'Technology jobs' },
    { id: 2, name: 'Marketing', description: 'Marketing jobs' },
    { id: 3, name: 'Sales', description: 'Sales jobs' },
    { id: 4, name: 'Finance', description: 'Finance jobs' },
    { id: 5, name: 'Human Resources', description: 'HR jobs' },
    { id: 6, name: 'Design', description: 'Design jobs' },
    { id: 7, name: 'Healthcare', description: 'Healthcare jobs' },
    { id: 8, name: 'Education', description: 'Education jobs' }
  ];

  const fallbackPositions = [
    { id: 1, name: 'Software Engineer', description: 'Software development', categoryId: 1 },
    { id: 2, name: 'Product Manager', description: 'Product management', categoryId: 1 },
    { id: 3, name: 'Designer', description: 'UI/UX Design', categoryId: 6 },
    { id: 4, name: 'Data Analyst', description: 'Data analysis', categoryId: 1 },
    { id: 5, name: 'Marketing Manager', description: 'Marketing leadership', categoryId: 2 },
    { id: 6, name: 'Sales Representative', description: 'Sales role', categoryId: 3 },
    { id: 7, name: 'Financial Analyst', description: 'Financial analysis', categoryId: 4 },
    { id: 8, name: 'HR Specialist', description: 'Human resources', categoryId: 5 }
  ];

  // Sử dụng useCallback để tránh re-creation - FIX: filter theo categoryId
  const filterPositionsByCategory = useCallback((categoryId) => {
    console.log('Filtering positions for category:', categoryId);
    console.log('Available positions:', positions);
    
    if (!categoryId || categoryId === '') {
      setFilteredPositions(positions);
      console.log('No category selected, showing all positions');
    } else {
      const filtered = positions.filter(position => {
        // API trả về categoryId chứ không phải category_id
        const positionCategoryId = position.categoryId || position.category_id;
        return positionCategoryId === parseInt(categoryId);
      });
      setFilteredPositions(filtered);
      console.log(`Filtered positions for category ${categoryId}:`, filtered);
    }
  }, [positions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories và positions parallel
        const [categoriesResponse, positionsResponse] = await Promise.all([
          jobCategoryService.getAllJobCategories(),
          jobPositionService.getAllJobPositions()
        ]);
        
        console.log('Categories API response:', categoriesResponse);
        console.log('Positions API response:', positionsResponse);
        
        // Process categories
        if (categoriesResponse && Array.isArray(categoriesResponse)) {
          setCategories(categoriesResponse);
        } else if (categoriesResponse && categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          console.warn('Unexpected categories API response format, using fallback data');
          setCategories(fallbackCategories);
        }
        
        // Process positions - API trả về {id, name, description, categoryId}
        if (positionsResponse && Array.isArray(positionsResponse)) {
          setPositions(positionsResponse);
          setFilteredPositions(positionsResponse);
        } else if (positionsResponse && positionsResponse.data && Array.isArray(positionsResponse.data)) {
          setPositions(positionsResponse.data);
          setFilteredPositions(positionsResponse.data);
        } else {
          console.warn('Unexpected positions API response format, using fallback data');
          setPositions(fallbackPositions);
          setFilteredPositions(fallbackPositions);
        }
        
      } catch (err) {
        console.error('Failed to fetch categories and positions:', err);
        setError(err.message || 'Failed to load data');
        
        // Fallback to static data
        setCategories(fallbackCategories);
        setPositions(fallbackPositions);
        setFilteredPositions(fallbackPositions);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoriesResponse, positionsResponse] = await Promise.all([
        jobCategoryService.getAllJobCategories(),
        jobPositionService.getAllJobPositions()
      ]);
      
      if (categoriesResponse && Array.isArray(categoriesResponse)) {
        setCategories(categoriesResponse);
      } else {
        setCategories(fallbackCategories);
      }
      
      if (positionsResponse && Array.isArray(positionsResponse)) {
        setPositions(positionsResponse);
        setFilteredPositions(positionsResponse);
      } else {
        setPositions(fallbackPositions);
        setFilteredPositions(fallbackPositions);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to load data');
      setCategories(fallbackCategories);
      setPositions(fallbackPositions);
      setFilteredPositions(fallbackPositions);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    positions,
    filteredPositions,
    loading,
    error,
    filterPositionsByCategory,
    refetchData
  };
};