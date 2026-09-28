/**
 * "Dawn" theme for the Pulse flow — same tokens as the landing page.
 * Icons replace the emoji in pulseExperienceData.js (the data file is
 * left untouched; unknown ids fall back to a neutral icon).
 */
import {
  Wind, HeartCrack, CloudRain, UserRound, Flame, Users, Gem, Fingerprint,
  Flower2, Briefcase, Moon, CircleHelp, MessageCircle, HeartHandshake,
  Stethoscope, Sprout, Ear,
} from 'lucide-react';

export const P = '#6B4FA0';
export const P_HOVER = '#5A4190';
export const DARK = '#221B3A';
export const NAVY_SOFT = '#5B5470';
export const MUTED = '#6E6784';
export const GOLD_TXT = '#8A6A3E';
export const CREAM = '#FAF8FC';
export const CREAM_2 = '#F3EFF9';
export const LILAC_LINE = '#E6DDF3';
export const SEA_TXT = '#2F5A45';
export const SF = '"Playfair Display",Georgia,serif';
export const F = "'Plus Jakarta Sans',Inter,system-ui,sans-serif";

export const TINTS = [
  { bg: '#F1ECF9', fg: '#6B4FA0', wash: '#F7F3FC', edge: ['#A992DA', '#DCD0F0', '#EFE9F8'] },
  { bg: '#E7F1EC', fg: '#3F7A5E', wash: '#F1F8F4', edge: ['#86BBA2', '#D3E7DC', '#EAF3EE'] },
  { bg: '#FBEEE6', fg: '#9A5A3A', wash: '#FEF6F1', edge: ['#E0A585', '#F3DACC', '#FAEEE7'] },
  { bg: '#F6EFE2', fg: '#8A6A3E', wash: '#FCF8F0', edge: ['#D6B27A', '#EEDFC4', '#F7F0E3'] },
];

export const GOLD_EDGE = 'linear-gradient(150deg, #D4B07A 0%, #E7D3E4 45%, #9C86CC 100%) border-box';

export const tintedBorder = (t, washStop = '60%') => ({
  border: '1.5px solid transparent',
  background: `linear-gradient(180deg, ${t.wash} 0%, #FFFFFF ${washStop}) padding-box, linear-gradient(150deg, ${t.edge[0]} 0%, ${t.edge[1]} 45%, ${t.edge[2]} 100%) border-box`,
});

export const PROBLEM_ICONS = {
  anxiety: Wind,
  relationships: HeartCrack,
  mood: CloudRain,
  loneliness: UserRound,
  burnout: Flame,
  family: Users,
  selfworth: Gem,
  identity: Fingerprint,
  grief: Flower2,
  career: Briefcase,
  sleep: Moon,
  other: CircleHelp,
};

export const SUPPORT_ICONS = {
  talk: MessageCircle,
  find_people: HeartHandshake,
  professional: Stethoscope,
  myself: Sprout,
  heard: Ear,
};

export const problemIcon = (id) => PROBLEM_ICONS[id] || CircleHelp;
export const supportIcon = (id) => SUPPORT_ICONS[id] || MessageCircle;

// Shared hover/focus styles for the flow's buttons
export const pulseCss = `
  .pl-btn{transition:background .2s, transform .2s, box-shadow .2s;}
  .pl-btn:not(:disabled):hover{background:${P_HOVER}!important;transform:translateY(-1px);box-shadow:0 8px 22px rgba(107,79,160,0.24)!important;}
  .pl-ghost{transition:background .2s, border-color .2s;}
  .pl-ghost:hover{background:${CREAM_2}!important;border-color:#C9B8E8!important;}
  .pl-back{transition:color .15s;}
  .pl-back:hover{color:${DARK}!important;}
  .pl-grid{grid-template-columns:repeat(4,minmax(0,1fr));}
  @media(max-width:720px){.pl-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
  .pl-btn:focus-visible,.pl-ghost:focus-visible,.pl-back:focus-visible,.pl-card:focus-visible{outline:3px solid #C9B8E8;outline-offset:3px;}
`;
