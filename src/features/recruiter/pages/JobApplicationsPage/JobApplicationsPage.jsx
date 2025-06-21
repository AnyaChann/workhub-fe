import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import SearchSection from '../../components/common/SearchSection/SearchSection';
import ApplicationCard from '../../components/applications/ApplicationCard/ApplicationCard';
import { PageLoadingSpinner } from '../../../../shared/components/LoadingSpinner/LoadingSpinner';
import './JobApplicationsPage.css';

const JobApplicationsPage = () => {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const jobTitle = searchParams.get('jobTitle') || 'Unknown Job';
  
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('appliedAt');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    if (jobId) {
      loadJobApplications();
    }
  }, [jobId]);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchQuery, sortBy, filterBy]);


const loadJobApplications = async () => {
  try {
    setLoading(true);
    setError(null);
    
    console.log('📋 Loading applications for job:', jobId);
    const applicationsData = await applicationService.getJobApplications(jobId);
    
    console.log('📋 =================== API RESPONSE ANALYSIS ===================');
    console.log('📋 Raw API response:', applicationsData);
    console.log('📋 Applications count:', applicationsData.length);
    
    if (applicationsData.length > 0) {
      console.log('📋 First application detailed analysis:', applicationsData[0]);
      console.log('📋 Available fields:', Object.keys(applicationsData[0]));
      
      // ✅ Detailed field analysis
      const firstApp = applicationsData[0];
      console.log('📋 Field analysis:');
      Object.entries(firstApp).forEach(([key, value]) => {
        console.log(`📋   ${key}: ${value} (${typeof value})`);
        if (typeof value === 'object' && value !== null) {
          console.log(`📋     Nested in ${key}:`, value);
        }
      });
    }
    
    // ✅ STRICT applicationId extraction - NO GENERATION
    const normalizedApplications = applicationsData.map((app, index) => {
      console.log(`📋 =================== PROCESSING APPLICATION ${index} ===================`);
      console.log(`📋 Raw application:`, app);
      
      // ✅ Try to find real applicationId - NO FALLBACK GENERATION
      let applicationId = null;
      let applicationIdSource = null;
      
      // Priority order for applicationId detection
      const appIdCandidates = [
        { key: 'applicationId', value: app.applicationId },
        { key: 'id', value: app.id },
        { key: 'application_id', value: app.application_id },
        { key: 'appId', value: app.appId },
        { key: 'app_id', value: app.app_id },
        { key: 'application.id', value: app.application?.id },
        { key: 'userApplicationId', value: app.userApplicationId }
      ];
      
      for (const candidate of appIdCandidates) {
        if (candidate.value !== null && 
            candidate.value !== undefined && 
            candidate.value !== '' &&
            !String(candidate.value).includes('@') &&
            !String(candidate.value).includes('_') &&
            !String(candidate.value).includes('mock')) {
          
          applicationId = candidate.value;
          applicationIdSource = candidate.key;
          break;
        }
      }
      
      console.log(`📋 ApplicationId detection result:`, {
        found: !!applicationId,
        value: applicationId,
        source: applicationIdSource,
        type: typeof applicationId
      });
      
      // ✅ If no valid applicationId found, mark as incomplete
      if (!applicationId) {
        console.warn(`⚠️ No valid applicationId found for application ${index}`);
        console.warn(`⚠️ This application cannot be updated until backend provides proper applicationId`);
      }
      
      const normalized = {
        // ✅ ID cho React key - use index if no real ID
        id: app.id || `temp_${index}`,
        
        // ✅ ApplicationId - NULL if not found (don't generate fake ones)
        applicationId: applicationId,
        applicationIdSource: applicationIdSource, // For debugging
        canUpdate: !!applicationId, // Flag to indicate if this app can be updated
        
        // Job info
        jobTitle: app.jobTitle || jobTitle || 'Unknown Job',
        jobId: jobId,
        
        // User info - try different field names
        userFullname: app.userFullname || app.fullname || app.candidateName || app.name || 'Unknown Candidate',
        userEmail: app.userEmail || app.email || app.candidate_email || 'No email',
        userPhone: app.userPhone || app.phone || app.candidate_phone || null,
        userId: app.userId || app.user_id || app.candidateId || null,
        
        // Application info
        status: app.status || 'pending',
        appliedAt: app.appliedAt || app.applied_at || app.createdAt || app.created_at || new Date().toISOString(),
        
        // Resume info
        resumeFile: app.resumeFile || app.resume_file || app.files || app.attachments || [],
        resumeId: app.resumeId || app.resume_id || null,
        
        // Additional fields
        coverLetter: app.coverLetter || app.cover_letter || null,
        notes: app.notes || null,
        
        // Debug info
        _originalData: app // Keep original for debugging
      };
      
      console.log(`📋 Normalized application ${index}:`, normalized);
      console.log(`📋 Can update status: ${normalized.canUpdate}`);
      
      return normalized;
    });
    
    // ✅ Count applications that can be updated
    const updatableCount = normalizedApplications.filter(app => app.canUpdate).length;
    const nonUpdatableCount = normalizedApplications.length - updatableCount;
    
    console.log('📋 =================== FINAL SUMMARY ===================');
    console.log(`📋 Total applications: ${normalizedApplications.length}`);
    console.log(`📋 Updatable applications: ${updatableCount}`);
    console.log(`📋 Non-updatable applications: ${nonUpdatableCount}`);
    
    if (nonUpdatableCount > 0) {
      console.warn(`⚠️ ${nonUpdatableCount} applications cannot be updated due to missing applicationId`);
      console.warn(`⚠️ Backend API may need to include proper applicationId in response`);
    }
    
    setApplications(normalizedApplications);
    
  } catch (err) {
    console.error('❌ Error loading job applications:', err);
    setError(err.message || 'Failed to load applications');
    
    // ✅ NO MOCK DATA - Force proper API implementation
    console.error('❌ API failed - No mock data provided. Please fix backend API.');
    setApplications([]);
  } finally {
    setLoading(false);
  }
};

  const filterAndSortApplications = () => {
    let filtered = [...applications];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.userFullname.toLowerCase().includes(query) ||
        app.userEmail.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (filterBy !== 'all') {
      filtered = filtered.filter(app => app.status === filterBy);
    }
    
    // Sort applications
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'appliedAt':
          return new Date(b.appliedAt) - new Date(a.appliedAt);
        case 'name':
          return a.userFullname.localeCompare(b.userFullname);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    
    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      // ✅ Enhanced debugging với nhiều thông tin hơn
      const originalApplication = applications.find(app => app.applicationId === applicationId);
      
      console.log('🔄 Status update requested:', {
        applicationId,
        applicationIdType: typeof applicationId,
        newStatus,
        jobId,
        originalApplication,
        allApplicationIds: applications.map(app => ({
          id: app.id,
          applicationId: app.applicationId,
          userEmail: app.userEmail
        }))
      });
      
      // ✅ Validate applicationId
      if (!applicationId || applicationId === 'undefined' || applicationId === 'null') {
        throw new Error('Invalid applicationId: ' + applicationId);
      }
      
      // ✅ Check if this is mock data
      if (String(applicationId).startsWith('mock_')) {
        console.log('🧪 Mock data detected - simulating status update');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update mock data locally
        setApplications(prev => prev.map(app => 
          app.applicationId === applicationId 
            ? { ...app, status: newStatus }
            : app
        ));
        
        alert(`Mock: Application status updated to "${newStatus}" successfully!`);
        return;
      }
      
      console.log('🔄 Calling real API...');
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.applicationId === applicationId 
          ? { ...app, status: newStatus }
          : app
      ));
      
      console.log('✅ Status updated successfully');
      alert(`Application status updated to "${newStatus}" successfully!`);
      
    } catch (error) {
      console.error('❌ Status update failed:', error);
      
      // ✅ Detailed error message
      let errorMessage = 'Failed to update application status: ' + error.message;
      
      if (error.message.includes('403')) {
        errorMessage += '\n\nPossible causes:\n- Invalid applicationId\n- No permission to update this application\n- Application belongs to different recruiter';
      }
      
      alert(errorMessage);
    }
  };

  const handleDownloadResume = async (application) => {
    try {
      console.log('📥 Download requested for:', {
        applicationId: application.applicationId,
        resumeFile: application.resumeFile,
        resumeId: application.resumeId
      });
      
      // ✅ Mock data handling
      if (String(application.applicationId).startsWith('mock_')) {
        console.log('🧪 Mock download - would download:', application.resumeFile[0]);
        alert('Mock: File download simulated - ' + (application.resumeFile[0] || 'No file'));
        return;
      }
      
      if (application.resumeFile && application.resumeFile.length > 0) {
        const fileName = application.resumeFile[0];
        await applicationService.downloadResumeByApplication(application.applicationId, fileName);
      } else {
        alert('No resume file available for download');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download resume: ' + error.message);
    }
  };

  const handleContactCandidate = (application) => {
    console.log('📧 Contact candidate:', application.userEmail);
    
    const subject = `Regarding your application for ${application.jobTitle}`;
    const body = `Hello ${application.userFullname},%0D%0A%0D%0AThank you for your application for the ${application.jobTitle} position.%0D%0A%0D%0ABest regards`;
    
    window.location.href = `mailto:${application.userEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  if (loading) {
    return <PageLoadingSpinner message="Loading applications..." />;
  }

  const getStatusCounts = () => {
    return {
      all: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="job-applications-page">
      <PageHeader 
        title={`Applications for "${decodeURIComponent(jobTitle)}"`}
        subtitle={`${filteredApplications.length} application${filteredApplications.length !== 1 ? 's' : ''} ${applications.length !== filteredApplications.length ? `(filtered from ${applications.length})` : ''}`}
      />
      
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
            <button onClick={loadJobApplications} className="retry-btn">
              🔄 Retry
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mock-data-notice">
              📋 Using mock data for demonstration - real API failed
            </div>
          )}
        </div>
      )}

      {/* ✅ Enhanced debug information */}
      {process.env.NODE_ENV === 'development' && applications.length > 0 && (
        <div className="debug-info" style={{
          background: '#f3f4f6 !important',
          padding: '12px',
          borderRadius: '4px',
          margin: '16px 0',
          fontSize: '0.875rem',
          fontFamily: 'monospace'
        }}>
          <strong>🔍 Debug Info:</strong><br />
          <strong>Job ID:</strong> {jobId}<br />
          <strong>Job Title:</strong> {decodeURIComponent(jobTitle)}<br />
          <strong>Applications Count:</strong> {applications.length}<br />
          <strong>Data Source:</strong> {applications[0]?.applicationId?.startsWith('mock_') ? 'Mock Data' : 'Real API'}<br />
          <details style={{ marginTop: '8px' }}>
            <summary><strong>Sample Application Data:</strong></summary>
            <pre style={{ 
              background: '#ffffff', 
              padding: '8px', 
              borderRadius: '4px', 
              fontSize: '0.75rem',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(applications[0], null, 2)}
            </pre>
          </details>
          <details style={{ marginTop: '8px' }}>
            <summary><strong>All Application IDs:</strong></summary>
            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
              {applications.map((app, index) => (
                <li key={index}>
                  <strong>#{index + 1}:</strong> ID={app.id}, AppID={app.applicationId}, User={app.userEmail}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}

      <SearchSection 
        placeholder="Search applications by candidate name, email, or status..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { value: 'appliedAt', label: 'Recently Applied' },
          { value: 'name', label: 'Candidate Name (A-Z)' },
          { value: 'status', label: 'Status' }
        ]}
      />
      
      {/* Status filter tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filterBy === 'all' ? 'active' : ''}`}
          onClick={() => setFilterBy('all')}
        >
          All ({statusCounts.all})
        </button>
        <button 
          className={`filter-tab ${filterBy === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterBy('pending')}
        >
          Pending ({statusCounts.pending})
        </button>
        <button 
          className={`filter-tab ${filterBy === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilterBy('accepted')}
        >
          Accepted ({statusCounts.accepted})
        </button>
        <button 
          className={`filter-tab ${filterBy === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilterBy('rejected')}
        >
          Rejected ({statusCounts.rejected})
        </button>
      </div>

      {/* Applications list */}
      <div className="applications-container">
        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No applications found</h3>
            <p>
              {searchQuery 
                ? `No applications match "${searchQuery}". Try adjusting your search.`
                : applications.length === 0
                ? 'No applications have been submitted for this job yet.'
                : 'No applications match the selected filter.'
              }
            </p>
          </div>
        ) : (
          <div className="applications-grid">
            {filteredApplications.map(application => (
              <ApplicationCard
                key={application.id}
                application={application}
                onStatusUpdate={handleStatusUpdate}
                onDownload={() => handleDownloadResume(application)}
                onContact={() => handleContactCandidate(application)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsPage;