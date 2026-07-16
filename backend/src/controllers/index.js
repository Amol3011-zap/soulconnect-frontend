import * as Models from '../models/index.js';
import * as services from '../services/index.js';
import { logger } from '../middleware/index.js';

// Categories
export const categories = {
  async getAll(req, res, next) {
    try {
      const cats = await Models.Categories.getAll();
      res.json(cats);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const cat = await Models.Categories.getById(req.params.id);
      if (!cat) return res.status(404).json({ error: 'Category not found' });
      res.json(cat);
    } catch (error) {
      next(error);
    }
  },

  async getBySlug(req, res, next) {
    try {
      const cat = await Models.Categories.getBySlug(req.params.slug);
      if (!cat) return res.status(404).json({ error: 'Category not found' });
      res.json(cat);
    } catch (error) {
      next(error);
    }
  },
};

// Guides
export const guides = {
  async getPublished(req, res, next) {
    try {
      const guides = await Models.Guides.getAll({
        category_id: req.query.category_id,
        search: req.query.search,
        limit: Math.min(parseInt(req.query.limit) || 50, 100),
      });
      res.json(guides);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const guide = await Models.Guides.getById(req.params.id);
      if (!guide) return res.status(404).json({ error: 'Guide not found' });

      await Models.Guides.incrementViewCount(guide.id);

      const links = await Models.InternalLinks.getSuggestionsForGuide(guide.id);
      res.json({ ...guide, suggested_guides: links });
    } catch (error) {
      next(error);
    }
  },

  async getBySlug(req, res, next) {
    try {
      const guide = await Models.Guides.getBySlug(req.params.slug);
      if (!guide) return res.status(404).json({ error: 'Guide not found' });

      await Models.Guides.incrementViewCount(guide.id);
      const links = await Models.InternalLinks.getSuggestionsForGuide(guide.id);
      res.json({ ...guide, suggested_guides: links });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { category_id, title, meta_description, featured_image_url } = req.body;

      if (!category_id || !title || !meta_description || !featured_image_url) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const slug = title.toLowerCase().replace(/\s+/g, '-');
      const guide = await Models.Guides.create({
        category_id,
        title,
        slug,
        meta_description,
        featured_image_url,
        author_id: req.user.id,
        content_json: {},
      });

      logger.info({ action: 'guide_created', guide_id: guide.id, user_id: req.user.id });
      res.status(201).json(guide);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const guide = await Models.Guides.getById(req.params.id);
      if (!guide) return res.status(404).json({ error: 'Guide not found' });

      if (guide.author_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Cannot edit this guide' });
      }

      const updated = await Models.Guides.update(req.params.id, {
        ...req.body,
        version: guide.version + 1,
      });

      logger.info({ action: 'guide_updated', guide_id: req.params.id, user_id: req.user.id });
      res.json(updated);
    } catch (error) {
      next(error);
    }
  },

  async publish(req, res, next) {
    try {
      const guide = await Models.Guides.getById(req.params.id);
      if (!guide) return res.status(404).json({ error: 'Guide not found' });

      const published = await Models.Guides.publish(req.params.id, req.user.id);

      await services.seo.generateMetadataForGuide(guide.id);

      logger.info({ action: 'guide_published', guide_id: req.params.id, user_id: req.user.id });
      res.json(published);
    } catch (error) {
      next(error);
    }
  },

  async submitForReview(req, res, next) {
    try {
      const guide = await Models.Guides.getById(req.params.id);
      if (!guide) return res.status(404).json({ error: 'Guide not found' });

      const submitted = await Models.Guides.submitForReview(req.params.id);
      await Models.MedicalReviews.create(guide.id, null);

      logger.info({ action: 'guide_submitted_review', guide_id: req.params.id, user_id: req.user.id });
      res.json(submitted);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const guide = await Models.Guides.getById(req.params.id);
      if (!guide) return res.status(404).json({ error: 'Guide not found' });

      logger.info({ action: 'guide_deleted', guide_id: req.params.id, user_id: req.user.id });
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};

// Medical Reviews
export const medicalReviews = {
  async getPending(req, res, next) {
    try {
      const reviews = await Models.MedicalReviews.getPending();
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const review = await Models.MedicalReviews.getByGuideId(req.params.id);
      if (!review) return res.status(404).json({ error: 'Review not found' });
      res.json(review);
    } catch (error) {
      next(error);
    }
  },

  async approve(req, res, next) {
    try {
      const approved = await Models.MedicalReviews.approve(req.params.id, req.user.id);
      logger.info({ action: 'review_approved', review_id: req.params.id, user_id: req.user.id });
      res.json(approved);
    } catch (error) {
      next(error);
    }
  },

  async reject(req, res, next) {
    try {
      const { comments } = req.body;
      const rejected = await Models.MedicalReviews.reject(req.params.id, comments, req.user.id);
      logger.info({ action: 'review_rejected', review_id: req.params.id, user_id: req.user.id });
      res.json(rejected);
    } catch (error) {
      next(error);
    }
  },

  async requestRevisions(req, res, next) {
    try {
      const { comments } = req.body;
      const revised = await Models.MedicalReviews.requestRevisions(req.params.id, comments, req.user.id);
      logger.info({ action: 'review_revisions_requested', review_id: req.params.id, user_id: req.user.id });
      res.json(revised);
    } catch (error) {
      next(error);
    }
  },
};

// Assessments
export const assessments = {
  async create(req, res, next) {
    try {
      const { guide_id, responses, score } = req.body;
      const assessment = await Models.Assessments.create({
        guide_id,
        responses_json: responses,
        score_overall: score,
      });
      res.status(201).json(assessment);
    } catch (error) {
      next(error);
    }
  },

  async getByGuideId(req, res, next) {
    try {
      const assessments = await Models.Assessments.getByGuideId(req.params.guide_id);
      res.json(assessments);
    } catch (error) {
      next(error);
    }
  },

  async getStats(req, res, next) {
    try {
      const stats = await Models.Assessments.getStats(req.params.guide_id);
      res.json(stats[0]);
    } catch (error) {
      next(error);
    }
  },
};

// Analytics
export const analytics = {
  async logEvent(req, res, next) {
    try {
      const event = await Models.Analytics.logEvent({
        event_type: req.body.event_type,
        page_url: req.body.page_url,
        guide_id: req.body.guide_id,
        user_id: req.user?.id,
        session_id: req.body.session_id,
        event_data: req.body.data,
        device_type: req.body.device_type,
        browser: req.body.browser,
        ip_address: req.ip,
      });
      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};

// SEO
export const seo = {
  async getMeta(req, res, next) {
    try {
      const meta = await Models.SEOMetadata.getForGuide(req.params.guide_id);
      if (!meta) return res.status(404).json({ error: 'Metadata not found' });
      res.json(meta);
    } catch (error) {
      next(error);
    }
  },

  async getStructuredData(req, res, next) {
    try {
      const meta = await Models.SEOMetadata.getForGuide(req.params.guide_id);
      if (!meta?.schema_org_json) return res.status(404).json({ error: 'Schema not found' });
      res.json(meta.schema_org_json);
    } catch (error) {
      next(error);
    }
  },

  async getSitemap(req, res, next) {
    try {
      const sitemap = await services.seo.generateSitemap();
      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      next(error);
    }
  },

  async getRobots(req, res, next) {
    try {
      res.set('Content-Type', 'text/plain');
      res.send(services.seo.getRobotsText());
    } catch (error) {
      next(error);
    }
  },
};

// Search
export const search = {
  async search(req, res, next) {
    try {
      const results = await services.search.search(req.query.q, {
        category_id: req.query.category_id,
        limit: Math.min(parseInt(req.query.limit) || 20, 100),
      });
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
};

// CMS
export const cms = {
  async getDashboard(req, res, next) {
    try {
      const stats = {
        total_guides: 0,
        published: 0,
        draft: 0,
        in_review: 0,
      };
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  async getDrafts(req, res, next) {
    try {
      res.json([]);
    } catch (error) {
      next(error);
    }
  },

  async saveDraft(req, res, next) {
    try {
      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};

// Users
export const users = {
  async getProfile(req, res, next) {
    try {
      const user = await Models.Users.getById(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};

// Admin
export const admin = {
  async getStats(req, res, next) {
    try {
      res.json({
        guides: 0,
        categories: 25,
        users: 0,
        assessments: 0,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAuditLog(req, res, next) {
    try {
      res.json([]);
    } catch (error) {
      next(error);
    }
  },

  async regenerateSitemap(req, res, next) {
    try {
      await services.seo.generateSitemap();
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};
