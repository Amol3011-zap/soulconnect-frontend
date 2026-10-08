import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

/**
 * "Back to Home" on public info pages. Signed in people came here from the
 * app (Settings, Profile), so it becomes "Back" and returns them there.
 */
export default function BackLink({ style, className, children }) {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  if (!token) return <Link to="/" style={style} className={className}>{children}</Link>;
  const goBack = (e) => {
    e.preventDefault();
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate('/account');
  };
  return (
    <a href="/account" onClick={goBack} style={style} className={className}>
      {React.Children.map(children, (c) => (typeof c === 'string' ? c.replace('Back to Home', 'Back') : c))}
    </a>
  );
}
