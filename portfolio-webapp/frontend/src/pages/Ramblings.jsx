import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Coffee, Moon, Sun, Lightbulb, Eye, Heart, Clock } from 'lucide-react';
import axios from 'axios';

const MOOD_ICONS = {
  contemplative: <Moon size={18} />,
  caffeinated:   <Coffee size={18} />,
  reflective:    <Lightbulb size={18} />,
  observant:     <Eye size={18} />,
  inspired:      <Lightbulb size={18} />,
  peaceful:      <Sun size={18} />,
  thoughtful:    <Coffee size={18} />,
  nostalgic:     <Heart size={18} />,
};

// Mood badge colours — intentionally per-mood, not palette tokens
const MOOD_COLOR = {
  contemplative: '#2563eb',
  caffeinated:   '#c2410c',
  reflective:    '#7c3aed',
  observant:     '#16a34a',
  inspired:      '#b45309',
  peaceful:      '#0f766e',
  thoughtful:    '#0284c7',
  nostalgic:     '#9f1239',
};

const defaultIcon  = <Sun size={18} />;
const defaultColor = '#5A7BA8';

const Ramblings = () => {
  const [ramblings, setRamblings] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    axios.get('/api/ramblings')
      .then(r => setRamblings(r.data))
      .catch(e => console.error('Error fetching ramblings:', e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="ramblings">
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-title">Random Ramblings</h1>
            <p className="section-subtitle">
              Raw, unfiltered thoughts scribbled down in moments of clarity, confusion, and everything in between
            </p>
          </motion.div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {ramblings.map((rambling, index) => (
              <motion.div
                key={rambling.id}
                className="rambling-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{ marginBottom: '2rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ color: MOOD_COLOR[rambling.mood] || defaultColor }}>
                    {MOOD_ICONS[rambling.mood] || defaultIcon}
                  </span>
                  <h2 className="rambling-title" style={{ margin: 0 }}>{rambling.title}</h2>
                </div>

                <div className="rambling-content">{rambling.content}</div>

                <div className="rambling-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={13} />
                    <span>
                      {new Date(rambling.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div
                    className="rambling-mood"
                    style={{
                      background: `${MOOD_COLOR[rambling.mood] || defaultColor}1A`,
                      color: MOOD_COLOR[rambling.mood] || defaultColor,
                      border: `1px solid ${MOOD_COLOR[rambling.mood] || defaultColor}40`,
                    }}
                  >
                    {MOOD_ICONS[rambling.mood] || defaultIcon}
                    {rambling.mood}
                  </div>
                </div>
              </motion.div>
            ))}

            {ramblings.length === 0 && (
              <motion.p
                style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: 'center' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                No ramblings yet — check back soon.
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* Why I Ramble */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Why I Ramble</h2>
            <p className="section-subtitle">My brain dump — messy, honest, and sometimes surprising even to me</p>
          </motion.div>

          <div className="grid grid-2">
            {[
              { icon: <Coffee size={22} />, title: 'Cafe Chronicles',       body: 'From Cafe Goodluck to German bakeries in Koregaon Park — some of the best insights come while sipping coffee and watching the world go by.' },
              { icon: <Sun size={22} />,    title: 'Sunset Reflections',    body: 'Watching sunsets from my terrace leads to unexpected connections between nature\'s algorithms and machine learning.' },
              { icon: <Heart size={22} />,  title: 'Historical Connections', body: 'Stories from WW2 codebreakers, family war tales, and historical parallels to modern data science challenges.' },
              { icon: <Clock size={22} />,  title: '3 AM Epiphanies',       body: 'Late-night coding sessions lead to unexpected breakthroughs — caffeine-fuelled thoughts when the world is quiet.' },
            ].map(({ icon, title, body }, i) => (
              <motion.div
                key={i}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    background: 'var(--bg-tint)', border: '1px solid var(--border)',
                    padding: '0.6rem', borderRadius: 'var(--radius-md)',
                    display: 'flex', color: 'var(--accent-blue)'
                  }}>
                    {icon}
                  </div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-primary)', fontWeight: 600 }}>{title}</h3>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mood Legend */}
      <section className="section">
        <div className="container">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">My Moods</h2>
            <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
              Because my thoughts change with my state of mind
            </p>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.75rem', maxWidth: '700px', margin: '0 auto'
            }}>
              {Object.entries(MOOD_ICONS).map(([mood, icon]) => (
                <div key={mood} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1rem',
                  background: `${MOOD_COLOR[mood]}12`,
                  border: `1px solid ${MOOD_COLOR[mood]}33`,
                  borderRadius: 'var(--radius-sm)',
                  justifyContent: 'center',
                  color: MOOD_COLOR[mood],
                }}>
                  {icon}
                  <span style={{ fontSize: 'var(--t-sm)', fontWeight: 500, textTransform: 'capitalize' }}>{mood}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Ramblings;
