# Local Testing Guide: Emotion Library Content

**Date:** 2026-02-15  
**Status:** Ready for Localhost Testing  
**Environment:** Node.js + Vite dev server

---

## Prerequisites

✅ Node.js 18+ installed  
✅ Frontend dependencies installed (`npm install`)  
✅ Development server configured (vite.config.js)  

---

## Testing on Localhost

### Step 1: Start Development Server

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
```

### Step 2: Navigate to Explore Route

Open browser: `http://localhost:5173/explore`

**Expected behavior:**
- Page loads with "Emotion Library" heading
- Search bar displays
- 24 emotion cards show (Anxiety, Depression, Grief, etc.)
- Each card shows: emoji icon, emotion name, description
- "Coming Soon" section at bottom

### Step 3: Test Individual Emotions

Click any emotion card (e.g., "Anxiety")

**URL changes to:** `http://localhost:5173/explore/i-feel-anxiety`

**Expected behavior:**
- Full emotion content displays:
  - ✅ Hero section (title + subtitle)
  - ✅ Summary paragraph
  - ✅ "What This Might Feel Like" section (8 items)
  - ✅ "Common Situations" section (8 items)
  - ✅ "Things You Can Try Today" section (8 items)
  - ✅ Reflection questions (5)
  - ✅ Anonymous stories (3)
  - ✅ "When to Seek Support" section
  - ✅ FAQ section (8 Q&A)
  - ✅ Related emotions (5 linked cards at bottom)

### Step 4: Test Internal Navigation

From emotion detail page, click a related emotion card

**Expected behavior:**
- URL changes to related emotion (e.g., /explore/i-feel-panic-attacks)
- New emotion's full content loads
- Related emotions include the previous emotion (reciprocal linking)

### Step 5: Test Search

From `/explore` hub:
1. Type in search bar: "anxiety"
2. Expected: Only anxiety card shows
3. Clear search: All 24 cards reappear

---

## Content Verification Checklist

For each emotion tested, verify:

### Structure
- [ ] Hero section renders (title + subtitle)
- [ ] Summary is readable (no formatting issues)
- [ ] All sections display in correct order
- [ ] No content truncation
- [ ] Related emotions link correctly

### Content Quality
- [ ] Copy is compassionate (not clinical)
- [ ] Practical tips make sense
- [ ] Stories are relatable
- [ ] FAQ answers questions well
- [ ] Professional help guidance is present

### Responsive Design
- [ ] Desktop layout looks good (1920px)
- [ ] Tablet layout responsive (768px)
- [ ] Mobile layout works (393px - iPhone 15 Pro)
- [ ] Text readable at all sizes
- [ ] No horizontal scroll on mobile

### Performance
- [ ] Page loads quickly (<2s)
- [ ] Clicking between emotions is smooth
- [ ] Search filters instantly
- [ ] No console errors

---

## Browser DevTools Inspection

### Check Meta Tags (for SEO)

Open DevTools → Console → Run:

```javascript
// Check meta description
console.log(document.querySelector('meta[name="description"]')?.content);

// Check OG tags (social preview)
console.log(document.querySelector('meta[property="og:title"]')?.content);
console.log(document.querySelector('meta[property="og:description"]')?.content);

// Check canonical URL
console.log(document.querySelector('link[rel="canonical"]')?.href);
```

**Expected output:** Emotion-specific metadata

### Check Related Categories

From any emotion detail page, inspect:

```javascript
// Find related emotion links
const relatedLinks = document.querySelectorAll('[data-related-emotion]');
console.log('Related emotions count:', relatedLinks.length); // Should be 5

// List related emotions
relatedLinks.forEach(link => {
  console.log('Related:', link.textContent);
});
```

**Expected:** 5 related emotion links shown

---

## Testing Specific Emotions

### Test Each Emotion Category

**1. Anxiety** (first emotion)
- Verify all content sections render
- Check related: panic-attacks, social-anxiety, stress, overthinking, sleep-issues

**2. Depression** (second emotion)
- Verify heavy/sensitive content handled well
- Check help resources prominent

**3. Grief & Loss** (emotion with trauma content)
- Verify respectful tone
- Check professional help guidance

**4. Heartbreak** (newer emotion)
- Verify story diversity
- Check related emotions make sense

**5. Motivation** (final emotion)
- Verify complete content

---

## Common Issues & Fixes

### Issue: Emotion cards don't load

**Cause:** emotionContentLibrary.ts not imported  
**Fix:** Verify import in ExploreHub.jsx:
```typescript
import emotionContentLibrary from '@/data/emotionContentLibrary';
```

### Issue: Related emotions don't render

