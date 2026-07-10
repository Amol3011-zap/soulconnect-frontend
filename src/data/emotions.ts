/**
 * emotions.ts - SoulConnect Emotion Library Configuration
 *
 * Defines all 25 emotional challenges/life struggles supported by SoulConnect.
 * Each emotion includes SEO metadata, color theming, and descriptions.
 *
 * Used by:
 * - Frontend routing and UI (/explore/{slug})
 * - Backend matching algorithm
 * - Static page prerendering for SEO
 * - Social media previews
 */

export interface Emotion {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  image: string;
  color: string;
  displayName: string;
  shortDescription: string;
}

export const emotions: Emotion[] = [
  {
    slug: 'anxiety',
    title: 'Anxiety Support Community | Connect & Heal',
    description: 'Find peer support for anxiety, panic attacks, and worry. Connect with people experiencing similar struggles and discover evidence-based coping strategies on SoulConnect.',
    keywords: ['anxiety support', 'anxiety disorder', 'manage anxiety', 'anxiety help', 'stress relief'],
    image: '/og/anxiety.jpg',
    color: '#7C3AED',
    displayName: 'Anxiety',
    shortDescription: 'Support for worry, panic, and anxious thoughts'
  },
  {
    slug: 'depression',
    title: 'Depression Support & Peer Counseling | SoulConnect',
    description: 'Connect with others experiencing depression. Access peer support, healing resources, and verified therapists to help you through depressive episodes on SoulConnect.',
    keywords: ['depression support', 'depression help', 'manage depression', 'depression treatment', 'mental health'],
    image: '/og/depression.jpg',
    color: '#8B5CF6',
    displayName: 'Depression',
    shortDescription: 'Help for sadness, hopelessness, and low mood'
  },
  {
    slug: 'grief',
    title: 'Grief Support & Loss Counseling | Healing Community',
    description: 'Navigate grief and loss with compassionate peer support. Share your feelings about losing a loved one and heal together with others who understand your pain.',
    keywords: ['grief support', 'bereavement counseling', 'loss support', 'death of loved one', 'grief healing'],
    image: '/og/grief.jpg',
    color: '#A855F7',
    displayName: 'Grief & Loss',
    shortDescription: 'Support for loss, bereavement, and mourning'
  },
  {
    slug: 'stress',
    title: 'Stress Management & Relief | Peer Support Platform',
    description: 'Manage overwhelming stress with peer support and coping techniques. Connect with others facing similar pressures and find sustainable relief strategies.',
    keywords: ['stress management', 'stress relief', 'cope with stress', 'stress support', 'anxiety management'],
    image: '/og/stress.jpg',
    color: '#A855F7',
    displayName: 'Stress',
    shortDescription: 'Help managing pressure and overwhelming situations'
  },
  {
    slug: 'loneliness',
    title: 'Loneliness Support & Social Connection | SoulConnect',
    description: 'Combat loneliness with a supportive peer community. Find meaningful connections and discover ways to build lasting relationships and combat social isolation.',
    keywords: ['loneliness support', 'social isolation', 'connect with others', 'overcome loneliness', 'make friends'],
    image: '/og/loneliness.jpg',
    color: '#7C3AED',
    displayName: 'Loneliness',
    shortDescription: 'Connection for feeling isolated or alone'
  },
  {
    slug: 'anger',
    title: 'Anger Management Support & Emotional Control | SoulConnect',
    description: 'Develop healthy ways to manage anger and frustration. Connect with peers and learn evidence-based techniques for emotional regulation and impulse control.',
    keywords: ['anger management', 'control anger', 'anger support', 'emotional regulation', 'frustration management'],
    image: '/og/anger.jpg',
    color: '#EC4899',
    displayName: 'Anger',
    shortDescription: 'Tools for managing anger and frustration'
  },
  {
    slug: 'self-doubt',
    title: 'Self-Doubt Support & Confidence Building | Peer Help',
    description: 'Overcome self-doubt and build confidence with peer support. Connect with others and develop a healthier relationship with self-esteem.',
    keywords: ['self-doubt support', 'lack of confidence', 'build confidence', 'self-esteem', 'self-worth'],
    image: '/og/self-doubt.jpg',
    color: '#8B5CF6',
    displayName: 'Self-Doubt',
    shortDescription: 'Rebuilding confidence and self-esteem'
  },
  {
    slug: 'relationship-issues',
    title: 'Relationship Support & Communication Help | SoulConnect',
    description: 'Improve relationships with peer guidance and communication strategies. Connect with others navigating similar challenges in marriage, dating, or partnerships.',
    keywords: ['relationship support', 'marriage counseling', 'dating advice', 'communication skills', 'relationship help'],
    image: '/og/relationship-issues.jpg',
    color: '#EC4899',
    displayName: 'Relationship Issues',
    shortDescription: 'Help with dating, marriage, and partnerships'
  },
  {
    slug: 'work-stress',
    title: 'Work Stress & Career Support | Professional Wellness',
    description: 'Manage work-related stress and career challenges. Find peer support from professionals dealing with similar workplace issues and burnout.',
    keywords: ['work stress', 'job stress', 'career support', 'workplace anxiety', 'professional stress'],
    image: '/og/work-stress.jpg',
    color: '#F97316',
    displayName: 'Work Stress',
    shortDescription: 'Support for job pressure and career challenges'
  },
  {
    slug: 'financial-worry',
    title: 'Financial Stress Support & Money Anxiety Help | SoulConnect',
    description: 'Manage financial anxiety and money worries with peer support. Connect with others navigating debt, savings, and economic stress.',
    keywords: ['financial stress', 'money anxiety', 'financial help', 'debt support', 'money management'],
    image: '/og/financial-worry.jpg',
    color: '#10B981',
    displayName: 'Financial Worry',
    shortDescription: 'Help with money stress and financial anxiety'
  },
  {
    slug: 'sleep-issues',
    title: 'Sleep Support & Insomnia Help | Better Sleep Community',
    description: 'Overcome insomnia and sleep problems with peer support. Discover sleep strategies and connect with others dealing with rest disturbances.',
    keywords: ['sleep support', 'insomnia help', 'sleep problems', 'sleep anxiety', 'sleep disorders'],
    image: '/og/sleep-issues.jpg',
    color: '#06B6D4',
    displayName: 'Sleep Issues',
    shortDescription: 'Support for insomnia and sleep disturbances'
  },
  {
    slug: 'panic-attacks',
    title: 'Panic Attack Support & Management | SoulConnect',
    description: 'Learn to manage panic attacks with peer support and coping strategies. Connect with others who understand the fear and physical symptoms of panic.',
    keywords: ['panic attacks', 'panic disorder', 'panic support', 'anxiety attacks', 'cope with panic'],
    image: '/og/panic-attacks.jpg',
    color: '#EF4444',
    displayName: 'Panic Attacks',
    shortDescription: 'Help managing panic disorder and attacks'
  },
  {
    slug: 'social-anxiety',
    title: 'Social Anxiety Support & Confidence | Peer Community',
    description: 'Overcome social anxiety with supportive peers. Connect with others who fear social situations and learn gradual exposure techniques together.',
    keywords: ['social anxiety', 'social phobia', 'anxiety in social situations', 'shyness support', 'social confidence'],
    image: '/og/social-anxiety.jpg',
    color: '#7C3AED',
    displayName: 'Social Anxiety',
    shortDescription: 'Support for fear of social situations'
  },
  {
    slug: 'perfectionism',
    title: 'Perfectionism Support & Balance | Breaking Free',
    description: 'Overcome perfectionism and achieve balance. Connect with peers and learn to embrace imperfection and self-compassion.',
    keywords: ['perfectionism support', 'perfectionist tendencies', 'performance anxiety', 'self-compassion', 'overcomplexity'],
    image: '/og/perfectionism.jpg',
    color: '#3B82F6',
    displayName: 'Perfectionism',
    shortDescription: 'Help releasing impossible standards'
  },
  {
    slug: 'overwhelm',
    title: 'Overwhelm Support & Coping Strategies | SoulConnect',
    description: 'Manage feeling overwhelmed with practical peer support. Learn to prioritize and regain control when everything feels like too much.',
    keywords: ['overwhelm support', 'feel overwhelmed', 'stress management', 'coping strategies', 'too much pressure'],
    image: '/og/overwhelm.jpg',
    color: '#F59E0B',
    displayName: 'Overwhelm',
    shortDescription: 'Help when everything feels like too much'
  },
  {
    slug: 'low-self-esteem',
    title: 'Low Self-Esteem Support & Confidence Building | SoulConnect',
    description: 'Build self-esteem with peer support and evidence-based strategies. Connect with others working on self-worth and positive self-image.',
    keywords: ['low self-esteem', 'build self-esteem', 'self-worth', 'confidence building', 'self-image'],
    image: '/og/low-self-esteem.jpg',
    color: '#8B5CF6',
    displayName: 'Low Self-Esteem',
    shortDescription: 'Help developing a healthier sense of self'
  },
  {
    slug: 'burnout',
    title: 'Burnout Recovery & Prevention | Wellness Support',
    description: 'Recover from professional burnout with peer guidance. Learn sustainable recovery strategies and reconnect with purpose and energy.',
    keywords: ['burnout support', 'burnout recovery', 'work exhaustion', 'prevent burnout', 'emotional exhaustion'],
    image: '/og/burnout.jpg',
    color: '#F59E0B',
    displayName: 'Burnout',
    shortDescription: 'Recovery from physical and emotional exhaustion'
  },
  {
    slug: 'jealousy',
    title: 'Jealousy Support & Secure Attachment | SoulConnect',
    description: 'Manage jealousy in relationships with peer support. Learn to address insecurity and build trust with compassion.',
    keywords: ['jealousy support', 'manage jealousy', 'relationship jealousy', 'insecurity', 'trust in relationships'],
    image: '/og/jealousy.jpg',
    color: '#EC4899',
    displayName: 'Jealousy',
    shortDescription: 'Help managing jealousy and insecurity'
  },
  {
    slug: 'guilt',
    title: 'Guilt Support & Emotional Processing | Healing',
    description: 'Process guilt and regret with compassionate peer support. Learn to forgive yourself and move forward with healing.',
    keywords: ['guilt support', 'manage guilt', 'emotional guilt', 'forgive yourself', 'guilt processing'],
    image: '/og/guilt.jpg',
    color: '#8B5CF6',
    displayName: 'Guilt',
    shortDescription: 'Help processing guilt and regret'
  },
  {
    slug: 'shame',
    title: 'Shame Support & Self-Compassion | SoulConnect',
    description: 'Overcome shame with peer support and self-compassion strategies. Connect with others and heal from shame-based thinking patterns.',
    keywords: ['shame support', 'manage shame', 'shame resilience', 'self-compassion', 'shame healing'],
    image: '/og/shame.jpg',
    color: '#7C3AED',
    displayName: 'Shame',
    shortDescription: 'Help overcoming shame and self-criticism'
  },
  {
    slug: 'trauma',
    title: 'Trauma Support & PTSD Help | Healing Community',
    description: 'Process trauma with supportive peers and professional guidance. Connect with others on healing journeys and access verified trauma-informed therapists.',
    keywords: ['trauma support', 'PTSD help', 'trauma healing', 'post-traumatic stress', 'trauma recovery'],
    image: '/og/trauma.jpg',
    color: '#EF4444',
    displayName: 'Trauma & PTSD',
    shortDescription: 'Support for past trauma and PTSD'
  },
  {
    slug: 'addiction',
    title: 'Addiction Support & Recovery | Peer Community',
    description: 'Find peer support for addiction recovery. Connect with others in recovery journeys and access verified addiction counselors and support resources.',
    keywords: ['addiction support', 'addiction recovery', 'substance abuse help', 'recovery community', 'rehab support'],
    image: '/og/addiction.jpg',
    color: '#06B6D4',
    displayName: 'Addiction',
    shortDescription: 'Help with substance and behavioral addictions'
  },
  {
    slug: 'imposter-syndrome',
    title: 'Imposter Syndrome Support & Confidence | Career Help',
    description: 'Overcome imposter syndrome with peer validation and strategies. Connect with high-achievers sharing similar self-doubt despite their success.',
    keywords: ['imposter syndrome', 'imposter feelings', 'overcome self-doubt', 'career confidence', 'achievement anxiety'],
    image: '/og/imposter-syndrome.jpg',
    color: '#3B82F6',
    displayName: 'Imposter Syndrome',
    shortDescription: 'Help recognizing your accomplishments'
  },
  {
    slug: 'purpose-meaning',
    title: 'Life Purpose & Meaning Support | Wellness Community',
    description: 'Discover life purpose and meaning with peer exploration. Connect with others seeking direction and fulfillment in their lives.',
    keywords: ['life purpose', 'find meaning', 'existential questions', 'life direction', 'personal fulfillment'],
    image: '/og/purpose-meaning.jpg',
    color: '#06B6D4',
    displayName: 'Purpose & Meaning',
    shortDescription: 'Support finding direction and life meaning'
  }
];

/**
 * Helper functions for emotion lookup
 */

export const getEmotionBySlug = (slug: string): Emotion | undefined => {
  return emotions.find((e) => e.slug === slug);
};

export const getEmotionsByCategory = (category: string): Emotion[] => {
  const categories: Record<string, string[]> = {
    mental_health: ['anxiety', 'depression', 'panic-attacks', 'social-anxiety'],
    relationships: ['relationship-issues', 'breakup', 'jealousy'],
    loss: ['grief', 'guilt', 'shame'],
    wellness: ['sleep-issues', 'stress', 'burnout', 'overwhelm'],
    self_image: ['body-image', 'low-self-esteem', 'self-doubt', 'imposter-syndrome'],
    life_meaning: ['purpose-meaning'],
  };

  return emotions.filter((e) => categories[category]?.includes(e.slug));
};

export const getAllEmotionSlugs = (): string[] => {
  return emotions.map((e) => e.slug);
};

/**
 * TypeScript type for React components
 */
export type EmotionSlug = typeof emotions[number]['slug'];

export default emotions;
