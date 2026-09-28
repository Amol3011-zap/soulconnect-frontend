import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search as SearchIcon, ArrowRight, Home, Sparkles,
  Wind, CloudRain, HeartCrack, Zap, User, Flame, CircleHelp, Users,
  Briefcase, Wallet, Moon, TriangleAlert, UserX, Target, Layers,
  HeartHandshake, BatteryLow, Eye, CloudDrizzle, Shield, Bandage, Anchor,
  Drama, Compass,
} from 'lucide-react';
import emotionContentLibrary from '../../data/emotionContentLibrary';

/* "Dawn" palette — same tokens as the landing page */
const P          = '#6B4FA0';  // Soul Violet — links, accents
const DARK       = '#221B3A';  // headings
const NAVY_SOFT  = '#5B5470';  // body copy
const MUTED      = '#6E6784';  // small/secondary text
const GOLD_TXT   = '#8A6A3E';  // eyebrow labels
const CREAM      = '#FAF8FC';
const CREAM_2    = '#F3EFF9';
const LILAC_LINE = '#E6DDF3';
const SF = '"Playfair Display",Georgia,serif';
const F  = "'Plus Jakarta Sans',Inter,system-ui,sans-serif";

// Drawn line icons instead of emoji (emoji render differently on every OS
// and read as template filler next to a calm type palette).
const CATEGORY_ICONS = {
  anxiety: Wind,
  depression: CloudRain,
  grief: HeartCrack,
  stress: Zap,
  loneliness: User,
  anger: Flame,
  'self-doubt': CircleHelp,
  'relationship-issues': Users,
  'work-stress': Briefcase,
  'financial-worry': Wallet,
  'sleep-issues': Moon,
  'panic-attacks': TriangleAlert,
  'social-anxiety': UserX,
  perfectionism: Target,
  overwhelm: Layers,
  'low-self-esteem': HeartHandshake,
  burnout: BatteryLow,
  jealousy: Eye,
  guilt: CloudDrizzle,
  shame: Shield,
  trauma: Bandage,
  addiction: Anchor,
  'imposter-syndrome': Drama,
  'purpose-meaning': Compass,
};

// Four soft tints, cycled across the grid for calm variety (never a rainbow)
// Each tint also drives the card's soft gradient border (stronger at the
// top-left corner, fading out) and its hover glow.
const TINTS = [
  { bg: '#F1ECF9', fg: '#6B4FA0', wash: '#F7F3FC', edge: ['#A992DA', '#DCD0F0', '#EFE9F8'], glow: 'rgba(107,79,160,0.14)' },  // lavender
  { bg: '#E7F1EC', fg: '#3F7A5E', wash: '#F1F8F4', edge: ['#86BBA2', '#D3E7DC', '#EAF3EE'], glow: 'rgba(63,122,94,0.14)' },   // sea glass
  { bg: '#FBEEE6', fg: '#9A5A3A', wash: '#FEF6F1', edge: ['#E0A585', '#F3DACC', '#FAEEE7'], glow: 'rgba(201,138,107,0.16)' }, // dawn blush
  { bg: '#F6EFE2', fg: '#8A6A3E', wash: '#FCF8F0', edge: ['#D6B27A', '#EEDFC4', '#F7F0E3'], glow: 'rgba(212,176,122,0.18)' }, // soft gold
];

const CategoryCard = React.memo(({ category, index }) => {
  const Icon = CATEGORY_ICONS[category.slug] || Sparkles;
  const tint = TINTS[index % TINTS.length];
  return (
    <Link
      to={`/explore/${category.slug}`}
      className="xh-card-link"
      style={{ textDecoration: 'none', display: 'flex' }}
    >
      <motion.div
        className="xh-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.4), duration: 0.35 }}
        style={{
          flex: 1,
          padding: '26px 26px 22px',
          '--glow': tint.glow,
          border: '1.75px solid transparent',
          background: `linear-gradient(180deg, ${tint.wash} 0%, #FFFFFF 42%) padding-box, linear-gradient(150deg, ${tint.edge[0]} 0%, ${tint.edge[1]} 45%, ${tint.edge[2]} 100%) border-box`,
          borderRadius: '18px',
          boxShadow: '0 2px 12px rgba(34,27,58,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: tint.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} strokeWidth={1.6} color={tint.fg} />
        </div>

        <h3 style={{ fontFamily: F, fontSize: '17px', fontWeight: 650, color: DARK, margin: 0, lineHeight: 1.3 }}>
          {category.name}
        </h3>

        {category.description && (
          <p style={{
            fontSize: '14px',
            color: NAVY_SOFT,
            margin: 0,
            lineHeight: 1.6,
            flex: 1,
          }}>
            {category.description}
          </p>
        )}

        <div className="xh-cta" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: P,
          fontSize: '13.5px',
          fontWeight: 600,
          marginTop: '4px',
        }}>
          Explore
          <ArrowRight size={14} className="xh-arrow" />
        </div>
      </motion.div>
    </Link>
  );
});

