import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
// ✅ Import applicationService thay vì resumeService
import { applicationService } from '../../../../shared/utils/helpers/applicationService';
import { resumeService } from '../../services/resumeService';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import SearchSection from '../../components/common/SearchSection/SearchSection';
import ResumeCard from '../../components/applications/ResumeCard/ResumeCard';
import ReviewModal from '../../components/applications/ReviewModal/ReviewModal';
import { PageLoadingSpinner } from '../../../../shared/components/LoadingSpinner/LoadingSpinner';
import './ApplicationsPage.css';

const ApplicationsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const jobTitle = searchParams.get('jobTitle');
  
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [filterBy, setFilterBy] = useState('all');
  
  // Review modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    loadResumes();
  }, [jobId]);

  useEffect(() => {
    filterAndSortResumes();
  }, [resumes, searchQuery, sortBy, filterBy]);

  const filterAndSortResumes = () => {
    let filtered = resumes;

    // Filter resumes based on search query
    if (searchQuery) {
      filtered = filtered.filter(resume =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resume.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter resumes based on filter criteria
    if (filterBy !== 'all') {
      filtered = filtered.filter(resume => resume.status === filterBy);
    }

    // Sort resumes based on sort criteria
    filtered = filtered.sort((a, b) => {
      if (sortBy === 'created_at') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.title.localeCompare(b.title);
    });

    setFilteredResumes(filtered);
  };

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📄 Loading resumes...');
      
      let resumesData;
      
      // ✅ Nếu có jobId, load applications cho job cụ thể
      if (jobId) {
        console.log('📋 Loading applications for specific job:', jobId);
        const applicationsData = await applicationService.getJobApplications(jobId);
        
        // Convert applications to resume format for compatibility
        resumesData = applicationsData.map((app, index) => ({
          id: app.resumeId || (index + 1000),
          user: {
            id: app.userId || (index + 1),
            fullname: app.userFullname || 'Unknown Candidate',
            email: app.userEmail || 'No email',
            phone: app.userPhone || null,
            avatar: null,
            status: 'verified',
            createdAt: app.appliedAt || new Date().toISOString()
          },
          title: `Resume for ${app.jobTitle || 'Job Application'}`,
          content: `Application submitted for: ${app.jobTitle || 'Unknown position'}`,
          file: app.resumeFile || [],
          isGenerated: false,
          createdAt: app.appliedAt || new Date().toISOString(),
          skills: [],
          // Additional application data
          applicationId: app.applicationId,
          status: app.status,
          appliedAt: app.appliedAt
        }));
      } else {
        // ✅ Load tất cả resumes (dùng resumeService)
        console.log('📄 Loading all resumes...');
        resumesData = await resumeService.getAllResumes();
      }
      
      console.log('📄 Resumes loaded:', resumesData.length);
      
      // ✅ Normalize data
      const normalizedResumes = resumesData.map(resume => ({
        id: resume.id || Math.random(),
        title: resume.title || 'Untitled Resume',
        content: resume.content || 'No description available',
        file: resume.file || [],
        isGenerated: resume.isGenerated || false,
        createdAt: resume.createdAt || new Date().toISOString(),
        skills: resume.skills || [],
        // Application-specific fields
        applicationId: resume.applicationId || null,
        status: resume.status || null,
        appliedAt: resume.appliedAt || null,
        user: {
          id: resume.user?.id || Math.random(),
          fullname: resume.user?.fullname || 'Unknown Candidate',
          email: resume.user?.email || 'No email provided',
          phone: resume.user?.phone || null,
          avatar: resume.user?.avatar || null,
          status: resume.user?.status || 'unknown',
          createdAt: resume.user?.createdAt || resume.createdAt || new Date().toISOString(),
          resumeList: resume.user?.resumeList || []
        }
      }));
      
      setResumes(normalizedResumes);
      
    } catch (err) {
      console.error('❌ Error loading resumes:', err);
      setError(err.message || 'Failed to load resumes');
      
      // Enhanced mock data for development
      if (process.env.NODE_ENV === 'development') {
        const mockResumes = [
          {
            id: 101,
            user: {
              id: 1,
              fullname: "Nguyễn Văn A",
              email: "candidate1@example.com",
              phone: "0912345678",
              avatar: null,
              status: "verified",
              createdAt: "2024-01-15T10:00:00Z",
              resumeList: []
            },
            title: jobId ? `Application for ${decodeURIComponent(jobTitle || 'Job')}` : "CV Java Developer",
            content: jobId ? `Application submitted for: ${decodeURIComponent(jobTitle || 'Job position')}` : "Kinh nghiệm: 3 năm Java Spring Boot, MySQL, RESTful API. Tham gia phát triển nhiều dự án web application quy mô lớn.",
            file: ["resume_java_dev.pdf"],
            isGenerated: false,
            createdAt: "2024-06-15T10:00:00Z",
            skills: jobId ? [] : [
              { id: 1, name: "Java", description: "Lập trình hướng đối tượng với Java." },
              { id: 2, name: "Spring Boot", description: "Framework Java cho web applications." },
              { id: 3, name: "MySQL", description: "Hệ quản trị cơ sở dữ liệu." }
            ],
            // Application-specific data if jobId exists
            ...(jobId && {
              applicationId: 101,
              status: 'pending',
              appliedAt: "2024-06-15T10:00:00Z"
            })
          }
          // ... more mock data
        ];
        setResumes(mockResumes);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cập nhật download handler để sử dụng applicationService
  const handleDownloadResume = async (resume) => {
    try {
      console.log('📥 Download resume:', resume.id);
      
      if (resume.file && resume.file.length > 0) {
        const fileName = resume.file[0];
        
        // If we have applicationId, use application-based download
        if (resume.applicationId) {
          await applicationService.downloadResumeByApplication(resume.applicationId, fileName);
        } else {
          // Otherwise use resume-based download
          await applicationService.downloadResumeById(resume.id, fileName);
        }
      } else {
        alert('No file available for download');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download resume file: ' + error.message);
    }
  };

  // ✅ Cập nhật page title và subtitle
  const getPageTitle = () => {
    if (jobId && jobTitle) {
      return `Applications for "${decodeURIComponent(jobTitle)}"`;
    }
    return "Applications & Resumes";
  };
  
  const getPageSubtitle = () => {
    if (jobId && jobTitle) {
      return `${filteredResumes.length} application${filteredResumes.length !== 1 ? 's' : ''} for this job`;
    }
    return `${filteredResumes.length} resume${filteredResumes.length !== 1 ? 's' : ''} ${resumes.length !== filteredResumes.length ? `(filtered from ${resumes.length})` : ''}`;
  };

  // ... rest of existing functions remain the same ...

  return (
    <div className="applications-page">
      <PageHeader 
        title={getPageTitle()}
        subtitle={getPageSubtitle()}
      />
      
      {/* ✅ Job filter banner */}
      {jobId && jobTitle && (
        <div className="job-filter-banner">
          <div className="filter-info">
            <span className="filter-icon">🎯</span>
            <span className="filter-text">
              Showing applications for: <strong>{decodeURIComponent(jobTitle)}</strong>
            </span>
          </div>
          <button 
            className="clear-filter-btn"
            onClick={() => window.history.replaceState({}, '', '/recruiter/dashboard/applications')}
          >
            <span>✕</span> Show All Applications
          </button>
        </div>
      )}
      
      {/* ... rest of existing JSX remains the same ... */}
    </div>
  );
};

export default ApplicationsPage;