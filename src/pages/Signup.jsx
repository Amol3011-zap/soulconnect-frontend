import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye, EyeOff, HeartHandshake, Stethoscope, Check, ArrowRight, ArrowLeft,
  Lock, ShieldCheck, Users, Info, Phone, Smartphone, FlaskConical, BadgeCheck,
} from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { authAPI } from '../services/api';
import { STRUGGLES } from '../components/soulmatch/soulmatchOptions';
import { checkPassword, checkPasswordBreached, passwordStrength, STRENGTH_LABELS, PASSWORD_MIN } from '../lib/passwordPolicy';
import Turnstile from '../components/Turnstile';

/* SameFeel Dawn palette */
const P = '#6B4FA0';
const DARK = '#1E1833';
const BODY = '#565070';
const MUTED = '#77718C';
const LINE = '#E7E1F0';
const LOTUS = '/logo-icon.png';
const HERO = '/brand/hero/avatar-group.jpg';
const FACES = [1, 5, 2, 8].map((n) => `/brand/hero/face-${n}.jpg`);

/* ── Phone OTP ──────────────────────────────────────────────────
 * TEST MODE (local dev, or VITE_OTP_TEST_MODE=true on a preview build):
 *   no SMS is sent and the code 123456 always works, so the team can test
 *   signup without a phone. If the backend OTP endpoints exist they are
 *   still called, so they can be tested too.
 * PRODUCTION: the backend must send a real SMS and verify the code.
 *   Signup is blocked until the phone is verified. The backend must ALSO
 *   reject /auth/signup when the phone was not verified, since anything in
 *   the browser can be bypassed.
 */
const OTP_TEST_MODE = import.meta.env.DEV || import.meta.env.VITE_OTP_TEST_MODE === 'true';
const TEST_CODE = '123456';
const RESEND_SECONDS = 30;

async function sendOtp(phone) {
  try {
    await authAPI.sendSignupOTP(phone);
    return { ok: true };
  } catch (err) {
    if (OTP_TEST_MODE) return { ok: true, test: true };
    const d = err?.response?.data?.detail;
    return { ok: false, error: typeof d === 'string' ? d : 'We could not send the code. Please try again in a moment.' };
  }
}

async function verifyOtp(phone, code) {
  try {
    const res = await authAPI.verifySignupOTP(phone, code);
    return { ok: true, token: res?.data?.verification_token || null };
  } catch (err) {
    if (OTP_TEST_MODE && code === TEST_CODE) return { ok: true, token: 'test-mode', test: true };
    const d = err?.response?.data?.detail;
    return { ok: false, error: typeof d === 'string' ? d : 'That code is not right. Please check and try again.' };
  }
}

const HEALER_TYPES = [
  { value: 'counsellor', label: 'Counsellor', icon: '🗣️', desc: 'Talking therapy & emotional guidance' },
  { value: 'therapist', label: 'Therapist', icon: '🧠', desc: 'CBT, DBT & evidence based therapy' },
  { value: 'psychiatrist', label: 'Psychiatrist', icon: '⚕️', desc: 'Medical & psychiatric support' },
  { value: 'life_coach', label: 'Life Coach', icon: '🎯', desc: 'Goal setting & personal growth' },
  { value: 'yoga_meditation', label: 'Yoga / Meditation', icon: '🧘', desc: 'Mindfulness & holistic wellness' },
  { value: 'reiki_healer', label: 'Reiki Healer', icon: '✨', desc: 'Energy healing & chakra balancing' },
  { value: 'nutritionist', label: 'Nutritionist', icon: '🥗', desc: 'Wellness through nutrition' },
  { value: 'art_music_therapy', label: 'Art / Music Therapy', icon: '🎨', desc: 'Creative expression therapy' },
  { value: 'hypnotherapist', label: 'Hypnotherapist', icon: '💫', desc: 'Subconscious healing' },
  { value: 'peer_support', label: 'Peer Support Specialist', icon: '🤝', desc: 'Lived experience support' },
];

const SPECIALIZATIONS = [
  'Anxiety & Panic', 'Depression', 'Trauma & PTSD', 'Relationships',
  'Grief & Loss', 'Addiction', 'Child & Adolescent', 'Couples Therapy',
  'Career & Life', 'Eating Disorders', 'LGBTQ+', 'Women\'s Health',
  'Mindfulness', 'Anger Management', 'OCD', 'Sleep Issues',
];




