# SoulConnect Emotion Library - CMS Guide

**Version:** 1.0.0  
**Audience:** Content managers, medical reviewers, administrators

---

## 1. CMS Dashboard Overview

The CMS dashboard is the central hub for managing the Emotion Library.

### Main Sections

1. **Guides**
   - View all guides (draft, in review, published)
   - Create new guides
   - Edit existing guides
   - Preview guides
   - Submit for review
   - Publish guides
   - Delete guides (admin only)

2. **Categories**
   - View 25 emotion categories
   - Edit category metadata
   - Manage category hierarchy
   - Set category colors/icons
   - View guides in each category

3. **Reviews**
   - View guides awaiting review
   - Approve/reject guides
   - Add review comments
   - Request revisions
   - Track review status

4. **Analytics**
   - View popular guides
   - Track page views
   - Monitor assessment completions
   - See search queries
   - Device/browser analytics

5. **Drafts**
   - Auto-saved drafts (every 30 seconds)
   - Revert to previous versions
   - Compare draft vs published
   - Schedule publish time

---

## 2. Creating a Guide

### Step-by-step

1. **Dashboard → Guides → Create New**
   - Select emotion category
   - Enter guide title
   - Enter meta description (160 chars max)
   - Add featured image URL

2. **Guide Editor**
   - **Title** (H1, auto-generates slug)
   - **Introduction** (2-3 paragraphs)
   - **What is [emotion]?** (Definition section)
   - **Why do we feel it?** (Context, 2-3 paragraphs)
   - **How to manage it** (5-7 steps/strategies)
   - **Quick tips** (5-10 bullet points)
   - **Related resources** (Auto-generated from internal linking engine)
   - **Assessment** (Auto-generated questions)
   - **Next steps** (CTA)

3. **Metadata**
   - SEO title (60 chars max, auto-preview)
   - Meta description (160 chars max)
   - Keywords (5-10, comma-separated)
   - Canonical URL (auto-generated)
   - Featured image
   - Internal links (suggested, you select)

4. **Preview**
   - Real-time preview
   - Mobile view
   - Desktop view
   - SEO preview (title, description)
   - Structured data preview
   - Responsive layouts

5. **Auto-save**
   - Every 30 seconds
   - Shows "Saved at 2:45 PM"
   - Revert to earlier versions
   - No need to manually save

6. **Submit for Review**
   - Click "Submit for Medical Review"
   - Add any reviewer notes
   - Select recommended reviewers (optional)
   - Status changes to "in_review"

7. **Publish**
   - After approval: Click "Publish"
   - Choose: Immediate or Schedule
   - If scheduled: Pick date/time
   - View count resets to 0
   - Published timestamp recorded

---

## 3. Guide Template Structure

Every guide follows this structure for consistency:

```markdown
# [Emotion Name] - [Descriptive Subtitle]

## Introduction
[2-3 paragraphs introducing the emotion and why it matters]

## What is [Emotion]?
[Clear definition and distinction from similar emotions]

## Why Do We Feel [Emotion]?
[Explanation of triggers, biological basis, psychological context]

## How to Manage [Emotion]
[5-7 evidence-based strategies with explanations]
- Strategy 1: [Name] - [2-3 sentence explanation]
- Strategy 2: [Name] - [2-3 sentence explanation]
- ... and so on

## Quick Tips
[5-10 immediately actionable bullet points]
- Tip 1
- Tip 2
- ... and so on

## Related Resources
[Auto-generated section with related guides]

## Self-Assessment
[Interactive assessment with 5-10 questions]

## Key Takeaway
[2-3 sentence conclusion with CTA]

## Next Steps
- [Link to related guide 1]
- [Link to related guide 2]
- [Link to assessment]
```

---

## 4. SEO Best Practices

### Before Publishing

- [ ] Title includes main keyword (60 chars)
- [ ] Meta description is compelling (160 chars)
- [ ] Keywords are relevant (5-10)
- [ ] First paragraph includes keyword naturally
- [ ] Headings are hierarchical (H1 → H2 → H3)
- [ ] Links point to related guides
- [ ] Images have alt text
- [ ] Content is >1500 words (guides)
- [ ] No keyword stuffing
- [ ] Links are internal (to other guides)

### SEO Checklist

- [ ] Title is unique across guides
- [ ] Description is compelling for CTR
- [ ] Keywords match search intent
- [ ] Related guides are linked
- [ ] Internal link anchor text is descriptive
- [ ] Featured image is high quality
- [ ] URLs are clean and readable
- [ ] Canonical URL is set
- [ ] Structured data preview looks good
- [ ] Mobile preview is readable

---

## 5. Medical Review Process

### As Content Creator

1. Complete guide with all sections
2. Click "Submit for Medical Review"
3. Add notes for reviewers (optional)
4. Guide status → "in_review"
5. Wait for reviewer to complete review

### As Medical Reviewer

1. Dashboard → Reviews → Pending
2. Click guide to review
3. Read full guide
4. Check medical accuracy
5. Verify evidence-based recommendations
6. One of three actions:
   - **Approve**: "This is medically accurate"
   - **Reject**: "This needs significant changes"
   - **Request Revisions**: "Make these specific changes"

### After Review

