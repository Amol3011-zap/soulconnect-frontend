import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

// Lazy load components
const UserProfilePage = lazy(() => import('../pages/UserProfilePage'));
const GuidedJourneysPage = lazy(() => import('../pages/GuidedJourneysPage'));
const SupportCirclesPage = lazy(() => import('../pages/SupportCirclesPage'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

// Protected route wrapper
function ProtectedRoute({ children, requiredRole }) {
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

export const phase5Routes = [
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <UserProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/journeys',
    element: <GuidedJourneysPage />,
  },
  {
    path: '/journeys/:id',
    element: (
      <ProtectedRoute>
        <GuidedJourneysPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/circles',
    element: <SupportCirclesPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
];
