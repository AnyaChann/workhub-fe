import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ROUTES from './routeConstants';

// Import pages
import Home from '../pages/Employer/Home/Home';
import Pricing from '../pages/Employer/Pricing/Pricing';
import DashboardLayout from '../pages/Employer/Dashboard/DashboardLayout';
import Login from '../pages/Auth/Login/Login';
import Register from '../pages/Auth/Register/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword/ForgotPassword';
import NotFound from '../pages/NotFound/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path={ROUTES.PRICING} element={<Pricing />} />
      
      {/* Auth routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      
      {/* Protected routes (Dashboard) */}
      <Route path={ROUTES.DASHBOARD} element={<DashboardLayout />} />
      
      {/* Future job routes */}
      {/* <Route path={ROUTES.CREATE_JOB} element={<CreateJob />} /> */}
      {/* <Route path={ROUTES.EDIT_JOB} element={<EditJob />} /> */}
      {/* <Route path={ROUTES.VIEW_JOB} element={<ViewJob />} /> */}
      
      {/* Future brand routes */}
      {/* <Route path={ROUTES.CREATE_BRAND} element={<CreateBrand />} /> */}
      {/* <Route path={ROUTES.EDIT_BRAND} element={<EditBrand />} /> */}
      {/* <Route path={ROUTES.VIEW_BRAND} element={<ViewBrand />} /> */}
      
      {/* Future static pages */}
      {/* <Route path={ROUTES.TERMS} element={<Terms />} /> */}
      {/* <Route path={ROUTES.PRIVACY} element={<Privacy />} /> */}
      {/* <Route path={ROUTES.CONTACT} element={<Contact />} /> */}
      {/* <Route path={ROUTES.ABOUT} element={<About />} /> */}
      
      {/* 404 route - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;