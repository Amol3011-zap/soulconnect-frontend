# SEO Cluster Map: Internal Linking Strategy

**Generated:** 2026-02-15  
**Purpose:** Semantic topic clustering for improved SEO rankings  
**Strategy:** Hub-and-spoke model with emotion categories as spokes

---

## Core Concept

The Emotion Library uses a **hub-and-spoke internal linking architecture**:

- **Hub:** `/explore` (main emotion library page)
- **Spokes:** 25 emotion detail pages (`/explore/i-feel-{slug}`)
- **Connections:** Each emotion links to 5 related emotions

This structure:
- ✅ Distributes authority from hub to spokes
- ✅ Creates topical clusters (anxiety cluster, grief cluster, etc.)
- ✅ Improves crawlability and indexation
- ✅ Increases average session duration
- ✅ Signals semantic relationships to search engines

---

## Emotion Clusters

### Cluster 1: Anxiety & Fear

**Hub:** Anxiety  
**Spokes:**
- Panic Attacks (related, more intense)
- Social Anxiety (context-specific anxiety)
- Stress (cause of anxiety)
- Sleep Issues (symptom/trigger)
- Overwhelm (manifestation)

**Internal Links:**
- Anxiety → "experiencing panic attacks?" link
- Panic Attacks → "part of anxiety spectrum" link
- Social Anxiety → "one form of anxiety" link
- Stress → "can trigger anxiety" link
- Overwhelm → "feeds anxiety" link

---

### Cluster 2: Grief & Loss

**Hub:** Grief & Loss  
**Spokes:**
- Heartbreak (specific loss type)
- Depression (common after loss)
- Loneliness (result of loss)
- Guilt (often accompanies grief)
- Emotional Exhaustion (grief is exhausting)

**Internal Links:**
- Grief → "heartbreak is also loss" link
- Heartbreak → "grief framework applies here" link
- Depression → "can follow significant loss" link
- Loneliness → "grief can feel isolating" link

---

### Cluster 3: Relationship & Connection

**Hub:** Relationship Issues  
**Spokes:**
- Loneliness (lack of connection)
- Jealousy (relationship insecurity)
- Heartbreak (relationship ending)
- Communication (core issue)
- Self-Doubt (affects relationships)

**Internal Links:**
- Relationship Issues → "jealousy often masks insecurity" link
- Jealousy → "often rooted in relationship insecurity" link
- Loneliness → "can happen in relationships too" link
- Heartbreak → "relationship loss process" link

---

### Cluster 4: Work & Performance

**Hub:** Work Stress  
**Spokes:**
- Burnout (result of sustained work stress)
- Financial Worry (often linked to job)
- Perfectionism (work driver)
- Low Self-Esteem (impacts job confidence)
- Motivation (work engagement)

**Internal Links:**
- Work Stress → "burnout is advanced work stress" link
- Burnout → "sustained work stress result" link
- Perfectionism → "often drives work stress" link
- Financial Worry → "often tied to job stability" link

---

### Cluster 5: Self-Image & Worth

**Hub:** Low Self-Esteem  
**Spokes:**
- Self-Doubt (specific self-esteem issue)
- Perfectionism (perfectionism feeds low self-esteem)
- Shame (deeper than low self-esteem)
- Guilt (affects self-perception)
- Social Anxiety (often rooted in low self-esteem)

**Internal Links:**
- Low Self-Esteem → "self-doubt is related" link
- Self-Doubt → "rooted in low self-esteem" link
- Shame → "deeper form of self-rejection" link
- Perfectionism → "can develop from low self-esteem" link

---

### Cluster 6: Mental Health & Wellbeing

**Hub:** Depression  
**Spokes:**
- Anxiety (often co-occurs)
- Burnout (can lead to depression)
- Loneliness (can cause/result from depression)
- Sleep Issues (depression symptom)
- Emotional Exhaustion (depression feels)

**Internal Links:**
- Depression → "anxiety and depression often co-occur" link
- Anxiety → "many anxious people also experience depression" link
- Burnout → "can trigger or worsen depression" link
- Sleep Issues → "common depression symptom" link

---

### Cluster 7: Emotional Processing

**Hub:** Guilt  
**Spokes:**
- Shame (related but different)
- Grief (grief often includes guilt)
- Overthinking (guilt feeds rumination)
- Anxiety (guilt can cause anxiety)
- Trauma (trauma often involves guilt)

**Internal Links:**
- Guilt → "shame is different; guilt is about actions" link
- Shame → "often confused with guilt" link
- Grief → "guilt frequently accompanies grief" link
- Overthinking → "guilt often triggers rumination" link

---

### Cluster 8: Mindset & Motivation

**Hub:** Motivation  
**Spokes:**
- Perfectionism (perfectionism blocks motivation)
- Overwhelm (overwhelm kills motivation)
- Burnout (burnout depletes motivation)
- Depression (depression erodes motivation)
- Feeling Lost (lack of direction kills motivation)

