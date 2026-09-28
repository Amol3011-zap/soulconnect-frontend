import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { AVATARS, MOODS, avatarSrc, saveAvatar } from '../data/avatars';

const P = '#6B4FA0';

const css = `
.ap-ov{position:fixed;inset:0;z-index:1300;background:rgba(30,24,51,.4);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif}
.ap{width:min(480px,100%);max-height:92vh;display:flex;flex-direction:column;background:#fff;border-radius:28px;box-shadow:0 30px 70px rgba(30,24,51,.28);overflow:hidden}
.ap-h{display:flex;align-items:flex-start;gap:12px;padding:18px 20px 4px}
.ap-h b{display:block;font-family:'Playfair Display',Georgia,serif;font-size:22px;color:#1E1833}
.ap-x{margin-left:auto;width:38px;height:38px;border:0;border-radius:12px;background:#F6F3FA;color:#77718C;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ap-scroll{overflow-y:auto;padding:0 20px 8px}
.ap-hero{display:flex;flex-direction:column;align-items:center;padding:6px 0 4px}
.ap-hero .big{width:132px;height:132px;border-radius:50%;background:radial-gradient(circle at 50% 38%,#FFFFFF 0%,#F4EEFB 60%,#E6DCF6 100%);box-shadow:0 0 0 4px #fff,0 0 0 6px #E6DDF3}
.ap-hero .big img{width:100%;height:100%;border-radius:50%;display:block}
.ap-hero small{margin-top:10px;font-size:13px;color:#77718C}
.ap-lbl{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8A6A3E;margin:16px 0 10px}
.ap-moods{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ap-m{display:flex;align-items:center;gap:8px;padding:6px 10px 6px 6px;border-radius:999px;border:1.5px solid #E6DDF3;background:#fff;cursor:pointer;font-family:inherit;font-size:13.5px;font-weight:600;color:#3A3350}
.ap-m img{width:34px;height:34px;border-radius:50%;background:#F4EEFB;flex-shrink:0}
.ap-m.on{border-color:${P};background:#F6F2FC;color:${P}}
.ap-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
.ap-o{position:relative;aspect-ratio:1;border-radius:50%;border:2.5px solid transparent;padding:0;cursor:pointer;background:radial-gradient(circle at 50% 38%,#FFFFFF 0%,#F4EEFB 60%,#E6DCF6 100%)}
.ap-o img{width:100%;height:100%;border-radius:50%;display:block}
.ap-o.on{border-color:${P};box-shadow:0 0 0 3px rgba(107,79,160,.16)}
.ap-o .ck{position:absolute;right:-3px;bottom:-3px;width:20px;height:20px;border-radius:50%;background:${P};color:#fff;display:flex;align-items:center;justify-content:center;border:2px solid #fff}
.ap-f{padding:12px 20px calc(16px + env(safe-area-inset-bottom,0px));border-top:1px solid #F0EBF6}
.ap-f p{font-size:12px;color:#77718C;margin:0 0 10px;text-align:center;line-height:1.45}
.ap-btn{width:100%;height:50px;border:0;border-radius:14px;background:linear-gradient(180deg,#7457AB,${P} 45%,#5B3F90);color:#fff;font-weight:700;font-size:15.5px;font-family:inherit;cursor:pointer;box-shadow:0 8px 20px rgba(107,79,160,.25)}
.ap-btn:disabled{background:#D9D0EA;box-shadow:none;cursor:default}
@media(max-width:520px){
  .ap-ov{padding:0;align-items:flex-end}
  .ap{width:100%;border-radius:26px 26px 0 0}
  .ap-grid{grid-template-columns:repeat(4,1fr)}
  .ap-moods{grid-template-columns:repeat(2,1fr)}
}
`;

/** Pick how you look and how you feel today. Bottom sheet on phones. */
export default function AvatarPicker({ open, current, currentMood = 'calm', onClose, onSaved }) {
  const [pick, setPick] = useState(current || 'a01');
  const [mood, setMood] = useState(currentMood);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) { setPick(current || 'a01'); setMood(currentMood || 'calm'); } }, [open, current, currentMood]);

  const unchanged = pick === current && mood === currentMood;
  const save = async () => {
    setSaving(true);
    await saveAvatar(pick, mood);
    setSaving(false);
    onSaved?.(pick, mood);
    onClose?.();
  };
  const moodInfo = MOODS.find((m) => m.id === mood);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="ap-ov" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <style>{css}</style>
          <motion.div className="ap" role="dialog" aria-modal="true" aria-labelledby="ap-title" onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.22 }}>
            <div className="ap-h">
              <b id="ap-title">Your avatar</b>
              <button type="button" className="ap-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
            </div>

            <div className="ap-scroll">
              <div className="ap-hero">
                <div className="big"><img src={avatarSrc(pick, mood)} alt="" /></div>
                <small>{moodInfo?.hint}</small>
              </div>

              <div className="ap-lbl">How are you feeling today?</div>
              <div className="ap-moods" role="radiogroup" aria-label="Mood">
                {MOODS.map((m) => (
                  <button key={m.id} type="button" role="radio" aria-checked={mood === m.id}
                    className={`ap-m${mood === m.id ? ' on' : ''}`} onClick={() => setMood(m.id)}>
                    <img src={avatarSrc(pick, m.id)} alt="" loading="lazy" />{m.label}
                  </button>
                ))}
              </div>

              <div className="ap-lbl">Choose your look</div>
              <div className="ap-grid" role="radiogroup" aria-label="Look">
                {AVATARS.map((a) => (
                  <button key={a.id} type="button" role="radio" aria-checked={pick === a.id} aria-label={a.label}
                    className={`ap-o${pick === a.id ? ' on' : ''}`} onClick={() => setPick(a.id)}>
                    <img src={avatarSrc(a.id, mood)} alt="" loading="lazy" />
                    {pick === a.id && <span className="ck"><Check size={12} strokeWidth={3} /></span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="ap-f">
              <p>Only Soul Friends see your avatar. Change your mood whenever it changes.</p>
              <button type="button" className="ap-btn" onClick={save} disabled={saving || unchanged}>
                {saving ? 'Saving…' : unchanged ? 'Saved' : 'Save'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
