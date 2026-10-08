import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flower2, Users, Sparkles, MessageCircle, ShieldCheck, AlertTriangle,
  X, Send, Flag, Wind, Plus, Smile, Image as ImageIcon, Mic, Trash2, Phone, Clock, RefreshCw, Lock, MoreHorizontal, ChevronLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuthStore } from '../store/auth';

import { STRUGGLES, CONVERSATION_STARTERS } from '../components/soulmatch/soulmatchOptions';
import { getConnections } from '../components/soulmatch/soulmatchData';
import {
  getLotuses, floatLotus, resonate, bloom, drift, givePetal,
  rankLotuses, suggestProblems, needsCrisisSupport,
  getChats, rememberChat, saveMessage, saveImage, saveAudio, markChat,
  FREE_CHAT_LIMIT, WINDOW_SIZE,
} from '../components/soulpond/soulpondData';
import SoulFriendProfile from '../components/soulpond/SoulFriendProfile';

/* "Dawn" palette, same as the landing page */
const P = '#6B4FA0';
const DARK = '#221B3A';
const BODY = '#5B5470';
const MUTED = '#6E6784';
const GOLD = '#8A6A3E';

const LABEL = Object.fromEntries(STRUGGLES.map(s => [s.id, s.label]));
const PICKABLE = STRUGGLES; // includes "Something Else" (id: other)
const MAX_TEXT = 120;
const LOTUS_GOLD = '/brand/logo/soulconnect-lotus-mark.svg';
const LOTUS_VIOLET = '/brand/logo/soulconnect-lotus-outline.svg';

// Loose positions (percent of the pond) so lotuses feel scattered, not gridded.
const SPOTS = [
  [2, 4], [34, 0], [63, 6], [6, 36], [36, 40], [64, 34], [1, 70], [33, 74], [63, 70],
];

const TABS = [
  { id: 'pond', label: 'The Pond', Icon: Flower2 },
  { id: 'chats', label: 'Conversations', Icon: MessageCircle },
  { id: 'friends', label: 'Soul Friends', Icon: Users },
];

function problemLabel(l) {
  if (l.customLabel) return l.customLabel;
  return (l.problems || []).map(p => LABEL[p]).filter(Boolean).join(' · ');
}