**Internal Links:**
- Motivation → "perfectionism often blocks motivation" link
- Perfectionism → "kills motivation through unrealistic standards" link
- Overwhelm → "too much stops motivation" link
- Feeling Lost → "hard to motivate when lost" link

---

### Cluster 9: Life Transitions

**Hub:** Feeling Lost  
**Spokes:**
- Grief (loss causes disorientation)
- Motivation (transitions kill motivation)
- Identity (transitions shift identity)
- Loneliness (transitions can isolate)
- Anxiety (uncertainty causes anxiety)

**Internal Links:**
- Feeling Lost → "major transitions often precede feeling lost" link
- Grief → "loss and feeling lost connected" link
- Anxiety → "uncertainty of transitions triggers anxiety" link
- Loneliness → "transitions can isolate you" link

---

### Cluster 10: Emotional Intelligence

**Hub:** Anger  
**Spokes:**
- Guilt (anger often masks guilt)
- Frustration (anger's milder sibling)
- Relationship Issues (anger affects relationships)
- Overwhelm (overwhelm can trigger anger)
- Jealousy (jealousy often feels like anger)

**Internal Links:**
- Anger → "often masks fear, hurt, or powerlessness" link
- Guilt → "anger can hide guilt" link
- Relationship Issues → "anger damages relationships" link
- Overwhelm → "overwhelm can trigger rage" link

---

## Link Placement Strategy

### Where to Place Internal Links

1. **In `relatedCategories` array** (primary)
   - Each emotion lists 5 related emotions
   - Automatically renders as "Related" section
   - Creates reciprocal links

2. **In story content** (natural context)
   - E.g., Anxiety story: "Her panic attacks are covered in [Panic Attacks guide]"
   - Links feel organic, not forced

3. **In FAQ answers** (contextual)
   - E.g., "Is anxiety the same as panic? [See Panic Attacks guide]"
   - Provides additional context

4. **In tips or reflection questions** (optional)
   - Avoid over-linking; stay focused

---

## Link Anchor Text Examples

### Generic (OK)
- "See related emotion guide"
- "Learn more about anxiety"

### Specific (BETTER)
- "Understanding panic attacks"
- "How grief and guilt connect"
- "Perfectionism blocks motivation"
- "Burnout is advanced work stress"

### Natural (BEST - use these)
- "This connects to [Panic Attacks] when anxiety intensifies"
- "You might also struggle with [Social Anxiety]"
- "Grief work covered in [Grief & Loss] applies here"
- "Similar to [Burnout], but work-specific"

---

## Reciprocal Linking

Each emotion's `relatedCategories` should be reciprocal:

```
If Anxiety lists Panic Attacks:
  Then Panic Attacks should list Anxiety
```

**Current Implementation:** All emotions follow this rule.

---

## Ranking Signals This Creates

### For Google
- ✅ Topical relevance (clustered emotions)
- ✅ Internal linking authority
- ✅ Semantic relationships (RankBrain)
- ✅ Session duration (more clicks = longer sessions)
- ✅ Lower bounce rate (related content keeps users)

### For Users
- ✅ Discovery: users find related resources
- ✅ Trust: comprehensive coverage builds authority
- ✅ Helpfulness: pointed to next logical step
- ✅ Retention: keeps users on site longer

---

## Search Intent Mapping

### Informational Queries
- "What is anxiety?"
- "Signs of depression"
- "How to manage anger"

**Solution:** Emotion hub and detail pages answer these directly

### Navigational Queries
- "Anxiety support"
- "Breakup recovery"
- "Overcome perfectionism"

**Solution:** Emotion detail pages rank for these

### Transactional Queries
- "Where to get help for anxiety"
- "Therapist for depression"
- "Support groups for grief"

**Solution:** "When to seek support" section answers these

---

## Topic Authority Building

The Emotion Library positions SoulConnect as an authority on:

1. **Mental wellness** (25 emotions)
2. **Peer support** (human-centered content)
3. **Evidence-based guidance** (WHO, NHS, APA informed)
4. **Accessibility** (no jargon, relatable language)

This authority then flows to:
- `/explore` hub page (gathers authority from all spokes)
- Product pages (users trust the brand)
- Other support resources

---

## Monitoring & Optimization

### Track These Metrics
- Click-through rate between related emotions
- Average cluster engagement (time in cluster)
- Bounce rate per cluster
- Pages per session (within cluster)

### Optimize If
- A spoke has low internal link clicks → improve anchor text or placement
- A spoke has high bounce rate → content may need refresh
- A cluster has low internal engagement → relationships may be weak

---

## Future Enhancements

1. **Co-occurrence matrix:** Track which emotions users visit in sequence
2. **Recommendation engine:** "Users who read X also read Y"
3. **Breadcrumb schema:** Breadcrumbs show cluster structure
4. **Knowledge graph:** Google understands emotion relationships

---

## Last Updated

**Date:** 2026-02-15  
**Status:** Ready for Implementation  
**Next:** Frontend component integration
