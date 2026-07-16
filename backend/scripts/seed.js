import { query } from '../src/db/connection.js';
import bcrypt from 'bcrypt';

const CATEGORIES = [
  { name: 'Anxiety', slug: 'anxiety', icon: 'brain', color: '#7C3AED' },
  { name: 'Depression', slug: 'depression', icon: 'cloud', color: '#8B5CF6' },
  { name: 'Grief', slug: 'grief', icon: 'heart', color: '#A855F7' },
  { name: 'Stress', slug: 'stress', icon: 'zap', color: '#D946EF' },
  { name: 'Loneliness', slug: 'loneliness', icon: 'user', color: '#EC4899' },
  { name: 'Anger', slug: 'anger', icon: 'flame', color: '#F43F5E' },
  { name: 'Self-Doubt', slug: 'self-doubt', icon: 'help-circle', color: '#F97316' },
  { name: 'Relationship Issues', slug: 'relationship-issues', icon: 'users', color: '#EAB308' },
  { name: 'Work Stress', slug: 'work-stress', icon: 'briefcase', color: '#84CC16' },
  { name: 'Financial Worry', slug: 'financial-worry', icon: 'wallet', color: '#22C55E' },
  { name: 'Sleep Issues', slug: 'sleep-issues', icon: 'moon', color: '#10B981' },
  { name: 'Panic Attacks', slug: 'panic-attacks', icon: 'alert-triangle', color: '#14B8A6' },
  { name: 'Social Anxiety', slug: 'social-anxiety', icon: 'users-x', color: '#06B6D4' },
  { name: 'Perfectionism', slug: 'perfectionism', icon: 'target', color: '#0EA5E9' },
  { name: 'Overwhelm', slug: 'overwhelm', icon: 'layers', color: '#3B82F6' },
  { name: 'Low Self-Esteem', slug: 'low-self-esteem', icon: 'thumbs-down', color: '#6366F1' },
  { name: 'Burnout', slug: 'burnout', icon: 'battery', color: '#8B5CF6' },
  { name: 'Jealousy', slug: 'jealousy', icon: 'eye', color: '#A78BFA' },
  { name: 'Guilt', slug: 'guilt', icon: 'frown', color: '#BFDBFE' },
  { name: 'Shame', slug: 'shame', icon: 'shield', color: '#DBEAFE' },
  { name: 'Trauma', slug: 'trauma', icon: 'alert-circle', color: '#FEE2E2' },
  { name: 'Addiction', slug: 'addiction', icon: 'prohibition', color: '#FCA5A5' },
  { name: 'Body Image', slug: 'body-image', icon: 'mirror', color: '#F87171' },
  { name: 'Imposter Syndrome', slug: 'imposter-syndrome', icon: 'mask', color: '#EF4444' },
  { name: 'Purpose & Meaning', slug: 'purpose-meaning', icon: 'compass', color: '#DC2626' },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // 1. Create admin user
    console.log('Creating users...');
    const passwordHash = await bcrypt.hash('admin123', 10);
    await query(
      `INSERT INTO users (email, password_hash, display_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@soulconnect.local', passwordHash, 'Admin User', 'admin', true]
    );

    const reviewerHash = await bcrypt.hash('reviewer123', 10);
    await query(
      `INSERT INTO users (email, password_hash, display_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['reviewer@soulconnect.local', reviewerHash, 'Medical Reviewer', 'reviewer', true]
    );

    // 2. Create categories
    console.log('Creating 25 emotion categories...');
    let displayOrder = 1;
    for (const cat of CATEGORIES) {
      await query(
        `INSERT INTO emotion_categories (name, slug, icon_name, color_hex, difficulty_level, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO NOTHING`,
        [cat.name, cat.slug, cat.icon, cat.color, 'beginner', displayOrder++, true]
      );
    }

    // 3. Create sample guide for Anxiety
    console.log('Creating sample guides...');
    const anxietyCategory = await query(
      'SELECT id FROM emotion_categories WHERE slug = $1',
      ['anxiety']
    );

    if (anxietyCategory.length > 0) {
      const categoryId = anxietyCategory[0].id;
      const admin = await query('SELECT id FROM users WHERE role = $1', ['admin']);
      const adminId = admin[0].id;

      const guideContent = {
        introduction: 'Anxiety is a natural response to stress...',
        what_is: 'Anxiety is characterized by persistent worry and tension...',
        why_feel: 'We feel anxiety when facing perceived threats...',
        management_strategies: [
          'Deep breathing exercises',
          'Progressive muscle relaxation',
          'Cognitive behavioral techniques',
          'Mindfulness meditation',
          'Physical exercise',
          'Social support',
          'Professional help',
        ],
        quick_tips: [
          'Take 5 deep breaths when anxious',
          'Practice grounding techniques',
          'Exercise regularly',
          'Limit caffeine intake',
          'Get adequate sleep',
          'Talk to someone',
          'Practice self-compassion',
          'Avoid avoidance',
        ],
      };

      await query(
        `INSERT INTO guides (category_id, title, slug, excerpt, meta_description, meta_keywords, seo_title, featured_image_url, author_id, content_json, status, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
         ON CONFLICT (slug) DO NOTHING`,
        [
          categoryId,
          'Anxiety Management - Evidence-Based Strategies',
          'anxiety-management',
          'Learn 7 evidence-based strategies to manage anxiety and find relief through proven techniques.',
          'Discover evidence-based strategies to manage anxiety, reduce worry, and find emotional balance.',
          'anxiety management, anxiety relief, coping strategies, mental health',
          'Anxiety Management - Evidence-Based Strategies | SoulConnect',
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500',
          adminId,
          JSON.stringify(guideContent),
          'published',
        ]
      );

      // Create SEO metadata for guide
      const guideId = await query('SELECT id FROM guides WHERE slug = $1', ['anxiety-management']);
      if (guideId.length > 0) {
        await query(
          `INSERT INTO seo_metadata (guide_id, page_type, og_title, og_description, og_image_url, twitter_card, canonical_url, structured_data)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            guideId[0].id,
            'guide',
            'Anxiety Management - Evidence-Based Strategies',
            'Discover evidence-based strategies to manage anxiety, reduce worry, and find emotional balance.',
            'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500',
            'summary_large_image',
            'https://soulconnect.health/guides/anxiety-management',
            JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: 'Anxiety Management - Evidence-Based Strategies',
              description: 'Learn evidence-based strategies to manage anxiety',
              publisher: { '@type': 'Organization', name: 'SoulConnect' },
            }),
          ]
        );
      }
    }

    console.log('\n✓ Database seed completed successfully!');
    console.log('✓ 25 emotion categories created');
    console.log('✓ Admin user: admin@soulconnect.local (password: admin123)');
    console.log('✓ Reviewer user: reviewer@soulconnect.local (password: reviewer123)');
    console.log('✓ Sample guide created for Anxiety\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
