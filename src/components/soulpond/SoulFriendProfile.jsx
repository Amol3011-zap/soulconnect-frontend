import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, MessageCircle, Sparkles, Flower2, MoreHorizontal, BellOff, UserMinus, Flag,
  ShieldCheck, Quote, HeartHandshake, Flame, BookHeart, CalendarHeart,
} from 'lucide-react';

/* Soul Friend profile: what two people see about each other once BOTH tapped Connect.
   Only feelings level info. Never phone, email, exact location or real surname. */

const P = '#6B4FA0';
const DARK = '#221B3A';
const BODY = '#5B5470';
const MUTED = '#6E6784';
const GOLD = '#8A6A3E';

const MOODS = {
  sunny:   { emoji: '☀️', label: 'Feeling light today',   ring: '#F4C542', bg: '#FFF6DA' },
  hopeful: { emoji: '🌤️', label: 'Feeling hopeful today', ring: '#F2A65A', bg: '#FFEBD9' },
  cloudy:  { emoji: '☁️', label: 'A bit cloudy today',     ring: '#A7B1C9', bg: '#EEF1F7' },
  rainy:   { emoji: '🌧️', label: 'Having a heavy day',     ring: '#7C93D8', bg: '#E7ECFA' },
  stormy:  { emoji: '⛈️', label: 'Going through a storm',  ring: '#8B6FD1', bg: '#EEE8FB' },
};

