import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  HeartHandshake, PhoneCall, LifeBuoy, ShieldCheck, Users, Database, CalendarCheck,
  Check, Eraser, ArrowDown,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────────
   SameFeel joining agreement.

   Shown once, right after signup. The person must scroll to the end, type
   their name, sign, and tick accept before they can enter the app.

   CONSENT_VERSION must be bumped whenever the wording below changes, so the
   stored record always says which text a person actually agreed to.
   ────────────────────────────────────────────────────────────────────────── */
export const CONSENT_VERSION = '2026-10-01';

const P = '#6B4FA0';
const DARK = '#221B3A';
const BODY = '#4A4560';
const MUTED = '#6E6784';

const SECTIONS = [
  {
    icon: HeartHandshake,
    tone: '#EFE9F8',
    ink: P,
    title: 'This is support, not treatment',
    points: [
      'SameFeel is a place to share feelings and feel less alone. It is not therapy, counselling, diagnosis or medical advice.',
      'The people you talk to are fellow members, not licensed professionals, unless a profile clearly says so.',
      'Nothing here replaces care from a doctor or therapist. Please keep seeing yours.',
    ],
  },
  {
    icon: PhoneCall,
    tone: '#FDECEC',
    ink: '#C0392B',
    title: 'In an emergency, call real help',
    points: [
      'SameFeel is not an emergency service and nobody here is on call for crises.',
      'If you or someone else is in danger, call 112, or Tele MANAS on 14416, which is free and open 24 hours.',
      'You will always find these numbers on the Emergency page in the app.',
    ],
  },
  {
    icon: LifeBuoy,
    tone: '#FFF1E8',
    ink: '#B4542A',
    title: 'If you are thinking of hurting yourself',
    points: [
      'Please talk to someone trained for this, right now. Tele MANAS on 14416 and AASRA on 9820466726 are free, open 24 hours, and answered by real people.',
      'Members here care, but they are not trained for this and may not be online. Waiting for a reply is not safe when you need help today.',
      'You are not in trouble and you are not unwelcome. We just want you with someone who can do more for you than we can.',
      'Please do not describe methods of self harm anywhere on SameFeel. It can seriously hurt someone else who reads it.',
      'If you tell us someone is in immediate danger, we may pass that on to people who can help.',
    ],
  },
  {
    icon: ShieldCheck,
    tone: '#EAF4EE',
    ink: '#2F7A55',
    title: 'Share your heart, not your details',
    points: [
      'You are anonymous here by default. Please keep it that way.',
      'Never share your full name, phone number, address, workplace, school, passwords, or bank and UPI details.',
      'Never send money to anyone you meet here. If someone asks, report them.',
      'If you ever choose to meet someone offline, that is your own decision and your own risk. Meet in public and tell someone you trust.',
    ],
  },
  {
    icon: Users,
    tone: '#FFF4E2',
    ink: '#9A6B1F',
    title: 'Be kind, keep it safe',
    points: [
      'No harassment, hate, threats, or unwanted romantic or sexual messages.',
      'Do not describe methods of self harm or encourage anyone to hurt themselves.',
      'Do not sell, advertise, or recruit here.',
      'What people share with you is theirs. Do not screenshot it or repost it anywhere else.',
      'Accounts that break these rules can be suspended or removed.',
    ],
  },
  {
    icon: Database,
    tone: '#EEF1FA',
    ink: '#3A5BA0',
    title: 'Your information and your choices',
    points: [
      'We store your account details and what you choose to write, such as stories, messages and mood check ins.',
      'What you write about your wellbeing is sensitive, so it is kept secure and is never sold.',
      'Content that is reported for safety may be read by our moderation team.',
      'You can see, correct, download or delete your information, and withdraw this consent, at any time from Settings.',
      'Withdrawing consent closes your account, because we cannot run the service without it.',
    ],
  },
  {
    icon: CalendarCheck,
    tone: '#F6EFE2',
    ink: '#8A6A3E',
    title: 'Who can join',
    points: [
      'You must be 18 or older to use SameFeel.',
      'You confirm the details you gave at signup are true.',
    ],
  },
];