const css = `
.su *{box-sizing:border-box}
.su{min-height:100vh;display:flex;background:#FBFAFD;color:${DARK};font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}

/* Left: immersive visual */
.su-visual{position:sticky;top:0;height:100vh;width:46%;max-width:720px;padding:16px;flex-shrink:0}
.su-frame{position:relative;height:100%;border-radius:28px;overflow:hidden;background:#E9E2F4;box-shadow:0 30px 60px rgba(30,24,51,.12)}
.su-frame img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 12%;transform:scale(1.02)}
.su-frame:after{content:'';position:absolute;inset:0;background:
  linear-gradient(180deg,rgba(30,24,51,.18) 0%,rgba(30,24,51,0) 20%,rgba(30,24,51,0) 36%,rgba(40,27,74,.55) 56%,rgba(33,22,62,.86) 76%,rgba(28,18,52,.95) 100%)}
.su-vtop{position:absolute;z-index:2;top:22px;left:22px;right:22px;display:flex;align-items:center;justify-content:space-between}
.su-glass{display:inline-flex;align-items:center;gap:10px;padding:8px 14px 8px 8px;border-radius:999px;background:rgba(255,255,255,.78);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 6px 20px rgba(30,24,51,.12);text-decoration:none}
.su-glass img{width:34px;height:34px;display:block;border-radius:10px;border:1px solid rgba(109,74,255,0.38);box-sizing:border-box}
.su-glass b{font-family:'Playfair Display',Georgia,serif;font-size:17px;color:${DARK};letter-spacing:-.01em}
.su-glass b span{color:#A87B45}
.su-vbottom{position:absolute;z-index:2;left:40px;right:40px;bottom:36px;color:#fff}
.su-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#E9DDFB;margin-bottom:14px}
.su-eyebrow i{width:26px;height:1.5px;background:#E9DDFB;display:block}
.su-vbottom h2{font-family:'Playfair Display',Georgia,serif;font-weight:700;font-size:clamp(34px,3.2vw,48px);line-height:1.08;letter-spacing:-.015em;margin:0 0 14px;text-shadow:0 2px 24px rgba(20,12,40,.35)}
.su-vbottom h2 em{font-style:italic;color:#F3E6C8}
.su-vbottom p{font-size:16px;line-height:1.6;color:rgba(255,255,255,.86);max-width:460px;margin:0 0 24px}
.su-trust{display:flex;flex-wrap:wrap;gap:8px}
.su-trust span{display:inline-flex;align-items:center;gap:7px;padding:9px 13px;border-radius:999px;font-size:13px;font-weight:600;color:#fff;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}

/* Right: form */
.su-panel{flex:1;min-width:0;display:flex;flex-direction:column;min-height:100vh}
.su-top{display:flex;align-items:center;justify-content:flex-end;gap:16px;padding:26px 40px 0}
.su-top .brand{display:none;align-items:center;gap:9px;margin-right:auto;text-decoration:none}
.su-top .brand img{width:34px;height:34px;border-radius:10px;border:1px solid rgba(109,74,255,0.38);box-sizing:border-box}
.su-top .brand b{font-family:'Playfair Display',Georgia,serif;font-size:19px;color:${DARK}}
.su-top .brand b span{color:#A87B45}
.su-login{font-size:14px;color:${MUTED}}
.su-login a{color:${P};font-weight:700;text-decoration:none;margin-left:6px;padding:8px 14px;border-radius:999px;border:1.5px solid #DDD3EE;display:inline-block;transition:background .15s}
.su-login a:hover{background:#F4F0FA}
.su-body{flex:1;display:flex;align-items:center;justify-content:center;padding:32px 40px 24px}
.su-col{width:100%;max-width:448px}
.su-foot{padding:0 40px 26px;display:flex;justify-content:center;gap:18px;flex-wrap:wrap;font-size:12.5px;color:${MUTED}}
.su-foot a{color:${MUTED};text-decoration:none}
.su-foot a:hover{color:${P}}
.su-foot .crisis{display:inline-flex;align-items:center;gap:6px}

.su-mhero{display:none}
.su-kicker{font-size:12.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${P};margin:0 0 12px}
.su-h1{font-family:'Playfair Display',Georgia,serif;font-size:38px;line-height:1.1;font-weight:700;letter-spacing:-.02em;margin:0 0 10px}
.su-lead{font-size:15.5px;line-height:1.6;color:${BODY};margin:0 0 28px}

/* progress */
.su-progress{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:0 0 12px}
.su-progress i{height:4px;border-radius:4px;background:#ECE6F5;overflow:hidden;position:relative}
.su-progress i.done:after,.su-progress i.on:after{content:'';position:absolute;inset:0;border-radius:4px;background:linear-gradient(90deg,${P},#9C86CC)}
.su-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:13px;color:${MUTED};margin:0 0 26px}
.su-meta b{color:${DARK};font-weight:700}
.su-meta button{border:0;background:none;color:${P};font-weight:700;font-size:13px;cursor:pointer;padding:0;font-family:inherit}

/* role tiles */
.su-roles{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:22px}
.su-role{position:relative;text-align:left;padding:20px 18px 18px;border-radius:20px;border:1.5px solid ${LINE};background:#fff;cursor:pointer;font-family:inherit;transition:border-color .18s,box-shadow .18s,transform .18s,background .18s;display:flex;flex-direction:column;gap:10px}
.su-role:hover{border-color:#CDBFE6;box-shadow:0 10px 28px rgba(107,79,160,.08);transform:translateY(-1px)}
.su-role.on{border-color:${P};background:linear-gradient(180deg,#FBF9FF,#fff);box-shadow:0 0 0 4px rgba(107,79,160,.10),0 14px 30px rgba(107,79,160,.10)}
.su-role .ic{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center}
.su-role .tt{font-size:16px;font-weight:700;color:${DARK};line-height:1.3}
.su-role .dd{font-size:13.5px;line-height:1.5;color:${BODY}}
.su-role ul{list-style:none;margin:4px 0 0;padding:0;display:grid;gap:6px}
.su-role li{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:#4A4462}
.su-role li svg{color:${P};flex-shrink:0}
.su-check{position:absolute;top:14px;right:14px;width:24px;height:24px;border-radius:50%;border:1.5px solid #D5CBE6;display:flex;align-items:center;justify-content:center;color:#fff;transition:all .18s}
.su-role.on .su-check{background:${P};border-color:${P}}

/* fields */
.su-f{margin-bottom:18px}
.su-l{display:flex;justify-content:space-between;align-items:baseline;font-size:13.5px;font-weight:700;color:#2E2842;margin-bottom:8px}
.su-l small{font-weight:500;color:${MUTED};font-size:12.5px}
.su-in{width:100%;height:52px;border:1.5px solid ${LINE};border-radius:14px;padding:0 16px;font-size:15.5px;font-family:inherit;color:${DARK};background:#fff;outline:none;transition:border-color .15s,box-shadow .15s;appearance:none;-webkit-appearance:none}
textarea.su-in{height:auto;padding:13px 16px;line-height:1.5;resize:vertical}
.su-in::placeholder{color:#ABA5BE}
.su-in:hover{border-color:#D6CCE7}
.su-in:focus{border-color:${P};box-shadow:0 0 0 4px rgba(107,79,160,.12)}
select.su-in{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%2377718C' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;padding-right:40px;cursor:pointer}
.su-wrap{position:relative}
.su-pre{position:absolute;left:1px;top:1px;bottom:1px;width:62px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:15px;font-weight:600;color:#3A3350;border-right:1.5px solid ${LINE};border-radius:13px 0 0 13px;background:#FAF8FD;pointer-events:none}
.su-eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:40px;height:40px;border:0;background:none;color:${MUTED};cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:10px}
.su-eye:hover{background:#F4F0FA;color:${P}}
.su-hint{font-size:12.5px;color:${MUTED};margin:7px 0 0;display:flex;align-items:center;gap:6px}
.su-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.su-err{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;color:#8E3521;background:#FDF3EE;border:1px solid #F4D9CC;border-radius:12px;padding:11px 13px;margin:0 0 16px}
.su-strength{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:9px}
.su-strength i{height:3px;border-radius:3px;background:#ECE6F5}

/* buttons */
.su-btn{height:54px;width:100%;display:flex;align-items:center;justify-content:center;gap:9px;border:0;border-radius:14px;padding:0 20px;font-size:15.5px;font-weight:700;font-family:inherit;cursor:pointer;color:#fff;
  background:linear-gradient(180deg,#7457AB 0%,${P} 45%,#5B3F90 100%);box-shadow:0 1px 0 rgba(255,255,255,.25) inset,0 10px 24px rgba(107,79,160,.28);transition:transform .12s,box-shadow .18s,filter .18s}
.su-btn:hover{filter:brightness(1.05);box-shadow:0 1px 0 rgba(255,255,255,.25) inset,0 14px 30px rgba(107,79,160,.34)}
.su-btn:active{transform:translateY(1px)}
.su-btn:disabled{background:#D9D0EA;box-shadow:none;cursor:not-allowed;filter:none}
.su-btn.ghost{background:#fff;color:${DARK};border:1.5px solid ${LINE};box-shadow:none;width:auto;padding:0 20px}
.su-btn.ghost:hover{background:#F7F4FB;filter:none}
.su-actions{display:flex;gap:10px;margin-top:8px}
.su-actions .su-btn:last-child{flex:1}
.su-or{display:flex;align-items:center;gap:12px;font-size:12.5px;color:${MUTED};margin:22px 0 16px}
.su-or:before,.su-or:after{content:'';flex:1;height:1px;background:${LINE}}
.su-social{display:flex;align-items:center;justify-content:center;gap:12px;font-size:13px;color:${MUTED}}
.su-faces{display:flex}
.su-faces img{width:30px;height:30px;border-radius:50%;border:2px solid #fff;object-fit:cover;margin-left:-8px;box-shadow:0 2px 6px rgba(30,24,51,.12)}
.su-faces img:first-child{margin-left:0}

/* problems */
.su-search{position:relative;margin-bottom:12px}
.su-search svg{position:absolute;left:15px;top:50%;transform:translateY(-50%);color:${MUTED}}
.su-search input{padding-left:42px;height:46px;font-size:14.5px}
.su-count{display:flex;align-items:center;justify-content:space-between;font-size:12.5px;color:${MUTED};margin-bottom:12px}
.su-count b{color:${P}}
.su-chips{display:flex;flex-wrap:wrap;gap:8px;padding:2px;margin-bottom:20px}
.su-chip{display:inline-flex;align-items:center;gap:7px;padding:9px 13px;border-radius:999px;border:1.5px solid ${LINE};background:#fff;color:#3A3350;font-size:13.5px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .15s}
.su-chip:hover{border-color:#CDBFE6;background:#FBF9FE}
.su-chip.on{background:${P};border-color:${P};color:#fff;box-shadow:0 6px 14px rgba(107,79,160,.22)}
.su-chip .n{min-width:18px;height:18px;border-radius:9px;padding:0 5px;background:#fff;color:${P};font-size:10.5px;font-weight:800;display:inline-flex;align-items:center;justify-content:center}
.su-care{display:flex;gap:10px;align-items:flex-start;padding:13px 14px;border-radius:14px;background:#FDF3EE;border:1px solid #F4D9CC;color:#7A3E22;font-size:13px;line-height:1.55;margin-bottom:16px}
.su-care a{color:#9A4A30;font-weight:700}
.su-types{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-height:236px;overflow-y:auto;padding:2px}
.su-type{text-align:left;padding:12px;border-radius:14px;border:1.5px solid ${LINE};background:#fff;cursor:pointer;font-family:inherit;display:flex;gap:10px;align-items:flex-start}
.su-type.on{border-color:${P};background:#F8F5FD}
.su-type b{display:block;font-size:13.5px;color:${DARK}}
.su-type span{display:block;font-size:11.5px;color:${MUTED};margin-top:2px;line-height:1.35}

/* review */
.su-sec{border:1.5px solid ${LINE};border-radius:18px;background:#fff;margin-bottom:12px;overflow:hidden}
.su-sec h4{display:flex;justify-content:space-between;align-items:center;margin:0;padding:13px 16px;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${MUTED};background:#FBFAFD;border-bottom:1px solid #F0EBF6}
.su-sec h4 button{border:0;background:none;color:${P};font-weight:700;font-size:13px;letter-spacing:0;text-transform:none;cursor:pointer;font-family:inherit}
.su-rv{display:flex;justify-content:space-between;gap:16px;padding:11px 16px;font-size:14px;border-bottom:1px solid #F4F0F8}
.su-rv:last-child{border-bottom:0}
.su-rv span{color:${MUTED};flex-shrink:0}
.su-rv b{text-align:right;color:${DARK};font-weight:600}
.su-note{display:flex;gap:10px;align-items:flex-start;padding:13px 14px;border-radius:14px;background:#F5F1FB;color:#4A3F66;font-size:13px;line-height:1.55;margin:4px 0 16px}
.su-note svg{color:${P};flex-shrink:0;margin-top:1px}
.su-agree{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.5;color:${BODY};margin:2px 0 18px;cursor:pointer}
.su-agree input{width:18px;height:18px;margin:1px 0 0;accent-color:${P};flex-shrink:0;cursor:pointer}
.su-agree a{color:${DARK};font-weight:600;text-decoration:underline;text-decoration-color:#CFC5E2;text-underline-offset:3px}
.su-legal{font-size:12.5px;color:${MUTED};text-align:center;margin:14px 0 0;line-height:1.6}
.su-legal a{color:${DARK};font-weight:600;text-decoration:underline;text-decoration-color:#CFC5E2;text-underline-offset:3px}
.su-spin{width:17px;height:17px;border-radius:50%;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;animation:suSpin .8s linear infinite}
@keyframes suSpin{to{transform:rotate(360deg)}}
.su-anim{animation:suIn .35s ease-out both}
@keyframes suIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.su-anim{animation:none}}

/* tablet and phone */
@media(max-width:1023px){
  .su-visual{display:none}
  .su-top{padding:16px 18px 0}
  .su-top .brand{display:flex}
  .su-login span{display:none}
  .su-body{align-items:flex-start;padding:18px 18px 24px}
  .su-foot{padding:0 18px 22px}
  .su-mhero{display:block;position:relative;height:190px;border-radius:24px;overflow:hidden;margin:0 0 24px;box-shadow:0 18px 36px rgba(30,24,51,.12)}
  .su-mhero img{width:100%;height:100%;object-fit:cover;object-position:50% 18%}
  .su-mhero:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(30,24,51,0) 35%,rgba(30,20,56,.78) 100%)}
  .su-mhero p{position:absolute;z-index:1;left:18px;right:18px;bottom:14px;margin:0;color:#fff;font-family:'Playfair Display',Georgia,serif;font-size:21px;font-weight:700;line-height:1.2}
  .su-mhero p em{color:#F3E6C8}
  .su-h1{font-size:30px}
}
@media(max-width:480px){
  .su-roles{grid-template-columns:1fr}
  .su-role{flex-direction:row;flex-wrap:wrap;align-items:flex-start}
  .su-role .txt{flex:1;min-width:0}
  .su-role ul{display:none}
  .su-meta .who{display:none}
  .su-otp{gap:7px}
  .su-otp input{height:54px;font-size:21px}
}

/* OTP */
.su-otp{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;margin:4px 0 14px}
.su-otp input{height:60px;width:100%;text-align:center;font-size:24px;font-weight:700;font-family:inherit;color:${DARK};border:1.5px solid ${LINE};border-radius:14px;background:#fff;outline:none;transition:border-color .15s,box-shadow .15s}
.su-otp input:focus{border-color:${P};box-shadow:0 0 0 4px rgba(107,79,160,.12)}
.su-otp input.filled{border-color:#CDBFE6;background:#FBF9FE}
.su-otp-meta{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:${MUTED};margin-bottom:18px}
.su-otp-meta button{border:0;background:none;color:${P};font-weight:700;font-size:13px;cursor:pointer;padding:0;font-family:inherit}
.su-otp-meta button:disabled{color:#B3ABC6;cursor:default}
.su-test{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:14px;background:#FFF8E8;border:1px dashed #E8C97A;color:#6B4A10;font-size:13px;line-height:1.5;margin-bottom:16px}
.su-test b{font-weight:800;letter-spacing:.12em}
.su-sent{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:#F5F1FB;margin-bottom:18px;font-size:14px;color:#3A3350}
.su-sent svg{color:${P};flex-shrink:0}
.su-verified{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;color:#2F6B4F;background:#E8F4EE;border-radius:999px;padding:4px 10px}
`;