const css = `
.sfp-ov{position:fixed;inset:0;z-index:1260;background:rgba(30,24,51,.42);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif;color:${DARK}}
.sfp{position:relative;width:min(460px,100%);max-height:92vh;overflow-y:auto;background:#fff;border-radius:28px;box-shadow:0 30px 70px rgba(30,24,51,.28);scrollbar-width:none}
.sfp::-webkit-scrollbar{display:none}
.sfp-hero{position:relative;height:132px;background:linear-gradient(135deg,#E9DFFA 0%,#F7E3E6 55%,#FCEFD9 100%);overflow:hidden}
.sfp-hero i{position:absolute;border-radius:50%;background:rgba(255,255,255,.45)}
.sfp-hero img.l{position:absolute;width:34px;opacity:.55}
.sfp-top{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;z-index:2}
.sfp-ib{width:38px;height:38px;border-radius:12px;border:0;background:rgba(255,255,255,.75);backdrop-filter:blur(6px);color:${DARK};display:flex;align-items:center;justify-content:center;cursor:pointer}
.sfp-av{position:relative;margin:-58px auto 0;width:112px;height:112px;border-radius:50%;padding:5px;background:#fff;z-index:1}
.sfp-av .ring{width:100%;height:100%;border-radius:50%;padding:4px}
.sfp-av .ph{width:100%;height:100%;border-radius:50%;overflow:hidden;background:linear-gradient(135deg,#C9B8E8,#F3D9C4);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',Georgia,serif;font-size:40px;font-weight:700;color:#fff;border:3px solid #fff;box-sizing:border-box}
.sfp-av .ph img{width:100%;height:100%;object-fit:cover;display:block}
.sfp-av .mood{position:absolute;right:2px;bottom:6px;width:34px;height:34px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 10px rgba(34,27,58,.15)}
.sfp-seen{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:4px;font-size:12.5px;font-weight:600;color:${MUTED}}
.sfp-seen i{width:8px;height:8px;border-radius:50%;background:#B9B3C8}
.sfp-seen.on{color:#2F7A55}
.sfp-seen.on i{background:#34B26A;box-shadow:0 0 0 3px rgba(52,178,106,.18)}
.sfp-av .online{position:absolute;left:12px;bottom:12px;width:18px;height:18px;border-radius:50%;background:#34B26A;border:3px solid #fff}
.sfp-id{text-align:center;padding:10px 22px 0}
.sfp-id h2{font-family:'Playfair Display',Georgia,serif;font-size:26px;margin:0;line-height:1.2}
.sfp-id .sid{display:inline-block;margin-top:4px;font-weight:700;font-size:14px;color:${P}}
.sfp-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:10px}
.sfp-chip{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:700}
.sfp-body{padding:18px 20px calc(20px + env(safe-area-inset-bottom,0px))}
.sfp-quote{position:relative;padding:14px 16px 14px 44px;border-radius:18px;background:#FCF8F0;border:1px solid #F1E3C8;font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:16px;line-height:1.45;color:#3A3350}
.sfp-quote svg{position:absolute;left:14px;top:14px;color:${GOLD}}
.sfp-quote small{display:block;margin-top:6px;font-family:'Plus Jakarta Sans',Inter,sans-serif;font-style:normal;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${GOLD}}
.sfp-h{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};margin:20px 0 10px}
.sfp-tags{display:flex;flex-wrap:wrap;gap:8px}
.sfp-tag{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 13px;border-radius:12px;background:#F6F3FA;border:1px solid #ECE5F6;font-size:13px;font-weight:600;color:#4E3680}
.sfp-tag.shared{background:linear-gradient(135deg,#EFE7FC,#FBEFF0);border-color:#D9CBF1}
.sfp-tag.shared b{font-size:10.5px;font-weight:800;color:#fff;background:${P};border-radius:999px;padding:2px 7px}
.sfp-help{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:16px;background:#EEF6F1;border:1px solid #D7EBDF;font-size:13.5px;color:#2F5C46}
.sfp-help svg{flex-shrink:0;color:#3F7A5E}
.sfp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.sfp-stat{padding:12px 8px;border-radius:16px;background:#FBFAFD;border:1px solid #EEE8F6;text-align:center}
.sfp-stat .ic{width:34px;height:34px;margin:0 auto 6px;border-radius:11px;display:flex;align-items:center;justify-content:center}
.sfp-stat b{display:block;font-size:19px;font-weight:800;line-height:1.1}
.sfp-stat span{font-size:11.5px;color:${MUTED}}
.sfp-time{position:relative;padding-left:22px}
.sfp-time::before{content:'';position:absolute;left:6px;top:6px;bottom:6px;width:2px;border-radius:2px;background:linear-gradient(#D9CBF1,#F1E3C8)}
.sfp-time div{position:relative;font-size:13.5px;color:${BODY};padding:4px 0}
.sfp-time div::before{content:'';position:absolute;left:-20px;top:9px;width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid ${P}}
.sfp-time b{color:${DARK};font-weight:700}
.sfp-acts{display:flex;gap:10px;margin-top:22px}
.sfp-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:50px;border-radius:16px;border:0;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer}
.sfp-btn.pri{background:linear-gradient(180deg,#7457AB,${P} 45%,#5B3F90);color:#fff;box-shadow:0 8px 18px rgba(107,79,160,.26)}
.sfp-btn.sec{background:#F6EFE2;color:${GOLD}}
.sfp-btn.sec:disabled{opacity:.75;cursor:default}
.sfp-priv{display:flex;gap:8px;align-items:flex-start;margin:16px 2px 0;font-size:12px;line-height:1.5;color:${MUTED}}
.sfp-priv svg{flex-shrink:0;margin-top:1px;color:#3F7A5E}
.sfp-menu{position:absolute;top:56px;right:12px;z-index:3;min-width:200px;padding:6px;border-radius:16px;background:#fff;box-shadow:0 14px 34px rgba(34,27,58,.18);border:1px solid #EEE8F6}
.sfp-menu button{width:100%;display:flex;align-items:center;gap:10px;padding:11px 12px;border:0;background:none;border-radius:10px;font-size:14px;font-weight:600;font-family:inherit;color:${DARK};cursor:pointer;text-align:left}
.sfp-menu button:hover{background:#F6F3FA}
.sfp-menu button.danger{color:#B4402C}
.sfp-confirm{margin-top:16px;padding:14px;border-radius:16px;background:#FDF1EE;border:1px solid #F3D3CB;font-size:13.5px;color:#7A3A2A}
.sfp-confirm div{display:flex;gap:8px;margin-top:10px}
.sfp-confirm button{flex:1;height:40px;border-radius:12px;border:0;font-family:inherit;font-weight:700;cursor:pointer}
@media(max-width:520px){
  .sfp-ov{padding:0;align-items:flex-end}
  .sfp{width:100%;border-radius:28px 28px 0 0;max-height:94vh}
}
`;

