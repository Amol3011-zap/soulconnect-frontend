import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { userAPI, authAPI } from '../services/api';
import {
  ChevronRight, Search, LogOut, Trash2, UserRound, KeyRound, LifeBuoy,
  Phone, ShieldCheck, Eye, EyeOff, Check, Info, X,
} from 'lucide-react';

/* SoulConnect Dawn palette */
const P = '#6B4FA0';
const DARK = '#1E1833';
const BODY = '#565070';
const MUTED = '#77718C';
const LINE = '#E7E1F0';
const RED = '#B4402C';

const css = `
.st *{box-sizing:border-box}
.st{min-height:100vh;background:linear-gradient(180deg,#F1ECF9 0%,#FAF8FC 220px);font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif;color:${DARK};padding-bottom:40px}
.st-wrap{max-width:680px;margin:0 auto;padding:28px 18px 0}
.st-h1{font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:700;letter-spacing:-.01em;margin:0 0 4px}
.st-sub{font-size:14.5px;color:${MUTED};margin:0 0 18px}
.st-search{position:relative;margin-bottom:22px}
.st-search svg{position:absolute;left:15px;top:50%;transform:translateY(-50%);color:${MUTED}}
.st-search input{width:100%;height:48px;border:1.5px solid ${LINE};border-radius:14px;padding:0 16px 0 42px;font-size:15px;font-family:inherit;color:${DARK};background:#fff;outline:none;transition:border-color .15s,box-shadow .15s}
.st-search input:focus{border-color:${P};box-shadow:0 0 0 4px rgba(107,79,160,.12)}
.st-me{display:flex;align-items:center;gap:14px;padding:16px;border-radius:22px;margin-bottom:22px;border:1.5px solid transparent;
  background:linear-gradient(#fff,#fff) padding-box,linear-gradient(150deg,#D4B07A,#E7D3E4 45%,#9C86CC) border-box;box-shadow:0 14px 34px rgba(107,79,160,.08)}
.st-av{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#C9B8E8,#F3D9C4);display:flex;align-items:center;justify-content:center;color:#fff;font:700 21px 'Playfair Display',Georgia,serif;flex-shrink:0}
.st-me b{display:block;font-size:16.5px}
.st-me span{font-size:13px;color:${MUTED}}
.st-me button{margin-left:auto;border:1.5px solid #DDD3EE;background:#fff;color:${P};font-weight:700;font-size:13px;padding:8px 14px;border-radius:999px;cursor:pointer;font-family:inherit;white-space:nowrap}
.st-label{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${MUTED};margin:0 4px 10px}
.st-card{background:#fff;border:1.5px solid ${LINE};border-radius:20px;overflow:hidden;margin-bottom:22px;box-shadow:0 8px 24px rgba(107,79,160,.05)}
.st-row{width:100%;display:flex;align-items:center;gap:14px;padding:14px 16px;background:none;border:0;border-bottom:1px solid #F1ECF7;text-align:left;cursor:pointer;font-family:inherit;color:${DARK};transition:background .15s}
.st-row:last-child{border-bottom:0}
.st-row:hover{background:#FBF9FE}
.st-ic{width:40px;height:40px;border-radius:12px;background:#F1ECF9;color:${P};display:flex;align-items:center;justify-content:center;flex-shrink:0}
.st-row .tx{flex:1;min-width:0}
.st-row .tx b{display:block;font-size:15px;font-weight:700}
.st-row .tx span{display:block;font-size:12.5px;color:${MUTED};margin-top:2px}
.st-row .ch{color:#B3ABC6;flex-shrink:0;transition:transform .2s}
.st-row.open .ch{transform:rotate(90deg)}
.st-row.danger .st-ic{background:#FCEDE8;color:${RED}}
.st-row.danger .tx b{color:${RED}}
.st-row.care .st-ic{background:#FDF3EE;color:#B4582C}
.st-pw{padding:4px 16px 18px;border-bottom:1px solid #F1ECF7;background:#FCFBFE}
.st-f{margin-top:12px}
.st-f label{display:block;font-size:13px;font-weight:700;color:#2E2842;margin-bottom:6px}
.st-in{position:relative}
.st-in input{width:100%;height:48px;border:1.5px solid ${LINE};border-radius:12px;padding:0 48px 0 14px;font-size:15px;font-family:inherit;color:${DARK};background:#fff;outline:none}
.st-in input:focus{border-color:${P};box-shadow:0 0 0 4px rgba(107,79,160,.12)}
.st-in button{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:40px;height:40px;border:0;background:none;color:${MUTED};cursor:pointer;display:flex;align-items:center;justify-content:center}
.st-msg{display:flex;gap:8px;align-items:flex-start;font-size:13px;border-radius:12px;padding:10px 12px;margin-top:12px}
.st-msg.err{color:#8E3521;background:#FDF3EE;border:1px solid #F4D9CC}
.st-msg.ok{color:#2F6B4F;background:#E8F4EE;border:1px solid #CBE6D8}
.st-btns{display:flex;gap:10px;margin-top:14px}
.st-btn{height:46px;border-radius:12px;padding:0 18px;font-size:14.5px;font-weight:700;font-family:inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0}
.st-btn.pri{flex:1;color:#fff;background:linear-gradient(180deg,#7457AB,${P} 45%,#5B3F90);box-shadow:0 8px 18px rgba(107,79,160,.24)}
.st-btn.pri:disabled{opacity:.6;cursor:not-allowed}
.st-btn.sec{background:#fff;color:${DARK};border:1.5px solid ${LINE}}
.st-btn.red{flex:1;color:#fff;background:${RED}}
.st-out{width:100%;height:52px;border-radius:16px;border:1.5px solid #F1D5CC;background:#fff;color:${RED};font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .15s}
.st-out:hover{background:#FDF6F3}
.st-ver{text-align:center;font-size:12px;color:#A9A2BD;margin-top:16px}
.st-modal{position:fixed;inset:0;z-index:1000;background:rgba(30,24,51,.38);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px}
.st-dialog{position:relative;width:100%;max-width:400px;background:#fff;border-radius:24px;padding:24px;box-shadow:0 30px 70px rgba(30,24,51,.25)}
.st-dialog h3{font-family:'Playfair Display',Georgia,serif;font-size:22px;margin:0 0 8px}
.st-dialog p{font-size:14px;line-height:1.6;color:${BODY};margin:0 0 18px}
.st-x{position:absolute;top:14px;right:14px;width:36px;height:36px;border:0;border-radius:10px;background:#F6F3FA;color:${MUTED};cursor:pointer;display:flex;align-items:center;justify-content:center}
.st-empty{text-align:center;color:${MUTED};font-size:14px;padding:30px 0}
.st-load{max-width:680px;margin:0 auto;padding:28px 18px}
.st-sk{height:72px;border-radius:20px;background:linear-gradient(90deg,#F1ECF9,#F8F5FC,#F1ECF9);background-size:200% 100%;animation:stSk 1.2s linear infinite;margin-bottom:14px}
@keyframes stSk{to{background-position:-200% 0}}
`;

