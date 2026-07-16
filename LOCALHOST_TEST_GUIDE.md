# SoulConnect Emotion Library - Local Testing & Deployment Guide

**Version:** 1.0.0  
**Purpose:** Deploy infrastructure on localhost and validate all components before production

---

## 1. Prerequisites

### System Requirements

- Node.js 18+ (check: `node --version`)
- PostgreSQL 14+ (check: `psql --version`)
- npm (check: `npm --version`)
- Git (check: `git --version`)

### Install Dependencies

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../frontend/backend
npm install
```

---

## 2. Database Setup

### Create Local Database

```bash
# Connect to PostgreSQL
psql postgres

# Inside psql terminal:
CREATE DATABASE emotion_library;
CREATE USER emotion_dev WITH PASSWORD 'dev_password_change_me';
ALTER ROLE emotion_dev CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE emotion_library TO emotion_dev;
\q
```

### Run Migrations

```bash
cd frontend/backend

# Set database URL
export DATABASE_URL="postgresql://emotion_dev:dev_password_change_me@localhost:5432/emotion_library"

# Run schema
psql $DATABASE_URL < schema.sql

# Verify tables created
psql $DATABASE_URL -c "\dt"
# Should show: emotion_categories, guides, medical_reviews, users, etc.
```

### Seed Sample Data

```bash
# Run seed script (creates sample data)
npm run db:seed

# Verify data
psql $DATABASE_URL -c "SELECT COUNT(*) FROM emotion_categories;"
# Should show: 25
```

---

## 3. Environment Configuration

### Backend .env

Create `frontend/backend/.env`:

```env
# Server
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://emotion_dev:dev_password_change_me@localhost:5432/emotion_library
DB_POOL_MIN=2
DB_POOL_MAX=10

# JWT
JWT_SECRET=super_secret_development_key_min_32_chars_long_here
JWT_EXPIRE=24h
REFRESH_TOKEN_SECRET=refresh_secret_min_32_chars_long_here
REFRESH_TOKEN_EXPIRE=7d

# Encryption
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef

# Frontend
FRONTEND_URL=http://localhost:5173
FRONTEND_LOCAL_URL=http://localhost:5173

# Feature flags
FEATURE_ASSESSMENT_ENABLED=true
FEATURE_MEDICAL_REVIEW_ENABLED=true
```

### Frontend .env.local

Create `frontend/.env.local`:

```env
# Local development API
VITE_API_URL=http://localhost:3000/api

# Feature flags
VITE_LAUNCH_READY=true

# Debug mode
VITE_DEBUG=true
```

---

## 4. Start Local Servers

### Terminal 1: Backend

```bash
cd frontend/backend

# Start development server with hot reload
npm run dev

# Expected output:
# Express server running on http://localhost:3000
# Connected to database
```

### Terminal 2: Frontend

```bash
cd frontend

# Start Vite dev server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

---

## 5. Access Local Application

### URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main app |
| Backend API | http://localhost:3000/api | API endpoints |
| Database | localhost:5432 | PostgreSQL (CLI only) |

### Test Frontend Load

```bash
# Test frontend loads
curl http://localhost:5173

# Expected: HTML response with SoulConnect landing page
```

### Test Backend Health

```bash
# Test API health
curl http://localhost:3000/api/health

# Expected: { "status": "ok" }
```

---

## 6. Component Testing Checklist

### ✅ Database

```bash
# Connect to database
psql $DATABASE_URL

# Test queries
SELECT COUNT(*) FROM emotion_categories;  -- Should be 25
SELECT COUNT(*) FROM guides;               -- Should be >0
SELECT COUNT(*) FROM users;                -- Should be >0
\q
```

**Expected Results:**
- [ ] 25 emotion categories
- [ ] Sample guides in each category
- [ ] Sample users (reviewer, admin)

### ✅ Authentication

1. Open http://localhost:5173/login
2. Try login with test credentials
3. Verify JWT token in browser storage (DevTools → Application → Cookies)
4. Try accessing protected route (/dashboard)

**Expected Results:**
- [ ] Login form renders
- [ ] Invalid credentials show error
- [ ] Valid credentials redirect to dashboard
- [ ] Token stored securely

### ✅ Emotion Library Routes

1. Navigate to http://localhost:5173/emotion-library
2. View category list
3. Click on a category (e.g., "Anxiety")
4. View guides in category
5. Click on a guide
6. Verify all sections render

**Expected Results:**
- [ ] Categories load and display correctly
- [ ] Guide list shows guides for each category
- [ ] Guide detail page renders all sections
- [ ] Internal links to related guides work
- [ ] Assessment questions display

