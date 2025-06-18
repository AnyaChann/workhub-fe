import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/contexts/AuthContext';
import ROUTES from '../../../core/routing/routeConstants';
import './DashboardLayout.css';

// Admin Components (placeholders for now)
import TempDashboard from '../../../shared/components/TempDashboard/TempDashboard';
import SupportButton from '../../../shared/components/SupportButton/SupportButton';

const AdminDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, userRole } = useAuth();

  // Debug current path
  useEffect(() => {
    console.log('📍 AdminDashboardLayout - Current path:', location.pathname);
    console.log('👤 User role:', userRole);
  }, [location.pathname, userRole]);

  // Security check - only admins can access
  useEffect(() => {
    if (!isAdmin()) {
      console.warn('❌ Non-admin trying to access admin dashboard');
      navigate('/forbidden', { replace: true });
    }
  }, [isAdmin, navigate]);

  if (!user) {
    return null; // ProtectedRoute should handle this
  }

  const adminFeatures = [
    '👥 User Management (Candidates, Recruiters)',
    '🏢 Company Management & Verification',
    '💼 Job Posting Oversight & Moderation', 
    '📊 System Analytics & Reports',
    '📦 Package & Billing Management',
    '⚙️ System Settings & Configuration',
    '🛡️ Security & Audit Logs',
    '🔧 System Maintenance Tools',
    '📧 Email & Communication Management',
    '🚨 Issue & Report Handling'
  ];

  return (
    <div className="dashboard">
      {/* Temporary admin dashboard */}
      <TempDashboard 
        userType="Admin" 
        title="Admin Dashboard"
        features={adminFeatures}
        showUserInfo={true}
        showLogout={true}
      />
      
      <SupportButton />
      
      {/* Future admin routes */}
      <div style={{ display: 'none' }}>
        <Routes>
          <Route 
            index
            element={<Navigate to="users/candidates" replace />} 
          />
          
          {/* User Management */}
          <Route path="users/candidates" element={<div>Candidates Management</div>} />
          <Route path="users/recruiters" element={<div>Recruiters Management</div>} />
          <Route path="users/admins" element={<div>Admins Management</div>} />
          <Route path="users/pending" element={<div>Pending Users</div>} />
          <Route path="users/suspended" element={<div>Suspended Users</div>} />
          <Route path="users/banned" element={<div>Banned Users</div>} />
          
          {/* Job Management */}
          <Route path="jobs/active" element={<div>Active Jobs</div>} />
          <Route path="jobs/pending" element={<div>Pending Jobs</div>} />
          <Route path="jobs/reported" element={<div>Reported Jobs</div>} />
          <Route path="jobs/expired" element={<div>Expired Jobs</div>} />
          
          {/* Company Management */}
          <Route path="companies/verified" element={<div>Verified Companies</div>} />
          <Route path="companies/pending" element={<div>Pending Companies</div>} />
          <Route path="companies/suspended" element={<div>Suspended Companies</div>} />
          
          {/* Reports & Analytics */}
          <Route path="reports/analytics" element={<div>System Analytics</div>} />
          <Route path="reports/system" element={<div>System Reports</div>} />
          <Route path="reports/security" element={<div>Security Reports</div>} />
          
          {/* Settings */}
          <Route path="settings/system" element={<div>System Settings</div>} />
          <Route path="settings/permissions" element={<div>Permissions</div>} />
          <Route path="settings/maintenance" element={<div>Maintenance</div>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="users/candidates" replace />} />
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

export default AdminDashboardLayout;