/* ── Styles ─────────────────────────────────────────────────── */
const css = `
.sp-page *,.sp-overlay *{box-sizing:border-box}
.sp-page{max-width:1120px;margin:0 auto;padding:36px 28px 80px;overflow-x:hidden;font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif;color:${DARK}}
.sp-eyebrow{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;background:#F1ECF9;color:${P};font-size:13px;font-weight:600}
.sp-title{font-family:'Playfair Display',Georgia,serif;font-size:clamp(28px,4vw,40px);font-weight:700;margin:14px 0 8px;letter-spacing:-.01em}
.sp-sub{color:${BODY};font-size:16px;line-height:1.6;max-width:620px}
.sp-tabs{display:inline-flex;gap:4px;padding:5px;border-radius:16px;background:#EFE9F8;margin:26px 0 20px}
.sp-tab{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:12px;border:0;background:transparent;color:${MUTED};font-weight:600;font-size:14.5px;cursor:pointer;font-family:inherit}
.sp-tab.is-on{background:#fff;color:${DARK};box-shadow:0 2px 10px rgba(34,27,58,.06)}
.sp-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(300px,1fr);gap:22px;align-items:start}
@media(max-width:960px){.sp-grid{grid-template-columns:minmax(0,1fr)}}
.sp-card{background:#fff;border-radius:22px;border:1.5px solid #E6DDF3;box-shadow:0 10px 30px rgba(107,79,160,.06);padding:22px}
.sp-card--gold{border:1.5px solid transparent;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(150deg,#D4B07A,#E7D3E4 45%,#9C86CC) border-box}
.sp-h2{font-family:'Playfair Display',Georgia,serif;font-size:21px;font-weight:700;margin:0 0 4px}
.sp-hint{font-size:13px;color:${MUTED};margin:0 0 12px;line-height:1.5}
.sp-chips{display:flex;flex-wrap:wrap;gap:8px}
.sp-chip{padding:8px 14px;border-radius:999px;border:1.5px solid #E6DDF3;background:#fff;color:#4E3680;font-weight:500;font-size:13.5px;cursor:pointer;font-family:inherit}
.sp-chip.is-on{background:${P};border-color:${P};color:#fff}
.sp-chip:disabled{opacity:.45;cursor:not-allowed}
.sp-filter{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 0}
.sp-pond{position:relative;height:520px;margin-top:14px;border-radius:24px;overflow:hidden;
  background:radial-gradient(ellipse 75% 60% at 50% 55%,#E6DCF6 0%,#DCD0F0 45%,#F3EFF9 85%)}
.sp-ripple{position:absolute;border-radius:50%;border:1.5px solid rgba(255,255,255,.7);pointer-events:none;animation:spRipple 7s ease-in-out infinite}
.sp-ripple.r2{animation-delay:3.5s}
.sp-lotus{position:absolute;width:190px;will-change:transform;display:flex;flex-direction:column;align-items:center;background:none;border:0;cursor:pointer;padding:0;font-family:inherit}
.sp-lotus img{position:relative;z-index:1;width:48px;filter:drop-shadow(0 6px 10px rgba(107,79,160,.25))}
.sp-bob{position:relative;display:flex;flex-direction:column;align-items:center;width:100%;animation:spFloat 7s ease-in-out infinite;will-change:transform}
.sp-lotus::before{content:'';position:absolute;top:34px;left:50%;width:78px;height:18px;margin-left:-39px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(255,255,255,.75),rgba(255,255,255,0) 70%);pointer-events:none}
.sp-lotus .t{margin-top:5px;background:rgba(255,255,255,.94);border-radius:14px;padding:8px 11px;font-size:12.5px;line-height:1.4;color:#3A3350;text-align:center;box-shadow:0 6px 14px rgba(107,79,160,.12);border:2px solid transparent}
.sp-lotus .k{font-size:10.5px;color:${P};font-weight:700;margin-top:5px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sp-lotus .f{display:inline-flex;align-items:center;gap:4px;margin-top:4px;padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.7);color:#8A6A3E;font-size:10.5px;font-weight:700}
.sp-lotus.is-guide .k{color:${GOLD}}
.sp-lotus.is-sel .t{border-color:${P}}
.sp-lotus:focus-visible .t{outline:3px solid #C9B8E8}
.sp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:14px;padding:13px 18px;font-weight:700;font-size:14.5px;cursor:pointer;background:${P};color:#fff;box-shadow:0 4px 14px rgba(107,79,160,.22);font-family:inherit}
.sp-btn:hover{background:#5A4190}
.sp-btn:disabled{background:#CFC3E6;box-shadow:none;cursor:not-allowed}
.sp-btn--ghost{background:#fff;color:${P};border:1.5px solid #DCD0F0;box-shadow:none}
.sp-btn--ghost:hover{background:#F3EFF9}
.sp-selected{margin-top:14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.sp-selected q{flex:1;min-width:220px;font-size:14.5px;color:${DARK};font-style:italic}
.sp-textarea{width:100%;min-height:96px;border:1.5px solid #DCD0F0;border-radius:16px;padding:12px 14px;font-weight:400;font-size:14.5px;line-height:1.5;color:${DARK};resize:vertical;font-family:inherit}
.sp-textarea:focus,.sp-input:focus{outline:none;border-color:${P};box-shadow:0 0 0 4px rgba(107,79,160,.12)}
.sp-input{width:100%;border:1.5px dashed #C9B8E8;border-radius:12px;padding:10px 12px;font-weight:400;font-size:14px;font-family:inherit;margin-top:10px}
.sp-count{text-align:right;font-size:11.5px;color:#9A93AE;margin-top:4px}
.sp-sugg{margin-top:10px;padding:11px 13px;border-radius:14px;background:#F1ECF9;font-size:13px;color:#4E3680;line-height:1.5}
.sp-sugg button{background:none;border:0;color:${P};font-weight:700;cursor:pointer;font-family:inherit;padding:0;margin-left:4px}
.sp-talk.is-soon{cursor:default;opacity:.92}
.sp-talk.is-soon>span:first-child{filter:saturate(.7)}
.sp-soon{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;background:#EFE9F8;color:${P};font-size:10.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
.sp-talk{display:flex;align-items:center;gap:12px;padding:14px;border-radius:18px;background:linear-gradient(160deg,#FBF1EC,#fff);border:1.5px solid #EEDFC4;margin-top:18px;width:100%;cursor:pointer;text-align:left;font-family:inherit}
.sp-note{display:flex;gap:8px;align-items:flex-start;font-size:12.5px;color:${MUTED};margin-top:12px;line-height:1.5}
.sp-dev{display:flex;gap:6px;align-items:center;font-size:12px;color:#9A5A3A;margin-top:12px}
.sp-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:${DARK};color:#fff;padding:12px 18px;border-radius:14px;font-size:14px;z-index:60;box-shadow:0 12px 30px rgba(0,0,0,.2)}
.sp-overlay{font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif;color:${DARK};position:fixed;inset:0;background:rgba(34,27,58,.38);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:1200;display:flex;align-items:center;justify-content:center;padding:16px}
.sp-chat{position:relative;width:min(460px,100%);height:min(680px,92vh);background:#FAF8FC;border-radius:28px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 70px rgba(34,27,58,.3)}
.sp-chat-h{display:flex;align-items:center;gap:12px;padding:14px 14px 14px 16px;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid #EEE8F6}
.sp-chat-h .who{flex:1;min-width:0}
.sp-chat-h .who b{display:block;font-size:16px;font-weight:700;color:${DARK};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sp-chat-h .who span{display:flex;align-items:center;gap:6px;font-size:12px;color:#3F7A5E;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sp-chat-h .who span i{width:7px;height:7px;border-radius:50%;background:#56B083;display:inline-block;flex-shrink:0}
.sp-ib{width:38px;height:38px;border-radius:12px;border:0;background:transparent;color:${MUTED};cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sp-ib:hover{background:#F3EFF9;color:${P}}
.sp-back{display:none}
.sp-menu{position:absolute;right:12px;top:62px;z-index:5;background:#fff;border-radius:16px;box-shadow:0 18px 40px rgba(34,27,58,.18);border:1px solid #EEE8F6;padding:6px;min-width:210px}
.sp-menu button{width:100%;display:flex;align-items:center;gap:10px;padding:11px 12px;border:0;background:none;border-radius:10px;font-size:14px;font-weight:600;font-family:inherit;color:${DARK};cursor:pointer;text-align:left}
.sp-menu button:hover{background:#F6F3FA}
.sp-menu button small{display:block;font-weight:400;font-size:11.5px;color:${MUTED};margin-top:1px}
.sp-av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#C9B8E8,#F3D9C4);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:17px;font-family:'Playfair Display',Georgia,serif;color:#fff;flex-shrink:0;box-shadow:0 0 0 3px #fff,0 0 0 4.5px #E6DDF3}
.sp-body{flex:1;overflow-y:auto;padding:14px 16px 10px;display:flex;flex-direction:column}
.sp-quote{padding:12px 14px;border-radius:16px;background:#FCF8F0;border:1px solid #F1E3C8;font-size:13.5px;line-height:1.45;color:#3A3350;margin-bottom:12px}
.sp-quote small{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:700;letter-spacing:.12em;color:${GOLD};margin-bottom:4px}
.sp-safe{display:flex;gap:11px;align-items:flex-start;padding:12px 14px;border-radius:16px;background:linear-gradient(135deg,#F4EEFB,#EEF3FB);border:1px solid #DCD0F0;margin-bottom:12px}
.sp-safe .ic{width:30px;height:30px;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${P};box-shadow:0 2px 6px rgba(107,79,160,.15)}
.sp-safe b{display:block;font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:700;font-size:16px;line-height:1.3;color:#4E3680;margin-bottom:3px}
.sp-safe p{margin:0;font-size:12.5px;line-height:1.5;color:#5A5470}
.sp-safe p strong{color:#3A3350;font-weight:700}
.sp-hello{margin:auto 0 12px;text-align:center;padding:10px 6px 0}
.sp-hello img{width:54px;height:auto;opacity:.9;display:block;margin:0 auto}
body.sp-chat-open .mobile-bottom-nav,body.sp-chat-open .app-topbar{visibility:hidden}
.sp-hello b{display:block;font-family:'Playfair Display',Georgia,serif;font-size:18px;color:${DARK};margin-top:6px}
.sp-hello span{display:block;font-size:13px;color:${MUTED};margin-top:4px;line-height:1.5}
.sp-m{max-width:82%;padding:10px 14px;border-radius:18px;font-size:14px;line-height:1.45;margin:0 0 8px;word-wrap:break-word}
.sp-m.th{background:#fff;border:1px solid #EEE8F6;border-bottom-left-radius:6px;align-self:flex-start}
.sp-m.has-img{padding:4px;max-width:72%}
.sp-m.has-img img{display:block;width:100%;max-height:320px;object-fit:cover;border-radius:14px}
.sp-m.has-img span{display:block;padding:7px 10px 5px}
.sp-tray{margin-bottom:10px}
.sp-sendbtn{width:44px;height:44px;border-radius:50%;border:0;background:${P};color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:0 6px 14px rgba(107,79,160,.28)}
.sp-rec-pill{gap:8px;padding:0 14px;border-color:#F1C9C9!important}
.sp-rec-pill b{font-size:14px;font-variant-numeric:tabular-nums;color:${DARK}}
.sp-rec-pill span{font-size:12px;color:#8A8399;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.sp-rec-dot{width:10px;height:10px;border-radius:50%;background:#E5484D;flex-shrink:0;animation:spRecBlink 1.1s ease-in-out infinite}
@keyframes spRecBlink{0%,100%{opacity:1}50%{opacity:.25}}
.sp-voice{display:flex;align-items:center;gap:6px}
.sp-voice audio{height:34px;width:200px;max-width:100%}
.sp-voice small{font-size:11px;opacity:.85}
.sp-tiles{display:flex;gap:18px;padding:6px 4px 2px}
.sp-tile{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;padding:0;font-family:inherit;font-size:12px;font-weight:600;color:#4A4560;cursor:pointer;width:72px;text-align:center}
.sp-tile .ic{width:52px;height:52px;border-radius:18px;display:flex;align-items:center;justify-content:center}
.sp-tile:disabled{cursor:default;opacity:.85}
.sp-tray-tip{display:flex;align-items:center;gap:6px;margin:10px 2px 0;font-size:11.5px;color:#6E6787}
.sp-photo{border:1px solid #E6DDF3;border-radius:18px;padding:10px;margin-bottom:10px;background:#FBFAFD}
.sp-photo-img{position:relative;border-radius:12px;overflow:hidden;background:#EFE9F8}
.sp-photo-img img{display:block;width:100%;max-height:220px;object-fit:contain}
.sp-photo-img button{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;border:0;background:rgba(30,24,51,.6);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}
.sp-photo-warn{display:flex;gap:8px;align-items:flex-start;margin:10px 2px;font-size:12px;line-height:1.45;color:#5A5470}
.sp-photo-warn svg{flex-shrink:0;margin-top:2px;color:${P}}
.sp-photo-warn b{font-family:'Playfair Display',Georgia,serif;font-style:italic;color:#4E3680}
.sp-photo-row{display:flex;gap:8px;align-items:center}
.sp-photo-row input{flex:1;min-width:0;height:42px;border:1px solid #E2DAEE;border-radius:21px;padding:0 14px;font-size:14px;font-family:inherit;color:${DARK};background:#fff;outline:none}
.sp-photo-row input:focus{border-color:${P}}
.sp-photo-send{width:42px;height:42px;border-radius:50%;border:0;background:${P};color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}
.sp-m.mi{background:${P};color:#fff;border-bottom-right-radius:6px;align-self:flex-end;box-shadow:0 4px 10px rgba(107,79,160,.18)}
.sp-starters{display:flex;gap:8px;overflow-x:auto;padding:2px 16px 10px;scrollbar-width:none}
.sp-starters::-webkit-scrollbar{display:none}
.sp-starters button{flex-shrink:0;font-weight:600;font-size:12.5px;font-family:inherit;border:1px solid #E1D7F1;background:#fff;color:#4E3680;border-radius:999px;padding:8px 13px;cursor:pointer;white-space:nowrap}
.sp-starters button:hover{background:#F6F2FC}
.sp-chat-f{padding:10px 14px calc(12px + env(safe-area-inset-bottom,0px));background:#fff;border-top:1px solid #EEE8F6}
.sp-acts{display:flex;gap:8px;margin-bottom:10px}
.sp-acts button{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 14px;border:0;border-radius:999px;font-weight:700;font-size:13px;font-family:inherit;cursor:pointer;white-space:nowrap}
.sp-acts button:disabled{cursor:default}
.sp-acts .grow{flex:1}
.sp-send{display:flex;gap:8px;align-items:center;position:relative}
.sp-plus{width:40px;height:40px;border-radius:50%;border:0;background:none;color:${DARK};display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:transform .2s,background .2s}
.sp-plus:hover{background:#F4EFFA}
.sp-plus.is-open{transform:rotate(45deg);color:${P}}
.sp-pill{flex:1;min-width:0;display:flex;align-items:center;height:44px;border:1px solid #E2DAEE;border-radius:22px;background:#fff;padding:0 6px 0 16px;transition:border-color .2s,box-shadow .2s}
.sp-pill:focus-within{border-color:${P};box-shadow:0 0 0 3px rgba(107,79,160,.10)}
.sp-pill input{flex:1;min-width:0;height:100%!important;border-radius:0!important;border:0!important;outline:none;background:none!important;box-shadow:none!important;padding:0!important;font-size:15px;font-family:inherit;color:${DARK};caret-color:${P}}
.sp-pill .sp-emo-btn{width:34px;height:34px;border-radius:50%;border:0;background:none;color:#6E6787;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:none}
.sp-pill .sp-emo-btn.is-on{color:${P};background:#F4EFFA}
.sp-emos{position:absolute;bottom:calc(100% + 8px);left:44px;right:56px;display:flex;justify-content:space-between;gap:4px;padding:8px 10px;border-radius:18px;background:#fff;border:1px solid #E6DDF3;box-shadow:0 10px 26px rgba(34,27,58,.12);z-index:5}
.sp-emos button{width:36px!important;height:36px!important;border-radius:10px!important;background:none!important;box-shadow:none!important;font-size:21px;line-height:1;cursor:pointer;color:inherit!important}
.sp-emos button:hover{background:#F4EFFA!important}
.sp-send input{flex:1;min-width:0;height:46px;border:1.5px solid #E6DDF3;border-radius:23px;padding:0 16px;font-weight:400;font-size:15px;font-family:inherit;color:${DARK};background:#FBFAFD;outline:none}
.sp-send input:focus{border-color:${P};box-shadow:0 0 0 3px rgba(107,79,160,.12);background:#fff}
.sp-send>button[type=submit]{width:44px;height:44px;border-radius:50%;border:0;background:${P};color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:0 6px 14px rgba(107,79,160,.28)}
.sp-send>button[type=submit]:disabled{background:#D9D0EA;box-shadow:none}
.sp-dev{display:flex;gap:6px;align-items:center;font-size:11px;color:#9A7A5A;margin:8px 0 0}
@media(max-width:640px){
  .sp-overlay{padding:0;align-items:stretch}
  .sp-chat{width:100%;height:100%;height:100dvh;border-radius:0;box-shadow:none}
  .sp-chat-h{padding-top:calc(10px + env(safe-area-inset-top,0px))}
  .sp-back{display:flex}
  .sp-close{display:none}
  .sp-menu{top:calc(62px + env(safe-area-inset-top,0px))}
}
.sp-state b{display:block;margin-bottom:2px}
.sp-state{margin:0 0 12px;padding:12px 14px;border-radius:14px;background:#E7F1EC;color:#2F5A45;font-size:13px;line-height:1.5}
.sp-crisis{margin-top:12px;padding:14px;border-radius:16px;background:#FDF2EC;border:1.5px solid #F3DACC;font-size:13.5px;color:#7A3E22;line-height:1.55}
.sp-crisis a{display:inline-flex;align-items:center;gap:6px;margin:8px 8px 0 0;padding:8px 12px;border-radius:12px;background:#fff;border:1px solid #F3DACC;color:#9A4A30;font-weight:700;text-decoration:none}
.sp-friend{display:flex;gap:12px;align-items:center;padding:14px;border-radius:18px;border:1.5px solid #E6DDF3;background:#fff;width:100%;text-align:left;font-family:inherit;color:inherit;cursor:pointer;transition:border-color .2s,transform .15s}
.sp-friend:hover{border-color:#C9B8E8}
.sp-friend:active{transform:scale(.99)}
.sp-row{display:flex;gap:12px;align-items:center;padding:14px;border-radius:18px;border:1.5px solid #E6DDF3;background:#fff;cursor:pointer;width:100%;text-align:left;font-family:inherit}
.sp-row:hover{border-color:#C9B8E8}
.sp-badge{min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:${P};color:#fff;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;margin-left:6px}
.sp-limit{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px;padding:12px 14px;border-radius:14px;background:#F6EFE2;color:#6B4A20;font-size:13px}
@keyframes spFloat{
  0%,100%{transform:translate(0,0) rotate(0deg)}
  25%{transform:translate(3px,-7px) rotate(1.2deg)}
  50%{transform:translate(0,-10px) rotate(0deg)}
  75%{transform:translate(-3px,-5px) rotate(-1.2deg)}
}
@keyframes spRipple{0%,100%{transform:scale(.92);opacity:.35}50%{transform:scale(1.08);opacity:.9}}
@keyframes spShimmer{0%{background-position:0% 0%}100%{background-position:100% 100%}}
@keyframes spBobSoft{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
/* Reduce Motion: keep only a slow, small bob so the pond still feels alive */
@media(prefers-reduced-motion:reduce){.sp-ripple,.sp-pond{animation:none!important}.sp-bob{animation-name:spBobSoft!important;animation-duration:9s!important}}
/* Phone: a tall pond, lotuses staggered like they drift on water, not a grid */
@media(max-width:640px){
  .sp-page{padding:22px 14px 90px}
  .sp-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%;box-sizing:border-box;overflow:hidden;gap:4px}
  .sp-tab{position:relative;min-width:0;flex-direction:column;justify-content:center;gap:4px;padding:9px 4px;font-size:12px;line-height:1.2;white-space:nowrap}
  .sp-tab .sp-badge{position:absolute;top:4px;right:calc(50% - 26px);margin-left:0;min-width:17px;height:17px;font-size:10px;padding:0 5px}
  .sp-card{padding:16px;min-width:0}
  .sp-pond{height:auto;margin-left:-6px;margin-right:-6px;padding:26px 10px 34px;display:grid;grid-template-columns:1fr 1fr;column-gap:10px;row-gap:26px;align-items:start;
    background:radial-gradient(ellipse 60% 22% at 30% 18%,rgba(255,255,255,.55),transparent 70%),radial-gradient(ellipse 55% 20% at 72% 62%,rgba(255,255,255,.45),transparent 70%),linear-gradient(170deg,#EDE6F8 0%,#DDD1F1 45%,#E6DCF6 70%,#F3EFF9 100%);
    background-size:200% 200%,200% 200%,100% 100%;animation:spShimmer 14s ease-in-out infinite alternate}
  .sp-lotus{position:relative;left:auto!important;top:auto!important;width:auto}
  .sp-lotus.is-right{margin-top:44px}
  .sp-lotus.nudge-l{margin-right:8px}
  .sp-lotus.nudge-r{margin-left:8px}
  .sp-lotus img{width:44px}
  .sp-lotus::before{top:30px;width:70px;margin-left:-35px}
  .sp-lotus .t{font-size:12.5px;padding:9px 10px;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
  .sp-ripple{width:80%!important;left:10%!important;height:120px!important}
  .sp-ripple.r1{top:30%!important}
  .sp-ripple.r2{top:65%!important}
}
`;