### ✅ CMS Access

1. Login as reviewer/admin
2. Navigate to http://localhost:5173/cms
3. View guides dashboard
4. Try creating new guide
5. Test draft auto-save
6. Test preview functionality

**Expected Results:**
- [ ] Only authenticated users can access CMS
- [ ] Only reviewers/admins can access
- [ ] Guide creation form loads
- [ ] Auto-save works (check console)
- [ ] Preview renders correctly
- [ ] Draft saves to database

### ✅ Medical Review Workflow

1. Login as content creator
2. Create new guide
3. Submit for medical review
4. Login as reviewer (different user)
5. View pending reviews
6. Approve/reject guide
7. Verify status changes

**Expected Results:**
- [ ] Content creator can submit for review
- [ ] Guide status changes to "in_review"
- [ ] Reviewer receives email (check logs)
- [ ] Reviewer can approve/reject
- [ ] Status updates reflect decisions
- [ ] Creator receives notifications

### ✅ Search Functionality

1. Navigate to http://localhost:5173/search
2. Search for "anxiety"
3. Verify results display
4. Test pagination
5. Test filtering by category

**Expected Results:**
- [ ] Search box accepts input
- [ ] Results display matching guides
- [ ] Results show relevance ranking
- [ ] Pagination works
- [ ] Filter by category works

### ✅ Assessment Engine

1. Open a guide (e.g., Anxiety guide)
2. Scroll to assessment section
3. Answer assessment questions
4. Submit assessment
5. View results

**Expected Results:**
- [ ] Assessment questions display
- [ ] All answer options available
- [ ] Submit button works
- [ ] Results render correctly
- [ ] Score calculated properly

### ✅ Analytics

1. View multiple guides
2. Click multiple links
3. Complete assessments
4. Navigate to analytics dashboard
5. Verify events recorded

**Expected Results:**
- [ ] Page views tracked
- [ ] Link clicks tracked
- [ ] Assessment completions tracked
- [ ] Dashboard shows aggregated data
- [ ] Trends display correctly

---

## 7. API Testing

### Health Check

```bash
curl -X GET http://localhost:3000/api/health
```

**Response:**
```json
{ "status": "ok" }
```

### Get All Categories

```bash
curl -X GET http://localhost:3000/api/categories
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Anxiety",
    "slug": "anxiety",
    "icon_name": "brain",
    "color_hex": "#7C3AED"
  },
  ...
]
```

### Get Published Guides

```bash
curl -X GET http://localhost:3000/api/guides?status=published
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Anxiety Management",
    "slug": "anxiety-management",
    "category_name": "Anxiety",
    "view_count": 125
  },
  ...
]
```

### Get Guide by ID

```bash
curl -X GET http://localhost:3000/api/guides/1
```

**Response:**
```json
{
  "id": 1,
  "title": "Anxiety Management",
  "content_json": { ... },
  "status": "published",
  ...
}
```

### Create Guide (Admin Only)

```bash
curl -X POST http://localhost:3000/api/guides \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "title": "My New Guide",
    "meta_description": "A guide about managing emotions",
    "featured_image_url": "https://example.com/image.jpg"
  }'
```

---

## 8. Performance Testing

### Lighthouse Score

```bash
# Install Lighthouse globally
npm install -g lighthouse

# Test frontend performance
lighthouse http://localhost:5173 --view

# Expected: Score >90 on all metrics
```

### Response Time

```bash
# Test API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/guides

# Expected: <100ms for healthy APIs
```

### Database Query Performance

```bash
# Test query performance
psql $DATABASE_URL -c "EXPLAIN ANALYZE SELECT * FROM guides WHERE status = 'published';"

# Check index usage in results
# Should show "Index Scan" not "Seq Scan"
```

---

## 9. SEO Testing

### Sitemap Generation

```bash
# Test sitemap generation
curl http://localhost:3000/api/seo/sitemap

# Expected: XML with all published guides
```

### Meta Tags

```bash
# Test meta tags for a guide
curl http://localhost:3000/api/seo/meta/1

# Expected: title, description, keywords, og tags
```

### Structured Data

```bash
# Test schema.org markup
curl http://localhost:3000/api/seo/structured-data/1

# Expected: Valid JSON-LD schema
```

---

## 10. Security Testing

### HTTPS Redirect

```bash
# Local development should warn if not HTTPS
# Production enforces redirect
```

### CORS Headers

```bash
curl -H "Origin: http://localhost:5173" http://localhost:3000/api/categories -v

# Check response headers:
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Credentials: true
```

