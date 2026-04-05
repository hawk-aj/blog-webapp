import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ── Palette ───────────────────────────────────────────────────────────────────
const P = {
  espresso:      '#472d30',
  maroon:        '#723d46',
  coral:         '#e26d5c',
  cream:         '#ffe1a8',
  sage:          '#c9cba3',
  border:        'rgba(201,203,163,0.20)',
  borderSubtle:  'rgba(201,203,163,0.10)',
  bgSurface:     'rgba(255,255,255,0.07)',
  bgElevated:    'rgba(0,0,0,0.20)',
  textSecondary: '#c9cba3',
  textMuted:     'rgba(201,203,163,0.60)',
  shadowSm:      '0 1px 4px rgba(71,45,48,0.50)',
  shadowMd:      '0 4px 16px rgba(71,45,48,0.60)',
};

// ── Styles ────────────────────────────────────────────────────────────────────
const c = {
  layout:  { display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: P.maroon },
  sidebar: { width: '220px', background: P.espresso, display: 'flex', flexDirection: 'column', flexShrink: 0 },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' },

  sideHeader: { padding: '1.5rem 1.25rem 1rem', borderBottom: `1px solid ${P.borderSubtle}` },
  sideTitle:  { color: P.cream, fontWeight: '700', fontSize: '1rem', margin: 0 },
  sideSub:    { color: P.textMuted, fontSize: '0.75rem', margin: '0.25rem 0 0', fontFamily: 'JetBrains Mono, monospace' },
  nav:        { flex: 1, padding: '0.75rem 0' },

  navBtn: {
    display: 'block', width: '100%', textAlign: 'left',
    padding: '0.7rem 1.25rem', background: 'none', border: 'none',
    color: 'rgba(255,225,168,0.55)', cursor: 'pointer',
    fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
  },
  navBtnActive: {
    color: P.coral, fontWeight: '600',
    borderLeft: `3px solid ${P.coral}`,
    paddingLeft: 'calc(1.25rem - 3px)',
    background: 'rgba(226,109,92,0.10)',
  },
  navBtnHover: { color: P.cream, background: 'rgba(255,255,255,0.06)' },

  logoutBtn: {
    margin: '1rem', padding: '0.6rem',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${P.borderSubtle}`,
    borderRadius: '8px', color: P.textMuted,
    cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif',
  },

  topbar: {
    background: P.espresso, padding: '1rem 2rem',
    borderBottom: `1px solid ${P.borderSubtle}`,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  topTitle: { fontWeight: '700', color: P.cream, fontSize: '1.1rem' },

  content: { padding: '2rem', flex: 1 },

  card: {
    background: P.bgSurface, borderRadius: '12px', padding: '1.5rem',
    border: `1px solid ${P.border}`, boxShadow: P.shadowSm, marginBottom: '1.5rem',
  },
  cardTitle: { fontWeight: '700', color: P.cream, fontSize: '1rem', marginBottom: '1.25rem' },

  label: {
    display: 'block', fontSize: '0.75rem', fontWeight: '600',
    color: P.textMuted, marginBottom: '0.3rem',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  input: {
    width: '100%', padding: '0.6rem 0.85rem',
    border: `1.5px solid ${P.border}`, borderRadius: '8px',
    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif', background: P.bgElevated,
    color: P.cream, transition: 'border-color 0.2s',
  },
  inputFocus: { borderColor: P.coral },
  textarea: {
    width: '100%', padding: '0.6rem 0.85rem',
    border: `1.5px solid ${P.border}`, borderRadius: '8px',
    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif', background: P.bgElevated,
    color: P.cream, resize: 'vertical', minHeight: '100px',
  },
  fieldGroup: { marginBottom: '1rem' },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },

  btn:        { padding: '0.55rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', fontFamily: 'Inter, sans-serif', transition: 'background 0.15s' },
  btnPrimary: { background: P.coral, color: P.cream },
  btnDanger:  { background: 'rgba(226,109,92,0.15)', color: P.coral, border: `1px solid rgba(226,109,92,0.30)` },
  btnGhost:   { background: 'rgba(255,255,255,0.06)', color: P.sage, border: `1px solid ${P.border}` },

  error:   { background: 'rgba(226,109,92,0.15)', border: `1px solid rgba(226,109,92,0.35)`, color: P.coral,   borderRadius: '8px', padding: '0.65rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' },
  success: { background: 'rgba(201,203,163,0.10)', border: `1px solid rgba(201,203,163,0.25)`, color: P.sage, borderRadius: '8px', padding: '0.65rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' },
  th:    { textAlign: 'left', padding: '0.6rem 0.75rem', borderBottom: `2px solid ${P.borderSubtle}`, color: P.textMuted, fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td:    { padding: '0.75rem', borderBottom: `1px solid ${P.borderSubtle}`, color: P.cream, verticalAlign: 'top' },

  badge: {
    display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px',
    fontSize: '0.75rem', fontWeight: '500',
    background: 'rgba(226,109,92,0.15)', color: P.sage,
    border: 'rgba(226,109,92,0.30)',
    marginRight: '0.35rem', marginBottom: '0.2rem',
  },
  tokenBox: {
    background: P.espresso, color: P.cream,
    fontFamily: 'JetBrains Mono, monospace',
    borderRadius: '8px', padding: '1rem 1.25rem',
    fontSize: '0.85rem', wordBreak: 'break-all', marginBottom: '0.75rem',
    border: `1px solid ${P.border}`,
  },
};

const TABS = [
  { id: 'overview',   label: 'Overview'    },
  { id: 'blogs',      label: 'Blog Posts'  },
  { id: 'profile',    label: 'Profile'     },
  { id: 'experience', label: 'Experience'  },
  { id: 'ramblings',  label: 'Ramblings'   },
];

// ── API hook ──────────────────────────────────────────────────────────────────
function useApi(token, navigate) {
  return useCallback((method, url, data) => {
    const cfg = { headers: { Authorization: `Bearer ${token}` } };
    const call = method === 'get'    ? axios.get(url, cfg)
               : method === 'delete' ? axios.delete(url, cfg)
               : method === 'put'    ? axios.put(url, data, cfg)
               :                       axios.post(url, data, cfg);
    return call.catch(e => {
      if (e.response?.status === 401) { sessionStorage.removeItem('admin_token'); navigate('/admin'); }
      throw e;
    });
  }, [token, navigate]);
}

function StatusMsg({ error, success }) {
  return (
    <>
      {error   && <div style={c.error}>{error}</div>}
      {success && <div style={c.success}>{success}</div>}
    </>
  );
}

function FocusInput({ name, focused, setFocused, style, ...props }) {
  return (
    <input
      style={{ ...c.input, ...(focused === name ? c.inputFocus : {}), ...style }}
      onFocus={() => setFocused(name)}
      onBlur={() => setFocused('')}
      {...props}
    />
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function OverviewPanel({ api }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [revealed, setReveal] = useState(false);

  const fetch = async () => {
    setLoading(true); setError('');
    try { setData((await api('get', '/api/admin/jupyter-token')).data); setReveal(true); }
    catch (e) { setError(e.response?.data?.error || 'Failed to fetch token'); }
    finally { setLoading(false); }
  };

  return (
    <div style={c.card}>
      <p style={c.cardTitle}>JupyterLab Token</p>
      <p style={{ color: P.textSecondary, fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
        Retrieve the current authentication token for{' '}
        <strong style={{ color: P.cream }}>jupyter.aaryajha.com</strong>.
      </p>
      <StatusMsg error={error} />
      {revealed && data && (
        <>
          <p style={{ fontSize: '0.72rem', color: P.textMuted, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Token</p>
          <div style={c.tokenBox}>{data.token}</div>
          {data.url && (
            <>
              <p style={{ fontSize: '0.72rem', color: P.textMuted, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>URL</p>
              <div style={{ ...c.tokenBox, color: P.coral }}>{data.url}</div>
            </>
          )}
          <button style={{ ...c.btn, ...c.btnGhost }} onClick={() => { setData(null); setReveal(false); }}>Hide</button>
        </>
      )}
      {!revealed && (
        <button style={{ ...c.btn, ...c.btnPrimary }} onClick={fetch} disabled={loading}>
          {loading ? 'Fetching...' : 'Show Token'}
        </button>
      )}
    </div>
  );
}

// ── Blogs ─────────────────────────────────────────────────────────────────────
const emptyBlog = { title: '', excerpt: '', date: '', tags: '', content: '' };

function BlogsPanel({ api }) {
  const [blogs, setBlogs]     = useState([]);
  const [editing, setEdit]    = useState(null);
  const [form, setForm]       = useState(emptyBlog);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [focused, setFocused] = useState('');

  useEffect(() => { load(); }, []);
  const load = async () => {
    try { setBlogs((await api('get', '/api/admin/blogs')).data); }
    catch { setError('Failed to load blogs'); }
  };

  const openNew  = () => { setForm(emptyBlog); setEdit('new'); setError(''); setSuccess(''); };
  const openEdit = (b) => { setForm({ ...b, tags: Array.isArray(b.tags) ? b.tags.join(', ') : b.tags }); setEdit(b); setError(''); setSuccess(''); };
  const cancel   = () => { setEdit(null); setError(''); setSuccess(''); };
  const payload  = (f) => ({ ...f, tags: f.tags.split(',').map(t => t.trim()).filter(Boolean) });

  const save = async () => {
    setError(''); setSuccess('');
    try {
      if (editing === 'new') { await api('post', '/api/admin/blogs', payload(form)); setSuccess('Post created.'); }
      else                   { await api('put', `/api/admin/blogs/${editing.id}`, payload(form)); setSuccess('Post updated.'); }
      await load(); setEdit(null);
    } catch (e) { setError(e.response?.data?.error || 'Save failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this post?')) return;
    try { await api('delete', `/api/admin/blogs/${id}`); await load(); }
    catch { setError('Delete failed'); }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: P.cream }}>Blog Posts</h2>
        {!editing && <button style={{ ...c.btn, ...c.btnPrimary }} onClick={openNew}>+ New Post</button>}
      </div>
      <StatusMsg error={error} success={success} />

      {editing ? (
        <div style={c.card}>
          <p style={c.cardTitle}>{editing === 'new' ? 'New Post' : 'Edit Post'}</p>
          {['title', 'excerpt', 'date'].map(f => (
            <div style={c.fieldGroup} key={f}>
              <label style={c.label}>{f}</label>
              <FocusInput name={f} focused={focused} setFocused={setFocused}
                value={form[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value })} />
            </div>
          ))}
          <div style={c.fieldGroup}>
            <label style={c.label}>Tags (comma-separated)</label>
            <FocusInput name="tags" focused={focused} setFocused={setFocused}
              value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="Machine Learning, Data Science" />
          </div>
          <div style={c.fieldGroup}>
            <label style={c.label}>Content</label>
            <textarea style={{ ...c.textarea, minHeight: '180px' }}
              value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={{ ...c.btn, ...c.btnPrimary }} onClick={save}>Save</button>
            <button style={{ ...c.btn, ...c.btnGhost }} onClick={cancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={c.card}>
          <table style={c.table}>
            <thead>
              <tr>
                <th style={c.th}>Title</th><th style={c.th}>Date</th>
                <th style={c.th}>Tags</th><th style={c.th}></th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(b => (
                <tr key={b.id}>
                  <td style={c.td}><strong>{b.title}</strong></td>
                  <td style={{ ...c.td, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: P.textSecondary }}>{b.date}</td>
                  <td style={c.td}>{(b.tags || []).map(t => <span style={c.badge} key={t}>{t}</span>)}</td>
                  <td style={{ ...c.td, whiteSpace: 'nowrap' }}>
                    <button style={{ ...c.btn, ...c.btnGhost, marginRight: '0.5rem' }} onClick={() => openEdit(b)}>Edit</button>
                    <button style={{ ...c.btn, ...c.btnDanger }} onClick={() => del(b.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!blogs.length && <tr><td colSpan={4} style={{ ...c.td, color: P.textMuted, textAlign: 'center' }}>No posts yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
function ProfilePanel({ api }) {
  const [form, setForm]       = useState(null);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [focused, setFocused] = useState('');

  useEffect(() => {
    api('get', '/api/admin/profile').then(r => setForm(r.data)).catch(() => setError('Failed to load'));
  }, []);

  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const skill = (k, v) => setForm(f => ({ ...f, skills: { ...f.skills, [k]: v.split(',').map(s => s.trim()).filter(Boolean) } }));
  const save  = async () => {
    setError(''); setSuccess('');
    try { await api('put', '/api/admin/profile', form); setSuccess('Profile saved.'); }
    catch (e) { setError(e.response?.data?.error || 'Save failed'); }
  };

  if (!form) return <div style={c.card}><StatusMsg error={error} /></div>;

  return (
    <div style={c.card}>
      <p style={c.cardTitle}>Edit Profile</p>
      <StatusMsg error={error} success={success} />
      <div style={c.row}>
        {['name','title','tagline','location','availability','email','phone','github','linkedin'].map(f => (
          <div style={{ ...c.fieldGroup, flex: '1 1 200px' }} key={f}>
            <label style={c.label}>{f}</label>
            <FocusInput name={f} focused={focused} setFocused={setFocused}
              value={form[f] || ''} onChange={e => set(f, e.target.value)} />
          </div>
        ))}
      </div>
      <div style={c.fieldGroup}>
        <label style={c.label}>Bio</label>
        <textarea style={c.textarea} value={form.bio || ''} onChange={e => set('bio', e.target.value)} />
      </div>
      <p style={{ fontWeight: '600', color: P.textMuted, fontSize: '0.72rem', margin: '1rem 0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skills</p>
      {form.skills && Object.entries(form.skills).map(([k, v]) => (
        <div style={c.fieldGroup} key={k}>
          <label style={c.label}>{k} (comma-separated)</label>
          <FocusInput name={k} focused={focused} setFocused={setFocused}
            value={Array.isArray(v) ? v.join(', ') : v}
            onChange={e => skill(k, e.target.value)} />
        </div>
      ))}
      <button style={{ ...c.btn, ...c.btnPrimary, marginTop: '0.5rem' }} onClick={save}>Save Profile</button>
    </div>
  );
}

// ── Experience ────────────────────────────────────────────────────────────────
const emptyExp = { company: '', position: '', duration: '', location: '', description: '' };

function ExperiencePanel({ api }) {
  const [items, setItems]     = useState([]);
  const [editing, setEdit]    = useState(null);
  const [form, setForm]       = useState(emptyExp);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [focused, setFocused] = useState('');

  useEffect(() => { load(); }, []);
  const load     = async () => { try { setItems((await api('get', '/api/admin/experience')).data); } catch { setError('Failed to load'); } };
  const openNew  = () => { setForm(emptyExp); setEdit('new'); setError(''); setSuccess(''); };
  const openEdit = (e) => { setForm({ ...e, description: Array.isArray(e.description) ? e.description.join('\n') : e.description }); setEdit(e); setError(''); setSuccess(''); };
  const cancel   = () => { setEdit(null); setError(''); setSuccess(''); };
  const payload  = (f) => ({ ...f, description: f.description.split('\n').map(s => s.trim()).filter(Boolean) });

  const save = async () => {
    setError(''); setSuccess('');
    try {
      if (editing === 'new') { await api('post', '/api/admin/experience', payload(form)); setSuccess('Added.'); }
      else                   { await api('put', `/api/admin/experience/${editing.id}`, payload(form)); setSuccess('Updated.'); }
      await load(); setEdit(null);
    } catch (e) { setError(e.response?.data?.error || 'Save failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try { await api('delete', `/api/admin/experience/${id}`); await load(); }
    catch { setError('Delete failed'); }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: P.cream }}>Work Experience</h2>
        {!editing && <button style={{ ...c.btn, ...c.btnPrimary }} onClick={openNew}>+ Add Entry</button>}
      </div>
      <StatusMsg error={error} success={success} />

      {editing ? (
        <div style={c.card}>
          <p style={c.cardTitle}>{editing === 'new' ? 'New Entry' : 'Edit Entry'}</p>
          <div style={c.row}>
            {['company','position','duration','location'].map(f => (
              <div style={{ ...c.fieldGroup, flex: '1 1 180px' }} key={f}>
                <label style={c.label}>{f}</label>
                <FocusInput name={f} focused={focused} setFocused={setFocused}
                  value={form[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value })} />
              </div>
            ))}
          </div>
          <div style={c.fieldGroup}>
            <label style={c.label}>Description (one bullet per line)</label>
            <textarea style={{ ...c.textarea, minHeight: '120px' }}
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={{ ...c.btn, ...c.btnPrimary }} onClick={save}>Save</button>
            <button style={{ ...c.btn, ...c.btnGhost }} onClick={cancel}>Cancel</button>
          </div>
        </div>
      ) : (
        items.map(item => (
          <div style={c.card} key={item.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ color: P.cream }}>{item.position}</strong>
                <span style={{ color: P.coral, margin: '0 0.4rem' }}>@</span>
                <strong style={{ color: P.coral }}>{item.company}</strong>
                <p style={{ color: P.textMuted, fontSize: '0.78rem', margin: '0.25rem 0 0', fontFamily: 'JetBrains Mono, monospace' }}>
                  {item.duration} &middot; {item.location}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginLeft: '1rem' }}>
                <button style={{ ...c.btn, ...c.btnGhost }} onClick={() => openEdit(item)}>Edit</button>
                <button style={{ ...c.btn, ...c.btnDanger }} onClick={() => del(item.id)}>Delete</button>
              </div>
            </div>
            <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1.25rem', color: P.textSecondary, fontSize: '0.875rem' }}>
              {(item.description || []).map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        ))
      )}
    </>
  );
}

// ── Ramblings ─────────────────────────────────────────────────────────────────
const emptyRambling = { title: '', content: '', date: '', mood: '' };

function RamblingsPanel({ api }) {
  const [items, setItems]     = useState([]);
  const [editing, setEdit]    = useState(null);
  const [form, setForm]       = useState(emptyRambling);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [focused, setFocused] = useState('');

  useEffect(() => { load(); }, []);
  const load     = async () => { try { setItems((await api('get', '/api/admin/ramblings')).data); } catch { setError('Failed to load'); } };
  const openNew  = () => { setForm(emptyRambling); setEdit('new'); setError(''); setSuccess(''); };
  const openEdit = (r) => { setForm(r); setEdit(r); setError(''); setSuccess(''); };
  const cancel   = () => { setEdit(null); setError(''); setSuccess(''); };

  const save = async () => {
    setError(''); setSuccess('');
    try {
      if (editing === 'new') { await api('post', '/api/admin/ramblings', form); setSuccess('Added.'); }
      else                   { await api('put', `/api/admin/ramblings/${editing.id}`, form); setSuccess('Updated.'); }
      await load(); setEdit(null);
    } catch (e) { setError(e.response?.data?.error || 'Save failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this rambling?')) return;
    try { await api('delete', `/api/admin/ramblings/${id}`); await load(); }
    catch { setError('Delete failed'); }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: P.cream }}>Ramblings</h2>
        {!editing && <button style={{ ...c.btn, ...c.btnPrimary }} onClick={openNew}>+ New</button>}
      </div>
      <StatusMsg error={error} success={success} />

      {editing ? (
        <div style={c.card}>
          <p style={c.cardTitle}>{editing === 'new' ? 'New Rambling' : 'Edit Rambling'}</p>
          <div style={c.row}>
            {['title','date','mood'].map(f => (
              <div style={{ ...c.fieldGroup, flex: '1 1 180px' }} key={f}>
                <label style={c.label}>{f}</label>
                <FocusInput name={f} focused={focused} setFocused={setFocused}
                  value={form[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value })} />
              </div>
            ))}
          </div>
          <div style={c.fieldGroup}>
            <label style={c.label}>Content</label>
            <textarea style={{ ...c.textarea, minHeight: '140px' }}
              value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={{ ...c.btn, ...c.btnPrimary }} onClick={save}>Save</button>
            <button style={{ ...c.btn, ...c.btnGhost }} onClick={cancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={c.card}>
          <table style={c.table}>
            <thead>
              <tr>
                <th style={c.th}>Title</th><th style={c.th}>Date</th>
                <th style={c.th}>Mood</th><th style={c.th}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(r => (
                <tr key={r.id}>
                  <td style={c.td}><strong>{r.title}</strong></td>
                  <td style={{ ...c.td, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: P.textSecondary }}>{r.date}</td>
                  <td style={c.td}><span style={c.badge}>{r.mood}</span></td>
                  <td style={{ ...c.td, whiteSpace: 'nowrap' }}>
                    <button style={{ ...c.btn, ...c.btnGhost, marginRight: '0.5rem' }} onClick={() => openEdit(r)}>Edit</button>
                    <button style={{ ...c.btn, ...c.btnDanger }} onClick={() => del(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={4} style={{ ...c.td, color: P.textMuted, textAlign: 'center' }}>No ramblings yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── Dashboard shell ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab]     = useState('overview');
  const [token, setToken] = useState('');
  const [hovered, setHov] = useState('');

  useEffect(() => {
    const t = sessionStorage.getItem('admin_token');
    if (!t) { navigate('/admin'); return; }
    setToken(t);
  }, [navigate]);

  const api    = useApi(token, navigate);
  const logout = () => { sessionStorage.removeItem('admin_token'); navigate('/admin'); };
  const label  = TABS.find(t => t.id === tab)?.label || '';

  return (
    <div style={c.layout}>
      <aside style={c.sidebar}>
        <div style={c.sideHeader}>
          <p style={c.sideTitle}>Admin</p>
          <p style={c.sideSub}>aaryajha.com</p>
        </div>
        <nav style={c.nav}>
          {TABS.map(t => (
            <button key={t.id}
              style={{ ...c.navBtn, ...(tab === t.id ? c.navBtnActive : {}), ...(hovered === t.id && tab !== t.id ? c.navBtnHover : {}) }}
              onClick={() => setTab(t.id)}
              onMouseEnter={() => setHov(t.id)}
              onMouseLeave={() => setHov('')}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button style={c.logoutBtn} onClick={logout}>Log out</button>
      </aside>

      <div style={c.main}>
        <div style={c.topbar}>
          <span style={c.topTitle}>{label}</span>
          <span style={{ fontSize: '0.75rem', color: P.textMuted, fontFamily: 'JetBrains Mono, monospace' }}>session &middot; 1h</span>
        </div>
        <div style={c.content}>
          {tab === 'overview'   && <OverviewPanel   api={api} />}
          {tab === 'blogs'      && <BlogsPanel      api={api} />}
          {tab === 'profile'    && <ProfilePanel    api={api} />}
          {tab === 'experience' && <ExperiencePanel api={api} />}
          {tab === 'ramblings'  && <RamblingsPanel  api={api} />}
        </div>
      </div>
    </div>
  );
}
