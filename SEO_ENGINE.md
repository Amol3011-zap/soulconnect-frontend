# SoulConnect Emotion Library - SEO Engine Documentation

**Version:** 1.0.0  
**Purpose:** Automated SEO optimization, structured data generation, sitemap/robots generation

---

## 1. SEO Architecture

### Components

1. **Meta Tag Generator**: Auto-generates title, description, keywords
2. **Structured Data Generator**: Creates JSON-LD schema.org markup
3. **Internal Linking Engine**: Suggests and manages internal links
4. **Sitemap Generator**: Auto-generates XML sitemap
5. **Robots.txt Generator**: Creates search engine crawl directives
6. **Canonical URL Manager**: Prevents duplicate content penalties
7. **OG Tag Generator**: Social preview optimization

### Data Flow

```
Create Guide
    ↓
SEO Engine Analyzes
    ↓
Generates:
  - Meta tags
  - Schema.org markup
  - Canonical URL
  - OG tags
  - Internal links
    ↓
Stores in seo_metadata table
    ↓
Guide published
    ↓
Sitemap regenerated
    ↓
Search engines crawl
```

---

## 2. Meta Tags Generation

### For Each Guide

**Meta Title** (60 chars max)
```
Format: [Emotion] - [Benefit] | SoulConnect
Example: "Anxiety Management - Evidence-Based Strategies | SoulConnect"
```

**Meta Description** (160 chars max)
```
Format: [Hook] [Benefit] [CTA]
Example: "Learn 7 evidence-based strategies to manage anxiety. Self-assessment, expert tips, and personalized recommendations for emotional wellness."
```

**Keywords** (5-10 total)
```
Primary: anxiety management
Secondary: anxiety relief, anxiety symptoms, anxiety treatment
Long-tail: how to manage anxiety, anxiety self-help, overcome anxiety
```

**Open Graph Tags**
```
og:title: [Meta Title]
og:description: [Meta Description]
og:image: [Featured Image URL]
og:type: article
og:url: [Canonical URL]
```

**Twitter Card Tags**
```
twitter:card: summary_large_image
twitter:title: [Meta Title]
twitter:description: [Meta Description]
twitter:image: [Featured Image URL]
```

---

## 3. Structured Data (Schema.org)

### Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Anxiety - Evidence-Based Management Strategies",
  "description": "Learn 7 evidence-based strategies to manage anxiety...",
  "image": ["https://example.com/anxiety-guide.jpg"],
  "datePublished": "2024-01-15T08:00:00Z",
  "dateModified": "2024-02-20T10:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Dr. Sarah Johnson",
    "url": "https://soulconnect.health/author/sarah-johnson"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SoulConnect",
    "logo": {
      "@type": "ImageObject",
      "url": "https://soulconnect.health/logo.png"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": 127
  }
}
```

### FAQPage Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is anxiety?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Anxiety is a natural emotion characterized by..."
      }
    },
    {
      "@type": "Question",
      "name": "How do I manage anxiety?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Evidence-based strategies include..."
      }
    }
  ]
}
```

### BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://soulconnect.health"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Emotion Library",
      "item": "https://soulconnect.health/emotion-library"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Mental Health",
      "item": "https://soulconnect.health/emotion-library/mental-health"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Anxiety",
      "item": "https://soulconnect.health/emotion-library/guides/anxiety"
    }
  ]
}
```

### Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SoulConnect",
  "url": "https://soulconnect.health",
  "logo": "https://soulconnect.health/logo.png",
  "description": "Mental wellness platform providing peer support, guided journeys, and expert resources.",
  "sameAs": [
    "https://twitter.com/soulconnect",
    "https://facebook.com/soulconnect"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "support@soulconnect.health"
  }
}
```

---

## 4. Internal Linking Engine

### Strategy

1. **Related Guides**: ML-based on semantic similarity
2. **Category Links**: Within same emotion category
3. **Contextual Links**: Within guide text where relevant
4. **Hierarchical Links**: Parent category → child guides

### Link Suggestions

When creating a guide, system suggests:

**Related Guides** (up to 5):
- Anxiety → Stress Management
- Anxiety → Sleep Issues
- Anxiety → Panic Attacks
- Anxiety → Breathing Techniques
- Anxiety → Meditation

**Category Links** (up to 3):
- Anxiety (main guide)
- Anxiety Disorders (related category)
- Mental Health (parent category)

**Best Practices**:
- Link 2-5 related guides per guide
- Use descriptive anchor text (not "click here")
- Link to guides 200+ words minimum
- Place links naturally in content
- Test links before publishing

---

## 5. Sitemap Generation

### Automatic Generation

**Triggers:**
- When guide is published
- When guide is updated
- When category is modified
- Daily at 2 AM UTC

