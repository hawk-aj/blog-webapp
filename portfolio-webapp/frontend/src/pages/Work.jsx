import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import SideStack from '../components/SideStack';

const Work = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    axios.get('/api/experience')
      .then(r => setExperience(r.data))
      .catch(e => console.error('Error fetching experience:', e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="work">

      {/* ── Experience — side-stack ────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-title">Work Experience</h1>
            <p className="section-subtitle">
              Scroll to step through roles and projects
            </p>
          </motion.div>
        </div>

        <div className="container">
          <SideStack cards={experience} />
        </div>
      </section>

      {/* ── Key Project Highlights ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Key Project Highlights</h2>
            <p className="section-subtitle">
              Notable achievements and innovations from my professional journey
            </p>
          </motion.div>

          <div className="grid grid-2">
            {[
              {
                title: 'Novel Recommendation Engine',
                body: 'Developed a convolution-inspired matrix-based approach for user behaviour analysis that outperformed collaborative filtering and market basket analysis. Delivered significantly improved engagement results.',
                tags: ['Machine Learning', 'Matrix Operations', 'User Analytics', 'Python'],
              },
              {
                title: 'Custom Speaker Diarization Pipeline',
                body: 'Implemented a speaker diarization system with novel clustering approaches and submodules from various existing pipelines, creating a robust system for voice separation and identification.',
                tags: ['NLP', 'Audio Processing', 'Clustering', 'Research'],
              },
              {
                title: 'Smart Device Firmware & Cloud Integration',
                body: 'Led firmware development for smart devices with rule-based decision mechanisms integrated with AWS Glue and Lambda, bridging hardware and cloud AI at scale.',
                tags: ['IoT', 'AWS Lambda', 'AWS Glue', 'Firmware'],
              },
              {
                title: 'Military & Defense ML Applications',
                body: 'Implemented machine learning algorithms and IoT principles for defense applications, addressing unique challenges in security-critical environments.',
                tags: ['Defense Tech', 'IoT Systems', 'ML Algorithms', 'Security'],
              },
            ].map((project, i) => (
              <motion.div
                key={i}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--t-lg)',
                  fontWeight: 600,
                  color: 'var(--accent-blue)',
                  marginBottom: '0.75rem'
                }}>
                  {project.title}
                </h3>
                <p style={{ marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  {project.body}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {project.tags.map(tag => (
                    <span key={tag} className="blog-tag">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technical Achievements ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">By the Numbers</h2>
          </motion.div>

          <div className="grid grid-3">
            {[
              { stat: '3+', label: 'Years of Experience',      body: 'Professional experience in data science and AI/ML development' },
              { stat: '10+', label: 'Major Projects',           body: 'Successful implementation of complex AI/ML and IoT solutions' },
              { stat: '5+', label: 'Technologies Mastered',     body: 'AWS services, ML frameworks, and programming languages' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="card text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--t-3xl)',
                  color: 'var(--accent-blue)',
                  marginBottom: '0.5rem',
                  lineHeight: 1
                }}>
                  {item.stat}
                </div>
                <h4 style={{
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  {item.label}
                </h4>
                <p style={{ margin: 0 }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Work;
