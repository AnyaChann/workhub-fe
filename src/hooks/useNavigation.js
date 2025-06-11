// src/hooks/useNavigation.js
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ROUTES from '../routes/routeConstants';

export const useNavigation = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const goToDashboard = () => {
    switch (userRole) {
      case 'employer':
        navigate(ROUTES.EMPLOYER.DASHBOARD);
        break;
      case 'candidate':
        navigate(ROUTES.CANDIDATE.DASHBOARD);
        break;
      case 'admin':
        navigate(ROUTES.ADMIN.DASHBOARD);
        break;
      default:
        navigate(ROUTES.HOME);
    }
  };

  const goToProfile = () => {
    switch (userRole) {
      case 'employer':
        navigate(ROUTES.EMPLOYER.SETTINGS);
        break;
      case 'candidate':
        navigate(ROUTES.CANDIDATE.PROFILE);
        break;
      case 'admin':
        navigate(ROUTES.ADMIN.SETTINGS);
        break;
      default:
        navigate(ROUTES.HOME);
    }
  };

  return {
    goToDashboard,
    goToProfile,
    navigate
  };
};