/* ── Photo helper: shrink + re-encode on the device.
   Re-drawing through a canvas also drops EXIF, so GPS location never leaves the phone. */
const MAX_PHOTO_MB = 10;
const MAX_VOICE_SECS = 120;
const fmtSecs = (n) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, '0')}`;
const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(r.result);
  r.onerror = reject;
  r.readAsDataURL(blob);
});
function compressImage(file, max = 960, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad-image')); };
    img.src = url;
  });
}

/* ── Chat modal ─────────────────────────────────────────────── */
const PREVIEW_NAMES = ['riya', 'aarav', 'meera', 'kabir', 'isha', 'dev', 'sana', 'arjun'];

function PondChat({ lotus, chatId, isMock, initial = [], initialBloomed = false, initialConnected = null, onClose, onToast, onChange }) {
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState(initial);
  const [draft, setDraft] = useState('');
  const [tray, setTray] = useState(false);
  const [emo, setEmo] = useState(false);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const [pending, setPending] = useState(null); // { src } photo waiting for a final check
  const [caption, setCaption] = useState('');
  // Voice notes
  const [recording, setRecording] = useState(false);
  const [recSecs, setRecSecs] = useState(0);
  const recRef = useRef(null);      // MediaRecorder
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const keepRef = useRef(false);    // send (true) or discard (false) when it stops
  const startRef = useRef(0);
  useEffect(() => {
    if (!recording) return undefined;
    const t = setInterval(() => {
      const secs = (Date.now() - startRef.current) / 1000;
      setRecSecs(secs);
      if (secs >= MAX_VOICE_SECS) stopRecording(true);
    }, 250);
    return () => clearInterval(t);
  }, [recording]);
  useEffect(() => () => streamRef.current?.getTracks().forEach(t => t.stop()), []);
  const [bloomed, setBloomed] = useState(initialBloomed);
  const [connected, setConnected] = useState(initialConnected); // partner SoulID once BOTH chose Connect
  const [petal, setPetal] = useState(false);
  const soulNo = useMemo(() => 100 + (String(lotus.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 800), [lotus.id]);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [msgs]);

  const send = (text) => {
    const t = (text ?? draft).trim();
    if (!t) return;
    setMsgs(m => [...m, { id: Date.now(), me: true, text: t }]);
    setDraft('');
    saveMessage(chatId, t).then(() => onChange && onChange()).catch(() => onToast('Message not sent. Please try again.'));
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof window.MediaRecorder === 'undefined') {
      onToast('Voice notes need a secure (https) connection. They will work once the app is live.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const type = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find(t => window.MediaRecorder.isTypeSupported?.(t));
      const rec = new window.MediaRecorder(stream, { ...(type ? { mimeType: type } : {}), audioBitsPerSecond: 32000 });
      chunksRef.current = [];
      keepRef.current = false;
      rec.ondataavailable = e => { if (e.data?.size) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        const duration = Math.round((Date.now() - startRef.current) / 1000);
        if (!keepRef.current || duration < 1 || !chunksRef.current.length) return;
        const audio = await blobToDataUrl(new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' }));
        setMsgs(m => [...m, { id: Date.now(), me: true, text: '', audio, duration }]);
        saveAudio(chatId, audio, duration)
          .then(() => onChange && onChange())
          .catch(err => onToast(err?.message === 'storage-full' ? 'Preview storage is full. Clear old chats to keep voice notes.' : 'Voice note not sent. Please try again.'));
      };
      recRef.current = rec;
      startRef.current = Date.now();
      setRecSecs(0);
      setTray(false);
      rec.start();
      setRecording(true);
    } catch {
      onToast('Microphone access was blocked. Allow it in your browser settings to send voice notes.');
    }
  };
  function stopRecording(keep) {
    keepRef.current = keep;
    if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
    recRef.current = null;
    setRecording(false);
  }

  const pickPhoto = () => { setEmo(false); fileRef.current?.click(); };
  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { onToast('Only photos can be shared here.'); return; }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) { onToast(`That photo is over ${MAX_PHOTO_MB} MB.`); return; }
    try {
      const src = await compressImage(file);
      setTray(false);
      setCaption('');
      setPending({ src });
    } catch {
      onToast("Couldn't open that photo.");
    }
  };
  const sendPhoto = () => {
    if (!pending) return;
    const text = caption.trim();
    setMsgs(m => [...m, { id: Date.now(), me: true, text, image: pending.src }]);
    setPending(null);
    setCaption('');
    saveImage(chatId, pending.src, text)
      .then(() => onChange && onChange())
      .catch(err => onToast(err?.message === 'storage-full' ? 'Preview storage is full. Clear old chats to keep photos.' : 'Photo not sent. Please try again.'));
  };

  const previewAccept = () => {
    const id = `@${PREVIEW_NAMES[soulNo % PREVIEW_NAMES.length]}soul`;
    markChat(chatId, { connected: id });
    setConnected(id);
    onChange && onChange();
  };

  const doBloom = async () => {
    try { await bloom(chatId); markChat(chatId, { bloomed: true }); setBloomed(true); onChange && onChange(); } catch { onToast('Could not save that. Please try again.'); }
  };
  const doDrift = async () => {
    try { await drift(chatId); } catch { /* ending a chat should never trap someone */ }
    markChat(chatId, { status: 'drifted' });
    onChange && onChange();
    onClose();
    onToast('The chat drifted away quietly.');
  };
  const doPetal = async () => {
    if (petal) return;
    try { await givePetal(chatId); setPetal(true); onToast('You gave a petal of kindness.'); } catch { onToast('Could not send the petal.'); }
  };

  const [menu, setMenu] = useState(false);
  useEffect(() => {
    document.body.classList.add('sp-chat-open');
    return () => document.body.classList.remove('sp-chat-open');
  }, []);
  const report = () => { setMenu(false); onToast('Thank you. Our team will review this conversation.'); };

  return (
    <div className="sp-overlay" role="dialog" aria-modal="true" aria-label="Anonymous conversation" onClick={onClose}>
      <motion.div className="sp-chat" onClick={e => { e.stopPropagation(); if (menu) setMenu(false); }}
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.22 }}>
        <div className="sp-chat-h">
          <button type="button" className="sp-ib sp-back" onClick={onClose} aria-label="Back"><ChevronLeft size={22} /></button>
          <div className="sp-av">{connected ? connected.replace('@', '').charAt(0).toUpperCase() : 'S'}</div>
          <div className="who">
            <b>{connected || `Soul #${soulNo}`}</b>
            <span><i />{connected ? 'Soul Friend' : 'Anonymous'} · {problemLabel(lotus)}</span>
          </div>
          <button type="button" className="sp-ib" onClick={e => { e.stopPropagation(); setMenu(v => !v); }} aria-label="More options" aria-expanded={menu}><MoreHorizontal size={20} /></button>
          <button type="button" className="sp-ib sp-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <AnimatePresence>
          {menu && (
            <motion.div className="sp-menu" onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }}>
              <button type="button" onClick={report}><Flag size={17} color="#9A5A3A" /><span>Report<small>Our team reviews it privately</small></span></button>
              <button type="button" onClick={() => { setMenu(false); doDrift(); }}><Wind size={17} color={MUTED} /><span>Let it drift<small>Ends quietly. Nobody is told why.</small></span></button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="sp-body">
          <div className="sp-quote"><small><Flower2 size={12} />FROM THEIR LOTUS</small>&ldquo;{lotus.text}&rdquo;</div>
          <div className="sp-safe" role="note" aria-label="Safety reminder">
            <span className="ic"><ShieldCheck size={17} /></span>
            <div>
              <b>Share your heart, not your details.</b>
              <p>Feelings and struggles are welcome here. Keep your <strong>real name, phone, address, passwords, bank or UPI details</strong> to yourself. A real Soul will never ask for them.</p>
            </div>
          </div>
          {connected ? (
            <div className="sp-state sp-connected">
              <b>You are now Soul Friends with {connected}</b>
              You both chose to connect, so your SoulIDs are shared and this conversation is saved.
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                <button type="button" className="sp-btn" style={{ padding: '8px 12px', fontSize: 13 }} onClick={() => navigate('/chat')}>Message {connected}</button>
              </div>
            </div>
          ) : bloomed ? (
            <div className="sp-state">
              <b>You asked to connect.</b> If Soul #{soulNo} also taps Connect, you both see each other&apos;s SoulID and become Soul Friends. If not, nothing changes and nobody is told.
              {isMock && (
                <div style={{ marginTop: 8 }}>
                  <button type="button" onClick={previewAccept} style={{ border: '1px dashed #9A5A3A', background: '#fff', color: '#9A5A3A', borderRadius: 10, padding: '6px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Dev preview: pretend they connect too
                  </button>
                </div>
              )}
            </div>
          ) : null}
          {msgs.length === 0 ? (
            <div className="sp-hello">
              <img src={LOTUS_GOLD} alt="" />
              <b>Say hello</b>
              <span>You are both anonymous here. Start with one of these, or write your own.</span>
            </div>
          ) : <div style={{ marginTop: 'auto' }} />}
          {msgs.map(m => (
            <div key={m.id} className={`sp-m ${m.me ? 'mi' : 'th'}${m.image ? ' has-img' : ''}`}>
              {m.image && <img src={m.image} alt="Shared photo" loading="lazy" />}
              {m.audio && (
                <span className="sp-voice">
                  <Mic size={15} />
                  <audio controls preload="metadata" src={m.audio} />
                  {m.duration ? <small>{fmtSecs(m.duration)}</small> : null}
                </span>
              )}
              {m.text && <span>{m.text}</span>}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {msgs.length === 0 && (
          <div className="sp-starters">
            {CONVERSATION_STARTERS.slice(0, 3).map(s => <button key={s} type="button" onClick={() => send(s)}>{s}</button>)}
          </div>
        )}

        <div className="sp-chat-f">
          <AnimatePresence initial={false}>
          {tray && (
          <motion.div className="sp-tray" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }} style={{ overflow: 'hidden' }}>
            <div className="sp-tiles">
              <button type="button" className="sp-tile" onClick={pickPhoto}>
                <span className="ic" style={{ background: '#EDE6FA', color: P }}><ImageIcon size={22} /></span>Photo
              </button>
              <button type="button" className="sp-tile" onClick={doBloom} disabled={bloomed || Boolean(connected)}>
                <span className="ic" style={{ background: connected ? '#E8F4EE' : '#F6EFE2', color: connected ? '#2F6B4F' : GOLD }}><Flower2 size={22} /></span>
                {connected ? 'Soul Friends' : bloomed ? 'Request sent' : 'Connect'}
              </button>
              <button type="button" className="sp-tile" onClick={doPetal}>
                <span className="ic" style={{ background: '#F1ECF9', color: P }}><Sparkles size={22} /></span>
                {petal ? 'Petal given' : 'Give a petal'}
              </button>
            </div>
            <p className="sp-tray-tip"><ShieldCheck size={13} />Share moments, not identities. No faces, IDs, bank or UPI screens.</p>
          </motion.div>
          )}
          </AnimatePresence>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
          <AnimatePresence>
            {pending && (
              <motion.div className="sp-photo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.18 }}>
                <div className="sp-photo-img">
                  <img src={pending.src} alt="Photo to share" />
                  <button type="button" onClick={() => setPending(null)} aria-label="Remove photo"><X size={16} /></button>
                </div>
                <p className="sp-photo-warn"><ShieldCheck size={14} /><span><b>Quick check before it floats away.</b> No faces, names, documents, bank or UPI screens. Location data is removed automatically.</span></p>
                <div className="sp-photo-row">
                  <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a caption" maxLength={300} aria-label="Caption" />
                  <button type="button" className="sp-photo-send" onClick={sendPhoto} aria-label="Send photo"><Send size={18} /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {recording ? (
            <div className="sp-send sp-rec" role="status" aria-live="polite">
              <button type="button" className="sp-plus" onClick={() => stopRecording(false)} aria-label="Discard voice note"><Trash2 size={21} /></button>
              <div className="sp-pill sp-rec-pill">
                <i className="sp-rec-dot" />
                <b>{fmtSecs(recSecs)}</b>
                <span>Recording. Keep names and places out.</span>
              </div>
              <button type="button" className="sp-sendbtn" onClick={() => stopRecording(true)} aria-label="Send voice note"><Send size={18} /></button>
            </div>
          ) : (
          <form className="sp-send" onSubmit={e => { e.preventDefault(); send(); }}>
            <button type="button" className={`sp-plus${tray ? ' is-open' : ''}`} onClick={() => setTray(v => !v)}
              aria-label={tray ? 'Hide options' : 'More options'} aria-expanded={tray}><Plus size={24} /></button>
            <div className="sp-pill">
              <input ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)}
                placeholder="Message" aria-label="Message" maxLength={500} />
            </div>
            {draft.trim() ? (
              <button type="submit" className="sp-sendbtn" aria-label="Send"><Send size={18} /></button>
            ) : (
              <button type="button" className="sp-sendbtn" onClick={startRecording} aria-label="Record a voice note"><Mic size={20} /></button>
            )}
          </form>
          )}
          {isMock && (
            <p className="sp-dev"><AlertTriangle size={11} />Preview only: saved on this device, not sent to anyone yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function SoulPond() {
  const [tab, setTab] = useState('pond');
  const [mine, setMine] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sc-pond-problems') || '[]'); } catch { return []; }
  });
  const [filter, setFilter] = useState('foryou');
  const [lotuses, setLotuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [selected, setSelected] = useState(null);
  const [chat, setChat] = useState(null);
  const [toast, setToast] = useState('');

  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);
  const [custom, setCustom] = useState('');
  const [crisis, setCrisis] = useState(false);
  const [floating, setFloating] = useState(false);

  const [friends, setFriends] = useState(null);
  const [profile, setProfile] = useState(null);
  const [removedFriends, setRemovedFriends] = useState([]);
  const closeProfile = useCallback(() => setProfile(null), []);
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(0);
  const [limitHit, setLimitHit] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore(st => st.user);
  const isPremium = Boolean(user?.is_premium || user?.premium || user?.plan === 'premium' || user?.subscription_tier === 'premium');

  const refreshChats = useCallback(() => {
    getChats().then(r => setChats(r.chats || []));
  }, []);
  useEffect(() => { refreshChats(); }, [refreshChats]);
  const openChats = chats.filter(c => c.status !== 'drifted');
  // Free plan counts every person you have EVER started talking to from the
  // pond (drifted chats still count). Only Premium can talk with more.
  const peopleUsed = chats.length;
  const mySoulId = user?.soul_id
    ? `@${user.soul_id}`
    : user?.name ? `@${String(user.name).split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')}soul` : null;
  const pondFriends = chats.filter(c => c.connected).map(c => ({
    id: `pond-${c.id}`, soulId: c.connected, tags: c.lotus ? [problemLabel(c.lotus)] : [], chat: c,
  }));

  useEffect(() => {
    try { localStorage.setItem('sc-pond-problems', JSON.stringify(mine)); } catch { /* private mode */ }
  }, [mine]);

  // Only the very first fill shows "Filling the pond…". Later refetches (when
  // someone changes their struggles) keep the current lotuses on screen until
  // the new ones arrive, so the pond never blinks empty.
  const loadedOnce = useRef(false);
  const load = useCallback(async () => {
    if (!loadedOnce.current) setLoading(true);
    const r = await getLotuses(mine.filter(p => p !== 'other'));
    setLotuses(r.lotuses);
    setIsMock(r.isMock);
    setUnsupported(r.unsupported);
    loadedOnce.current = true;
    setLoading(false);
  }, [mine]);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (tab !== 'friends' || friends !== null) return;
    getConnections().then(r => setFriends(r.connections || []));
  }, [tab, friends]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const matching = useMemo(() => {
    const ranked = rankLotuses(lotuses, mine);
    if (filter === 'foryou' && mine.length) return ranked.filter(l => l.fit !== 'other');
    if (filter !== 'foryou' && filter !== 'all') return ranked.filter(l => (l.problems || []).includes(filter));
    return ranked;
  }, [lotuses, mine, filter]);
  useEffect(() => { setPage(0); }, [filter, mine]);
  const pages = Math.max(1, Math.ceil(matching.length / WINDOW_SIZE));
  const visible = useMemo(
    () => matching.slice((page % pages) * WINDOW_SIZE, (page % pages) * WINDOW_SIZE + WINDOW_SIZE).slice(0, SPOTS.length),
    [matching, page, pages],
  );

  const toggleMine = (id) => {
    setMine(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 2 ? prev : [...prev, id]);
  };
  const toggleTag = (id) => {
    setTags(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 2 ? prev : [...prev, id]);
  };

  const suggestions = useMemo(() => {
    if (!tags.includes('other')) return [];
    return suggestProblems(`${custom} ${text}`).filter(p => !tags.includes(p));
  }, [tags, custom, text]);

  const openChat = (c) => setChat({ lotus: c.lotus, chatId: c.id, isMock: String(c.id).startsWith('mock-'), initial: c.messages || [], bloomed: Boolean(c.bloomed), connected: c.connected || null });

  const openLotus = async (lotus) => {
    const existing = openChats.find(c => c.lotus?.id === lotus.id);
    if (existing) { openChat(existing); return; }
    if (!isPremium && peopleUsed >= FREE_CHAT_LIMIT) { setLimitHit(true); return; }
    try {
      const r = await resonate(lotus);
      const saved = rememberChat({ id: r.chatId, lotus: { id: lotus.id, text: lotus.text, problems: lotus.problems, customLabel: lotus.customLabel || null } });
      refreshChats();
      openChat(saved);
    } catch {
      setToast('Could not open that conversation. Please try again.');
    }
  };

  const submitLotus = async (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || tags.length === 0) return;
    if (needsCrisisSupport(t)) { setCrisis(true); return; }
    setFloating(true);
    try {
      const problems = tags.filter(p => p !== 'other');
      const r = await floatLotus({ text: t, problems, customLabel: tags.includes('other') ? custom.trim() : null });
      if (r.lotus) setLotuses(prev => [r.lotus, ...prev.filter(l => l.id !== r.lotus.id)]);
      setText(''); setTags([]); setCustom('');
      setToast('Your lotus is floating. We will let you know when someone feels it too.');
    } catch {
      setToast('Could not float your lotus. Please try again.');
    } finally {
      setFloating(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <main className="sp-page">
        <span className="sp-eyebrow"><Flower2 size={14} /> Feel Pond</span>
        <h1 className="sp-title">Feelings close to yours, right now.</h1>
        <p className="sp-sub">You don&apos;t pick people here. You respond to feelings. Tap a lotus that feels like yours, or float one of your own.</p>

        <div className="sp-tabs" role="tablist">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id}
              className={`sp-tab${tab === id ? ' is-on' : ''}`} onClick={() => setTab(id)}>
              <Icon size={16} />{label}
              {id === 'chats' && openChats.length > 0 && <span className="sp-badge">{openChats.length}</span>}
            </button>
          ))}
        </div>

        {tab === 'pond' && (
          <div className="sp-grid">
            {/* LEFT: the pond */}
            <section className="sp-card" aria-labelledby="sp-pond-title">
              <h2 className="sp-h2" id="sp-pond-title">The Lotus Pond</h2>
              <p className="sp-hint">Pick up to 2 things you are going through. You will see lotuses that share at least one.</p>
              <div className="sp-chips">
                {PICKABLE.filter(s => s.id !== 'other').map(s => (
                  <button key={s.id} type="button" className={`sp-chip${mine.includes(s.id) ? ' is-on' : ''}`}
                    aria-pressed={mine.includes(s.id)}
                    disabled={!mine.includes(s.id) && mine.length >= 2}
                    onClick={() => toggleMine(s.id)}>{s.label}</button>
                ))}
              </div>

              <div className="sp-filter">
                <button type="button" className={`sp-chip${filter === 'foryou' ? ' is-on' : ''}`} onClick={() => setFilter('foryou')}>For you</button>
                {mine.map(p => (
                  <button key={p} type="button" className={`sp-chip${filter === p ? ' is-on' : ''}`} onClick={() => setFilter(p)}>{LABEL[p]}</button>
                ))}
                <button type="button" className={`sp-chip${filter === 'all' ? ' is-on' : ''}`} onClick={() => setFilter('all')}>All feelings</button>
              </div>

              <div className="sp-pond">
                <div className="sp-ripple r1" style={{ width: '70%', height: 160, left: '15%', top: '38%' }} />
                <div className="sp-ripple r2" style={{ width: '44%', height: 100, left: '28%', top: '44%' }} />
                {loading && <p style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED }}>Filling the pond…</p>}
                {!loading && visible.length === 0 && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, color: BODY }}>
                    <img src={LOTUS_GOLD} alt="" style={{ width: 60, marginBottom: 10 }} />
                    <b style={{ color: DARK }}>{unsupported ? 'The pond is opening soon.' : 'The pond is quiet right now.'}</b>
                    <span style={{ fontSize: 13.5, marginTop: 4 }}>Float your own lotus. We will let you know when someone feels it too.</span>
                  </div>
                )}
                <AnimatePresence>
                  {!loading && visible.map((l, i) => {
                    const [x, y] = SPOTS[i];
                    return (
                      <motion.button key={l.id} type="button"
                        className={`sp-lotus${l.guide ? ' is-guide' : ''}${selected?.id === l.id ? ' is-sel' : ''}${i % 2 ? ' is-right' : ''}${i % 4 === 0 ? ' nudge-l' : i % 4 === 3 ? ' nudge-r' : ''}`}
                        style={{ left: `${x}%`, top: `${y}%` }}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelected(l)}
                        aria-label={`Lotus: ${l.text}`}>
                        <span className="sp-bob" style={{ animationDuration: `${6 + (i % 4)}s`, animationDelay: `${-(i * 0.9)}s` }}>
                        <img src={l.guide || l.mine ? LOTUS_GOLD : LOTUS_VIOLET} alt="" />
                        <span className="t">&ldquo;{l.text}&rdquo;</span>
                        <span className="k">
                          {l.guide ? 'SameFeel Guide' : l.mine ? 'Your lotus' : problemLabel(l)}
                        </span>
                        {!l.guide && l.felt > 0 && <span className="f">♥ {l.felt} felt this</span>}
                        </span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="sp-selected">
                {selected ? (
                  <>
                    <q>{selected.text}</q>
                    {!selected.mine && !selected.guide && (
                      <button type="button" className="sp-btn" onClick={() => openLotus(selected)}>I feel this too</button>
                    )}
                    {selected.guide && <span style={{ fontSize: 13, color: GOLD }}>A note from the SameFeel team</span>}
                    {selected.mine && <span style={{ fontSize: 13, color: MUTED }}>This is your lotus. It floats for 3 days.</span>}
                  </>
                ) : (
                  <span style={{ fontSize: 13.5, color: MUTED }}>Tap a lotus to read it and respond.</span>
                )}
              </div>

              <p className="sp-note"><ShieldCheck size={14} color="#3F7A5E" style={{ flexShrink: 0, marginTop: 2 }} />
                Everyone is anonymous until you both tap &ldquo;Connect&rdquo;. Then you see each other&apos;s SoulID and become Soul Friends. You can report or let a chat drift at any time.</p>
              {matching.length > WINDOW_SIZE && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12.5, color: MUTED }}>Showing {visible.length} of {matching.length} lotuses for you</span>
                  <button type="button" className="sp-btn sp-btn--ghost" style={{ padding: '9px 14px' }} onClick={() => { setPage(p => p + 1); setSelected(null); }}>
                    <RefreshCw size={14} />Show other lotuses
                  </button>
                </div>
              )}
              {!isPremium && (
                <p className="sp-note"><MessageCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  Free plan: you have talked with {Math.min(peopleUsed, FREE_CHAT_LIMIT)} of {FREE_CHAT_LIMIT} people from the pond. Premium lets you talk with as many as you like.</p>
              )}
              {limitHit && (
                <div className="sp-limit" role="alert">
                  <Lock size={15} />
                  <span style={{ flex: 1, minWidth: 200 }}>You have connected with {FREE_CHAT_LIMIT} people from the pond on the free plan. Upgrade to Premium to talk with more. Your current conversations stay open.</span>
                  <button type="button" className="sp-btn sp-btn--ghost" style={{ padding: '8px 12px' }} onClick={() => { setLimitHit(false); setTab('chats'); }}>My conversations</button>
                  <button type="button" className="sp-btn" style={{ padding: '8px 12px' }} onClick={() => navigate('/premium')}>See Premium</button>
                </div>
              )}
              {isMock && (
                <p className="sp-dev"><AlertTriangle size={12} />Sample lotuses: dev build only, no pond backend connected yet.</p>
              )}
            </section>

            {/* RIGHT: float your own + talk now */}
            <aside>
              <form className="sp-card sp-card--gold" onSubmit={submitLotus} aria-labelledby="sp-float-title">
                <h2 className="sp-h2" id="sp-float-title">Float your lotus</h2>
                <p className="sp-hint">One line. No name. It floats on the pond for 3 days.</p>
                <textarea className="sp-textarea" value={text} maxLength={MAX_TEXT}
                  onChange={e => { setText(e.target.value); setCrisis(false); }}
                  placeholder="What is on your heart right now?" aria-label="Your lotus" />
                <div className="sp-count">{text.length} / {MAX_TEXT}</div>

                <p className="sp-hint" style={{ margin: '10px 0 8px', fontWeight: 700, letterSpacing: '.1em', color: GOLD, fontSize: 11.5 }}>WHAT IS IT ABOUT? (UP TO 2)</p>
                <div className="sp-chips">
                  {PICKABLE.map(s => (
                    <button key={s.id} type="button" className={`sp-chip${tags.includes(s.id) ? ' is-on' : ''}`}
                      aria-pressed={tags.includes(s.id)}
                      disabled={!tags.includes(s.id) && tags.length >= 2}
                      onClick={() => toggleTag(s.id)}>{s.label}</button>
                  ))}
                </div>
                {tags.includes('other') && (
                  <input className="sp-input" value={custom} maxLength={40} onChange={e => setCustom(e.target.value)}
                    placeholder="Say it your way, e.g. caring for a parent" aria-label="Your own words" />
                )}
                {suggestions.length > 0 && tags.length < 2 && (
                  <div className="sp-sugg">
                    Closest matches: <b>{suggestions.map(p => LABEL[p]).join(' and ')}</b>. Add so more people who understand can find you?
                    <button type="button" onClick={() => setTags(prev => (prev.length >= 2 ? prev : [...prev, suggestions[0]]))}>
                      Add {LABEL[suggestions[0]]}
                    </button>
                  </div>
                )}
                {crisis && (
                  <div className="sp-crisis" role="alert">
                    <b>It sounds like you are carrying something really heavy right now.</b> You deserve support straight away from someone trained to help.
                    <div>
                      <a href="tel:14416"><Phone size={14} />Tele-MANAS 14416</a>
                      <a href="/crisis-support">More crisis support</a>
                    </div>
                  </div>
                )}
                <button type="submit" className="sp-btn" style={{ width: '100%', marginTop: 16 }}
                  disabled={floating || !text.trim() || tags.length === 0}>
                  {floating ? 'Floating…' : 'Float it on the pond'}
                </button>
                <p className="sp-note"><Clock size={14} style={{ flexShrink: 0, marginTop: 2 }} />If nobody is around right now, we will send you a gentle note when someone feels this too.</p>
              </form>

              <button type="button" className="sp-talk is-soon" aria-disabled="true" onClick={() => setToast('Talk now is on its way. Float a lotus meanwhile and we will let you know.')}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: '#F6EFE2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageCircle size={19} color={GOLD} /></span>
                <span style={{ flex: 1 }}>
                  <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14.5, color: DARK }}>Talk now<span className="sp-soon">Coming soon</span></b>
                  <span style={{ fontSize: 12.5, color: MUTED }}>Pair with someone online who shares one of your problems</span>
                </span>

              </button>
            </aside>
          </div>
        )}

        {tab === 'chats' && (
          <section className="sp-card" style={{ maxWidth: 720 }}>
            <h2 className="sp-h2">Your conversations</h2>
            <p className="sp-hint">Anonymous chats that started from a lotus. If you both tap Connect, you become Soul Friends and see each other&apos;s SoulID.</p>
            {openChats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 10px', color: BODY }}>
                <img src={LOTUS_GOLD} alt="" style={{ width: 56 }} />
                <p style={{ margin: '10px 0 0' }}>No conversations yet. Tap a lotus in the pond and choose &ldquo;I feel this too&rdquo;.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {openChats.map(c => {
                  const last = (c.messages || [])[c.messages.length - 1];
                  return (
                    <button key={c.id} type="button" className="sp-row" onClick={() => openChat(c)}>
                      <div className="sp-av">S</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: DARK }}>
                          &ldquo;{c.lotus?.text}&rdquo;
                        </div>
                        <div style={{ fontSize: 12.5, color: MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.connected ? `Soul Friend ${c.connected} · ` : c.bloomed ? 'Connect request sent · ' : ''}{last ? `You: ${last.text}` : 'No messages yet'}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: '#3F7A5E', fontWeight: 600, whiteSpace: 'nowrap' }}>{c.lotus ? problemLabel(c.lotus) : ''}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {!isPremium && (
              <p className="sp-note"><Lock size={14} style={{ flexShrink: 0, marginTop: 2 }} />Free plan: you can talk with {FREE_CHAT_LIMIT} people from the pond in total. Premium removes the limit.</p>
            )}
          </section>
        )}

        {tab === 'friends' && (
          <section className="sp-card" style={{ maxWidth: 720 }}>
            <h2 className="sp-h2">Soul Friends</h2>
            <p className="sp-hint">People you connected with from the pond. You both chose each other.</p>
            {mySoulId && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 16, background: 'linear-gradient(160deg,#FBF1EC,#F1ECF9)', marginBottom: 14 }}>
                <Flower2 size={18} color={P} />
                <span style={{ fontSize: 13.5, color: BODY }}>Your SoulID <b style={{ color: P }}>{mySoulId}</b>. It is only shown to people you both choose to connect with.</span>
              </div>
            )}
            {pondFriends.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
                {pondFriends.filter(f => !removedFriends.includes(f.id)).map(f => (
                  <button key={f.id} type="button" className="sp-row" onClick={() => setProfile({
                    key: f.id, name: f.soulId.replace('@', '').replace(/soul$/, '').replace(/^./, c => c.toUpperCase()), soulId: f.soulId,
                    tags: f.tags, connectedAt: f.chat?.updatedAt ? new Date(f.chat.updatedAt).toISOString() : null,
                    metAt: f.chat?.createdAt ? new Date(f.chat.createdAt).toISOString() : null, metFrom: f.chat?.lotus?.text, lastActive: f.chat?.lastActive || null,
                    onMessage: () => { setProfile(null); openChat(f.chat); },
                  })}>
                    <div className="sp-av">{f.soulId.replace('@', '')[0].toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: P }}>{f.soulId}</div>
                      <div style={{ fontSize: 12.5, color: MUTED }}>Connected from the pond · {f.tags.join(' · ')}</div>
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: P }}>View ›</span>
                  </button>
                ))}
              </div>
            )}
            {friends === null ? (
              <p style={{ color: MUTED }}>Loading…</p>
            ) : friends.length === 0 && pondFriends.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 10px', color: BODY }}>
                <img src={LOTUS_GOLD} alt="" style={{ width: 56 }} />
                <p style={{ margin: '10px 0 0' }}>When you and someone both tap &ldquo;Connect&rdquo; in a conversation, they will appear here with their SoulID.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {friends.filter(f => !removedFriends.includes(f.id)).map(f => (
                  <button key={f.id} type="button" className="sp-friend" onClick={() => setProfile({
                    key: f.id, name: f.name, avatar: f.avatar_url,
                    soulId: f.soulId || (f.name && f.name !== 'Anonymous' ? `@${f.name.toLowerCase().replace(/[^a-z0-9]/g, '')}soul` : null),
                    tags: f.tags || [f.problem], connectedAt: f.connectedAt, metAt: f.metAt, metFrom: f.metFrom,
                    bio: f.bio, mood: f.mood, supportNeed: f.supportNeed, streak: f.streak, petals: f.petals, stories: f.stories, lastActive: f.lastActive,
                    onMessage: () => { setProfile(null); navigate('/chat'); },
                  })}>
                    {f.avatar_url ? <img src={f.avatar_url} alt="" className="sp-av" /> : <div className="sp-av">{(f.name || 'S')[0]}</div>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>
                        {f.name || 'Soul Friend'}
                        {f.name && f.name !== 'Anonymous' && <span style={{ fontWeight: 500, color: P, fontSize: 13, marginLeft: 6 }}>@{f.name.toLowerCase().replace(/[^a-z0-9]/g, '')}soul</span>}
                      </div>
                      <div style={{ fontSize: 12.5, color: MUTED }}>
                        {(f.tags || [f.problem]).filter(Boolean).join(' · ')}
                        {f.connectedAt ? ` · since ${new Date(f.connectedAt).toLocaleDateString()}` : ''}
                      </div>
                    </div>
                    <ChevronLeft size={18} color={MUTED} style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <SoulFriendProfile
        friend={profile}
        myStruggles={(mine || []).map(id => LABEL[id]).filter(Boolean)}
        onClose={closeProfile}
        onMessage={() => profile?.onMessage?.()}
        onRemove={() => { setRemovedFriends(r => [...r, profile.key]); setProfile(null); setToast('Removed from your Soul Friends.'); }}
        onToast={setToast}
      />
      {createPortal(<AnimatePresence>
        {chat && (
          <PondChat key={chat.chatId} lotus={chat.lotus} chatId={chat.chatId} isMock={chat.isMock}
            initial={chat.initial} initialBloomed={chat.bloomed} initialConnected={chat.connected}
            onClose={() => { setChat(null); refreshChats(); }} onToast={setToast} onChange={refreshChats} />
        )}
      </AnimatePresence>, document.body)}

      {toast && <div className="sp-toast" role="status">{toast}</div>}
    </>
  );
}