const css = `
.cd-ov{position:fixed;inset:0;z-index:1400;background:rgba(30,24,51,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif;color:${DARK}}
.cd{width:min(520px,100%);max-height:92vh;display:flex;flex-direction:column;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 30px 70px rgba(30,24,51,.3)}
.cd-head{padding:22px 24px 16px;background:linear-gradient(135deg,#F3EDFB,#FBF1EC);border-bottom:1px solid #EEE8F6}
.cd-head img{width:34px;height:34px;display:block;margin-bottom:10px;border-radius:10px;border:1px solid rgba(109,74,255,0.38);box-sizing:border-box}
.cd-head h2{font-family:'Playfair Display',Georgia,serif;font-size:23px;margin:0;line-height:1.25}
.cd-head p{margin:6px 0 0;font-size:13.5px;line-height:1.5;color:${BODY}}
.cd-scroll{flex:1;overflow-y:auto;padding:18px 24px 4px;scroll-behavior:smooth}
.cd-sec{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid #F2EEF8}
.cd-sec:last-of-type{border-bottom:0}
.cd-sec .ic{width:38px;height:38px;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cd-sec h3{font-size:15px;margin:6px 0 7px;line-height:1.3}
.cd-sec ul{margin:0;padding-left:17px}
.cd-sec li{font-size:13.5px;line-height:1.6;color:${BODY};margin-bottom:5px}
.cd-sec li:last-child{margin-bottom:0}
.cd-end{padding:14px 0 18px;font-size:13px;line-height:1.6;color:${MUTED};text-align:center}
.cd-end a{color:${P};font-weight:700}
.cd-jump{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(100% + 10px);display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 15px;border:0;border-radius:999px;background:${DARK};color:#fff;font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;box-shadow:0 8px 20px rgba(34,27,58,.28)}
.cd-foot{position:relative;padding:16px 24px calc(18px + env(safe-area-inset-bottom,0px));border-top:1px solid #EEE8F6;background:#FBFAFD}
.cd-label{display:block;font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:${MUTED};margin-bottom:7px}
.cd-name{width:100%;box-sizing:border-box;height:46px;border:1.5px solid #E2DAEE;border-radius:12px;padding:0 14px;font-family:inherit;font-size:15px;color:${DARK};background:#fff;outline:none}
.cd-name:focus{border-color:${P};box-shadow:0 0 0 3px rgba(107,79,160,.12)}
.cd-sign{position:relative;margin-top:14px;border:1.5px dashed #C9B8E8;border-radius:14px;background:#fff;overflow:hidden}
.cd-sign canvas{display:block;width:100%;height:116px;touch-action:none;cursor:crosshair}
.cd-sign .hint{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13.5px;color:#A79FBE;pointer-events:none}
.cd-sign .base{position:absolute;left:16px;right:16px;bottom:30px;height:1px;background:#EDE7F6;pointer-events:none}
.cd-clear{position:absolute;top:8px;right:8px;display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 11px;border:1px solid #E6DDF3;border-radius:999px;background:#fff;font-family:inherit;font-size:11.5px;font-weight:700;color:${MUTED};cursor:pointer}
.cd-tick{display:flex;gap:11px;align-items:flex-start;margin-top:16px;cursor:pointer;user-select:none}
.cd-tick input{position:absolute;opacity:0;pointer-events:none}
.cd-box{width:24px;height:24px;border-radius:8px;border:2px solid #CFC3E6;background:#fff;flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;color:#fff;transition:background .15s,border-color .15s}
.cd-tick input:checked + .cd-box{background:${P};border-color:${P}}
.cd-tick input:focus-visible + .cd-box{box-shadow:0 0 0 3px rgba(107,79,160,.25)}
.cd-tick span{font-size:13.5px;line-height:1.55;color:${BODY}}
.cd-go{width:100%;height:52px;margin-top:16px;border:0;border-radius:16px;background:linear-gradient(180deg,#7457AB,${P} 45%,#5B3F90);color:#fff;font-family:inherit;font-size:15.5px;font-weight:700;cursor:pointer;box-shadow:0 8px 18px rgba(107,79,160,.26)}
.cd-go:disabled{background:#DED5EE;color:#fff;box-shadow:none;cursor:not-allowed}
.cd-missing{margin:10px 2px 0;font-size:12.5px;color:${MUTED};text-align:center}
@media(max-width:520px){
  .cd-ov{padding:0;align-items:flex-end}
  .cd{max-height:96vh;border-radius:26px 26px 0 0}
  .cd-head,.cd-scroll,.cd-foot{padding-left:18px;padding-right:18px}
}
`;

