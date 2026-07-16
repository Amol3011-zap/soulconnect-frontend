# Emotion Library Content Map

**Generated:** 2026-02-15  
**Status:** Production Ready  
**Total Emotions:** 25  
**Content Structure:** TypeScript/JSON (src/data/emotionContentLibrary.ts)

---

## Content Inventory

All 25 emotions follow identical structure for consistency:

| # | Emotion | Slug | SEO Title | Keywords (3-5) | Stories | FAQ | Status |
|---|---------|------|-----------|-----------------|---------|-----|--------|
| 1 | Anxiety | anxiety | Anxiety Support & Coping Strategies | anxiety help, manage anxiety, anxious thoughts | 3 | 8 | ✅ |
| 2 | Depression | depression | Depression Support & Hope | depression help, low mood, hopelessness | 3 | 8 | ✅ |
| 3 | Grief & Loss | grief | Grief Support & Bereavement | grief support, bereavement, loss | 3 | 8 | ✅ |
| 4 | Stress | stress | Stress Management & Relief | stress management, overwhelm, burnout prevention | 3 | 8 | ✅ |
| 5 | Loneliness | loneliness | Loneliness Support & Connection | loneliness support, isolation, social connection | 3 | 8 | ✅ |
| 6 | Anger | anger | Anger Management & Control | anger management, emotional regulation, frustration | 3 | 8 | ✅ |
| 7 | Self-Doubt | self-doubt | Self-Doubt Support & Confidence | self-doubt, imposter syndrome, building confidence | 3 | 8 | ✅ |
| 8 | Relationship Issues | relationship-issues | Relationship Support & Communication | relationship help, communication skills, couple counseling | 3 | 8 | ✅ |
| 9 | Work Stress | work-stress | Work Stress Support & Career Pressure | work stress, job stress, career pressure | 3 | 8 | ✅ |
| 10 | Financial Worry | financial-worry | Financial Stress & Money Anxiety | financial stress, money anxiety, debt stress | 3 | 8 | ✅ |
| 11 | Sleep Issues | sleep-issues | Sleep Support & Insomnia Help | sleep issues, insomnia help, cannot sleep | 3 | 8 | ✅ |
| 12 | Panic Attacks | panic-attacks | Panic Attack Help & Support | panic attack help, panic disorder, grounding techniques | 3 | 8 | ✅ |
| 13 | Social Anxiety | social-anxiety | Social Anxiety Support & Overcome Fear | social anxiety, social fear, overcoming shyness | 3 | 8 | ✅ |
| 14 | Perfectionism | perfectionism | Perfectionism Support & Release Standards | perfectionism support, high standards, all-or-nothing | 3 | 8 | ✅ |
| 15 | Overwhelm | overwhelm | Overwhelm Support & Information Overload | overwhelm, too much to do, managing stress | 3 | 8 | ✅ |
| 16 | Low Self-Esteem | low-self-esteem | Low Self-Esteem Support & Build Self-Worth | low self-esteem, self-worth, building confidence | 3 | 8 | ✅ |
| 17 | Burnout | burnout | Burnout Support & Recovery | burnout support, job burnout, recovery | 3 | 8 | ✅ |
| 18 | Jealousy | jealousy | Jealousy Support & Managing Envy | jealousy support, managing jealousy, insecurity | 3 | 8 | ✅ |
| 19 | Guilt | guilt | Guilt & Shame Support | guilt support, regret, self-forgiveness | 3 | 8 | ✅ |
| 20 | Shame | shame | Shame & Self-Rejection Support | shame support, feeling ashamed, overcoming shame | 3 | 8 | ✅ |
| 21 | Feeling Lost | feeling-lost | Feeling Lost in Life Support | feeling lost, lack of direction, finding purpose | 3 | 8 | ✅ |
| 22 | Emotional Exhaustion | emotional-exhaustion | Emotional Exhaustion & Compassion Fatigue | emotional exhaustion, compassion fatigue, empathy burnout | 3 | 8 | ✅ |
| 23 | Overthinking | overthinking | Overthinking Support & Racing Thoughts | overthinking, racing thoughts, rumination | 3 | 8 | ✅ |
| 24 | Heartbreak | heartbreak | Heartbreak & Breakup Support | heartbreak, breakup recovery, lost love | 3 | 8 | ✅ |
| 25 | Motivation | motivation | Motivation & Drive Support | motivation, lack of motivation, low drive | 3 | 8 | ✅ |

---

## Content Structure per Emotion