**Format:** XML 2.0 compliant

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://soulconnect.health</loc>
    <lastmod>2024-02-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Emotion Library -->
  <url>
    <loc>https://soulconnect.health/emotion-library</loc>
    <lastmod>2024-02-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Categories -->
  <url>
    <loc>https://soulconnect.health/emotion-library/categories/anxiety</loc>
    <lastmod>2024-02-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Guides -->
  <url>
    <loc>https://soulconnect.health/emotion-library/guides/anxiety-management</loc>
    <lastmod>2024-02-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>https://example.com/anxiety-image.jpg</image:loc>
      <image:title>Anxiety Management Strategies</image:title>
    </image:image>
  </url>
</urlset>
```

**Priority Levels:**
- Homepage: 1.0
- Emotion Library hub: 0.9
- Categories: 0.8
- Published guides: 0.7

**Change Frequency:**
- Homepage: weekly
- Category: weekly
- Guide (published): monthly
- Guide (recently updated): weekly

---

## 6. Robots.txt Generation

```
# Emotion Library Robots.txt

# Allow all search engines
User-agent: *
Allow: /
Allow: /emotion-library
Allow: /emotion-library/categories
Allow: /emotion-library/guides
Allow: /resources
Allow: /search

# Disallow internal/admin areas
Disallow: /admin
Disallow: /cms
Disallow: /api/
Disallow: /auth
Disallow: /logout
Disallow: /register
Disallow: /*/draft
Disallow: /*?draft=true

# Crawl delay
Crawl-delay: 1

# Sitemaps
Sitemap: https://soulconnect.health/sitemap.xml
Sitemap: https://soulconnect.health/sitemap-guides.xml
Sitemap: https://soulconnect.health/sitemap-categories.xml
```

---

## 7. Canonical URLs

### Strategy

Each guide has exactly one canonical URL to prevent duplicate content penalties.

**Format:**
```
https://soulconnect.health/emotion-library/guides/[emotion-slug]
```

**Examples:**
```
https://soulconnect.health/emotion-library/guides/anxiety
https://soulconnect.health/emotion-library/guides/grief
https://soulconnect.health/emotion-library/guides/stress
```

**Canonical Tag:**
```html
<link rel="canonical" href="https://soulconnect.health/emotion-library/guides/anxiety">
```

**Rules:**
- One canonical URL per guide (never more)
- Canonical points to published guide
- No parameters on canonical URL
- Stays same if URL ever changes
- Declared in HTML head

---

## 8. SEO Performance Monitoring

### Metrics to Track

**Monthly Reports:**

1. **Indexation**
   - Guides indexed in Google
   - Guides indexed in Bing
   - Pages in search console

2. **Rankings**
   - Average position for target keywords
   - Impressions in search
   - Click-through rate (CTR)

3. **Organic Traffic**
   - Sessions from organic search
   - Avg. session duration
   - Bounce rate
   - Pages per session

4. **Engagement**
   - Assessment completions
   - Internal links clicked
   - Related guides clicked
   - Time on page

5. **Health**
   - Search Console errors (0)
   - Crawl budget status
   - Mobile usability issues (0)
   - Core Web Vitals (green)

### Actions Based on Performance

**Low rankings?**
- Improve meta description for CTR
- Add internal links from high-traffic pages
- Improve related content quality

**Low organic traffic?**
- Expand content (add more guides)
- Target long-tail keywords
- Improve internal link structure

**Low engagement?**
- Improve guide structure
- Add assessment to guides
- Improve related guides suggestions

---

## 9. SEO Checklist for Every Guide

Before publishing:

- [ ] Title ≤ 60 characters
- [ ] Title includes primary keyword
- [ ] Description ≤ 160 characters
- [ ] Description is compelling
- [ ] 5-10 keywords identified
- [ ] First paragraph has keyword
- [ ] Headings are hierarchical (H1 → H2 → H3)
- [ ] 2-5 internal links included
- [ ] All links have descriptive anchor text
- [ ] Featured image ≥ 500px width
- [ ] All images have alt text
- [ ] Content ≥ 1500 words
- [ ] Mobile preview is readable
- [ ] Schema.org markup generates correctly
- [ ] Canonical URL is set
- [ ] OG tags are generated
- [ ] No keyword stuffing detected
- [ ] No duplicate content warnings
- [ ] Related guides are suggested
- [ ] Medical review completed

---

## 10. Technical Implementation

### APIs Needed

```javascript
// Generate meta tags for guide
GET /api/seo/meta/:guide_id

// Get structured data for guide
GET /api/seo/structured-data/:guide_id

// Get suggested internal links
GET /api/seo/internal-links/:guide_id

// Regenerate sitemap
POST /api/seo/generate-sitemap

// Regenerate robots.txt
POST /api/seo/generate-robots

// Get SEO analytics
GET /api/seo/analytics/:guide_id
```

### Automatic Triggers

- Guide published → Regenerate sitemap
- Guide updated → Update sitemap
- New category → Regenerate sitemap
- Daily at 2 AM → Full sitemap regeneration
- Weekly → SEO health audit

---

**SEO is built in, not bolted on.**

Every guide is automatically optimized for search engines using this engine. No manual SEO work needed beyond content creation following our guidelines.
