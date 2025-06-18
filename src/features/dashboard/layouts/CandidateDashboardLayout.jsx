import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/contexts/AuthContext';
import ROUTES from '../../../core/routing/routeConstants';
import './DashboardLayout.css';

// Candidate Components (placeholders for now)
import TempDashboard from '../../../shared/components/TempDashboard/TempDashboard';
import SupportButton from '../../../shared/components/SupportButton/SupportButton';

const CandidateDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isCandidate, userRole } = useAuth();

  // Debug current path
  useEffect(() => {
    console.log('📍 CandidateDashboardLayout - Current path:', location.pathname);
    console.log('👤 User role:', userRole);
  }, [location.pathname, userRole]);

  // Security check - only candidates can access
  useEffect(() => {
    if (!isCandidate()) {
      console.warn('❌ Non-candidate trying to access candidate dashboard');
      navigate('/unauthorized', { replace: true });
    }
  }, [isCandidate, navigate]);

  if (!user) {
    return null; // ProtectedRoute should handle this
  }

  const candidateFeatures = [
    '🎯 Personalized Job Recommendations',
    '📄 Resume Builder & Management', 
    '📋 Application Tracking',
    '⭐ Saved Jobs & Favorites',
    '👤 Profile Management',
    '💬 Employer Communications',
    '📊 Application Analytics',
    '🔔 Job Alert Notifications'
  ];

  return (
    <div className="dashboard">
      {/* Temporary candidate dashboard */}
      <TempDashboard 
        userType="Candidate" 
        title="Candidate Dashboard"
        features={candidateFeatures}
        showUserInfo={true}
        showLogout={true}
      />
      
      <SupportButton />
      
      {/* Future candidate routes */}
      <div style={{ display: 'none' }}>
        <Routes>
          <Route 
            index
            element={<Navigate to="jobs/search" replace />} 
          />
          
          {/* Job Search & Management */}
          <Route path="jobs/search" element={<div>Job Search</div>} />
          <Route path="jobs/saved" element={<div>Saved Jobs</div>} />
          <Route path="jobs/applied" element={<div>Applied Jobs</div>} />
          <Route path="jobs/recommended" element={<div>Recommended Jobs</div>} />
          
          {/* Applications */}
          <Route path="applications/pending" element={<div>Pending Applications</div>} />
          <Route path="applications/interviews" element={<div>Interviews</div>} />
          <Route path="applications/offers" element={<div>Job Offers</div>} />
          
          {/* Profile */}
          <Route path="profile/edit" element={<div>Edit Profile</div>} />
          <Route path="profile/resume" element={<div>Resume Management</div>} />
          <Route path="profile/skills" element={<div>Skills</div>} />
          
          {/* Account */}
          <Route path="account/settings" element={<div>Account Settings</div>} />
          <Route path="account/privacy" element={<div>Privacy Settings</div>} />
          <Route path="account/notifications" element={<div>Notification Settings</div>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="jobs/search" replace />} />
        </Routes>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          Path: {location.pathname} | Role: {userRole} | Status: Under Development
        </div>
      )}
    </div>
  );
};

export default CandidateDashboardLayout;