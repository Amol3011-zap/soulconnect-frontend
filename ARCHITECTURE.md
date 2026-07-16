# SoulConnect Emotion Library - Infrastructure Architecture

**Version:** 1.0.0  
**Status:** Infrastructure Complete (Content-agnostic)  
**Deploy Target:** Localhost (dev) → Vercel (production)

---

## 1. Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── emotion-library/
│   │   │   ├── index.jsx                    # Emotion Library landing
│   │   │   ├── category/[slug].jsx          # Category page
│   │   │   ├── guide/[id].jsx               # Individual guide
│   │   │   ├── search.jsx                   # Search results
│   │   │   └── assessment.jsx               # Assessment engine
│   │   └── resources/
│   │       └── index.jsx                    # Resources hub
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navigation.jsx               # Main nav with Resources
│   │   │   ├── Footer.jsx                   # Footer
│   │   │   ├── DarkModeToggle.jsx          # Dark mode
│   │   │   └── SEO.jsx                      # Meta tags
│   │   │
│   │   ├── emotion-library/
│   │   │   ├── CategoryCard.jsx             # Reusable category card
│   │   │   ├── GuideTemplate.jsx            # Template for all guides
│   │   │   ├── GuidePreview.jsx             # Draft preview
│   │   │   ├── AssessmentEngine.jsx         # Assessment component
│   │   │   ├── RelatedGuides.jsx            # Internal linking
│   │   │   └── MedicalReviewBadge.jsx       # Review status
│   │   │
│   │   ├── cms/
│   │   │   ├── CMSDashboard.jsx             # CMS interface
│   │   │   ├── GuideEditor.jsx              # Guide editor
│   │   │   ├── CategoryManager.jsx          # Category management
│   │   │   ├── PreviewPane.jsx              # Real-time preview
│   │   │   └── PublishWorkflow.jsx          # Publish/review flow
│   │   │
│   │   └── search/
│   │       ├── SearchBar.jsx                # Search input
│   │       ├── SearchResults.jsx            # Results display
│   │       └── SearchFilters.jsx            # Filter panel
│   │
│   ├── services/
│   │   ├── emotionLibraryAPI.js            # Emotion Library endpoints
│   │   ├── cmsAPI.js                        # CMS endpoints
│   │   ├── searchAPI.js                     # Search endpoints
│   │   ├── assessmentAPI.js                 # Assessment endpoints
│   │   ├── analyticsAPI.js                  # Analytics endpoints
│   │   ├── seoEngine.js                     # SEO/structured data
│   │   ├── sitemapGenerator.js              # Sitemap/robots generation
│   │   └── internalLinkingEngine.js         # Link suggestions
│   │
│   ├── store/
│   │   ├── emotionLibraryStore.js          # Emotion library state
│   │   ├── cmsStore.js                      # CMS state
│   │   ├── searchStore.js                   # Search state
│   │   ├── assessmentStore.js               # Assessment state
│   │   ├── uiStore.js                       # Dark mode, etc
│   │   └── analyticsStore.js                # Analytics state
│   │
│   ├── hooks/
│   │   ├── useEmotionLibrary.js            # Fetch guides/categories
│   │   ├── useCMS.js                        # CMS operations
│   │   ├── useSearch.js                     # Search functionality
│   │   ├── useAssessment.js                 # Assessment logic
│   │   ├── useDarkMode.js                   # Dark mode state
│   │   ├── useSEO.js                        # SEO meta generation
│   │   └── useAnalytics.js                  # Analytics tracking
│   │
│   ├── lib/
│   │   ├── emotionCategories.js            # 25 emotion categories
│   │   ├── assessmentQuestions.js           # Assessment Q&A
│   │   ├── validationRules.js               # Form validation
│   │   ├── dateUtils.js                     # Date formatting
│   │   ├── urlUtils.js                      # URL generation
│   │   └── securityUtils.js                 # Security helpers
│   │
│   ├── styles/
│   │   ├── globals.css                      # Global styles + dark mode
│   │   ├── variables.css                    # Design tokens
│   │   └── responsive.css                   # Mobile-first breakpoints
│   │
│   ├── config/
│   │   ├── emotionLibraryConfig.js         # Feature flags
│   │   ├── seoConfig.js                     # SEO settings
│   │   ├── searchConfig.js                  # Search settings
│   │   └── analyticsConfig.js               # Analytics settings
│   │
│   └── App.jsx                              # Main app + routing
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Guide.js                     # Guide schema
│   │   │   ├── Category.js                  # Category schema
│   │   │   ├── Assessment.js                # Assessment schema
│   │   │   ├── MedicalReview.js             # Review workflow
│   │   │   ├── SearchIndex.js               # Search index
│   │   │   └── Analytics.js                 # Analytics data
│   │   │
│   │   ├── routes/
│   │   │   ├── emotionLibrary.js           # Library endpoints
│   │   │   ├── cms.js                       # CMS endpoints
│   │   │   ├── search.js                    # Search endpoints
│   │   │   ├── assessment.js                # Assessment endpoints
│   │   │   ├── analytics.js                 # Analytics endpoints
│   │   │   ├── seo.js                       # SEO endpoints
│   │   │   └── admin.js                     # Admin endpoints
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js                      # Auth checks
│   │   │   ├── validation.js                # Input validation
│   │   │   ├── errorHandler.js              # Error handling
│   │   │   ├── corsHeaders.js               # CORS + security
│   │   │   ├── rateLimiter.js               # Rate limiting
│   │   │   └── logging.js                   # Request logging
│   │   │
│   │   ├── services/
│   │   │   ├── emotionLibraryService.js    # Business logic
│   │   │   ├── cmsService.js                # CMS operations
│   │   │   ├── searchService.js             # Search indexing
│   │   │   ├── assessmentService.js         # Assessment scoring
│   │   │   ├── seoService.js                # SEO generation
│   │   │   ├── sitemapService.js            # Sitemap generation
│   │   │   ├── analyticsService.js          # Analytics processing
│   │   │   └── medicalReviewService.js      # Review workflow
│   │   │
│   │   ├── database/
│   │   │   ├── connection.js                # DB connection
│   │   │   ├── migrations/                  # Database migrations
│   │   │   ├── seeds/                       # Initial data
│   │   │   └── queries.js                   # Common queries
│   │   │
│   │   └── server.js                        # Express app
│   │
│   └── package.json
│
├── scripts/
│   ├── generate-sitemap.js                  # Sitemap generation
│   ├── generate-robots.js                   # Robots.txt generation
│   ├── update-search-index.js               # Search index update
│   ├── seed-database.js                     # Initialize data
│   └── inject-static.js                     # Static injection
│
└── public/
    ├── sitemap.xml                          # Generated sitemap
    ├── robots.txt                           # Generated robots.txt
    └── manifest.json                        # PWA manifest