const daysSince = (iso) => (iso ? Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400e3)) : null);
const lastSeen = (iso) => {
  if (!iso) return null;
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 5) return { now: true, text: 'Active now' };
  if (mins < 60) return { now: false, text: `Active ${mins} min ago` };
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return { now: false, text: `Active ${hrs}h ago` };
  const d = Math.floor(hrs / 24);
  if (d === 1) return { now: false, text: 'Active yesterday' };
  if (d < 7) return { now: false, text: `Active ${d} days ago` };
  return { now: false, text: 'Active a while ago' };
};
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '');

/**
 * friend: { name, soulId, avatar, tags[], connectedAt, metAt, bio, mood, supportNeed,
 *           streak, petals, stories, metFrom }
 * myStruggles: labels of the viewer's own struggles, used to highlight common ground.
 */
export default function SoulFriendProfile({ friend, myStruggles = [], onClose, onMessage, onRemove, onToast }) {
  const [menu, setMenu] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [petal, setPetal] = useState(false);

  useEffect(() => {
    if (!friend) return undefined;
    setMenu(false); setConfirm(false); setPetal(false);
    document.body.classList.add('sp-chat-open');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('sp-chat-open'); window.removeEventListener('keydown', onKey); };
  }, [friend, onClose]);

  const f = friend || {};
  const name = f.name || '';
  const isAnon = !f.name || f.name === 'Anonymous';
  const display = isAnon ? 'Anonymous Soul' : f.name;
  const first = isAnon ? 'they' : f.name;
  const mood = MOODS[f.mood];
  const days = daysSince(f.connectedAt);
  const seen = lastSeen(f.lastActive);
  const mine = useMemo(() => new Set(myStruggles.map(s => String(s).toLowerCase())), [myStruggles]);
  const tags = (f.tags || []).filter(Boolean);
  const sharedCount = tags.filter(t => mine.has(t.toLowerCase())).length;

  const givePetal = () => {
    if (petal) return;
    setPetal(true);
    onToast?.(`You sent ${isAnon ? 'them' : f.name} a petal of kindness 🌸`);
  };

  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {friend && (
        <motion.div className="sfp-ov" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.12, delay: 0.1 } }}>
          <style>{css}</style>
          <motion.div className="sfp" role="dialog" aria-modal="true" aria-label={`${display} profile`}
            onClick={e => { e.stopPropagation(); if (menu) setMenu(false); }}
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ duration: 0.22 }}>

            {/* Hero */}
            <div className="sfp-hero" aria-hidden="true">
              <i style={{ width: 120, height: 120, left: -30, top: -40 }} />
              <i style={{ width: 70, height: 70, right: 40, top: 30 }} />
              <img className="l" src="/brand/logo/soulconnect-lotus-outline.svg" alt="" style={{ right: 18, bottom: 14 }} />
              <img className="l" src="/brand/logo/soulconnect-lotus-mark.svg" alt="" style={{ left: 26, bottom: 22, width: 26 }} />
            </div>
            <div className="sfp-top">
              <button type="button" className="sfp-ib" onClick={onClose} aria-label="Close"><X size={19} /></button>
              <button type="button" className="sfp-ib" onClick={e => { e.stopPropagation(); setMenu(v => !v); }} aria-label="More options" aria-expanded={menu}><MoreHorizontal size={19} /></button>
            </div>
            <AnimatePresence>
              {menu && (
                <motion.div className="sfp-menu" onClick={e => e.stopPropagation()}
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                  <button type="button" onClick={() => { setMenu(false); onToast?.('Notifications muted for this friend.'); }}><BellOff size={16} />Mute notifications</button>
                  <button type="button" onClick={() => { setMenu(false); setConfirm(true); }}><UserMinus size={16} />Remove Soul Friend</button>
                  <button type="button" className="danger" onClick={() => { setMenu(false); onToast?.('Thanks for telling us. Our team will review this privately.'); }}><Flag size={16} />Report</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Avatar with mood ring */}
            <div className="sfp-av">
              <div className="ring" style={{ background: mood ? `conic-gradient(${mood.ring}, #C9B8E8, ${mood.ring})` : 'linear-gradient(135deg,#C9B8E8,#F3D9C4)' }}>
                <div className="ph">{f.avatar ? <img src={f.avatar} alt="" /> : display[0].toUpperCase()}</div>
              </div>
              {mood && <span className="mood" title={mood.label}>{mood.emoji}</span>}
              {seen?.now && <span className="online" aria-label="Online now" />}
            </div>

            <div className="sfp-id">
              <h2>{display}</h2>
              {f.soulId && <span className="sid">{f.soulId}</span>}
              {seen && <div className={`sfp-seen${seen.now ? ' on' : ''}`}><i />{seen.text}</div>}
              <div className="sfp-chips">
                <span className="sfp-chip" style={{ background: '#EFE9F8', color: P }}><Flower2 size={13} />Soul Friend{days !== null ? ` · ${days === 0 ? 'today' : `${days} day${days === 1 ? '' : 's'}`}` : ''}</span>
                {mood && <span className="sfp-chip" style={{ background: mood.bg, color: DARK }}>{mood.emoji} {mood.label}</span>}
              </div>
            </div>

            <div className="sfp-body">
              {/* In their words */}
              {f.bio && (
                <div className="sfp-quote">
                  <Quote size={18} />
                  {f.bio}
                  <small>In {isAnon ? 'their' : `${f.name}'s`} words</small>
                </div>
              )}

              {/* Common ground */}
              {tags.length > 0 && (
                <>
                  <div className="sfp-h"><HeartHandshake size={14} />{sharedCount > 0 ? 'Your common ground' : `What ${first} is working through`}</div>
                  <div className="sfp-tags">
                    {tags.map(t => {
                      const shared = mine.has(t.toLowerCase());
                      return <span key={t} className={`sfp-tag${shared ? ' shared' : ''}`}>{t}{shared && <b>You too</b>}</span>;
                    })}
                  </div>
                </>
              )}

              {/* What helps */}
              {f.supportNeed && (
                <>
                  <div className="sfp-h"><Sparkles size={14} />What helps {isAnon ? 'them' : f.name}</div>
                  <div className="sfp-help"><HeartHandshake size={20} /><span><b>{f.supportNeed}.</b> A small check in goes a long way.</span></div>
                </>
              )}

              {/* Healing journey */}
              {(f.streak != null || f.petals != null || f.stories != null) && (
                <>
                  <div className="sfp-h"><Flame size={14} />Healing journey</div>
                  <div className="sfp-stats">
                    <div className="sfp-stat"><div className="ic" style={{ background: '#FFEBD9', color: '#D9772B' }}><Flame size={18} /></div><b>{f.streak ?? 0}</b><span>day streak</span></div>
                    <div className="sfp-stat"><div className="ic" style={{ background: '#FBE7EF', color: '#C2477A' }}><Flower2 size={18} /></div><b>{(f.petals ?? 0) + (petal ? 1 : 0)}</b><span>petals</span></div>
                    <div className="sfp-stat"><div className="ic" style={{ background: '#EFE9F8', color: P }}><BookHeart size={18} /></div><b>{f.stories ?? 0}</b><span>stories</span></div>
                  </div>
                </>
              )}

              {/* Your story together */}
              <div className="sfp-h"><CalendarHeart size={14} />Your story together</div>
              <div className="sfp-time">
                {f.metAt && <div>Met in the pond <b>{fmtDate(f.metAt)}</b>{f.metFrom ? <> over &ldquo;{f.metFrom}&rdquo;</> : null}</div>}
                {f.connectedAt && <div>You both chose Connect <b>{fmtDate(f.connectedAt)}</b></div>}
                <div>Still growing, one conversation at a time 🌱</div>
              </div>

              {confirm ? (
                <div className="sfp-confirm" role="alertdialog" aria-label="Remove Soul Friend">
                  Remove {display}? You will stop seeing each other&apos;s SoulID. Nobody is notified.
                  <div>
                    <button type="button" style={{ background: '#fff', color: DARK }} onClick={() => setConfirm(false)}>Keep</button>
                    <button type="button" style={{ background: '#B4402C', color: '#fff' }} onClick={() => { setConfirm(false); onRemove?.(); }}>Remove</button>
                  </div>
                </div>
              ) : (
                <div className="sfp-acts">
                  <button type="button" className="sfp-btn pri" onClick={onMessage}><MessageCircle size={18} />Message</button>
                  <button type="button" className="sfp-btn sec" onClick={givePetal} disabled={petal}><Sparkles size={17} />{petal ? 'Petal sent' : 'Give a petal'}</button>
                </div>
              )}

              <p className="sfp-priv"><ShieldCheck size={14} />{isAnon ? 'They see' : `${f.name} sees`} the same card about you. Phone number, email and exact location are never shown.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
