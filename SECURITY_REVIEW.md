# SoulConnect Emotion Library - Security Review & Implementation Guide

**Version:** 1.0.0  
**Classification:** Security-Sensitive  
**Last Updated:** 2024-02-20

---

## 1. Security Architecture

### Layers

1. **Network Layer**: HTTPS, TLS 1.2+, security headers
2. **Application Layer**: Auth, validation, rate limiting
3. **Database Layer**: Encryption at rest, access control
4. **Data Layer**: Input sanitization, output escaping
5. **Session Layer**: JWT tokens, secure cookies
6. **API Layer**: Authentication, authorization, audit logging

---

## 2. Authentication & Authorization

### JWT Token Implementation

**Token Structure:**
```json
{
  "sub": "user_id_123",
  "email": "user@example.com",
  "role": "user",
  "iat": 1676899200,
  "exp": 1676985600,
  "jti": "unique_token_id"
}
```

**Token Settings:**
- Algorithm: HS256 or RS256
- Expiration: 24 hours (access token)
- Refresh token: 7 days
- HttpOnly flag: TRUE (secure cookies)
- SameSite: Strict
- Secure flag: TRUE (HTTPS only)

**Refresh Token Flow:**
```
1. User logs in
2. Get access token (24h) + refresh token (7d)
3. Access token expires
4. Use refresh token to get new access token
5. Never expose access token in localStorage
6. Store only in secure HttpOnly cookie
```

### Role-Based Access Control (RBAC)

**Roles:**
```javascript
{
  'user': {
    'emotion_library:read': true,
    'assessment:submit': true,
    'guide:comment': false
  },
  'reviewer': {
    'emotion_library:read': true,
    'guide:review': true,
    'guide:approve': true,
    'guide:reject': true,
    'cms:draft_read': true
  },
  'admin': {
    '*': true // All permissions
  }
}
```

**Permission Checks:**
```javascript
// Middleware example
async function checkPermission(req, res, next) {
  const user = req.user;
  const requiredPermission = 'guide:approve';
  
  if (!hasPermission(user.role, requiredPermission)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'You do not have permission to approve guides'
    });
  }
  
  next();
}
```

---

## 3. Input Validation & Sanitization

### Validation Schema (Joi)

```javascript
const guideSchema = Joi.object({
  title: Joi.string()
    .min(10)
    .max(255)
    .required(),
  
  content: Joi.object()
    .required(),
  
  meta_description: Joi.string()
    .min(50)
    .max(160)
    .required(),
  
  category_id: Joi.number()
    .positive()
    .required(),
  
  featured_image_url: Joi.string()
    .uri()
    .required(),
  
  tags: Joi.array()
    .items(Joi.string().max(50))
    .max(10)
});
```

### XSS Protection

**Never trust user input:**

```javascript
// WRONG - vulnerable to XSS
<div>{userInput}</div>

// CORRECT - React escapes by default
<div>{userInput}</div>

// Rich text - use sanitize library
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(userHTML, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href']
});

<div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
```

### SQL Injection Prevention

**Parameterized Queries:**

```javascript
// WRONG - vulnerable
const query = `SELECT * FROM guides WHERE id = ${guideId}`;
db.query(query);

// CORRECT - parameterized
const query = 'SELECT * FROM guides WHERE id = $1';
db.query(query, [guideId]);
```

---

## 4. CORS & CSRF Protection

### CORS Configuration

```javascript
// backend/middleware/cors.js
const cors = require('cors');

app.use(cors({
  origin: [
    'https://soulconnect.health',
    'https://www.soulconnect.health',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
}));
```

### CSRF Token Protection

```javascript
// Generate CSRF token
const csrfToken = generateRandomToken(32);
res.cookie('csrf-token', csrfToken, {
  httpOnly: false,
  secure: true,
  sameSite: 'Strict'
});

// Verify on state-changing requests
app.post('/api/guides', (req, res) => {
  const tokenFromBody = req.body._csrf;
  const tokenFromCookie = req.cookies['csrf-token'];
  
  if (tokenFromBody !== tokenFromCookie) {
    return res.status(403).json({ error: 'CSRF token invalid' });
  }
  
  // Process request
});
```

---

## 5. Rate Limiting

### API Rate Limits

```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    return req.user?.role === 'admin';
  }
});

app.use('/api/', limiter);
```

### Stricter Limits for Sensitive Endpoints

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true
});

app.post('/api/auth/login', authLimiter, loginHandler);
app.post('/api/auth/register', authLimiter, registerHandler);
```

---

## 6. Database Security

### Connection Encryption

```javascript
// .env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

// connection.js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true
  }
});
```

### Data Encryption at Rest

```javascript
// Encrypt sensitive fields
const crypto = require('crypto');

