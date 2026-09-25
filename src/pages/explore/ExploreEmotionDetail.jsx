import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Home, ArrowRight, Check, HeartHandshake, MessageCircle, Leaf, Users,
  Stethoscope, TriangleAlert, ShieldCheck, LifeBuoy, BookOpen,
} from 'lucide-react';
import emotionContentLibrary from '../../data/emotionContentLibrary';
import { getArticleBySlug } from '../../data/articles';

// Reverse of BlogDetail.jsx's ARTICLE_TO_EMOTION_SLUG map — light
// cross-linking from an emotion page to its one matching blog article,
// using the same category/tags relationship, not new content. Only the
// slug is hardcoded; the title is always read live from articles.js so
// the two can't drift out of sync.
const EMOTION_TO_ARTICLE_SLUG = {
  anxiety: 'anxiety-management-tips',
  depression: 'depression-treatment-support',
  grief: 'grief-support-healing',
  loneliness: 'overcoming-loneliness',
  burnout: 'burnout-recovery-strategies',
  'panic-attacks': 'panic-attacks-understanding',
  heartbreak: 'breakup-recovery-healing',
};

/* "Dawn" palette — same tokens as the landing page and Explore hub */
const P          = '#6B4FA0';
const DARK       = '#221B3A';
const NAVY_SOFT  = '#5B5470';
const MUTED      = '#6E6784';
const GOLD_TXT   = '#8A6A3E';
const CREAM      = '#FAF8FC';
const CREAM_2    = '#F3EFF9';
const LILAC_LINE = '#E6DDF3';
const SF = '"Playfair Display",Georgia,serif';
const F  = "'Plus Jakarta Sans',Inter,system-ui,sans-serif";
const PAGE_BG = `linear-gradient(180deg, ${CREAM_2} 0px, ${CREAM} 460px)`;

// Soft tinted gradient borders for the content cards (same family as the
// Explore hub cards): strongest at the top-left corner, fading out.
const EDGES = {
  lavender: { wash: '#F7F3FC', edge: ['#A992DA', '#DCD0F0', '#EFE9F8'], dot: '#8F77C5' },
  blush:    { wash: '#FEF6F1', edge: ['#E0A585', '#F3DACC', '#FAEEE7'], dot: '#C98A6B' },
  sea:      { wash: '#F1F8F4', edge: ['#86BBA2', '#D3E7DC', '#EAF3EE'], dot: '#3F7A5E' },
  gold:     { wash: '#FCF8F0', edge: ['#D6B27A', '#EEDFC4', '#F7F0E3'], dot: '#B08A52' },
};
const cardStyle = (tone) => {
  const t = EDGES[tone];
  return {
    marginBottom: '28px',
    padding: 'clamp(22px, 4vw, 34px)',
    border: '1.5px solid transparent',
    borderRadius: '20px',
    background: `linear-gradient(180deg, ${t.wash} 0%, #FFFFFF 90px) padding-box, linear-gradient(150deg, ${t.edge[0]} 0%, ${t.edge[1]} 45%, ${t.edge[2]} 100%) border-box`,
    boxShadow: '0 2px 14px rgba(34,27,58,0.035)',
  };
};
const H2 = { fontFamily: SF, fontSize: 'clamp(22px, 3vw, 27px)', fontWeight: 700, color: DARK, letterSpacing: '-0.015em', lineHeight: 1.25, margin: '0 0 18px 0' };

