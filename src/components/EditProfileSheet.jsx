import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { userAPI } from '../services/api';
import { avatarSrc } from '../data/avatars';

const P = '#6B4FA0';
const DARK = '#1E1833';
const MUTED = '#77718C';
const LINE = '#E7E1F0';
const BIO_MAX = 120;

const css = `
.ep-ov{position:fixed;inset:0;z-index:1250;background:rgba(30,24,51,.4);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif}
.ep{position:relative;width:min(460px,100%);max-height:92vh;overflow-y:auto;background:#fff;border-radius:28px;box-shadow:0 30px 70px rgba(30,24,51,.28);padding:20px 20px calc(18px + env(safe-area-inset-bottom,0px))}
.ep h3{font-family:'Playfair Display',Georgia,serif;font-size:22px;color:${DARK};margin:2px 0 16px}
.ep-x{position:absolute;top:16px;right:16px;width:38px;height:38px;border:0;border-radius:12px;background:#F6F3FA;color:${MUTED};cursor:pointer;display:flex;align-items:center;justify-content:center}
.ep-av{display:flex;align-items:center;gap:14px;padding:12px;border:1.5px solid ${LINE};border-radius:18px;margin-bottom:16px}
.ep-av .ph{width:64px;height:64px;border-radius:50%;overflow:hidden;flex-shrink:0;background:#F4EEFB;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:24px;color:${P}}
.ep-av .ph img{width:100%;height:100%;display:block}
.ep-av b{display:block;font-size:15px;color:${DARK}}
.ep-av span{font-size:13px;color:${MUTED}}
.ep-av button{margin-left:auto;height:40px;padding:0 16px;border-radius:999px;border:1.5px solid #DCD2EE;background:#fff;color:${P};font-weight:700;font-size:14px;font-family:inherit;cursor:pointer;flex-shrink:0}
.ep label{display:block;font-size:13px;font-weight:700;color:${DARK};margin:0 0 6px}
.ep input,.ep textarea{width:100%;box-sizing:border-box;border:1.5px solid ${LINE};border-radius:12px;padding:12px 14px;font-size:15px;font-family:inherit;color:${DARK};background:#fff;outline:none}
.ep input{height:48px}
.ep textarea{min-height:88px;resize:none;line-height:1.45}
.ep input:focus,.ep textarea:focus{border-color:${P};box-shadow:0 0 0 4px rgba(107,79,160,.12)}
.ep-f{margin-bottom:14px}
.ep-count{text-align:right;font-size:12px;color:${MUTED};margin-top:4px}
.ep-err{font-size:13px;color:#B4402C;margin:0 0 10px;text-align:center}
.ep-btns{display:flex;gap:10px;margin-top:6px}
.ep-btn{height:48px;border-radius:14px;padding:0 18px;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;border:0}
.ep-btn.sec{background:#fff;color:${DARK};border:1.5px solid ${LINE}}
.ep-btn.pri{flex:1;color:#fff;background:linear-gradient(180deg,#7457AB,${P} 45%,#5B3F90);box-shadow:0 8px 18px rgba(107,79,160,.24)}
.ep-btn.pri:disabled{opacity:.6;cursor:default}
@media(max-width:520px){
  .ep-ov{padding:0;align-items:flex-end}
  .ep{width:100%;border-radius:26px 26px 0 0}
}
`;

/** Edit name, bio and avatar. Bottom sheet on phones. */
export default function EditProfileSheet({ open, profile, avatarId, mood, onClose, onChangeAvatar, onSaved }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(profile?.name || '');
    setBio(profile?.bio || '');
    setError('');
  }, [open, profile]);

  const trimmed = name.trim();
  const changed = trimmed !== (profile?.name || '') || bio.trim() !== (profile?.bio || '');

  const save = async (e) => {
    e.preventDefault();
    if (!trimmed) { setError('Please add your name.'); return; }
    setSaving(true); setError('');
    const data = { name: trimmed, bio: bio.trim() };
    try {
      const res = await userAPI.updateProfile(data);
      const next = { ...(profile || {}), ...data, ...(res?.data && typeof res.data === 'object' ? res.data : {}) };
      const { user } = useAuthStore.getState();
      useAuthStore.setState({ user: { ...(user || {}), ...data } });
      onSaved?.(next);
      onClose?.();
    } catch (err) {
      setError(err?.response?.data?.detail || "Couldn't save right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const src = avatarSrc(avatarId, mood);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="ep-ov" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.12, delay: 0.1 } }}>
          <style>{css}</style>
          <motion.form className="ep" role="dialog" aria-modal="true" aria-labelledby="ep-title" onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.18 }}>
            <button type="button" className="ep-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
            <h3 id="ep-title">Edit profile</h3>

            <div className="ep-av">
              <div className="ph">{src ? <img src={src} alt="" /> : (trimmed[0] || 'S').toUpperCase()}</div>
              <div style={{ minWidth: 0 }}>
                <b>Avatar</b>
                <span>{src ? 'Your look and mood' : 'Pick a look'}</span>
              </div>
              <button type="button" onClick={onChangeAvatar}>Change</button>
            </div>

            <div className="ep-f">
              <label htmlFor="ep-name">Name</label>
              <input id="ep-name" value={name} maxLength={40} autoComplete="name" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="ep-f">
              <label htmlFor="ep-bio">Bio</label>
              <textarea id="ep-bio" value={bio} maxLength={BIO_MAX} placeholder="You are more than what you’re going through."
                onChange={(e) => setBio(e.target.value)} />
              <div className="ep-count">{bio.length}/{BIO_MAX}</div>
            </div>

            {error && <p className="ep-err" role="alert">{error}</p>}
            <div className="ep-btns">
              <button type="button" className="ep-btn sec" onClick={onClose}>Cancel</button>
              <button type="submit" className="ep-btn pri" disabled={saving || !changed}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