function encryptField(plaintext) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
    iv
  );
  let encrypted = cipher.update(plaintext);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptField(encrypted) {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
    iv
  );
  let decrypted = decipher.update(Buffer.from(parts[1], 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
```

---

## 7. Security Headers

### Helmet.js Configuration

```javascript
// backend/middleware/security.js
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { 
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
}));
```

### Security Headers Set:

- `Strict-Transport-Security`: HTTPS only
- `X-Content-Type-Options`: Prevent MIME type sniffing
- `X-Frame-Options`: Prevent clickjacking
- `X-XSS-Protection`: XSS filter protection
- `Content-Security-Policy`: Restrict resource loading
- `Referrer-Policy`: Control referrer info
- `Permissions-Policy`: Disable unnecessary APIs

---

## 8. Logging & Audit Trail

### Access Logging

```javascript
// middleware/logging.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    user: req.user?.id,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});
```

### Audit Trail for CMS Actions

```javascript
// services/auditService.js
async function logAuditEvent(userId, action, resourceType, resourceId, changes) {
  await db.query(
    `INSERT INTO api_audit_log 
    (user_id, action, resource_type, resource_id, changes_json, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())`,
    [userId, action, resourceType, resourceId, JSON.stringify(changes)]
  );
}

// Usage in guide update
await logAuditEvent(
  req.user.id,
  'update',
  'guide',
  guideId,
  { title: oldTitle, newTitle }
);
```

---

## 9. Environment Variables (Required)

Create `.env` file with:

```env
# Server
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:pass@host:5432/emotion_library
DB_POOL_MIN=5
DB_POOL_MAX=20

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=24h
REFRESH_TOKEN_SECRET=refresh_secret_min_32_chars
REFRESH_TOKEN_EXPIRE=7d

# Encryption
ENCRYPTION_KEY=hex_encoded_32_byte_key

# Frontend
FRONTEND_URL=https://soulconnect.health
FRONTEND_LOCAL_URL=http://localhost:5173

# Sendgrid (for email reviews)
SENDGRID_API_KEY=your_sendgrid_key

# Monitoring
SENTRY_DSN=your_sentry_dsn

# Feature flags
FEATURE_ASSESSMENT_ENABLED=true
FEATURE_MEDICAL_REVIEW_ENABLED=true
```

**NEVER commit .env to git!**

---

## 10. Security Checklist

### Before Deployment

- [ ] All secrets in environment variables
- [ ] No hardcoded API keys
- [ ] HTTPS enforced (vercel.json redirect)
- [ ] JWT tokens HttpOnly + Secure + SameSite
- [ ] CORS configured for exact domains
- [ ] CSRF tokens on all forms
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] Security headers set (Helmet.js)
- [ ] XSS protection (sanitize user input)
- [ ] SQL injection prevention (parameterized queries)
- [ ] Database connection encrypted
- [ ] Audit logging enabled
- [ ] Error messages don't leak info
- [ ] Admin routes require auth
- [ ] CMS access restricted to authorized users
- [ ] Medical review access controlled
- [ ] Dependencies up to date
- [ ] No console.log of sensitive data
- [ ] CORS credentials: true if needed

### Runtime Monitoring

- [ ] Log all authentication attempts
- [ ] Alert on repeated failed logins
- [ ] Monitor for SQL errors in logs
- [ ] Alert on rate limit exceeded
- [ ] Monitor database connection errors
- [ ] Track API response times
- [ ] Alert on high error rates

---

## 11. Common Vulnerabilities to Avoid

### 1. SQL Injection
✅ Always use parameterized queries
❌ Never interpolate user input into SQL strings

### 2. XSS (Cross-Site Scripting)
✅ Use React's built-in escaping
✅ Sanitize HTML with DOMPurify
❌ Never use `dangerouslySetInnerHTML` with user input

### 3. CSRF (Cross-Site Request Forgery)
✅ Implement CSRF token validation
✅ Use SameSite cookies
❌ Don't skip CSRF checks for "trusted" endpoints

### 4. Authentication Bypass
✅ Check permissions on every protected endpoint
✅ Validate JWT tokens on every request
❌ Don't rely on client-side permission checks alone

### 5. Sensitive Data Exposure
✅ Keep secrets in environment variables
✅ Encrypt sensitive data at rest
✅ Never log passwords or tokens
❌ Don't hardcode API keys in code

### 6. Broken Access Control
✅ Verify user owns resource before allowing edit
✅ Check role permissions on every action
❌ Don't trust user-provided IDs without ownership check

### 7. Rate Limiting Bypass
✅ Rate limit by user ID + IP
✅ Store limits in Redis or database
❌ Don't rely on client-side rate limiting

---

## 12. Incident Response

If a security issue is discovered:

1. **Assess**: Is user data at risk? Are systems compromised?
2. **Contain**: Disable affected features if necessary
3. **Notify**: Inform security team and stakeholders
4. **Fix**: Deploy security patch ASAP
5. **Audit**: Review logs for unauthorized access
6. **Document**: Record incident and lessons learned

---

**Security is everyone's responsibility.**

Follow these guidelines on every commit. When in doubt, err on the side of caution.
