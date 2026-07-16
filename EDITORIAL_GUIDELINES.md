# Editorial Guidelines: Emotion Library Content

**Version:** 1.0  
**Last Updated:** 2026-02-15  
**Status:** Production Approved

---

## Tone & Voice

The Emotion Library speaks in **SoulConnect's premium voice**:

### DO
✅ Be compassionate and validating  
✅ Use "you" language (make it personal)  
✅ Tell human stories with real struggles  
✅ Normalize experiences ("everyone feels this")  
✅ Offer practical, small-step solutions  
✅ Acknowledge complexity ("it's not always linear")  
✅ Point to professional help when needed  
✅ Use concrete examples over theory  

### DON'T
❌ Use clinical or medical jargon  
❌ Diagnose or prescribe  
❌ Catastrophize or use fear-based language  
❌ Minimize struggles ("just think positive")  
❌ Pretend you understand everything  
❌ Make generic statements  
❌ Copy from other websites  
❌ Be preachy or judgmental  

### Example

**Wrong:**
"Anxiety disorder is characterized by persistent worry and fear responses that interfere with daily functioning. Treatment options include cognitive-behavioral therapy or anxiolytic medication."

**Right:**
"Anxiety is when your mind races with 'what if' thoughts that feel unbearable. It's normal—everyone feels it sometimes. The challenge is when worry takes over your life."

---

## Content Structure Standards

### 1. SEO Metadata
- **Title:** 60 chars max, includes keyword, speaks to user need
- **Description:** 160 chars max, compelling and specific
- **Keywords:** 3-5 long-tail keywords (e.g., "why do I feel anxious?" not "anxiety")

### 2. Hero Section
- **Title:** Short, relatable question or statement
- **Subtitle:** Normalizes the feeling + offers hope

### 3. Summary (120 words max)
- Plain language (8th-grade reading level)
- No jargon or medical terms
- Explain what it is, why it matters, why it's treatable
- End on hope

### 4. Relatable Experiences (8 items)
- Specific, concrete descriptions
- Start with "You feel..." or "You..."
- Cover physical, emotional, behavioral signs
- Diverse life situations
- User should think: "That's exactly how I feel"

### 5. Common Situations (8 items)
- Realistic triggers or contexts
- Diverse scenarios (work, relationships, health, loss, etc.)
- Avoid medical diagnosis language
- Acknowledge complexity ("can happen to anyone")

### 6. Practical Tips (8 items)
- Immediately actionable (can do today)
- Mix quick wins + deeper work
- Realistic, not toxic positivity
- Include "seek professional help" hint in tone

### 7. Reflection Questions (5 items)
- Encourage self-discovery
- Not yes/no questions
- Invite honesty and introspection
- Examples: "When did...", "What...", "How would...", "Who..."

### 8. Anonymous Stories (3 items)
- Real-sounding scenarios
- Diverse backgrounds, ages, contexts
- Show struggle + small progress
- Under 150 words each
- Relatable (not exceptional)

### 9. When to Seek Support
- Compassionate, not scary
- Clear triggers: persistent, impacting life, thoughts of harm
- Normalize seeking help
- Specific: therapy, crisis line, ER if needed

### 10. Related Categories (5 items)
- Semantically related emotions
- Create topic clusters
- Consider both "causes" and "results"
- Enable internal linking structure

### 11. FAQ (8 items)
- Address common misconceptions
- Practical questions users actually ask
- Normalize the experience
- Point to resources when needed

---

## Writing Standards

### Clarity
- Use short sentences (10-15 words)
- One idea per sentence
- Active voice when possible
- Define any potentially unclear term

### Accessibility
- 8th-grade reading level (aim for ~50 Flesch Reading Ease)
- No medical jargon without explanation
- Use "I/you/we" not "one"
- Bold key points

### Inclusivity
- Diverse pronouns (she/he/they)
- Multiple cultures represented
- Various socioeconomic contexts
- LGBTQ+ friendly language
- Age range from teens to seniors

### Accuracy
- No medical claims
- No diagnosis language
- Facts from credible sources (WHO, NHS, APA)
- Nothing contradicted by science
- Always suggest professional evaluation

---

## Prohibited Content

### NEVER include:
❌ Medical diagnosis ("You have anxiety disorder")  
❌ Prescription recommendations ("Try SSRIs")  
❌ Fear-mongering ("This will ruin your life")  
❌ Toxic positivity ("Just think positive!")  
❌ Moral judgments ("You shouldn't feel angry")  
❌ Comparison to "normal" ("You're abnormal")  
❌ Diet/supplement sales ("Try our supplement")  
❌ Pseudoscience ("Chakra alignment will heal you")  
❌ Guarantees ("You'll feel better in 2 weeks")  

---

## Validation Checklist

Before publishing/updating an emotion:

### Content Quality
- [ ] Summary is ≤120 words
- [ ] All 8 relatable experiences feel authentic
- [ ] Tips are actionable today
- [ ] Stories are diverse and relatable
- [ ] 8 FAQs address real questions
- [ ] "When to seek support" is compassionate

### Accuracy
- [ ] No medical diagnoses
- [ ] No medication recommendations
- [ ] No pseudoscience
- [ ] Information aligns with WHO/NHS/APA guidance
- [ ] Professional help suggested appropriately