```

---

## 2. Core Features & Components

### 2.1 Emotion Library
- **Categories**: 25 emotion categories with descriptions, icons, colors
- **Guides**: SEO-optimized, structured guides per emotion
- **Metadata**: Title, description, keywords, canonical URL
- **Versioning**: Draft → Review → Published states
- **Timestamps**: Created, updated, published dates

### 2.2 CMS (Content Management)
- **Dashboard**: Overview of all guides, categories
- **Editor**: Rich text editor with formatting
- **Preview**: Real-time draft preview with responsive layouts
- **Workflow**: Draft → Medical Review → Published
- **Publish**: Schedule, immediate, or draft publish
- **Permissions**: Admin-only CMS access

### 2.3 Categories System
- **Static list** of 25 emotions
- **Filtering**: By emotion, difficulty level, etc
- **Taxonomy**: Parent/child categories
- **SEO**: Optimized category pages
- **Display**: Grid/list view options

### 2.4 Guide Template (Reusable)
**Structure:**
```
- Header (H1 title, meta)
- Introduction (problem statement)
- What is [emotion]? (definition)
- Why do we feel it? (context)
- How to manage it (steps)
- Quick tips (bullet points)
- Related resources (internal links)
- Assessment (self-evaluation)
- Expert review badge (medical review status)
- Call to action (next steps)
```

### 2.5 Search Engine
- **Full-text search**: Guides, categories, tags
- **Filters**: Emotion type, difficulty, tags
- **Autocomplete**: As-you-type suggestions
- **Ranking**: Relevance + popularity
- **Analytics**: Track popular searches

### 2.6 SEO Engine
- **Meta tags**: Automatic generation
- **Schema.org**: Structured data (Article, FAQPage)
- **Open Graph**: Social preview tags
- **Canonical URLs**: Prevent duplicates
- **XML Sitemap**: Auto-generated from content
- **robots.txt**: Search engine directives

### 2.7 Structured Data Generator
- **Article schema**: For each guide
- **FAQPage schema**: For assessment questions
- **BreadcrumbList**: Navigation structure
- **Organization schema**: SoulConnect info
- **LocalBusiness schema**: Location (if applicable)

### 2.8 Internal Linking Engine
- **Related guides**: ML-based suggestions
- **Category links**: Related categories
- **Contextual links**: Within guide text
- **Breadcrumbs**: Navigation trail
- **Metrics**: Link density, anchor text analysis

### 2.9 Assessment Engine
- **Self-assessment**: Rate emotions 1-10
- **Quiz format**: Multiple choice questions
- **Scoring**: Aggregate scores
- **Results**: Personalized recommendations
- **History**: Track past assessments
- **Analytics**: Aggregate patterns

### 2.10 Analytics
- **Page views**: Per guide/category
- **User interactions**: Assessment completions
- **Search queries**: Popular searches
- **Time on page**: Engagement metrics
- **Referral sources**: Traffic sources
- **Device types**: Mobile vs desktop

### 2.11 Medical Review Workflow
- **Draft stage**: Created by content team
- **Review queue**: Assigned to medical reviewers
- **Comments**: Reviewer feedback
- **Approval**: Medical reviewer sign-off
- **Published**: Live on site with badge
- **Version history**: Track reviews

### 2.12 Security
- **Authentication**: Token-based auth (JWT)
- **Authorization**: Role-based access (admin, reviewer, user)
- **Input validation**: Sanitize all inputs
- **XSS protection**: Escape HTML content
- **CSRF tokens**: For form submissions
- **Rate limiting**: API request limits
- **HTTPS only**: Secure connections
- **Data encryption**: Sensitive data at rest

### 2.13 Database Schema
```sql
-- Core tables
Guides (id, category_id, title, slug, content, meta_description, keywords, status, version)
Categories (id, name, slug, description, icon, color, created_at, updated_at)
Assessments (id, guide_id, user_id, score, answers, created_at)
MedicalReviews (id, guide_id, reviewer_id, status, comments, approved_at)
SearchIndex (id, guide_id, title, content, tokens, rank)
Analytics (id, page_url, user_id, event_type, timestamp, metadata)
Users (id, email, role, created_at, updated_at)
```

### 2.14 APIs (RESTful)
```
GET    /api/emotion-library/categories            # List categories
GET    /api/emotion-library/categories/:slug      # Get category
GET    /api/emotion-library/guides                # List guides
GET    /api/emotion-library/guides/:id            # Get guide
POST   /api/emotion-library/assessments           # Submit assessment
GET    /api/emotion-library/assessments/:id       # Get assessment result
GET    /api/search?q=anxiety&filters=...         # Search guides
GET    /api/seo/structured-data/:id               # Get structured data
POST   /api/cms/guides                            # Create guide (admin)
PUT    /api/cms/guides/:id                        # Update guide (admin)
PUT    /api/cms/guides/:id/publish                # Publish guide (admin)
POST   /api/cms/guides/:id/review                 # Submit for review (admin)
GET    /api/analytics/stats                       # Analytics dashboard
POST   /api/auth/login                            # User login
GET    /api/sitemap.xml                           # Sitemap
GET    /robots.txt                                # Robots file
```

### 2.15 Mobile Responsive UI
- **Breakpoints**: 320px, 375px, 768px, 1024px, 1440px
- **Touch targets**: 48px minimum
- **Navigation**: Mobile menu, sticky header
- **Typography**: Responsive font sizes
- **Images**: Responsive with srcset
- **Layout**: Single column mobile, multi-column desktop
- **Bottom nav**: For mobile navigation

### 2.16 Dark Mode
- **Toggle**: In header, persists to localStorage
- **Colors**: 
  - Light: #ffffff bg, #1a1a1a text
  - Dark: #1a1a1a bg, #ffffff text
- **Transitions**: Smooth 200ms transitions
- **Contrast**: WCAG AA standards both modes
- **System preference**: Respect OS dark mode

### 2.17 Draft Preview
- **Real-time**: Update as you type
- **Responsive**: Show mobile/desktop views
- **SEO preview**: Show meta tags
- **Structured data**: Show schema preview
- **Side-by-side**: Editor on left, preview on right

### 2.18 Sitemap Generation
- **Auto-generated**: From database content
- **Update frequency**: When guides change
- **Priority**: Homepage 1.0, guides 0.8, categories 0.7
- **Protocol**: XML 2.0 compliant
- **Location**: public/sitemap.xml

### 2.19 Robots.txt Generation
```
User-agent: *
Allow: /emotion-library
Allow: /resources
Disallow: /admin
Disallow: /cms
Sitemap: https://soulconnect.health/sitemap.xml
```

### 2.20 Quality Standards
- **Lighthouse**: >95 on all metrics
- **Performance**: <2s First Contentful Paint
- **Accessibility**: WCAG 2.1 AA
- **SEO**: Core Web Vitals Green
- **Mobile**: Perfect on all devices
- **Code**: Zero console errors/warnings
- **Security**: A+ on SSL labs

---

## 3. Tech Stack

### Frontend
- **Framework**: React 18 + Vite 5
- **Routing**: React Router v6
- **State**: Zustand (minimal, performant)
- **Styling**: Inline styles + CSS variables (no Tailwind)
- **Animation**: motion/react
- **Icons**: Lucide React
- **HTTP**: Axios
- **SEO**: React Helmet

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (or MongoDB for flexibility)
- **Auth**: JWT tokens
- **Validation**: Joi/Yup
- **Search**: Full-text PostgreSQL or Elasticsearch
- **Caching**: Redis (optional)
- **Logging**: Winston or Pino

### DevOps
- **Frontend deploy**: Vercel (SSR support)
- **Backend deploy**: Railway or Heroku
- **Database**: Managed PostgreSQL
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + custom analytics

---

## 4. Deployment

### Local Development
```bash
# Frontend
npm run dev          # Vite dev server :5173
npm run build        # Production build
npm run preview      # Preview build locally