**Cause:** Related categories slugs don't match  
**Fix:** Run script to verify:
```javascript
emotionContentLibrary.forEach(emotion => {
  emotion.relatedCategories.forEach(slug => {
    const exists = emotionContentLibrary.find(e => e.slug === slug);
    if (!exists) console.error('Missing:', slug);
  });
});
```

### Issue: Search doesn't filter emotions

**Cause:** Search filter logic broken  
**Fix:** Check ExploreHub.jsx search function handles emotionContentLibrary correctly

### Issue: Content appears cut off

**Cause:** CSS max-width too narrow  
**Fix:** Increase container max-width to 1200px

---

## Performance Benchmarks

### Target Metrics

- **Page load:** < 2 seconds
- **Time to interactive:** < 3 seconds
- **First contentful paint:** < 1 second
- **Lighthouse SEO:** > 95

### Check in DevTools

1. Open DevTools → Lighthouse
2. Run audit for "Performance"
3. Verify scores above targets
4. Fix any red flags

---

## SEO Verification

### Meta Tags Present

For each emotion, verify in DevTools:

- [ ] `<title>` tag (emotion-specific)
- [ ] `<meta name="description">` (160 chars)
- [ ] `<meta property="og:title">`
- [ ] `<meta property="og:description">`
- [ ] `<link rel="canonical">`

### Sitemap Inclusion

Check if emotion URLs in `/public/sitemap.xml`:

```bash
grep "explore/i-feel" frontend/public/sitemap.xml
```

Expected: 24 emotion URLs listed

### Robot.txt Accessibility

Verify `/public/robots.txt` allows /explore:

```
Allow: /explore
Allow: /explore/i-feel-*
```

---

## Accessibility Testing

### Keyboard Navigation

1. Press `Tab` repeatedly on emotion detail page
2. Verify all interactive elements focusable
3. Related emotion links should be reachable

### Screen Reader Testing

Use browser accessibility inspector:

1. Open DevTools → Accessibility tab
2. Verify heading hierarchy (h1 > h2 > h3)
3. Check ARIA labels on interactive elements
4. Verify link text is descriptive

### Color Contrast

Use WebAIM contrast checker:

- [ ] Text on background: 4.5:1 contrast minimum
- [ ] Headings: 7:1 contrast (AAA standard)
- [ ] Links distinct from text

---

## Manual Testing Scenarios

### Scenario 1: New User Exploring

1. Land on `/explore`
2. Browse emotion cards
3. Click random emotion
4. Read story section
5. Check when to seek help
6. Try another emotion via related link

**Expected:** Smooth, intuitive journey; helpful content

### Scenario 2: User with Specific Emotion

1. Search for "anxiety" on hub
2. Click anxiety card
3. Read tips section
4. Click related "panic-attacks"
5. Skim FAQ
6. Check trust/safety disclaimer

**Expected:** User feels validated and knows next step

### Scenario 3: Mobile User

1. Visit `/explore` on phone (393px)
2. Scroll through emotion cards
3. Click emotion
4. Read content on mobile
5. Tap related emotion
6. Use search on hub

**Expected:** Responsive, readable, easy to navigate

---

## Reporting Issues

When testing, note any issues:

| Issue | Page | Section | Priority |
|-------|------|---------|----------|
| Example | /explore/i-feel-anxiety | Summary paragraph | High |

### Issue Template

```
### Content Issue
**Page:** /explore/i-feel-anxiety
**Section:** Tips
**Issue:** Third tip is unclear
**Expected:** Practical, actionable
**Current:** Too vague
**Severity:** Medium
```

---

## Sign-Off Checklist

Before approving for production:

### Content Quality
- [ ] All 24 emotions fully render
- [ ] No content truncation
- [ ] Tone is compassionate
- [ ] Practical tips actionable
- [ ] Stories are relatable
- [ ] FAQ addresses real questions

### Technical
- [ ] No console errors
- [ ] All links work
- [ ] Search filters correctly
- [ ] Mobile responsive
- [ ] Meta tags correct
- [ ] Performance acceptable

### UX/Accessibility
- [ ] Navigation intuitive
- [ ] Related links make sense
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG AA

### SEO
- [ ] Meta descriptions accurate
- [ ] OG tags for social sharing
- [ ] Canonical URLs correct
- [ ] Sitemap includes all emotions
- [ ] Robots.txt allows /explore

---

## Localhost Testing Complete ✅

Once all checks pass, the content is ready for:
1. User review and feedback
2. Production deployment to Vercel
3. GitHub push with all documentation

**Next Step:** Submit for user review at localhost before production push.

---

**Last Updated:** 2026-02-15  
**Owner:** SoulConnect Engineering  
**Status:** Ready for Testing