CategoryCard.displayName = 'CategoryCard';

const css = `
  .xh-card{transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease;}
  .xh-card-link:hover .xh-card{transform:translateY(-3px);box-shadow:0 14px 30px var(--glow)!important;}
  .xh-card-link:focus-visible{outline:none;}
  .xh-card-link:focus-visible .xh-card{outline:3px solid #C9B8E8;outline-offset:2px;}
  .xh-arrow{transition:transform .2s ease;}
  .xh-card-link:hover .xh-arrow{transform:translateX(3px);}
  .xh-search:focus-within{border-color:${P}!important;box-shadow:0 0 0 3px rgba(107,79,160,0.14)!important;}
  .xh-search input::placeholder{color:${MUTED};}
  .xh-home:hover{color:${P}!important;}
  @media(max-width:640px){
    .xh-h1{font-size:34px!important;}
    .xh-pad{padding-left:20px!important;padding-right:20px!important;}
  }
`;

export default function ExploreHub() {
  const navigate = useNavigate();
  const [categories] = useState(() =>
    emotionContentLibrary.map((e) => ({
      slug: e.slug,
      name: e.displayName,
      description: e.seo.description,
    }))
  );
  const [searchInput, setSearchInput] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const debounceTimer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchInput.trim()) {
      return categories;
    }
    const query = searchInput.toLowerCase();
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(query)
    );
  }, [searchInput, categories]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setDisplayValue(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchInput(value);
    }, 150);
  }, []);

  // Clears both the filter and the visible text (the input is controlled,
  // so "Clear search" actually empties the box).
  const clearSearch = useCallback(() => {
    clearTimeout(debounceTimer.current);
    setDisplayValue('');
    setSearchInput('');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: F,
      color: DARK,
      background: `linear-gradient(180deg, ${CREAM_2} 0px, ${CREAM} 420px)`,
    }}>
      <style>{css}</style>

      {/* Breadcrumb Navigation */}
      <div className="xh-pad" style={{
        padding: '14px 32px',
        borderBottom: `1px solid ${LILAC_LINE}`,
        background: 'rgba(255,255,255,0.6)',
      }}>
        <nav aria-label="Breadcrumb" style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '13px', color: MUTED,
        }}>
          <button
            className="xh-home"
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
              transition: 'color .15s',
            }}
          >
            <Home size={15} strokeWidth={1.75} />
            Home
          </button>
          <span aria-hidden="true" style={{ color: '#C9B8E8' }}>/</span>
          <span style={{ color: DARK, fontWeight: 600 }}>Explore</span>
        </nav>
      </div>

      {/* Header */}
      <div className="xh-pad" style={{ padding: '64px 32px 48px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p style={{
            fontSize: '12px', fontWeight: 700, color: GOLD_TXT,
            letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 14px',
          }}>
            Explore
          </p>
          <h1 className="xh-h1" style={{
            fontFamily: SF, fontSize: '48px', fontWeight: 700, color: DARK,
            letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 16px 0',
          }}>
            Emotion Library
          </h1>
          <p style={{
            fontSize: '17px', color: NAVY_SOFT, lineHeight: 1.65,
            margin: '0 auto 32px', maxWidth: '560px',
          }}>
            Explore {categories.length} emotions and discover evidence-based strategies for emotional wellness
          </p>

          {/* Search Bar */}
          <div className="xh-search" style={{
            maxWidth: '520px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            background: '#FFFFFF',
            border: '1px solid #DCD0F0',
            borderRadius: '14px',
            boxShadow: '0 4px 16px rgba(34,27,58,0.04)',
            transition: 'border-color .2s, box-shadow .2s',
          }}>
            <SearchIcon size={19} strokeWidth={1.75} style={{ color: MUTED, flexShrink: 0 }} />
            <input
              type="text"
              aria-label="Search emotions"
              placeholder="Search emotions..."
              value={displayValue}
              onChange={handleSearchChange}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: DARK,
                fontSize: '15px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Categories Grid */}
      <div className="xh-pad" style={{ padding: '8px 32px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '56px 32px',
                textAlign: 'center',
                background: '#FFFFFF',
                border: `1px solid ${LILAC_LINE}`,
                borderRadius: '18px',
                color: NAVY_SOFT,
              }}
            >
              <p style={{ fontSize: '17px', margin: 0 }}>No emotions found matching "{displayValue}"</p>
              <button
                onClick={clearSearch}
                style={{
                  marginTop: '18px',
                  padding: '11px 22px',
                  background: CREAM_2,
                  border: '1px solid #DCD0F0',
                  color: P,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                }}
              >
                Clear search
              </button>
            </motion.div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '20px',
            }}>
              {filteredCategories.map((category, index) => (
                <CategoryCard key={category.slug} category={category} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
