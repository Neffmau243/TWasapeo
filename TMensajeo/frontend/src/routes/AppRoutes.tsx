import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import BusinessDetailPage from '../pages/public/BusinessDetailPage';
import NotFoundPage from '../pages/errors/NotFoundPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import AdminDashboard from '../pages/admin/AdminDashboard';
import BusinessesManagePage from '../pages/admin/BusinessesManagePage';
import PendingBusinessesPage from '../pages/admin/PendingBusinessesPage';
import UsersManagePage from '../pages/admin/UsersManagePage';
import CategoriesPage from '../pages/admin/CategoriesPage';
import ReviewsModerate from '../pages/admin/ReviewsModerate';
import StatsPage from '../pages/admin/StatsPage';
import OwnerDashboard from '../pages/owner/DashboardPage';
import MyBusinessesPage from '../pages/owner/MyBusinessesPage';
import ReviewsManagePage from '../pages/owner/ReviewsManagePage';
import CreateBusinessPage from '../pages/owner/CreateBusinessPage';
import ProfilePage from '../pages/user/ProfilePage';

const AppRoutes: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/business/:slug" element={<BusinessDetailPage />} />

        {/* User Routes - Protected */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Routes - Protected */}
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/businesses" element={<BusinessesManagePage />} />
          <Route path="/admin/businesses/pending" element={<PendingBusinessesPage />} />
          <Route path="/admin/users" element={<UsersManagePage />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
          <Route path="/admin/reviews" element={<ReviewsModerate />} />
          <Route path="/admin/stats" element={<StatsPage />} />
        </Route>

        {/* Owner Routes - Protected */}
        <Route element={<RoleRoute allowedRoles={['OWNER', 'ADMIN']} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/businesses" element={<MyBusinessesPage />} />
          <Route path="/owner/businesses/create" element={<CreateBusinessPage />} />
          <Route path="/owner/reviews" element={<ReviewsManagePage />} />
          {/* <Route path="/owner/businesses/:id/edit" element={<EditBusinessPage />} /> */}
        </Route>

        {/* Error Routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes;