// A list row with a small coloured marker instead of a typed "•"
function Row({ children, tone = 'lavender', check = false }) {
  const c = EDGES[tone].dot;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
      {check ? (
        <span style={{ flexShrink: 0, marginTop: '2px', width: 20, height: 20, borderRadius: '50%', background: '#E3F0E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={12} strokeWidth={2.5} color="#2F5A45" />
        </span>
      ) : (
        <span style={{ flexShrink: 0, marginTop: '9px', width: 7, height: 7, borderRadius: '50%', background: c }} />
      )}
      <p style={{ fontSize: '15.5px', color: NAVY_SOFT, lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
  );
}

const css = `
  .xd-link{transition:color .15s;}
  .xd-link:hover{color:${P}!important;}
  .xd-chip{transition:background .2s,border-color .2s,transform .2s;}
  .xd-chip:hover{background:${CREAM_2}!important;border-color:#C9B8E8!important;transform:translateY(-1px);}
  .xd-btn-p{transition:background .2s,transform .2s;}
  .xd-btn-p:hover{background:#5A4190!important;transform:translateY(-1px);}
  .xd-btn-s{transition:background .2s,border-color .2s,transform .2s;}
  .xd-btn-s:hover{background:${CREAM_2}!important;border-color:#C9B8E8!important;transform:translateY(-1px);}
  .xd-read{transition:border-color .2s,box-shadow .2s;}
  .xd-read:hover{border-color:#C9B8E8!important;box-shadow:0 10px 24px rgba(107,79,160,0.10)!important;}
  button:focus-visible{outline:3px solid #C9B8E8;outline-offset:2px;}
  @media(max-width:640px){ .xd-h1{font-size:34px!important;} .xd-pad{padding-left:20px!important;padding-right:20px!important;} }
`;

export default function ExploreEmotionDetail() {
  const { emotionSlug } = useParams();
  const navigate = useNavigate();

  // Get emotion from static library
  const emotion = useMemo(() => {
    return emotionContentLibrary.find((e) => e.slug === emotionSlug);
  }, [emotionSlug]);

  const relatedArticleSlug = EMOTION_TO_ARTICLE_SLUG[emotionSlug];
  const relatedArticle = relatedArticleSlug ? getArticleBySlug(relatedArticleSlug) : null;

  // If emotion not found, redirect to /explore
  if (!emotion) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: PAGE_BG, fontFamily: F }}>
        <div style={{ textAlign: 'center', color: NAVY_SOFT }}>
          <p>Emotion not found</p>
          <button
            onClick={() => navigate('/explore')}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              background: '#FFFFFF',
              border: '1px solid #DCD0F0',
              color: P,
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG, fontFamily: F, color: DARK }}>
      <style>{css}</style>
      {/* Breadcrumb Navigation */}
      <div className="xd-pad" style={{ padding: '14px 32px', borderBottom: `1px solid ${LILAC_LINE}`, background: 'rgba(255,255,255,0.6)' }}>
        <nav aria-label="Breadcrumb" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: MUTED, flexWrap: 'wrap' }}>
          <button
            className="xd-link"
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: MUTED,
              cursor: 'pointer',
              padding: '6px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'inherit',
              fontSize: '13px',
            }}
          >
            <Home size={15} strokeWidth={1.75} />
            Home
          </button>
          <span aria-hidden="true" style={{ color: '#C9B8E8' }}>/</span>
          <button
            className="xd-link"
            onClick={() => navigate('/explore')}
            style={{
              background: 'none',
              border: 'none',
              color: MUTED,
              cursor: 'pointer',
              padding: '6px 0',
              fontFamily: 'inherit',
              fontSize: '13px',
            }}
          >
            Explore
          </button>
          <span aria-hidden="true" style={{ color: '#C9B8E8' }}>/</span>
          <span style={{ color: DARK, fontWeight: 600 }}>{emotion.displayName}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="xd-pad" style={{ padding: '44px 32px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="xd-link"
              onClick={() => navigate('/explore')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: MUTED,
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'inherit',
                marginBottom: '26px',
                padding: '6px 0',
              }}
            >
              <ArrowLeft size={17} strokeWidth={1.75} />
              Back to Explore
            </button>

            <p style={{ fontSize: '12px', fontWeight: 700, color: GOLD_TXT, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 14px' }}>
              Emotion Library · {emotion.displayName}
            </p>
            <h1 className="xd-h1" style={{ fontFamily: SF, fontSize: '46px', fontWeight: 700, color: DARK, letterSpacing: '-0.02em', lineHeight: 1.12, margin: '0 0 16px 0' }}>
              {emotion.hero.title}
            </h1>
            <p style={{ fontSize: '18px', color: NAVY_SOFT, margin: '0 0 8px 0', maxWidth: '700px', lineHeight: '1.65' }}>
              {emotion.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="xd-pad" style={{ padding: '8px 32px 72px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={cardStyle('lavender')}
          >
            <h2 style={H2}>
              {emotionSlug === 'self-doubt'
                ? 'What are self-doubt and low self-esteem?'
                : emotionSlug === 'relationship-issues'
                ? 'What are relationship issues?'
                : emotionSlug === 'financial-worry'
                ? 'What is financial stress?'
                : emotionSlug === 'sleep-issues'
                ? 'What are sleep issues?'
                : emotionSlug === 'panic-attacks'
                ? 'What are panic attacks?'
                : emotionSlug === 'jealousy'
                ? 'What is jealousy and insecurity?'
                : emotionSlug === 'motivation'
                ? 'What is low motivation?'
                : emotionSlug === 'feeling-lost'
                ? 'What does it mean to feel lost?'
                : emotionSlug === 'emotional-exhaustion'
                ? 'What does emotional exhaustion mean?'
                : emotionSlug === 'overthinking'
                ? 'What does overthinking mean?'
                : `What is ${emotion.displayName.toLowerCase()}?`}
            </h2>
            <p style={{ fontSize: '16.5px', color: NAVY_SOFT, lineHeight: '1.8', margin: 0 }}>
              {emotion.summary}
            </p>
          </motion.div>

          {/* Relatable Experiences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={cardStyle('lavender')}
          >
            <h2 style={H2}>
              {emotionSlug === 'relationship-issues'
                ? 'Common relationship challenges'
                : emotionSlug === 'financial-worry'
                ? 'Common signs of financial stress'
                : emotionSlug === 'sleep-issues'
                ? 'Common signs of sleep problems'
                : emotionSlug === 'panic-attacks'
                ? 'Common signs of panic attacks'
                : emotionSlug === 'social-anxiety'
                ? 'Common signs of social anxiety'
                : emotionSlug === 'perfectionism'
                ? 'Common signs of perfectionism'
                : emotionSlug === 'overwhelm'
                ? 'Common signs of overwhelm'
                : emotionSlug === 'low-self-esteem'
                ? 'Common signs of low self-esteem'
                : emotionSlug === 'burnout'
                ? 'Common signs of burnout'
                : emotionSlug === 'jealousy'
                ? 'Common signs of jealousy'
                : emotionSlug === 'guilt'
                ? 'Common signs of guilt'
                : emotionSlug === 'shame'
                ? 'Common signs of shame'
                : emotionSlug === 'motivation'
                ? 'Common signs of low motivation'
                : emotionSlug === 'feeling-lost'
                ? 'Common signs of feeling lost'
                : emotionSlug === 'emotional-exhaustion'
                ? 'Common signs of emotional exhaustion'
                : emotionSlug === 'overthinking'
                ? 'Common signs of overthinking'
                : `Common ${emotion.displayName.toLowerCase()} symptoms`}
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {emotion.relatable.map((item, idx) => (
                <Row key={idx} tone="lavender">{item}</Row>
              ))}
            </div>
          </motion.div>

          {/* Common Situations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={cardStyle('blush')}
          >
            <h2 style={H2}>
              {emotionSlug === 'relationship-issues'
                ? 'Common causes of relationship problems'
                : emotionSlug === 'financial-worry'
                ? 'Common causes of financial stress'
                : emotionSlug === 'sleep-issues'
                ? 'Common causes of sleep problems'
                : emotionSlug === 'panic-attacks'
                ? 'Common causes and triggers of panic attacks'
                : emotionSlug === 'social-anxiety'
                ? 'Common causes and triggers of social anxiety'
                : emotionSlug === 'perfectionism'
                ? 'Common causes and triggers of perfectionism'
                : emotionSlug === 'overwhelm'
                ? 'Common causes and triggers of overwhelm'
                : emotionSlug === 'low-self-esteem'
                ? 'Common causes and triggers of low self-esteem'
                : emotionSlug === 'burnout'
                ? 'Common causes and triggers of burnout'
                : emotionSlug === 'jealousy'
                ? 'Common causes and triggers of jealousy'
                : emotionSlug === 'guilt'
                ? 'Common causes and triggers of guilt'
                : emotionSlug === 'shame'
                ? 'Common causes and triggers of shame'
                : emotionSlug === 'motivation'
                ? 'Common causes and triggers of low motivation'
                : emotionSlug === 'feeling-lost'
                ? 'Common causes and triggers of feeling lost'
                : emotionSlug === 'emotional-exhaustion'
                ? 'Common causes and triggers of emotional exhaustion'
                : emotionSlug === 'overthinking'
                ? 'Common causes and triggers of overthinking'
                : `Common ${emotion.displayName.toLowerCase()} triggers`}
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {emotion.situations.map((item, idx) => (
                <Row key={idx} tone="blush">{item}</Row>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={cardStyle('sea')}
          >
            <h2 style={H2}>How to manage {emotionSlug === 'financial-worry' ? 'financial stress' : emotionSlug === 'motivation' ? 'low motivation' : emotion.displayName.toLowerCase()}: techniques you can try today</h2>
            <div style={{ display: 'grid', gap: '14px' }}>
              {emotion.tips.map((item, idx) => (
                <Row key={idx} tone="sea" check>{item}</Row>
              ))}
            </div>
          </motion.div>

          {/* Reflection Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={cardStyle('gold')}
          >
            <h2 style={H2}>
              {emotionSlug === 'relationship-issues'
                ? 'Questions to understand your relationship'
                : emotionSlug === 'financial-worry'
                ? 'Questions to understand your relationship with money'
                : emotionSlug === 'sleep-issues'
                ? 'Questions to understand your sleep'
                : emotionSlug === 'panic-attacks'
                ? 'Questions to understand your experience with panic'
                : `Questions to understand your ${emotion.displayName.toLowerCase()}`}
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {emotion.reflectionQuestions.map((question, idx) => (
                <div key={idx} style={{ padding: '16px 18px', background: '#FDFAF3', border: '1px solid #EEDFC4', borderRadius: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, fontFamily: SF, fontSize: '18px', fontWeight: 700, color: '#B08A52', lineHeight: 1.3 }}>{idx + 1}.</span>
                  <p style={{ fontSize: '15.5px', color: '#3A3350', fontWeight: 500, lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>{question}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Find Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{ marginBottom: '28px', padding: 'clamp(24px, 4vw, 36px)', borderRadius: '22px', border: '1.5px solid transparent', background: `linear-gradient(160deg, #FBF1EC 0%, ${CREAM_2} 60%, #F1ECF9 100%) padding-box, linear-gradient(150deg, #D4B07A 0%, #E7D3E4 45%, #9C86CC 100%) border-box`, boxShadow: '0 16px 40px rgba(107,79,160,0.08)' }}
          >
            <h2 style={{ ...H2, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: '#FFFFFF', border: '1px solid #DCD0F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartHandshake size={20} strokeWidth={1.6} color={P} />
              </span>
              {emotionSlug === 'self-doubt'
                ? 'Build confidence and self-worth'
                : emotionSlug === 'relationship-issues'
                ? 'Strengthen your relationships'
                : emotionSlug === 'work-stress'
                ? 'Protect your well-being'
                : emotionSlug === 'financial-worry'
                ? 'Build financial confidence and stability'
                : emotionSlug === 'sleep-issues'
                ? 'Improve your sleep and well-being'
                : emotionSlug === 'panic-attacks'
                ? 'Find support for panic and anxiety'
                : emotionSlug === 'social-anxiety'
                ? 'Build confidence and connection'
                : emotionSlug === 'perfectionism'
                ? 'Build self-compassion and confidence'
                : emotionSlug === 'overwhelm'
                ? 'Find clarity and support'
                : emotionSlug === 'low-self-esteem'
                ? 'Build confidence and self-worth'
                : emotionSlug === 'burnout'
                ? 'Recover and recharge'
                : emotionSlug === 'jealousy'
                ? 'Build trust and emotional security'
                : emotionSlug === 'guilt'
                ? 'Find understanding and support'
                : emotionSlug === 'shame'
                ? 'Find understanding and self-acceptance'
                : emotionSlug === 'motivation'
                ? 'Rediscover purpose and momentum'
                : emotionSlug === 'feeling-lost'
                ? 'Find clarity and support'
                : emotionSlug === 'emotional-exhaustion'
                ? 'Recover and reconnect'
                : emotionSlug === 'overthinking'
                ? 'Find clarity and support'
                : `Find ${emotion.displayName.toLowerCase()} support`}
            </h2>
            <p style={{ fontSize: '16px', color: NAVY_SOFT, lineHeight: '1.8', margin: '0 0 24px 0' }}>
              {emotionSlug === 'self-doubt'
                ? 'You don\'t have to face self-doubt alone. SoulConnect helps people build confidence, strengthen self-worth, and connect with supportive communities:'
                : emotionSlug === 'relationship-issues'
                ? 'You don\'t have to navigate relationship challenges alone. SoulConnect helps people improve communication, build healthier connections, and find support during difficult times:'
                : emotionSlug === 'work-stress'
                ? 'You don\'t have to carry work stress alone. SoulConnect helps people manage pressure, set healthier boundaries, and protect their mental well-being:'
                : emotionSlug === 'financial-worry'
                ? 'You don\'t have to navigate financial stress alone. SoulConnect helps people understand their finances, build confidence with money, and find support during tough times:'
                : emotionSlug === 'sleep-issues'
                ? 'You don\'t have to deal with sleep problems alone. SoulConnect helps people understand sleep challenges, reduce stress, and build healthier habits:'
                : emotionSlug === 'panic-attacks'
                ? 'You don\'t have to face panic attacks alone. SoulConnect helps people understand panic, build coping skills, and find support during difficult moments:'
                : emotionSlug === 'social-anxiety'
                ? 'You don\'t have to face social anxiety alone. SoulConnect helps people build confidence, practice social connection, and find support in a safe environment:'
                : emotionSlug === 'perfectionism'
                ? 'You don\'t have to face perfectionism alone. SoulConnect helps people manage self-criticism, build confidence, and develop healthier expectations for themselves:'
                : emotionSlug === 'overwhelm'
                ? 'You don\'t have to navigate overwhelm alone. SoulConnect helps people reduce stress, organize their thoughts, and find support during difficult periods:'
                : emotionSlug === 'jealousy'
                ? 'You don\'t have to navigate jealousy and insecurity alone. SoulConnect helps people strengthen relationships, build confidence, and find support during difficult moments:'
                : emotionSlug === 'guilt'
                ? 'You don\'t have to carry guilt alone. SoulConnect helps people process difficult emotions, practice self-compassion, and move forward:'
                : emotionSlug === 'shame'
                ? 'You don\'t have to carry shame alone. SoulConnect helps people process difficult emotions, build self-compassion, and reconnect with others:'
                : emotionSlug === 'motivation'
                ? 'You don\'t have to navigate low motivation alone. SoulConnect helps people reconnect with their goals, build healthy habits, and find support during difficult times:'
                : emotionSlug === 'feeling-lost'
                ? 'You don\'t have to navigate uncertainty alone. SoulConnect helps people explore change, reconnect with their values, and find support during difficult transitions:'
                : emotionSlug === 'emotional-exhaustion'
                ? 'You don\'t have to navigate emotional exhaustion alone. SoulConnect helps people manage stress, set healthier boundaries, and reconnect with themselves:'
                : emotionSlug === 'overthinking'
                ? 'You don\'t have to navigate overthinking alone. SoulConnect helps people manage racing thoughts, reduce stress, and build healthier coping strategies:'
                : `You don't have to carry ${emotion.displayName.toLowerCase()} alone. SoulConnect helps people manage ${emotion.displayName.toLowerCase()} and mental health challenges:`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <div style={{ padding: '18px', background: '#FFFFFF', border: `1px solid ${LILAC_LINE}`, borderRadius: '14px' }}>
                <p style={{ fontSize: '14.5px', fontWeight: 700, color: DARK, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageCircle size={17} strokeWidth={1.75} color={P} />Connect with peers</p>
                <p style={{ fontSize: '13.5px', color: NAVY_SOFT, margin: 0, lineHeight: '1.6' }}>
                  {emotionSlug === 'self-doubt'
                    ? 'Join anonymously with others who understand self-doubt, confidence struggles, and low self-esteem'
                    : emotionSlug === 'relationship-issues'
                    ? 'Join anonymously with others who understand relationship challenges, breakups, trust issues, and communication struggles'
                    : emotionSlug === 'work-stress'
                    ? 'Join anonymously with others who understand workplace pressure, burnout, difficult colleagues, and career stress'
                    : emotionSlug === 'financial-worry'
                    ? 'Join anonymously with others who understand financial stress, money anxiety, and building financial confidence'
                    : emotionSlug === 'sleep-issues'
                    ? 'Join anonymously with others who understand insomnia, restless nights, racing thoughts, and sleep struggles'
                    : emotionSlug === 'panic-attacks'
                    ? 'Join anonymously with others who understand panic attacks, anxiety, fear, and overwhelming emotions'
                    : emotionSlug === 'social-anxiety'
                    ? 'Join anonymously with others who understand social anxiety, fear of judgment, loneliness, and social pressure'
                    : emotionSlug === 'perfectionism'
                    ? 'Join anonymously with others who understand perfectionism, burnout, self-doubt, and the pressure to succeed'
                    : emotionSlug === 'overwhelm'
                    ? 'Join anonymously with others who understand overwhelm, burnout, decision fatigue, and the pressure of everyday life'
                    : emotionSlug === 'motivation'
                    ? 'Join anonymously with others who understand burnout, procrastination, feeling stuck, and loss of motivation'
                    : emotionSlug === 'feeling-lost'
                    ? 'Join anonymously with others who understand uncertainty, life transitions, identity changes, and feeling lost'
                    : emotionSlug === 'emotional-exhaustion'
                    ? 'Join anonymously with others who understand caregiving stress, burnout, emotional exhaustion, and feeling overwhelmed'
                    : emotionSlug === 'overthinking'
                    ? 'Join anonymously with others who understand overthinking, anxiety, self-doubt, and racing thoughts'
                    : `Join anonymously with others who understand ${emotion.displayName.toLowerCase()}`}
                </p>
              </div>
              <div style={{ padding: '18px', background: '#FFFFFF', border: `1px solid ${LILAC_LINE}`, borderRadius: '14px' }}>
                <p style={{ fontSize: '14.5px', fontWeight: 700, color: DARK, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Leaf size={17} strokeWidth={1.75} color={'#3F7A5E'} />Guided exercises</p>
                <p style={{ fontSize: '13.5px', color: NAVY_SOFT, margin: 0, lineHeight: '1.6' }}>Explore grounding techniques, calming exercises, and small daily steps that support emotional well-being</p>
              </div>
              <div style={{ padding: '18px', background: '#FFFFFF', border: `1px solid ${LILAC_LINE}`, borderRadius: '14px' }}>
                <p style={{ fontSize: '14.5px', fontWeight: 700, color: DARK, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={17} strokeWidth={1.75} color={'#9A5A3A'} />Support groups</p>
                <p style={{ fontSize: '13.5px', color: NAVY_SOFT, margin: 0, lineHeight: '1.6' }}>Join communities dedicated to mental health and wellness</p>
              </div>
              <div style={{ padding: '18px', background: '#FFFFFF', border: `1px solid ${LILAC_LINE}`, borderRadius: '14px' }}>
                <p style={{ fontSize: '14.5px', fontWeight: 700, color: DARK, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Stethoscope size={17} strokeWidth={1.75} color={GOLD_TXT} />Professional help</p>
                <p style={{ fontSize: '13.5px', color: NAVY_SOFT, margin: 0, lineHeight: '1.6' }}>Connect with verified therapists and mental health professionals</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <button
                className="xd-btn-p"
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '14px 24px',
                  background: P,
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 8px rgba(107,79,160,0.18)',
                }}
              >
                Join SoulConnect
              </button>
              <button
                className="xd-btn-s"
                onClick={() => window.location.href = '/explore'}
                style={{
                  padding: '14px 24px',
                  background: '#FFFFFF',
                  border: '1px solid #DCD0F0',
                  color: P,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                }}
              >
                Explore more emotions
              </button>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            style={cardStyle('lavender')}
          >
            <h2 style={H2}>Frequently asked questions about {emotionSlug === 'financial-worry' ? 'financial stress' : emotionSlug === 'sleep-issues' ? 'sleep problems' : emotionSlug === 'panic-attacks' ? 'panic attacks' : emotionSlug === 'overwhelm' ? 'feeling overwhelmed' : emotionSlug === 'motivation' ? 'low motivation' : emotion.displayName.toLowerCase()}</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {emotion.faq.map((item, idx) => (
                <div key={idx} style={{ paddingTop: idx ? '16px' : 0, borderTop: idx ? `1px solid ${LILAC_LINE}` : 'none' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: DARK, margin: '0 0 8px 0', lineHeight: 1.4 }}>{item.question}</h3>
                  <p style={{ fontSize: '15px', color: NAVY_SOFT, lineHeight: '1.7', margin: 0 }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* When to Seek Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ marginBottom: '28px', padding: '24px 26px', background: '#EEF6F2', border: '1px solid #CFE3DA', borderRadius: '18px' }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2F5A45', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LifeBuoy size={19} strokeWidth={1.75} color="#3F7A5E" />
              When to Seek Professional Support
            </h2>
            <p style={{ fontSize: '15.5px', color: '#34473F', lineHeight: '1.7', margin: 0 }}>
              {emotion.whenToSeekSupport}
            </p>
          </motion.div>

          {/* Related Emotions */}
          {/* Related Topics */}
          {emotion.relatedCategories && emotion.relatedCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={cardStyle('blush')}
            >
              <h2 style={H2}>Related Topics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {emotion.relatedCategories.map((slug) => {
                  const related = emotionContentLibrary.find(e => e.slug === slug);
                  if (!related) return null;
                  return (
                    <button
                      key={slug}
                      className="xd-chip"
                      onClick={() => navigate(`/explore/${slug}`)}
                      style={{
                        padding: '14px 16px',
                        background: '#FFFFFF',
                        border: '1px solid #DCD0F0',
                        borderRadius: '14px',
                        color: P,
                        cursor: 'pointer',
                        fontSize: '14.5px',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      {related.displayName}
                      <ArrowRight size={15} strokeWidth={1.75} />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Related Reading (blog cross-link) */}
          {relatedArticle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.82 }}
              style={cardStyle('sea')}
            >
              <h2 style={H2}>Related Reading</h2>
              <button
                className="xd-read"
                onClick={() => navigate(`/blog/${relatedArticle.slug}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  width: '100%',
                  textAlign: 'left',
                  padding: '18px 20px',
                  background: '#FFFFFF',
                  border: `1px solid ${LILAC_LINE}`,
                  borderRadius: '14px',
                  color: DARK,
                  cursor: 'pointer',
                  fontSize: '15.5px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 10px rgba(34,27,58,0.03)',
                }}
              >
                <span style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 11, background: '#F6EFE2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={18} strokeWidth={1.6} color={GOLD_TXT} />
                </span>
                <span style={{ flex: 1 }}>{relatedArticle.title}</span>
                <ArrowRight size={16} strokeWidth={1.75} color={P} />
              </button>
            </motion.div>
          )}

          {/* Important Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            style={{ padding: '20px 22px', background: '#FDF3EE', border: '1px solid #F1D6C8', borderRadius: '16px', fontSize: '14px', color: '#5A4238', lineHeight: '1.65', marginBottom: '20px' }}
          >
            <p style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#7A4A2E', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TriangleAlert size={16} strokeWidth={1.9} color="#B5673F" />
              Important
            </p>
            <p style={{ margin: 0 }}>
              SoulConnect offers support, resources, and community, but it is not a substitute for professional medical advice. If you are in immediate danger or thinking about harming yourself, please contact emergency services or someone you trust immediately.
            </p>
          </motion.div>

          {/* Trust & Safety Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{ padding: '20px 22px', background: CREAM_2, border: `1px solid ${LILAC_LINE}`, borderRadius: '16px', fontSize: '13.5px', color: NAVY_SOFT, lineHeight: '1.65' }}
          >
            <p style={{ margin: '0 0 8px 0', fontWeight: 700, color: DARK, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} strokeWidth={1.75} color={P} />
              Medical and Editorial Review
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              {emotion.trustSafety?.disclaimer || 'This content is educational and reviewed by the SoulConnect team. It is not a substitute for professional mental health advice, diagnosis, or treatment.'}
            </p>
            <p style={{ margin: '12px 0 0 0', fontSize: '12.5px', color: MUTED }}>
              Last reviewed: {emotion.trustSafety?.lastReviewedDate || 'February 2025'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