export default function ConsentDialog({ open, defaultName = '', onAccept }) {
  const [name, setName] = useState(defaultName);
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const scrollRef = useRef(null);
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => { setName(defaultName); }, [defaultName]);

  /* Canvas sized to its box, scaled for sharp strokes on retina screens. */
  useEffect(() => {
    if (!open) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = DARK;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [open]);

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const p = e.touches?.[0] ?? e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  };
  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!signed) setSigned(true);
  };
  const end = () => { drawing.current = false; };
  const clear = () => {
    const c = canvasRef.current;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    setSigned(false);
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setAtEnd(true);
  };
  const jumpToEnd = () => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  const ready = atEnd && agreed && signed && name.trim().length >= 2;

  const missing = !atEnd
    ? 'Please read to the end first.'
    : !name.trim() || name.trim().length < 2
      ? 'Please type your name.'
      : !signed
        ? 'Please sign in the box above.'
        : !agreed
          ? 'Please tick the box to accept.'
          : '';

  const submit = () => {
    if (!ready) return;
    onAccept({
      version: CONSENT_VERSION,
      name: name.trim(),
      signature: canvasRef.current.toDataURL('image/png'),
      acceptedAt: new Date().toISOString(),
    });
  };

  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="cd-ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <style>{css}</style>
          <motion.div
            className="cd"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cd-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            <div className="cd-head">
              <img src="/logo-icon.png" alt="" />
              <h2 id="cd-title">Before you come in</h2>
              <p>A short, honest note about what SameFeel is and what we each promise. Please read it to the end.</p>
            </div>

            <div className="cd-scroll" ref={scrollRef} onScroll={onScroll}>
              {SECTIONS.map(({ icon: Icon, tone, ink, title, points }) => (
                <section className="cd-sec" key={title}>
                  <span className="ic" style={{ background: tone, color: ink }}><Icon size={19} /></span>
                  <div>
                    <h3>{title}</h3>
                    <ul>{points.map(pt => <li key={pt}>{pt}</li>)}</ul>
                  </div>
                </section>
              ))}
              <p className="cd-end">
                The full <a href="/terms" target="_blank" rel="noreferrer">Terms</a> and{' '}
                <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> apply.
                You can read this agreement again, or withdraw it, from Settings.
              </p>
            </div>

            <div className="cd-foot">
              <AnimatePresence>
                {!atEnd && (
                  <motion.button
                    type="button"
                    className="cd-jump"
                    onClick={jumpToEnd}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                  >
                    <ArrowDown size={14} /> Read to the end
                  </motion.button>
                )}
              </AnimatePresence>

              <label className="cd-label" htmlFor="cd-name">Your name</label>
              <input
                id="cd-name"
                className="cd-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Type your full name"
                autoComplete="name"
                maxLength={60}
              />

              <div className="cd-sign">
                <canvas
                  ref={canvasRef}
                  aria-label="Signature box. Draw your signature with your finger or mouse."
                  onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
                  onTouchStart={start} onTouchMove={move} onTouchEnd={end}
                />
                <span className="base" />
                {!signed && <span className="hint">Sign here with your finger</span>}
                {signed && (
                  <button type="button" className="cd-clear" onClick={clear}><Eraser size={12} /> Clear</button>
                )}
              </div>

              <label className="cd-tick">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <span className="cd-box">{agreed && <Check size={15} strokeWidth={3} />}</span>
                <span>I have read and understood the above. I am 18 or older, and I accept this agreement.</span>
              </label>

              <button type="button" className="cd-go" onClick={submit} disabled={!ready}>
                Accept and enter SameFeel
              </button>
              {missing && <p className="cd-missing">{missing}</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
