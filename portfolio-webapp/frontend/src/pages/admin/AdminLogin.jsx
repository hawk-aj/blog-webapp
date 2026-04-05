import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const PHASE = {
  PASSWORD:        'password',
  TOTP:            'totp',
  RECOVER_REQUEST: 'recover_request',
  RECOVER_OTP:     'recover_otp',
};

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#723d46',
    fontFamily: 'Inter, sans-serif',
    padding: '1rem',
  },
  card: {
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '12px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(201,203,163,0.20)',
    boxShadow: '0 8px 32px rgba(71,45,48,0.70)',
  },
  logo: { textAlign: 'center', marginBottom: '2rem' },
  lockIcon: { fontSize: '2rem', display: 'block', marginBottom: '0.75rem' },
  title: { fontSize: '1.4rem', fontWeight: '700', color: '#ffe1a8', margin: '0 0 0.25rem' },
  subtitle: { fontSize: '0.82rem', color: 'rgba(201,203,163,0.60)', margin: 0, fontFamily: 'JetBrains Mono, monospace' },

  label: {
    display: 'block', fontSize: '0.75rem', fontWeight: '600',
    color: 'rgba(201,203,163,0.60)', marginBottom: '0.4rem',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  input: {
    width: '100%', padding: '0.75rem 1rem',
    border: '1.5px solid rgba(201,203,163,0.20)',
    borderRadius: '8px', fontSize: '1rem', outline: 'none',
    boxSizing: 'border-box', background: 'rgba(0,0,0,0.20)',
    color: '#ffe1a8', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
  },
  inputFocus: { borderColor: '#e26d5c' },
  btn: {
    width: '100%', padding: '0.85rem',
    background: '#e26d5c', color: '#ffe1a8',
    border: 'none', borderRadius: '8px', fontSize: '1rem',
    fontWeight: '600', cursor: 'pointer', marginTop: '1.25rem',
    transition: 'background 0.2s', fontFamily: 'Inter, sans-serif',
  },
  btnHover: { background: '#d4574a' },
  btnDisabled: { opacity: 0.45, cursor: 'not-allowed' },
  error: {
    background: 'rgba(226,109,92,0.15)', border: '1px solid rgba(226,109,92,0.35)',
    color: '#e26d5c', borderRadius: '8px', padding: '0.75rem 1rem',
    fontSize: '0.875rem', marginTop: '1rem',
  },
  success: {
    background: 'rgba(201,203,163,0.12)', border: '1px solid rgba(201,203,163,0.30)',
    color: '#c9cba3', borderRadius: '8px', padding: '0.75rem 1rem',
    fontSize: '0.875rem', marginTop: '1rem',
  },
  link: {
    background: 'none', border: 'none', color: '#e26d5c',
    cursor: 'pointer', fontSize: '0.82rem', padding: 0,
    fontFamily: 'Inter, sans-serif', textDecoration: 'underline',
  },
  hint: { fontSize: '0.8rem', color: 'rgba(201,203,163,0.60)', marginTop: '0.5rem', lineHeight: '1.5' },
  fieldGroup: { marginBottom: '1rem' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' },
  divider: { borderTop: '1px solid rgba(201,203,163,0.10)', margin: '1.5rem 0 0' },
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [phase, setPhase]         = useState(PHASE.PASSWORD);
  const [password, setPassword]   = useState('');
  const [totpCode, setTotpCode]   = useState('');
  const [recovOtp, setRecovOtp]   = useState('');
  const [newPw, setNewPw]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [preToken, setPreToken]   = useState('');
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [focused, setFocused]     = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('admin_token')) navigate('/admin/dashboard');
  }, [navigate]);

  const go = (fn) => async () => {
    setError(''); setSuccess(''); setLoading(true);
    try { await fn(); }
    catch (e) { setError(e.response?.data?.error || 'Network error'); }
    finally { setLoading(false); }
  };

  const submitPassword = go(async () => {
    const res = await axios.post('/api/admin/login', { password });
    setPreToken(res.data.pre_token); setPassword(''); setPhase(PHASE.TOTP);
  });

  const submitTotp = go(async () => {
    const res = await axios.post('/api/admin/verify-2fa', { code: totpCode },
      { headers: { Authorization: `Bearer ${preToken}` } });
    sessionStorage.setItem('admin_token', res.data.token);
    navigate('/admin/dashboard');
  });

  const requestRecovery = go(async () => {
    const res = await axios.post('/api/admin/recover/request');
    setSuccess(res.data.message); setPhase(PHASE.RECOVER_OTP);
  });

  const submitRecovery = go(async () => {
    if (newPw !== confirmPw) throw { response: { data: { error: 'Passwords do not match' } } };
    const res = await axios.post('/api/admin/recover/verify', { otp: recovOtp, new_password: newPw });
    setSuccess(res.data.message);
    setRecovOtp(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => { setSuccess(''); setPhase(PHASE.PASSWORD); }, 2500);
  });

  const inp = (name, extra = {}) => ({
    className: 'admin-login-input',
    style: { ...s.input, ...(focused === name ? s.inputFocus : {}), ...extra },
    onFocus: () => setFocused(name),
    onBlur:  () => setFocused(''),
  });

  return (
    <div style={s.page} className="admin-login-page">
      <div style={s.card} className="admin-login-card">
        <div style={s.logo}>
          <span style={s.lockIcon}>&#128274;</span>
          <p style={s.title}>Admin</p>
          <p style={s.subtitle}>aaryajha.com</p>
        </div>

        {phase === PHASE.PASSWORD && (
          <>
            <div style={s.fieldGroup}>
              <label style={s.label}>Password</label>
              <input type="password" value={password} autoFocus
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitPassword()}
                {...inp('password')} />
            </div>
            <button onClick={submitPassword} disabled={loading || !password}
              style={{ ...s.btn, ...(loading || !password ? s.btnDisabled : {}) }}>
              {loading ? 'Checking...' : 'Continue'}
            </button>
            <div style={s.divider} />
            <div style={{ ...s.row, marginTop: '1rem' }}>
              <span />
              <button style={s.link} onClick={() => { setError(''); setPhase(PHASE.RECOVER_REQUEST); }}>
                Forgot password?
              </button>
            </div>
          </>
        )}

        {phase === PHASE.TOTP && (
          <>
            <div style={s.fieldGroup}>
              <label style={s.label}>Authenticator Code</label>
              <input type="text" inputMode="numeric" maxLength={6} autoFocus
                value={totpCode} placeholder="000000"
                onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && submitTotp()}
                {...inp('totp', { letterSpacing: '0.4em', fontSize: '1.5rem', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' })} />
              <p style={s.hint}>Enter the 6-digit code from Google Authenticator.</p>
            </div>
            <button onClick={submitTotp} disabled={loading || totpCode.length !== 6}
              style={{ ...s.btn, ...(loading || totpCode.length !== 6 ? s.btnDisabled : {}) }}>
              {loading ? 'Verifying...' : 'Log In'}
            </button>
            <div style={s.divider} />
            <div style={{ ...s.row, marginTop: '1rem' }}>
              <button style={s.link} onClick={() => { setError(''); setPhase(PHASE.PASSWORD); }}>Back</button>
              <button style={s.link} onClick={() => { setError(''); setPhase(PHASE.RECOVER_REQUEST); }}>
                Can't access authenticator?
              </button>
            </div>
          </>
        )}

        {phase === PHASE.RECOVER_REQUEST && (
          <>
            <p style={{ color: '#c9cba3', marginBottom: '1.25rem', lineHeight: '1.6', fontSize: '0.9rem' }}>
              A recovery code will be sent to <strong style={{ color: '#ffe1a8' }}>aj240502@gmail.com</strong>.
            </p>
            <button onClick={requestRecovery} disabled={loading}
              style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}>
              {loading ? 'Sending...' : 'Send Recovery Code'}
            </button>
            <div style={s.divider} />
            <div style={{ ...s.row, marginTop: '1rem' }}>
              <button style={s.link} onClick={() => { setError(''); setSuccess(''); setPhase(PHASE.PASSWORD); }}>Cancel</button>
            </div>
          </>
        )}

        {phase === PHASE.RECOVER_OTP && (
          <>
            <div style={s.fieldGroup}>
              <label style={s.label}>Recovery Code</label>
              <input type="text" inputMode="numeric" maxLength={6} autoFocus
                value={recovOtp} placeholder="000000"
                onChange={e => setRecovOtp(e.target.value.replace(/\D/g, ''))}
                {...inp('recovOtp', { letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' })} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>New Password</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} {...inp('newPw')} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Confirm Password</label>
              <input type="password" value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitRecovery()}
                {...inp('confirmPw')} />
            </div>
            <button onClick={submitRecovery}
              disabled={loading || recovOtp.length !== 6 || !newPw || !confirmPw}
              style={{ ...s.btn, ...(loading || recovOtp.length !== 6 || !newPw || !confirmPw ? s.btnDisabled : {}) }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <div style={s.divider} />
            <div style={{ ...s.row, marginTop: '1rem' }}>
              <button style={s.link} onClick={() => { setError(''); setSuccess(''); setPhase(PHASE.PASSWORD); }}>Cancel</button>
            </div>
          </>
        )}

        {error   && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}
      </div>
    </div>
  );
}