### Rate Limiting

```bash
# Send 6 requests rapidly
for i in {1..6}; do
  curl -s http://localhost:3000/api/health | head -1
done

# On 6th request should get 429 Too Many Requests
```

### SQL Injection Test

```bash
# Test parameterized queries (should NOT work)
curl "http://localhost:3000/api/guides?search='; DROP TABLE guides; --"

# Expected: No error, query treated as literal string
# Database should remain intact
```

---

## 11. Browser Testing

### Chrome DevTools

1. Open http://localhost:5173
2. DevTools (F12)
3. Check:
   - Console (no errors)
   - Network (all requests 200)
   - Storage (JWT tokens stored)
   - Lighthouse (>90 score)

### Mobile Testing

1. DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Set to iPhone 15 Pro (393×852)
3. Test:
   - Layout responsive
   - Touch targets ≥ 48px
   - Bottom nav visibility
   - Modal scrolling

### Cross-Browser

1. Test in Chrome, Firefox, Safari, Edge
2. Verify:
   - Styles render correctly
   - No console errors
   - Animations smooth
   - Forms functional

---

## 12. Data Validation

### Content Validation

```bash
# Test guide content JSON structure
psql $DATABASE_URL -c "SELECT content_json FROM guides LIMIT 1 \gx"

# Should see valid JSON with all required fields
```

### SEO Metadata

```bash
# Verify SEO metadata populated
psql $DATABASE_URL -c "SELECT title, description, keywords FROM seo_metadata LIMIT 1 \gx"

# Should have non-null values
```

### Analytics Data

```bash
# Verify analytics events recorded
psql $DATABASE_URL -c "SELECT COUNT(*) FROM analytics_events;"

# Should increase as you interact with app
```

---

## 13. Error Handling

### 404 Errors

1. Navigate to http://localhost:5173/guides/invalid-slug
2. Expected: Custom 404 page

### 500 Errors

1. Stop backend: Ctrl+C in backend terminal
2. Try to load http://localhost:5173/emotion-library
3. Expected: Connection error or graceful fallback

### Validation Errors

1. Try creating guide with invalid data:
```bash
curl -X POST http://localhost:3000/api/guides \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "title": "" }' # Invalid: missing required fields
```

2. Expected: 400 Bad Request with error message

---

## 14. Logs & Debugging

### Backend Logs

Check backend terminal for:
- Database connection messages
- API request logs
- Error traces
- Middleware logs

Example:
```
[2024-02-20 10:30:45] INFO: GET /api/guides 200ms
[2024-02-20 10:30:46] INFO: POST /api/guides/1/reviews 150ms
```

### Database Logs

```bash
# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql.log

# Or in psql:
SELECT * FROM pg_log_directory();
```

### Frontend Console

DevTools → Console for JavaScript errors

---

## 15. Complete Checklist

Before marking infrastructure complete:

- [ ] Database created and seeded
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] All 25 categories display
- [ ] Sample guides render correctly
- [ ] Authentication works
- [ ] CMS accessible only to authorized users
- [ ] Medical review workflow functions
- [ ] Search returns results
- [ ] Assessments save responses
- [ ] Analytics events recorded
- [ ] All API endpoints respond correctly
- [ ] Lighthouse score >90
- [ ] Mobile layout responsive
- [ ] No console errors
- [ ] Rate limiting works
- [ ] SEO metadata generates
- [ ] Sitemap generates
- [ ] Security headers present
- [ ] CORS configured correctly

---

## 16. Troubleshooting

### Database Connection Fails

**Error:** `ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Start PostgreSQL
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Use Services app or: net start postgresql-x64-14
```

### Port Already In Use

**Error:** `EADDRINUSE :::3000`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### JWT Token Invalid

**Error:** `Unauthorized: Invalid token`

**Solution:**
1. Check JWT_SECRET matches between backend .env and login
2. Verify token not expired (check exp in DevTools)
3. Clear browser storage and re-login

### CORS Errors

**Error:** `No 'Access-Control-Allow-Origin' header`

**Solution:**
1. Verify FRONTEND_URL in backend .env matches actual frontend URL
2. Check CORS middleware initialized before routes
3. Restart backend server

---

## 17. Next Steps After Testing

1. **Review Results**: Go through complete checklist
2. **Document Issues**: Note any bugs or missing features
3. **Get User Approval**: Share test results with team
4. **Iterate**: Fix any issues found
5. **Deploy to Production**: Only after full sign-off

---

**Deployment Infrastructure is Complete.**

All 20 components are documented, and the foundation is ready for code implementation. Start local testing now!
