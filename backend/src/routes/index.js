import express from 'express';
import { authenticate, authorize } from '../middleware/index.js';
import * as controllers from '../controllers/index.js';

const router = express.Router();

// Public routes - no auth required

// Categories
router.get('/categories', controllers.categories.getAll);
router.get('/categories/:id', controllers.categories.getById);
router.get('/categories/slug/:slug', controllers.categories.getBySlug);

// Published guides
router.get('/guides', controllers.guides.getPublished);
router.get('/guides/:id', controllers.guides.getById);
router.get('/guides/slug/:slug', controllers.guides.getBySlug);

// Search
router.get('/search', controllers.search.search);

// Analytics - public (logs events)
router.post('/analytics/events', controllers.analytics.logEvent);

// SEO
router.get('/seo/meta/:guide_id', controllers.seo.getMeta);
router.get('/seo/structured-data/:guide_id', controllers.seo.getStructuredData);
router.get('/seo/sitemap', controllers.seo.getSitemap);
router.get('/seo/robots', controllers.seo.getRobots);

// Protected routes - auth required

// Admin: Guides management
router.post('/guides', authenticate, authorize('admin', 'reviewer'), controllers.guides.create);
router.put('/guides/:id', authenticate, authorize('admin', 'reviewer'), controllers.guides.update);
router.post('/guides/:id/publish', authenticate, authorize('admin', 'reviewer'), controllers.guides.publish);
router.post('/guides/:id/submit-review', authenticate, controllers.guides.submitForReview);
router.delete('/guides/:id', authenticate, authorize('admin'), controllers.guides.delete);

// Medical Reviews
router.get('/medical-reviews/pending', authenticate, authorize('reviewer', 'admin'), controllers.medicalReviews.getPending);
router.get('/medical-reviews/:id', authenticate, authorize('reviewer', 'admin'), controllers.medicalReviews.getById);
router.post('/medical-reviews/:id/approve', authenticate, authorize('reviewer', 'admin'), controllers.medicalReviews.approve);
router.post('/medical-reviews/:id/reject', authenticate, authorize('reviewer', 'admin'), controllers.medicalReviews.reject);
router.post('/medical-reviews/:id/request-revisions', authenticate, authorize('reviewer', 'admin'), controllers.medicalReviews.requestRevisions);

// Assessments
router.post('/assessments', controllers.assessments.create);
router.get('/assessments/:guide_id', controllers.assessments.getByGuideId);
router.get('/assessments/:guide_id/stats', controllers.assessments.getStats);

// CMS Dashboard
router.get('/cms/dashboard', authenticate, authorize('admin', 'reviewer'), controllers.cms.getDashboard);
router.get('/cms/drafts', authenticate, authorize('admin', 'reviewer'), controllers.cms.getDrafts);
router.post('/cms/drafts', authenticate, authorize('admin', 'reviewer'), controllers.cms.saveDraft);

// User profile
router.get('/users/me', authenticate, controllers.users.getProfile);
router.put('/users/me', authenticate, controllers.users.updateProfile);

// Admin routes
router.get('/admin/stats', authenticate, authorize('admin'), controllers.admin.getStats);
router.get('/admin/audit-log', authenticate, authorize('admin'), controllers.admin.getAuditLog);
router.post('/admin/seo/regenerate-sitemap', authenticate, authorize('admin'), controllers.admin.regenerateSitemap);

export default router;
