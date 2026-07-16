import { query, queryOne, queryCount } from '../db/connection.js';

// Categories
export const Categories = {
  async getAll() {
    return query(
      'SELECT * FROM emotion_categories WHERE is_active = true ORDER BY display_order'
    );
  },

  async getById(id) {
    return queryOne(
      'SELECT * FROM emotion_categories WHERE id = $1',
      [id]
    );
  },

  async getBySlug(slug) {
    return queryOne(
      'SELECT * FROM emotion_categories WHERE slug = $1 AND is_active = true',
      [slug]
    );
  },

  async create(data) {
    return queryOne(
      `INSERT INTO emotion_categories (name, slug, description, icon_name, color_hex, difficulty_level, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.name, data.slug, data.description, data.icon_name, data.color_hex, data.difficulty_level, data.display_order]
    );
  },
};

// Guides
export const Guides = {
  async getAll(filters = {}) {
    let sql = 'SELECT * FROM v_published_guides WHERE 1=1';
    const params = [];

    if (filters.category_id) {
      sql += ` AND category_id = $${params.length + 1}`;
      params.push(filters.category_id);
    }

    if (filters.search) {
      sql += ` AND (title ILIKE $${params.length + 1} OR excerpt ILIKE $${params.length + 1})`;
      params.push(`%${filters.search}%`);
    }

    sql += ' ORDER BY published_at DESC LIMIT $' + (params.length + 1);
    params.push(filters.limit || 50);

    return query(sql, params);
  },

  async getById(id) {
    return queryOne(
      'SELECT * FROM guides WHERE id = $1',
      [id]
    );
  },

  async getBySlug(slug) {
    return queryOne(
      'SELECT g.*, ec.name as category_name FROM guides g JOIN emotion_categories ec ON g.category_id = ec.id WHERE g.slug = $1 AND g.status = $2',
      [slug, 'published']
    );
  },

  async create(data) {
    return queryOne(
      `INSERT INTO guides (category_id, title, slug, excerpt, meta_description, meta_keywords, seo_title, featured_image_url, author_id, content_json, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [data.category_id, data.title, data.slug, data.excerpt, data.meta_description, data.meta_keywords, data.seo_title, data.featured_image_url, data.author_id, data.content_json, 'draft']
    );
  },

  async update(id, data) {
    const setClauses = [];
    const params = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id') {
        setClauses.push(`${key} = $${paramCount}`);
        params.push(value);
        paramCount++;
      }
    }

    params.push(id);
    return queryOne(
      `UPDATE guides SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
      params
    );
  },

  async publish(id, reviewer_id) {
    return queryOne(
      `UPDATE guides SET status = $1, published_at = NOW(), reviewer_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      ['published', reviewer_id, id]
    );
  },

  async submitForReview(id) {
    return queryOne(
      `UPDATE guides SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      ['in_review', id]
    );
  },

  async incrementViewCount(id) {
    return query(
      `UPDATE guides SET view_count = view_count + 1 WHERE id = $1`,
      [id]
    );
  },
};

// Medical Reviews
export const MedicalReviews = {
  async getPending() {
    return query(
      `SELECT mr.*, g.title as guide_title, u.display_name as reviewer_name
       FROM medical_reviews mr
       JOIN guides g ON mr.guide_id = g.id
       LEFT JOIN users u ON mr.reviewer_id = u.id
       WHERE mr.status = $1
       ORDER BY mr.created_at DESC`,
      ['pending']
    );
  },

  async getByGuideId(guide_id) {
    return queryOne(
      'SELECT * FROM medical_reviews WHERE guide_id = $1 ORDER BY created_at DESC LIMIT 1',
      [guide_id]
    );
  },

  async create(guide_id, reviewer_id) {
    return queryOne(
      `INSERT INTO medical_reviews (guide_id, reviewer_id, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [guide_id, reviewer_id, 'pending']
    );
  },

  async approve(id, reviewer_id) {
    return queryOne(
      `UPDATE medical_reviews SET status = $1, approved_at = NOW(), reviewer_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      ['approved', reviewer_id, id]
    );
  },

  async reject(id, comments, reviewer_id) {
    return queryOne(
      `UPDATE medical_reviews SET status = $1, rejected_at = NOW(), comments = $2, reviewer_id = $3, updated_at = NOW() WHERE id = $4 RETURNING *`,
      ['rejected', comments, reviewer_id, id]
    );
  },

  async requestRevisions(id, comments, reviewer_id) {
    return queryOne(
      `UPDATE medical_reviews SET status = $1, revisions_requested_at = NOW(), comments = $2, reviewer_id = $3, updated_at = NOW() WHERE id = $4 RETURNING *`,
      ['revisions_requested', comments, reviewer_id, id]
    );
  },
};

// Assessments
export const Assessments = {
  async create(data) {
    return queryOne(
      `INSERT INTO assessments (guide_id, user_id, session_id, responses_json, score_overall, score_details_json, interpretation, recommendations_json)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [data.guide_id, data.user_id, data.session_id, data.responses_json, data.score_overall, data.score_details_json, data.interpretation, data.recommendations_json]
    );
  },

  async getByGuideId(guide_id, limit = 100) {
    return query(
      'SELECT * FROM assessments WHERE guide_id = $1 ORDER BY created_at DESC LIMIT $2',
      [guide_id, limit]
    );
  },

  async getStats(guide_id) {
    return query(
      `SELECT
        COUNT(*) as total,
        AVG(score_overall) as avg_score,
        MIN(score_overall) as min_score,
        MAX(score_overall) as max_score
       FROM assessments
       WHERE guide_id = $1`,
      [guide_id]
    );
  },
};

