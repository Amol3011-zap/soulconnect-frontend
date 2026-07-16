import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

// Lazy load CMS components
const CmsDashboard = lazy(() => import('../pages/CmsDashboard'));
const GuideEditor = lazy(() => import('../pages/GuideEditor'));
const MedicalReviewsPage = lazy(() => import('../pages/MedicalReviewsPage'));

// Protected route wrapper
function CmsRoute({ children, requiredRole }) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.token);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export const cmsRoutes = [
  {
    path: '/cms',
    element: (
      <CmsRoute requiredRole={['admin', 'reviewer']}>
        <CmsDashboard />
      </CmsRoute>
    ),
  },
  {
    path: '/cms/editor',
    element: (
      <CmsRoute requiredRole={['admin', 'reviewer']}>
        <GuideEditor />
      </CmsRoute>
    ),
  },
  {
    path: '/cms/editor/:id',
    element: (
      <CmsRoute requiredRole={['admin', 'reviewer']}>
        <GuideEditor />
      </CmsRoute>
    ),
  },
  {
    path: '/cms/reviews',
    element: (
      <CmsRoute requiredRole={['admin', 'reviewer']}>
        <MedicalReviewsPage />
      </CmsRoute>
    ),
  },
];
