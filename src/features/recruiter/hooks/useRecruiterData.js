import { useState, useEffect } from 'react';
import { recruiterService } from '../services/recruiterService';

export const useRecruiterData = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadJobs = async (status = 'active', filters = {}) => {
    setLoading(true);
    try {
      const data = await recruiterService.getJobs(status, filters);
      setJobs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await recruiterService.getCandidates(filters);
      setCandidates(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async (dateRange = {}) => {
    setLoading(true);
    try {
      const data = await recruiterService.getAnalytics(dateRange);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    candidates,
    analytics,
    loading,
    error,
    loadJobs,
    loadCandidates,
    loadAnalytics
  };
};
