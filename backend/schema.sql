-- SoulConnect Emotion Library Database Schema
-- PostgreSQL 14+

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  display_name VARCHAR(255),
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_role ON users(role);

-- Emotion Categories
CREATE TABLE IF NOT EXISTS emotion_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  color_hex VARCHAR(7),
  difficulty_level VARCHAR(50) DEFAULT 'beginner',
  parent_category_id INTEGER REFERENCES emotion_categories(id),
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_slug ON emotion_categories(slug);
CREATE INDEX IF NOT EXISTS idx_parent_id ON emotion_categories(parent_category_id);

-- Guides (emotion library content)
CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES emotion_categories(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content_json JSONB,
  excerpt TEXT,
  meta_description VARCHAR(160),
  meta_keywords VARCHAR(500),
  seo_title VARCHAR(60),
  featured_image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  author_id INTEGER REFERENCES users(id),
  reviewer_id INTEGER REFERENCES users(id),
  published_at TIMESTAMP,
  review_comments TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_category ON guides(category_id);
CREATE INDEX IF NOT EXISTS idx_guide_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_status ON guides(status);
CREATE INDEX IF NOT EXISTS idx_published_at ON guides(published_at);

-- Medical Review Workflow
CREATE TABLE IF NOT EXISTS medical_reviews (
  id SERIAL PRIMARY KEY,
  guide_id INTEGER NOT NULL REFERENCES guides(id),
  reviewer_id INTEGER NOT NULL REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  comments TEXT,
  recommendations TEXT,
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  revisions_requested_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_review_guide_id ON medical_reviews(guide_id);
CREATE INDEX IF NOT EXISTS idx_review_status ON medical_reviews(status);

-- Search Index
CREATE TABLE IF NOT EXISTS search_index (
  id SERIAL PRIMARY KEY,
  guide_id INTEGER NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  searchable_text TEXT,
  title_weight FLOAT DEFAULT 1.0,
  content_weight FLOAT DEFAULT 0.5,
  category_name VARCHAR(100),
  tags VARCHAR(500),
  rank_score FLOAT DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_guide_id ON search_index(guide_id);

-- Assessments (user self-assessments)
CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  guide_id INTEGER NOT NULL REFERENCES guides(id),
  responses JSONB,
  score INTEGER,
  interpretation TEXT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessment_guide_id ON assessments(guide_id);
CREATE INDEX IF NOT EXISTS idx_assessment_user_id ON assessments(user_id);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  event_type VARCHAR(100),
  guide_id INTEGER REFERENCES guides(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_event_guide_id ON analytics_events(guide_id);

-- Internal Links (related guides)
CREATE TABLE IF NOT EXISTS internal_links (
  id SERIAL PRIMARY KEY,
  source_guide_id INTEGER NOT NULL REFERENCES guides(id),
  target_guide_id INTEGER NOT NULL REFERENCES guides(id),
  relevance_score FLOAT DEFAULT 0.5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_links_source ON internal_links(source_guide_id);

-- SEO Metadata
CREATE TABLE IF NOT EXISTS seo_metadata (
  id SERIAL PRIMARY KEY,
  guide_id INTEGER UNIQUE REFERENCES guides(id),
  page_type VARCHAR(50),
  og_title VARCHAR(100),
  og_description VARCHAR(160),
  og_image_url VARCHAR(500),
  twitter_card VARCHAR(50),
  canonical_url VARCHAR(500),
  structured_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Drafts
CREATE TABLE IF NOT EXISTS content_drafts (
  id SERIAL PRIMARY KEY,
  guide_id INTEGER REFERENCES guides(id),
  author_id INTEGER REFERENCES users(id),
  content_json JSONB,
  version INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Audit Log
CREATE TABLE IF NOT EXISTS api_audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255),
  resource VARCHAR(255),
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rate Limits
CREATE TABLE IF NOT EXISTS rate_limits (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(50),
  endpoint VARCHAR(255),
  request_count INTEGER DEFAULT 1,
  reset_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Views for published content
CREATE OR REPLACE VIEW v_published_guides AS
SELECT
  g.id,
  g.title,
  g.slug,
  g.excerpt,
  g.content_json,
  g.featured_image_url,
  g.status,
  g.view_count,
  g.published_at,
  ec.name as category_name,
  ec.slug as category_slug,
  ec.icon_name
FROM guides g
LEFT JOIN emotion_categories ec ON g.category_id = ec.id
WHERE g.status = 'published' AND ec.is_active = true;

-- Search results view
CREATE OR REPLACE VIEW v_search_results AS
SELECT
  si.id,
  si.guide_id,
  g.title,
  g.slug,
  g.excerpt,
  si.searchable_text,
  si.rank_score,
  ec.name as category_name
FROM search_index si
LEFT JOIN guides g ON si.guide_id = g.id
LEFT JOIN emotion_categories ec ON g.category_id = ec.id
WHERE g.status = 'published'
ORDER BY si.rank_score DESC;