**If Approved:**
- Content creator can publish immediately
- "Medically Reviewed" badge displays

**If Revisions Requested:**
- Guide status → "revision_requested"
- Content creator makes changes
- Resubmit for review
- Process repeats

**If Rejected:**
- Guide status → "draft"
- Content creator gets feedback
- Can rewrite or delete

---

## 6. Analytics Dashboard

### Key Metrics

1. **Page Views**
   - Total views per guide
   - Views by day/week/month
   - Trending up/down

2. **User Engagement**
   - Avg time on page
   - Scroll depth
   - Click patterns

3. **Assessment Completions**
   - % users who complete assessment
   - Most selected answers
   - Score distributions

4. **Search Queries**
   - Top search terms
   - Search without results
   - Click-through from search

5. **Traffic Sources**
   - Direct visits
   - Search traffic
   - Referral traffic
   - Social media

6. **Device Analytics**
   - Desktop vs mobile split
   - Top browsers
   - Device types

### Actions Based on Analytics

**Low views?**
- Improve SEO
- Check internal links
- Promote in related guides

**High scroll depth but low time?**
- Content too long
- Readers skimming
- Improve formatting

**Low assessment completion?**
- Assessment too hard
- Not clear where it is
- Rewrite questions

**High search traffic?**
- This is a winner
- Expand similar topics
- Internal link from others

---

## 7. Content Guidelines

### Writing Style

- Clear, compassionate, non-clinical language
- Avoid jargon (define if necessary)
- Use second person ("You") where appropriate
- Active voice preferred
- Short paragraphs (2-4 sentences)
- Short sentences (15-20 words avg)

### Structure

- H1 for title (1 per page)
- H2 for main sections (5-7 per guide)
- H3 for subsections if needed
- Bullet lists for scannable content
- Bold for key terms

### Content Length

- Introduction: 150-250 words
- Each main section: 200-400 words
- Quick tips: 50-100 words
- Total: 1500-2500 words

### Medical Accuracy

- Cite evidence-based strategies
- Avoid absolute claims ("cure", "guarantee")
- Include disclaimer: "This is not medical advice"
- Focus on self-help strategies
- Know when to recommend professional help

### Accessibility

- Alt text on all images
- Descriptive link text (not "click here")
- Color isn't the only indicator
- Sufficient contrast (WCAG AA)
- Readable fonts (>14px)

---

## 8. Common Tasks

### Updating a Published Guide

1. Dashboard → Guides → Find guide
2. Click "Edit"
3. Make changes
4. Changes auto-save
5. Preview changes (mobile + desktop)
6. Click "Update Published"
7. Confirm changes
8. Version number increments
9. Updated timestamp recorded

### Creating a New Category

1. Dashboard → Categories → Add Category
2. Enter category name (e.g., "Anxiety")
3. Auto-generates slug
4. Add description (optional)
5. Choose icon from list
6. Choose color from palette
7. Set difficulty level
8. Save
9. Category appears in guide creation

### Requesting Revision Help

1. Dashboard → Guides → Find guide
2. Hover over "Status" → "Request Revision"
3. Add specific revision requests
4. Content creator is notified
5. Guide moves to revision queue
6. Creator makes changes + resubmits

### Scheduling a Publish

1. Dashboard → Drafts → Find draft
2. Click "Schedule Publish"
3. Choose date/time in calendar
4. Confirm
5. System publishes automatically at scheduled time
6. You receive notification

### Reverting to Previous Version

1. Dashboard → Guides → Find guide
2. Click "Version History"
3. See all versions with timestamps
4. Click version to compare
5. Click "Revert to This Version"
6. Confirm revert
7. Guide reverts to that version

---

## 9. Troubleshooting

### Draft Not Saving?
- Check internet connection
- Hard refresh browser (Ctrl+F5)
- Try different browser
- Contact admin if issue persists

### SEO Preview Not Updating?
- Clear browser cache
- Close and reopen editor
- Wait 30 seconds for auto-save
- Check meta tags in database

### Assessment Not Showing?
- Verify assessment questions are added
- Check guide status (must be published)
- Clear browser cache
- Contact admin

### Review Stuck in "Pending"?
- Assign to specific reviewer
- Send reminder email
- Check reviewer's dashboard
- Ask reviewer directly

---

## 10. Best Practices Checklist

Before Publishing Every Guide:

- [ ] Written in clear, non-clinical language
- [ ] >1500 words total
- [ ] Includes 5-7 strategies/tips
- [ ] Has featured image (>500px width)
- [ ] All images have alt text
- [ ] Links to 2-3 related guides
- [ ] Assessment questions are added
- [ ] Mobile preview looks good
- [ ] Desktop preview looks good
- [ ] SEO title & description set
- [ ] Keywords identified (5-10)
- [ ] Medical review completed
- [ ] No spelling/grammar errors
- [ ] Tone is compassionate & helpful
- [ ] No absolute claims ("cure", etc)
- [ ] Disclaimer included if needed
- [ ] Internal links are relevant
- [ ] Featured image is properly centered
- [ ] Title matches meta title
- [ ] No excessive keyword repetition

---

**Next: Start creating guides!**

Once infrastructure is deployed, content creators can begin populating the 25 emotion guides following this CMS guide and template structure.