function BrandPill() {
  return (
    <Link to="/" className="su-glass" aria-label="SameFeel home">
      <img src={LOTUS} alt="" width="34" height="34" />
      <b>Same<span>Feel</span></b>
    </Link>
  );
}

function Visual({ role }) {
  const healer = role === 'healer';
  return (
    <aside className="su-visual" aria-hidden="true">
      <div className="su-frame">
        <img className="bg" src={HERO} alt="" />
        <div className="su-vtop"><BrandPill /></div>
        <div className="su-vbottom">
          <div className="su-eyebrow"><i />{healer ? 'For healers' : 'Heal · Connect · Grow'}</div>
          {healer
            ? <h2>Share your gift.<br /><em>Help someone heal.</em></h2>
            : <h2>You are more than<br /><em>what you’re going through.</em></h2>}
          <p>{healer
            ? 'Join the SameFeel healer network and support people who are ready to take their next step.'
            : 'A safe space to share what you feel and connect with people who truly understand.'}</p>
          <div className="su-trust">
            {(healer
              ? [[ShieldCheck, 'Verified profiles'], [Users, 'Matched by need'], [HeartHandshake, 'Your own fee']]
              : [[Lock, 'Private by default'], [Users, 'Matched by what you feel'], [HeartHandshake, 'Help is never paywalled']]
            ).map(([Icon, t]) => <span key={t}><Icon size={15} />{t}</span>)}
          </div>
        </div>
      </div>
    </aside>
  );
}

