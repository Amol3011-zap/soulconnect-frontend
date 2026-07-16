import { lazy } from 'react';

// Lazy load emotion library components
const EmotionLibraryHub = lazy(() => import('../pages/EmotionLibraryHub'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const GuideDetailPage = lazy(() => import('../pages/GuideDetailPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));

export const emotionLibraryRoutes = [
  {
    path: '/emotion-library',
    element: <EmotionLibraryHub />,
  },
  {
    path: '/emotion-library/category/:slug',
    element: <CategoryPage />,
  },
  {
    path: '/guides/:slug',
    element: <GuideDetailPage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
];
