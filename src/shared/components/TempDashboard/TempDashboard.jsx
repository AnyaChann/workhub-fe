import React, { useContext } from 'react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageLoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

const TempDashboard = ({ 
  userType, 
  title = 'Dashboard', 
  features = [], 
  showUserInfo = true,
  showLogout = true 
}) => {
  const { logout, fullname, email, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <PageLoadingSpinner message={`Loading ${title}...`} />;
  }

  const handleLogout = async () => {
    try {
      console.log(`ðŸšª Logging out ${userType}...`);
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  };

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  const defaultFeatures = {
    Candidate: [
      'ðŸŽ¯ Personalized Job Recommendations',
      'ðŸ“„ Resume Builder & Management', 
      'ðŸ“‹ Application Tracking',
      'â­ Saved Jobs & Favorites',
      'ðŸ‘¤ Profile Management',
      'ðŸ’¬ Employer Communications'
    ],
    Admin: [
      'ðŸ‘¥ User Management',
      'ðŸ¢ Company Management',
      'ðŸ’¼ Job Oversight', 
      'ðŸ“Š System Analytics',
      'ðŸ“¦ Package Management',
      'âš™ï¸ System Settings'
    ]
  };

  const featureList = features.length > 0 ? features : defaultFeatures[userType] || [];

  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center', 
      background: '#f8f9fa',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* User Info & Logout */}
      {showUserInfo && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '200px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>ðŸ‘¤</span>
            <span style={{ fontWeight: '600' }}>{fullname || email}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
            {userRole?.toUpperCase()}
          </div>
          {showLogout && (
            <button
              onClick={handleLogout}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                justifyContent: 'center'
              }}
            >
              ðŸšª Logout
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <h1 style={{ color: '#28a745', marginBottom: '1rem' }}>
        ðŸŽ‰ Login Successful!
      </h1>
      <h2 style={{ color: '#333', marginBottom: '2rem' }}>
        Welcome to {title}
      </h2>
      
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <h3 style={{ color: '#666', marginBottom: '1rem' }}>
          Dashboard Features Coming Soon:
        </h3>
        <ul style={{
          textAlign: 'left',
          color: '#666',
          lineHeight: '1.8'
        }}>
          {featureList.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        
        {/* Status */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ color: '#495057', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            ðŸš€ Development Status
          </h4>
          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>
               <strong>Employer Dashboard:</strong> Fully functional
            </p>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              ðŸš§ <strong>{userType} Dashboard:</strong> Under development
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button onClick={handleBackToHome} style={{
          padding: '0.75rem 2rem',
          background: '#007bff',
          color: 'white',
          border: 'none', 
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ðŸ  Back to Home
        </button>

        {showLogout && (
          <button onClick={handleLogout} style={{
            padding: '0.75rem 2rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px', 
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ðŸšª Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default TempDashboard;