// Analytics
export const Analytics = {
  async logEvent(data) {
    return queryOne(
      `INSERT INTO analytics_events (event_type, page_url, guide_id, user_id, session_id, event_data, device_type, browser, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [data.event_type, data.page_url, data.guide_id, data.user_id, data.session_id, data.event_data, data.device_type, data.browser, data.ip_address]
    );
  },

  async getPageViewsForGuide(guide_id) {
    return queryOne(
      `SELECT COUNT(*) as views FROM analytics_events WHERE guide_id = $1 AND event_type = $2`,
      [guide_id, 'page_view']
    );
  },

  async getTrendingGuides(days = 30, limit = 10) {
    return query(
      `SELECT guide_id, COUNT(*) as views FROM analytics_events
       WHERE event_type = 'page_view'
       AND created_at > NOW() - INTERVAL '${days} days'
       GROUP BY guide_id
       ORDER BY views DESC
       LIMIT $1`,
      [limit]
    );
  },
};

// SEO Metadata
export const SEOMetadata = {
  async getForGuide(guide_id) {
    return queryOne(
      'SELECT * FROM seo_metadata WHERE guide_id = $1',
      [guide_id]
    );
  },

  async create(data) {
    return queryOne(
      `INSERT INTO seo_metadata (guide_id, title, description, keywords, canonical_url, og_title, og_description, og_image_url, twitter_card, schema_org_json, last_generated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       ON CONFLICT (guide_id) DO UPDATE SET
       title = EXCLUDED.title,
       description = EXCLUDED.description,
       keywords = EXCLUDED.keywords,
       canonical_url = EXCLUDED.canonical_url,
       og_title = EXCLUDED.og_title,
       og_description = EXCLUDED.og_description,
       og_image_url = EXCLUDED.og_image_url,
       twitter_card = EXCLUDED.twitter_card,
       schema_org_json = EXCLUDED.schema_org_json,
       last_generated_at = NOW()
       RETURNING *`,
      [data.guide_id, data.title, data.description, data.keywords, data.canonical_url, data.og_title, data.og_description, data.og_image_url, data.twitter_card, data.schema_org_json]
    );
  },
};

// Users
export const Users = {
  async getById(id) {
    return queryOne(
      'SELECT id, email, role, display_name, avatar_url, created_at FROM users WHERE id = $1',
      [id]
    );
  },

  async getByEmail(email) {
    return queryOne(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
  },

  async create(data) {
    return queryOne(
      `INSERT INTO users (email, password_hash, display_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, role, display_name`,
      [data.email, data.password_hash, data.display_name, data.role || 'user']
    );
  },
};

// Internal Links
export const InternalLinks = {
  async getSuggestionsForGuide(guide_id, limit = 5) {
    return query(
      `SELECT il.*, g.title as target_title, g.slug as target_slug
       FROM internal_links il
       JOIN guides g ON il.to_guide_id = g.id
       WHERE il.from_guide_id = $1 AND g.status = 'published'
       ORDER BY il.relevance_score DESC
       LIMIT $2`,
      [guide_id, limit]
    );
  },

  async create(data) {
    return queryOne(
      `INSERT INTO internal_links (from_guide_id, to_guide_id, anchor_text, context, link_type, relevance_score)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (from_guide_id, to_guide_id) DO UPDATE SET
       anchor_text = EXCLUDED.anchor_text,
       context = EXCLUDED.context,
       relevance_score = EXCLUDED.relevance_score
       RETURNING *`,
      [data.from_guide_id, data.to_guide_id, data.anchor_text, data.context, data.link_type, data.relevance_score]
    );
  },
};