function strengthOf(pw) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[0-9]/.test(pw) && /[a-zA-Z]/.test(pw)) s++;
  return s;
}

function OtpBoxes({ value, onChange, onComplete }) {
  const refs = useRef([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');
  const set = (i, d) => {
    const next = (value.slice(0, i) + d + value.slice(i + 1)).slice(0, 6);
    onChange(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
    if (next.length === 6 && !next.includes(' ')) onComplete?.(next);
  };
  useEffect(() => { refs.current[0]?.focus(); }, []);
  return (
    <div className="su-otp" onPaste={(e) => {
      const t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
      if (t) { e.preventDefault(); onChange(t); refs.current[Math.min(t.length, 5)]?.focus(); if (t.length === 6) onComplete?.(t); }
    }}>
      {digits.map((d, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }} className={d ? 'filled' : ''}
          inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={1}
          aria-label={`Digit ${i + 1}`} value={d}
          onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(-1); set(i, v || ''); }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !d && i > 0) { refs.current[i - 1]?.focus(); onChange(value.slice(0, i - 1)); }
          }} />
      ))}
    </div>
  );
}

export default function Signup() {
  const [role, setRole] = useState(''); // 'user' | 'healer'
  const [step, setStep] = useState(0); // 0 choose role, 1 account, 2 verify phone, 3 about you, 4 practice (healers)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone verification
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [verifyToken, setVerifyToken] = useState(null);
  const [testMode, setTestMode] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [sending, setSending] = useState(false);

  const [ageOk, setAgeOk] = useState(false);
  const [problems, setProblems] = useState([]);      // 1 or 2 struggle ids
  const [captchaToken, setCaptchaToken] = useState('');
  const [pwBreached, setPwBreached] = useState('');

  // Healer only
  const [healerType, setHealerType] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [experience, setExperience] = useState('');
  const [credentials, setCredentials] = useState('');
  const [bio, setBio] = useState('');
  const [sessionFee, setSessionFee] = useState('');
  const [languages, setLanguages] = useState('');

  const [gpsLocation, setGpsLocation] = useState(null);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) =>
        setGpsLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
      );
    }
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const isHealer = role === 'healer';
  const STEPS = isHealer ? ['Account', 'Verify phone', 'Your practice'] : ['Account', 'Verify phone'];
  const lastStep = STEPS.length;
  const digits = phone.replace(/\D/g, '');

  const toggleSpec = (s) => setSpecializations((prev) =>
    prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
  );

  const validate = () => {
    if (step === 1) {
      if (!name.trim()) return 'Please enter your name';
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Enter a valid email address';
      if (digits.length !== 10) return 'Enter a valid 10 digit mobile number';
      const pwErr = checkPassword(password, { name, email, phone: digits });
      if (pwErr) return pwErr;
      if (pwBreached) return pwBreached;
      if (!isHealer && problems.length === 0) return 'Please pick at least one, so we can start you somewhere useful';
      if (!captchaToken) return 'Please complete the security check';
      if (!ageOk) return 'Please confirm you are 13 or older';
    }
    if (step === 3 && isHealer) {
      if (!healerType) return 'Please select your profession type';
      if (!experience) return 'Please enter your years of experience';
      if (!bio.trim() || bio.length < 30) return 'Bio must be at least 30 characters';
      if (!sessionFee) return 'Please enter your session fee';
    }
    return '';
  };

  const go = (s) => { setError(''); setStep(s); window.scrollTo?.({ top: 0, behavior: 'smooth' }); };
  const back = () => go(step === 3 && verified ? 1 : step - 1);

  const startVerify = async () => {
    setSending(true); setError('');
    const r = await sendOtp(digits);
    setSending(false);
    if (!r.ok) { setError(r.error); return false; }
    setTestMode(Boolean(r.test));
    setCode('');
    setResendIn(RESEND_SECONDS);
    return true;
  };

  const next = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (step === 1) {
      if (verified) { if (isHealer) go(3); else handleSignup(); return; }
      if (await startVerify()) go(2);
      return;
    }
    if (step === lastStep) { handleSignup(); return; }
    go(step + 1);
  };

  const checkCode = async (c = code) => {
    if (c.length !== 6) { setError('Enter the 6 digit code'); return; }
    setLoading(true); setError('');
    const r = await verifyOtp(digits, c);
    setLoading(false);
    if (!r.ok) { setError(r.error); return; }
    setVerified(true); setVerifyToken(r.token);
    if (isHealer) go(3); else handleSignup(r.token);
  };

  const handleSignup = async (freshToken) => {
    if (!verified && !freshToken) { go(2); return; }
    setLoading(true);
    setError('');
    try {
      const payload = {
        phone: digits,
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        role,
        age_confirmed_13_plus: true,
        phone_verification_token: freshToken || verifyToken,
        latitude: gpsLocation?.latitude || 19.076,
        longitude: gpsLocation?.longitude || 72.8777,
        distance_preference: 10,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        // TODO(backend): make primary_problem optional. Signup no longer asks
        // what people are going through (the Feel Pond asks that instead), so
        // this is only a placeholder the current backend requires.
        primary_problem: problems[0] || 'anxiety',
        secondary_problems: problems.slice(1),
        captcha_token: captchaToken,   // backend MUST verify this via /siteverify
        ...(isHealer && {
          healer_type: healerType,
          specializations,
          experience_years: parseInt(experience),
          credentials: credentials.trim(),
          bio: bio.trim(),
          session_fee: parseFloat(sessionFee),
          languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
        }),
      };
      const response = await authAPI.signup(payload);
      setAuth(response.data, response.data.access_token, role);
      navigate('/home');
    } catch (err) {
      const detail = err.response?.data?.detail;
      const status = err.response?.status;
      if (status >= 500 && !detail) {
        setError('We could not create your account just now. Please try again in a moment.');
      } else if (Array.isArray(detail)) {
        setError(detail.map((e) => `${e.loc?.slice(-1)[0]}: ${e.msg}`).join(' | '));
      } else {
        setError(detail || err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Breach check runs debounced, never blocks typing, and fails open.
  useEffect(() => {
    if (!password) { setPwBreached(''); return undefined; }
    const t = setTimeout(() => { checkPasswordBreached(password).then(setPwBreached); }, 600);
    return () => clearTimeout(t);
  }, [password]);

  const strength = passwordStrength(password);
  const strengthColor = ['#ECE6F5', '#D9534F', '#E0A36B', '#9C86CC', P][strength];
  const Err = () => (error ? <p className="su-err" role="alert"><Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />{error}</p> : null);

  const Shell = ({ children }) => (
    <div className="su">
      <style>{css}</style>
      <Visual role={role || 'user'} />
      <div className="su-panel">
        <header className="su-top">
          <Link to="/" className="brand" aria-label="SameFeel home">
            <img src={LOTUS} alt="" width="34" height="34" />
            <b>Same<span>Feel</span></b>
          </Link>
          <span className="su-login"><span>Already a member?</span><Link to="/login">Log in</Link></span>
        </header>
        <main className="su-body">
          <div className="su-col su-anim" key={step}>{children}</div>
        </main>
        <footer className="su-foot">
          <span className="crisis"><Phone size={13} />In crisis? Tele MANAS 14416, free and 24/7</span>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </footer>
      </div>
    </div>
  );

  /* ── Step 0: choose how to join ── */
  if (step === 0) {
    return Shell({
      children: (
        <>
          <div className="su-mhero">
            <img src={HERO} alt="" />
            <p>You are more than <em>what you’re going through.</em></p>
          </div>
          <p className="su-kicker">Create your account</p>
          <h1 className="su-h1">Welcome to SameFeel</h1>
          <p className="su-lead">Tell us how you would like to join. You can always change this later.</p>

          <div className="su-roles" role="radiogroup" aria-label="How would you like to join?">
            {[
              {
                value: 'user', Icon: HeartHandshake, bg: 'linear-gradient(135deg,#EFE7FB,#FBF1EC)', color: P,
                title: 'I’m looking for support',
                desc: 'Connect with people who understand what you’re going through.',
                points: ['Anonymous by default', 'Free to join'],
              },
              {
                value: 'healer', Icon: Stethoscope, bg: 'linear-gradient(135deg,#F7EFE1,#FBF1EC)', color: '#8A6A3E',
                title: 'I’m a healer or professional',
                desc: 'Offer your care as a counsellor, therapist, coach or practitioner.',
                points: ['Verified profile', 'Set your own fee'],
              },
            ].map((o) => (
              <button key={o.value} type="button" role="radio" aria-checked={role === o.value}
                className={`su-role${role === o.value ? ' on' : ''}`}
                onClick={() => { setRole(o.value); setError(''); }}>
                <span className="su-check">{role === o.value && <Check size={14} strokeWidth={3} />}</span>
                <span className="ic" style={{ background: o.bg, color: o.color }}><o.Icon size={22} /></span>
                <span className="txt">
                  <span className="tt" style={{ display: 'block', paddingRight: 26 }}>{o.title}</span>
                  <span className="dd" style={{ display: 'block', marginTop: 4 }}>{o.desc}</span>
                </span>
                <ul>{o.points.map((p) => <li key={p}><Check size={14} strokeWidth={2.6} />{p}</li>)}</ul>
              </button>
            ))}
          </div>

          <Err />
          <button type="button" className="su-btn" disabled={!role} onClick={() => go(1)}>
            Continue <ArrowRight size={18} />
          </button>

          <div className="su-or">A community built on understanding</div>
          <div className="su-social">
            <span className="su-faces">{FACES.map((f) => <img key={f} src={f} alt="" />)}</span>
            <span>Real people, real stories, no judgement.</span>
          </div>
        </>
      ),
    });
  }

  const titles = {
    1: ['Create your account', 'It takes less than a minute.'],
    2: ['Verify your number', 'We sent a 6 digit code to your phone.'],
    3: ['Your practice', 'Tell people how you can help. You can edit this later.'],
  };

  return Shell({
    children: (
      <>
        <div className="su-progress" style={{ gridTemplateColumns: `repeat(${STEPS.length},1fr)` }} aria-hidden="true">
          {STEPS.map((_, i) => <i key={i} className={i + 1 < step ? 'done' : i + 1 === step ? 'on' : ''} />)}
        </div>
        <div className="su-meta">
          <span>Step <b>{step}</b> of {STEPS.length} · {STEPS[step - 1]}</span>
          <button type="button" onClick={() => go(0)}><span className="who">{isHealer ? 'Joining as a healer' : 'Looking for support'} · </span>Change</button>
        </div>

        <h1 className="su-h1">{titles[step][0]}</h1>
        <p className="su-lead">{titles[step][1]}</p>

        {/* ── Step 1: Account ── */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
            <div className="su-f">
              <label className="su-l" htmlFor="su-name">{isHealer ? 'Full name' : 'Name'}</label>
              <input id="su-name" className="su-in" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)}
                placeholder={isHealer ? 'Dr. / Your full name' : 'What should we call you?'} />
              <p className="su-hint">{isHealer ? 'Your name will be visible to clients.' : <><Lock size={12} />Only your first name is shown to people you connect with.</>}</p>
            </div>
            <div className="su-f">
              <label className="su-l" htmlFor="su-email">Email</label>
              <input id="su-email" className="su-in" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="su-f">
              <label className="su-l" htmlFor="su-phone">Mobile number {verified && <span className="su-verified"><BadgeCheck size={13} />Verified</span>}</label>
              <div className="su-wrap">
                <span className="su-pre">🇮🇳 +91</span>
                <input id="su-phone" className="su-in" style={{ paddingLeft: 76 }} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={11}
                  value={phone} onChange={(e) => { setPhone(e.target.value); if (verified) { setVerified(false); setVerifyToken(null); } }} placeholder="98765 43210" />
              </div>
              <p className="su-hint"><Smartphone size={12} />We will send a code to verify it. Never shared.</p>
            </div>
            <div className="su-f">
              <label className="su-l" htmlFor="su-pass">Password <small>At least {PASSWORD_MIN} characters</small></label>
              <div className="su-wrap">
                <input id="su-pass" className="su-in" style={{ paddingRight: 52 }} type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                  value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
                <button type="button" className="su-eye" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && (
                <>
                  <div className="su-strength" aria-hidden="true">
                    {[1, 2, 3, 4].map((n) => <i key={n} style={{ background: strength >= n ? strengthColor : undefined }} />)}
                  </div>
                  <p className="su-hint" style={{ color: pwBreached ? '#B4402C' : undefined }}>
                    {pwBreached || `${STRENGTH_LABELS[strength] || 'Weak'} · a few ordinary words together is stronger than one tricky word`}
                  </p>
                </>
              )}
            </div>
            {!isHealer && (
              <div className="su-f">
                <label className="su-l">
                  What brings you here? <small>Pick one or two</small>
                </label>
                <p className="su-hint" style={{ marginBottom: 10 }}>
                  <Info size={12} />This shapes your daily tiny wins and who you meet first. You can change it any time.
                </p>
                <div className="su-chips" role="group" aria-label="What brings you here">
                  {STRUGGLES.filter(s => s.id !== 'other').map(({ id, label }) => {
                    const on = problems.includes(id);
                    const full = problems.length >= 2 && !on;
                    return (
                      <button
                        key={id}
                        type="button"
                        className={`su-chip${on ? ' on' : ''}`}
                        aria-pressed={on}
                        disabled={full}
                        style={full ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
                        onClick={() => {
                          setError('');
                          setProblems(prev => prev.includes(id)
                            ? prev.filter(x => x !== id)
                            : prev.length < 2 ? [...prev, id] : prev);
                        }}
                      >
                        {label}
                        {on && <span className="n">{problems.indexOf(id) + 1}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <Turnstile onVerify={setCaptchaToken} onExpire={() => setCaptchaToken('')} />
            <label className="su-agree">
              <input type="checkbox" checked={ageOk} onChange={(e) => { setAgeOk(e.target.checked); setError(''); }} />
              <span>I am 13 or older and agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.</span>
            </label>
            <Err />
            <div className="su-actions">
              <button type="button" className="su-btn ghost" onClick={() => go(0)} aria-label="Back"><ArrowLeft size={18} /></button>
              <button type="submit" className="su-btn" disabled={sending}>
                {sending ? <><span className="su-spin" />Sending code…</> : verified ? <>Continue <ArrowRight size={18} /></> : <>Send verification code <ArrowRight size={18} /></>}
              </button>
            </div>
          </form>
        )}

        {/* ── Step 2: Verify phone ── */}
        {step === 2 && (
          <>
            <div className="su-sent"><Smartphone size={18} /><span>Code sent to <b>+91 {digits.replace(/(\d{5})(\d{5})/, '$1 $2')}</b></span></div>
            {(testMode || OTP_TEST_MODE) && (
              <div className="su-test" role="note">
                <FlaskConical size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Test mode: no SMS is sent. Use the code <b>{TEST_CODE}</b>. This note never appears on the live site.</span>
              </div>
            )}
            <OtpBoxes value={code} onChange={(v) => { setCode(v); setError(''); }} onComplete={(v) => checkCode(v)} />
            <div className="su-otp-meta">
              <button type="button" onClick={() => go(1)}>Change number</button>
              <button type="button" disabled={resendIn > 0 || sending} onClick={startVerify}>
                {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
              </button>
            </div>
            <Err />
            <div className="su-actions">
              <button type="button" className="su-btn ghost" onClick={() => go(1)} aria-label="Back"><ArrowLeft size={18} /></button>
              <button type="button" className="su-btn" onClick={() => checkCode()} disabled={loading || code.length !== 6}>
                {loading ? <><span className="su-spin" />{isHealer ? 'Checking…' : 'Creating your account…'}</> : <>{isHealer ? 'Verify' : 'Verify and create account'} <ArrowRight size={18} /></>}
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Healer practice ── */}
        {step === 3 && isHealer && (
          <>
            <div className="su-f">
              <label className="su-l">Your profession</label>
              <div className="su-types">
                {HEALER_TYPES.map((h) => (
                  <button key={h.value} type="button" className={`su-type${healerType === h.value ? ' on' : ''}`}
                    onClick={() => setHealerType(h.value)} aria-pressed={healerType === h.value}>
                    <span style={{ fontSize: 19 }} aria-hidden="true">{h.icon}</span>
                    <span><b>{h.label}</b><span>{h.desc}</span></span>
                  </button>
                ))}
              </div>
            </div>
            <div className="su-f">
              <label className="su-l">Specializations <small>Select all that apply</small></label>
              <div className="su-chips" style={{ marginBottom: 0 }}>
                {SPECIALIZATIONS.map((s) => (
                  <button key={s} type="button" className={`su-chip${specializations.includes(s) ? ' on' : ''}`} onClick={() => toggleSpec(s)}>{s}</button>
                ))}
              </div>
            </div>
            <div className="su-grid2 su-f">
              <div>
                <label className="su-l" htmlFor="su-exp">Experience (years)</label>
                <input id="su-exp" className="su-in" type="number" min="0" max="60" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5" />
              </div>
              <div>
                <label className="su-l" htmlFor="su-fee">Session fee (₹)</label>
                <input id="su-fee" className="su-in" type="number" min="0" value={sessionFee} onChange={(e) => setSessionFee(e.target.value)} placeholder="e.g. 500" />
              </div>
            </div>
            <div className="su-f">
              <label className="su-l" htmlFor="su-cred">Credentials</label>
              <input id="su-cred" className="su-in" type="text" value={credentials} onChange={(e) => setCredentials(e.target.value)} placeholder="e.g. M.A. Psychology, RCI Licensed" />
            </div>
            <div className="su-f">
              <label className="su-l" htmlFor="su-lang">Languages <small>Separate with commas</small></label>
              <input id="su-lang" className="su-in" type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="e.g. English, Hindi, Marathi" />
            </div>
            <div className="su-f">
              <label className="su-l" htmlFor="su-bio">About you <small>{bio.length}/300</small></label>
              <textarea id="su-bio" className="su-in" rows={4} value={bio} onChange={(e) => setBio(e.target.value.slice(0, 300))}
                placeholder="Your approach, your background and how you can help." />
            </div>
            <div className="su-note"><ShieldCheck size={17} /><span>Our team reviews every healer profile within 24 hours. You will get a confirmation once you are verified.</span></div>
            <Err />
            <div className="su-actions">
              <button type="button" className="su-btn ghost" onClick={back} aria-label="Back"><ArrowLeft size={18} /></button>
              <button type="button" className="su-btn" onClick={next} disabled={loading}>
                {loading ? <><span className="su-spin" />Creating your account…</> : <>Join as a healer <ArrowRight size={18} /></>}
              </button>
            </div>
            <p className="su-legal">By creating an account you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
          </>
        )}
      </>
    ),
  });
}