# Backend
npm run dev          # Express server :3000
npm run db:migrate   # Run migrations
npm run db:seed      # Seed initial data
```

### Production
- Frontend: Deploy to Vercel (automatic from main branch)
- Backend: Deploy to Railway (automatic from main branch)
- Database: Managed PostgreSQL on Railway
- DNS: soulconnect.health domain

---

## 5. Security Checklist

- [ ] HTTPS enforced everywhere
- [ ] JWT tokens secure (HttpOnly, SameSite)
- [ ] Input validation on all endpoints
- [ ] XSS protection (escape/sanitize)
- [ ] CSRF tokens on forms
- [ ] Rate limiting on APIs
- [ ] Admin routes require auth
- [ ] CMS access restricted to authorized users
- [ ] Medical review access controlled
- [ ] Database credentials in env vars
- [ ] API keys in env vars (no hardcoding)
- [ ] Error messages don't leak info
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Dependencies kept up to date

---

## 6. Performance Targets

- [ ] Lighthouse Performance: >95
- [ ] Lighthouse Accessibility: >95
- [ ] Lighthouse Best Practices: >95
- [ ] Lighthouse SEO: >95
- [ ] First Contentful Paint: <1.5s
- [ ] Largest Contentful Paint: <2.5s
- [ ] Cumulative Layout Shift: <0.1
- [ ] Interaction to Next Paint: <100ms
- [ ] Time to Interactive: <3s
- [ ] Bundle size: <200KB (gzipped)

---

## 7. Testing Strategy

### Unit Tests
- Services (business logic)
- Utilities (helpers, formatters)
- Validation rules

### Integration Tests
- API endpoints
- Database operations
- Auth workflows

### E2E Tests
- User flows (search, assessment, guide reading)
- CMS workflows (create, review, publish)
- Mobile responsiveness

### Performance Tests
- Lighthouse audits
- Bundle size analysis
- Load testing APIs

---

## 8. Next Steps (After Infrastructure)

1. Create 25 emotion guides with content
2. Implement assessment questions & logic
3. Build medical review process
4. Set up analytics dashboard
5. Create admin training documentation
6. Launch beta with medical reviewers
7. Iterate based on feedback
8. Full production launch

---

**This infrastructure is content-agnostic and ready for content population.**