### TypeScript Interface
```typescript
interface EmotionContent {
  slug: string;                    // URL-safe identifier
  displayName: string;             // Human-readable name
  
  seo: {
    title: string;                 // <title> tag (60 chars max)
    description: string;           // Meta description (160 chars max)
    openGraph: {
      title: string;               // OG:title for social preview
      description: string;         // OG:description for social
    };
    keywords: string[];            // 3-5 target keywords
  };
  
  hero: {
    title: string;                 // Hero headline
    subtitle: string;              // Hero supporting text
  };
  
  summary: string;                 // Max 120 words, plain language
  relatable: string[];             // 8 items: "You feel X..."
  situations: string[];            // 8 items: common triggers
  tips: string[];                  // 8 actionable suggestions
  reflectionQuestions: string[];   // 5 prompts for self-discovery
  
  stories: {
    title: string;                 // Story name
    content: string;               // 50-150 word narrative
  }[];                             // 3 anonymous stories
  
  whenToSeekSupport: string;       // When to get professional help
  relatedCategories: string[];     // 5 emotion slugs for linking
  
  faq: {
    question: string;
    answer: string;
  }[];                             // 8 Q&A pairs
  
  trustSafety: {
    disclaimer: string;            // Legal/safety disclaimer
    lastReviewedDate: string;       // YYYY-MM-DD format
  };
}
```

---

## Content Quality Metrics

### Evidence Standards
- ✅ WHO, NHS, APA, NIMH, CDC, Mayo Clinic informed
- ✅ No generic AI content
- ✅ No fear-based language or catastrophizing
- ✅ No medical diagnoses or claims
- ✅ All content rewritten in SoulConnect's voice
- ✅ No content copied from other websites

### SEO Standards
- ✅ Long-tail keyword focus (e.g., "Why do I feel anxious?" not "Anxiety")
- ✅ Breadcrumb schema ready
- ✅ FAQ schema ready
- ✅ Internal linking ready (via `relatedCategories`)
- ✅ Canonical URL compatible

### Human-Centered Standards
- ✅ Relatable, not clinical
- ✅ Validating, not judgmental
- ✅ Hopeful, not catastrophic
- ✅ Practical, not theoretical
- ✅ Diverse stories (gender, culture, age, background)

---

## File Location & Format

**Primary File:** `src/data/emotionContentLibrary.ts`

**Import in Components:**
```typescript
import emotionContentLibrary from '@/data/emotionContentLibrary';

// Access single emotion
const anxiety = emotionContentLibrary.find(e => e.slug === 'anxiety');

// Map all emotions
emotionContentLibrary.forEach(emotion => {
  console.log(emotion.displayName, emotion.summary);
});
```

---

## Usage in Frontend

### ExploreHub Component
- Displays emotion cards with slug, displayName, summary
- Links to `/explore/i-feel-{slug}` detail page

### ExploreEmotionDetail Component
- Displays full emotion content
- Renders all sections (hero, summary, relatable, tips, etc.)
- Shows related categories as linked cards

### Dynamic Routing
- Route: `/explore/i-feel-:emotionSlug`
- Lookup: `emotionContentLibrary.find(e => e.slug === emotionSlug)`
- Fallback: 404 if emotion not found

---

## Maintenance & Updates

### Adding New Content
1. Add emotion object to `emotionContentLibrary` array
2. Follow identical structure (all 11 sections required)
3. Update sitemap.xml
4. Redeploy frontend

### Editing Existing Content
1. Edit the emotion object in emotionContentLibrary.ts
2. No database migration needed (static data)
3. Redeploy frontend

### Localizing Content
1. Create `emotionContentLibrary.es.ts`, `.fr.ts`, etc.
2. Wire language switcher to correct file
3. Same structure, translated content

---

## SEO Compliance Checklist

- ✅ Metadata: title, description, keywords
- ✅ Schema: FAQ, breadcrumb, structured data ready
- ✅ Internal linking: 5 related categories per emotion
- ✅ Keyword targeting: long-tail searches
- ✅ No duplicate content: all original
- ✅ Canonical URLs: ready for implementation
- ✅ Accessibility: semantic HTML, ARIA labels ready
- ✅ Mobile-friendly: responsive text lengths
- ✅ Page speed: JSON data (no API calls needed)

---

## Analytics & Monitoring

### Track These Metrics
- Page views per emotion
- Bounce rate per emotion
- Time on page
- Click-through to related emotions
- Search queries leading to each emotion

### Signals for Content Update
- High bounce rate (content mismatch)
- Low engagement (content too dry)
- Low search impressions (SEO issue)
- User feedback (via comment/survey)

---

## Trust & Safety

All content includes:
- ✅ Professional help disclaimer
- ✅ Crisis helpline reference where appropriate
- ✅ No self-diagnosis encouragement
- ✅ Last reviewed date for medical accuracy
- ✅ Clear boundaries on AI limitations

---

## Last Updated

**Date:** 2026-02-15  
**By:** Claude Code  
**Status:** Complete & Production Ready  
**Next:** Frontend integration & localhost testing
