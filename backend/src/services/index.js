import * as Models from '../models/index.js';

// Search Service
export const search = {
  async search(query, options = {}) {
    if (!query || query.length < 2) {
      return [];
    }

    let sql = `
      SELECT g.*, ec.name as category_name
      FROM guides g
      JOIN emotion_categories ec ON g.category_id = ec.id
      WHERE g.status = 'published'
      AND (
        g.title ILIKE $1
        OR g.excerpt ILIKE $1
        OR g.meta_keywords ILIKE $1
      )
    `;
    const params = [`%${query}%`];

    if (options.category_id) {
      sql += ` AND g.category_id = $${params.length + 1}`;
      params.push(options.category_id);
    }

    sql += ` ORDER BY g.view_count DESC LIMIT $${params.length + 1}`;
    params.push(options.limit || 20);

    return Models.Guides.getAll({
      search: query,
      category_id: options.category_id,
      limit: options.limit || 20,
    });
  },
};

// SEO Service
export const seo = {
  async generateMetadataForGuide(guide_id) {
    const guide = await Models.Guides.getById(guide_id);
    if (!guide) return null;

    const meta = {
      guide_id,
      title: guide.seo_title || `${guide.title} | SoulConnect`,
      description: guide.meta_description || guide.excerpt,
      keywords: guide.meta_keywords || 'emotion, mental health, wellness',
      canonical_url: `https://soulconnect.health/guides/${guide.slug}`,
      og_title: guide.seo_title || guide.title,
      og_description: guide.meta_description || guide.excerpt,
      og_image_url: guide.featured_image_url,
      twitter_card: 'summary_large_image',
      schema_org_json: this.generateSchemaForGuide(guide),
    };

    return Models.SEOMetadata.create(meta);
  },

  generateSchemaForGuide(guide) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.meta_description || guide.excerpt,
      image: guide.featured_image_url,
      datePublished: guide.created_at,
      dateModified: guide.updated_at,
      publisher: {
        '@type': 'Organization',
        name: 'SoulConnect',
        logo: {
          '@type': 'ImageObject',
          url: 'https://soulconnect.health/logo.png',
        },
      },
      author: {
        '@type': 'Person',
        name: guide.author_id ? 'SoulConnect Team' : 'Anonymous',
      },
    };
  },

  async generateSitemap() {
    const guides = await Models.Guides.getAll({ limit: 1000 });
    const categories = await Models.Categories.getAll();

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Homepage
    xml += '  <url>\n';
    xml += '    <loc>https://soulconnect.health</loc>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '  </url>\n';

    // Emotion Library
    xml += '  <url>\n';
    xml += '    <loc>https://soulconnect.health/emotion-library</loc>\n';
    xml += '    <priority>0.9</priority>\n';
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '  </url>\n';

    // Categories
    for (const cat of categories) {
      xml += '  <url>\n';
      xml += `    <loc>https://soulconnect.health/emotion-library/categories/${cat.slug}</loc>\n`;
      xml += '    <priority>0.8</priority>\n';
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '  </url>\n';
    }

    // Guides
    for (const guide of guides) {
      xml += '  <url>\n';
      xml += `    <loc>https://soulconnect.health/emotion-library/guides/${guide.slug}</loc>\n`;
      xml += `    <lastmod>${guide.updated_at ? guide.updated_at.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <priority>0.7</priority>\n';
      xml += '    <changefreq>monthly</changefreq>\n';
      if (guide.featured_image_url) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${guide.featured_image_url}</image:loc>\n`;
        xml += `      <image:title>${guide.title}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += '  </url>\n';
    }

    xml += '</urlset>';
    return xml;
  },

  getRobotsText() {
    return `# Emotion Library Robots.txt

User-agent: *
Allow: /
Allow: /emotion-library
Allow: /emotion-library/categories
Allow: /emotion-library/guides
Allow: /search
Disallow: /admin
Disallow: /cms
Disallow: /api/
Disallow: /auth
Disallow: /*/draft

Crawl-delay: 1

Sitemap: https://soulconnect.health/api/seo/sitemap`;
  },

  async generateInternalLinks(guide_id) {
    const guide = await Models.Guides.getById(guide_id);
    if (!guide) return [];

    // Get all other published guides in same category
    const allGuides = await Models.Guides.getAll({
      category_id: guide.category_id,
      limit: 100,
    });

    const filtered = allGuides
      .filter(g => g.id !== guide_id)
      .slice(0, 5);

    for (const targetGuide of filtered) {
      await Models.InternalLinks.create({
        from_guide_id: guide_id,
        to_guide_id: targetGuide.id,
        anchor_text: targetGuide.title,
        context: `Related guide about ${targetGuide.title}`,
        link_type: 'related',
        relevance_score: 0.8,
      });
    }

    return filtered;
  },
};

// Assessment Service
export const assessments = {
  calculateScore(responses) {
    if (!responses || Object.keys(responses).length === 0) {
      return 0;
    }

    const values = Object.values(responses);
    const sum = values.reduce((a, b) => a + (parseInt(b) || 0), 0);
    return Math.round((sum / (values.length * 10)) * 100);
  },

  generateInterpretation(score) {
    if (score < 30) return 'Low concern - you are managing well';
    if (score < 60) return 'Moderate concern - consider the strategies in this guide';
    if (score < 80) return 'High concern - these strategies are important for you';
    return 'Very high concern - please consider professional support';
  },
};

// Analytics Service
export const analytics = {
  async getTrendingGuides(days = 30, limit = 10) {
    return Models.Analytics.getTrendingGuides(days, limit);
  },

  async getTopSearchQueries(limit = 20) {
    // TODO: Implement when search event tracking is added
    return [];
  },

  async getEngagementStats(guide_id) {
    const views = await Models.Analytics.getPageViewsForGuide(guide_id);
    const assessments = await Models.Assessments.getStats(guide_id);
    return {
      views: views.views || 0,
      total_assessments: assessments[0].total || 0,
      avg_assessment_score: assessments[0].avg_score || 0,
    };
  },
};

// Email Service (stubs for future integration)
export const email = {
  async sendReviewNotification(reviewer_email, guide_title) {
    // TODO: Implement with SendGrid
    console.log(`Email: Review notification to ${reviewer_email} for "${guide_title}"`);
  },

  async sendApprovalNotification(creator_email, guide_title) {
    // TODO: Implement with SendGrid
    console.log(`Email: Approval notification to ${creator_email} for "${guide_title}"`);
  },
};

// Content Service
export const content = {
  async generateDraftPreview(content) {
    return {
      preview: content,
      wordCount: this.calculateWordCount(content),
      readingTime: this.calculateReadingTime(content),
    };
  },

  calculateWordCount(content) {
    if (!content) return 0;
    return content.toString().split(/\s+/).length;
  },

  calculateReadingTime(content) {
    const wordCount = this.calculateWordCount(content);
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  },
};