function Row({ icon: Icon, title, desc, onClick, tone = '', open, trailing }) {
  return (
    <button type="button" className={`st-row ${tone}${open ? ' open' : ''}`} onClick={onClick}>
      <span className="st-ic"><Icon size={19} /></span>
      <span className="tx"><b>{title}</b>{desc && <span>{desc}</span>}</span>
      {trailing || <ChevronRight size={18} className="ch" />}
    </button>
  );
}

function PwField({ label, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="st-f">
      <label>{label}</label>
      <div className="st-in">
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} placeholder="••••••••" />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pwData, setPwData] = useState({ current: '', new: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pwData.new.length < 6) { setPwError('New password must be at least 6 characters'); return; }
    if (pwData.new !== pwData.confirm) { setPwError('Passwords do not match'); return; }
    setPwLoading(true);
    try {
      await authAPI.changePassword(pwData.current, pwData.new);
      setPwSuccess('Password changed successfully.');
      setPwData({ current: '', new: '', confirm: '' });
      setTimeout(() => { setShowChangePassword(false); setPwSuccess(''); }, 2000);
    } catch (err) {
      setPwError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // This would call a delete account API
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="st">
        <style>{css}</style>
        <div className="st-load" aria-busy="true">{[0, 1, 2, 3].map((i) => <div key={i} className="st-sk" />)}</div>
      </div>
    );
  }

  const q = searchQuery.trim().toLowerCase();
  const hit = (...words) => !q || words.some((w) => w.toLowerCase().includes(q));
  const showAccount = hit('account', 'profile', 'edit profile', 'name', 'bio', 'avatar', 'password', 'change password', 'delete');
  const showHelp = hit('help', 'support', 'help center', 'faq', 'crisis', 'helpline', 'privacy', 'policy', 'data');
  const me = profile || user || {};
  const displayName = me.name || 'Your account';
  const initial = (displayName.trim()[0] || 'S').toUpperCase();
  const phoneLine = me.phone ? `+91 ${String(me.phone).replace(/(\d{5})(\d{5})$/, '$1 $2')}` : 'Manage your SoulConnect experience';

  return (
    <div className="st">
      <style>{css}</style>
      <div className="st-wrap">
        <h1 className="st-h1">Settings</h1>
        <p className="st-sub">Manage your SoulConnect experience.</p>

        <div className="st-search">
          <Search size={17} />
          <input type="search" placeholder="Search settings" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search settings" />
        </div>

        {!q && (
          <div className="st-me">
            <span className="st-av" aria-hidden="true">{initial}</span>
            <div style={{ minWidth: 0 }}>
              <b>{displayName}</b>
              <span>{phoneLine}</span>
            </div>
            <button type="button" onClick={() => navigate('/account')}>Edit</button>
          </div>
        )}

        {showAccount && (
          <>
            <p className="st-label">Account</p>
            <div className="st-card">
              <Row icon={UserRound} title="Edit profile" desc="Name, bio, avatar" onClick={() => navigate('/account')} />
              <Row icon={KeyRound} title="Change password" desc="Update your login password" open={showChangePassword}
                onClick={() => { setShowChangePassword(!showChangePassword); setPwError(''); setPwSuccess(''); }} />
              <AnimatePresence initial={false}>
                {showChangePassword && (
                  <motion.form className="st-pw" onSubmit={handleChangePassword}
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <PwField label="Current password" autoComplete="current-password" value={pwData.current} onChange={(e) => setPwData({ ...pwData, current: e.target.value })} />
                    <PwField label="New password" autoComplete="new-password" value={pwData.new} onChange={(e) => setPwData({ ...pwData, new: e.target.value })} />
                    <PwField label="Confirm new password" autoComplete="new-password" value={pwData.confirm} onChange={(e) => setPwData({ ...pwData, confirm: e.target.value })} />
                    {pwError && <div className="st-msg err" role="alert"><Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />{pwError}</div>}
                    {pwSuccess && <div className="st-msg ok" role="status"><Check size={15} style={{ flexShrink: 0, marginTop: 1 }} />{pwSuccess}</div>}
                    <div className="st-btns">
                      <button type="button" className="st-btn sec" onClick={() => setShowChangePassword(false)}>Cancel</button>
                      <button type="submit" className="st-btn pri" disabled={pwLoading}>{pwLoading ? 'Saving…' : 'Save password'}</button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
              <Row icon={Trash2} tone="danger" title="Delete account" desc="Permanently delete your account" onClick={() => setShowDeleteConfirm(true)} trailing={<span />} />
            </div>
          </>
        )}

        {showHelp && (
          <>
            <p className="st-label">Help & support</p>
            <div className="st-card">
              <Row icon={LifeBuoy} title="Help center" desc="FAQs and tutorials" onClick={() => navigate('/safety')} />
              <Row icon={Phone} tone="care" title="Crisis resources" desc="24/7 helplines and support" onClick={() => navigate('/crisis-support')} />
              <Row icon={ShieldCheck} title="Privacy policy" desc="How we protect your data" onClick={() => navigate('/privacy')} />
            </div>
          </>
        )}

        {q && !showAccount && !showHelp && <p className="st-empty">No settings match “{searchQuery}”.</p>}

        <button type="button" className="st-out" onClick={() => { logout(); navigate('/'); }}>
          <LogOut size={18} /> Log out
        </button>
        <p className="st-ver">SoulConnect · You are more than what you’re going through.</p>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div className="st-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)}>
            <motion.div className="st-dialog" role="dialog" aria-modal="true" aria-labelledby="st-del-title"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}>
              <button type="button" className="st-x" onClick={() => setShowDeleteConfirm(false)} aria-label="Close"><X size={17} /></button>
              <h3 id="st-del-title">Delete your account?</h3>
              <p>This action cannot be undone. All your data will be permanently deleted.</p>
              <div className="st-btns" style={{ marginTop: 0 }}>
                <button type="button" className="st-btn sec" style={{ flex: 1 }} onClick={() => setShowDeleteConfirm(false)}>Keep my account</button>
                <button type="button" className="st-btn red" onClick={handleDeleteAccount}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