### Tone
- [ ] Compassionate, not clinical
- [ ] Validating, not minimizing
- [ ] Hopeful, not catastrophic
- [ ] Relatable, not condescending
- [ ] Practical, not theoretical

### SEO
- [ ] Title under 60 chars
- [ ] Description under 160 chars
- [ ] 3-5 long-tail keywords
- [ ] Related categories are semantically sound
- [ ] Ready for canonicalization

### Accessibility
- [ ] Readable at 8th-grade level
- [ ] No unexplained jargon
- [ ] First person language ("You feel...")
- [ ] Diverse examples and stories

---

## Brand Voice Examples

### Anxiety
**Our voice:**
"Anxiety is your mind's way of preparing you for potential threats. When it becomes constant, it can be exhausting. You're not alone."

### Perfectionism
**Our voice:**
"Perfectionism is the relentless pursuit of flawlessness. It feels protective but actually limits you. Progress beats perfection every time."

### Grief
**Our voice:**
"Grief is the price of love. There's no 'right way' to grieve. Your loss is real, your pain is valid, and healing is possible."

---

## Updating Existing Content

When updating an emotion's content:

1. **Verify source:** Is the information still accurate per current research?
2. **Check stories:** Are they still relatable to users today?
3. **Review FAQ:** Do these address current user questions?
4. **Update date:** Change `lastReviewedDate` to today
5. **Test tone:** Does it still feel like SoulConnect?

---

## Adding New Emotions

To add a new emotion to the library:

1. Create emotion object following template in `emotionContentLibrary.ts`
2. Fill all 11 required sections
3. Identify 5 `relatedCategories` from existing emotions
4. Add reciprocal links: update existing emotions to reference the new one
5. Test in frontend: verify rendering, links work
6. Update sitemap.xml with new emotion URL
7. Update this guidelines doc if needed

---

## Legal & Safety

### Medical Disclaimer (Required)
Every emotion must include a professional help disclaimer. Standard language:

"This content is educational and not a substitute for professional mental health care. If you're [experiencing severe symptoms/having thoughts of self-harm/in crisis], contact a mental health professional, crisis helpline, or emergency services immediately."

### When to Escalate Disclaimer
If content addresses: suicide, self-harm, severe depression, psychosis, abuse

Add specific language: "If you're having thoughts of suicide, call [local helpline] or go to your nearest emergency room."

### Review Date
Update `lastReviewedDate` annually to maintain medical accuracy.

---

## Accessibility Standards

### HTML/Semantic
- Proper heading hierarchy (h1 > h2 > h3)
- Semantic tags (`<article>`, `<section>`, `<aside>`)
- ARIA labels where needed
- Alt text on images

### Reading Level
- Test with Flesch Reading Ease
- Aim for 50-60 (readable for general public)
- No content above 60 (too advanced)

### Color & Contrast
- WCAG AAA contrast (7:1 minimum)
- Don't rely on color alone to convey meaning
- Test with accessibility checker

---

## Template: New Emotion Structure

```typescript
{
  slug: 'emotion-name',
  displayName: 'Emotion Name',
  seo: {
    title: 'Title | Subheader (60 chars max)',
    description: 'Compelling 160-char description that speaks to user need',
    openGraph: {
      title: 'Social preview title',
      description: 'Social preview description'
    },
    keywords: ['keyword1', 'keyword2', 'keyword3', 'keyword4', 'keyword5']
  },
  hero: {
    title: 'Relatable question or statement?',
    subtitle: 'Normalize + offer hope. One sentence.'
  },
  summary: 'Plain language explanation. 100-120 words. Why it matters. Treatable. Hope.',
  relatable: [
    'You feel/experience X...',
    // 7 more items
  ],
  situations: [
    'Common trigger or situation',
    // 7 more items
  ],
  tips: [
    'Actionable, specific suggestion',
    // 7 more items
  ],
  reflectionQuestions: [
    'Open-ended question',
    // 4 more items
  ],
  stories: [
    { title: 'Story Name', content: 'Real-sounding narrative 50-150 words' },
    // 2 more stories
  ],
  whenToSeekSupport: 'Compassionate description of when professional help is needed.',
  relatedCategories: ['slug1', 'slug2', 'slug3', 'slug4', 'slug5'],
  faq: [
    { question: 'Question users ask?', answer: 'Practical, validating answer' },
    // 7 more Q&A
  ],
  trustSafety: {
    disclaimer: 'This content is educational...',
    lastReviewedDate: '2026-02-15'
  }
}
```

---

## Review Process

### Self-Review (Author)
- [ ] Read aloud for tone/flow
- [ ] Check all templates followed
- [ ] Verify no prohibited content
- [ ] Run accessibility check

### Editor Review
- [ ] Tone matches SoulConnect
- [ ] Accuracy verified
- [ ] All sections complete
- [ ] SEO optimized

### Legal Review (for medical content)
- [ ] No diagnoses
- [ ] No prescriptions
- [ ] Appropriate disclaimers
- [ ] Trauma-informed language

---

## Last Updated

**Date:** 2026-02-15  
**Next Review:** 2026-08-15 (6-month audit)  
**Owner:** SoulConnect Editorial Team
