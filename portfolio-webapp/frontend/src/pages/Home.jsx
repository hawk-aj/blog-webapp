import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Database, Cpu } from 'lucide-react';
import axios from 'axios';
import Room3D from '../components/Room3D';

// Mirror Room3D's sizing so the hero badge can anchor to the room's corner.
const ROOM_BASE_W = 720;
const ROOM_BASE_H = 480;
function pickRoomScale(vw, vh) {
  if (vw < 640) return Math.max(0.32, Math.min(0.55, (vw * 0.92) / ROOM_BASE_W));
  if (vw < 1024) return Math.max(0.45, Math.min(0.7, (vw * 0.6) / ROOM_BASE_W));
  return Math.max(0.55, Math.min(0.9, (Math.min(vw, vh * 1.6) * 0.5) / ROOM_BASE_W));
}

const Home = () => {
  const [profile, setProfile]         = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [roomScale, setRoomScale]     = useState(() =>
    typeof window === 'undefined' ? 0.7 : pickRoomScale(window.innerWidth, window.innerHeight)
  );
  const heroRef        = useRef(null);
  const heroContentRef = useRef(null);

  useEffect(() => {
    const onResize = () => setRoomScale(pickRoomScale(window.innerWidth, window.innerHeight));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Parallax — gently shift hero content on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!heroContentRef.current) return;
      const shift = Math.min(window.scrollY * 0.18, 80);
      heroContentRef.current.style.transform = `translateY(${shift}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, blogsRes] = await Promise.all([
          axios.get('/api/profile'),
          axios.get('/api/blogs')
        ]);
        setProfile(profileRes.data);
        setRecentBlogs(blogsRes.data.slice(0, 2));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero" ref={heroRef}>
        {/* 3D cursor-tracked room background (renders the stats blob too) */}
        <Room3D />

        {/* Right panel: badge + tagline + buttons in one flex column,
            centred on the room's right-edge x-position */}
        <div
          ref={heroContentRef}
          className="hero-right-panel"
          style={{
            left: `calc(50% + ${(ROOM_BASE_W * roomScale) / 2}px)`,
          }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="hero-badge-name">
              {profile?.name || 'Aarya Jha'}
            </h1>
            <p className="hero-badge-title">
              {profile?.title || 'Data Engineer II & AI/ML Researcher'}
            </p>
          </motion.div>

          <div className="hero-panel-foot">
            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {profile?.tagline || 'Transforming data into intelligence, one algorithm at a time'}
            </motion.p>
            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/work" className="btn btn-primary">
                My Work <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Get In Touch
              </Link>
            </motion.div>
          </div>
        </div>

      </section>

      {/* What I Do */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">What I Do</h2>
            <p className="section-subtitle">
              Turning complex data into actionable insights through AI/ML and scalable engineering
            </p>
          </motion.div>

          <div className="grid grid-3">
            {[
              {
                icon: <Brain size={22} />,
                title: 'AI/ML Research',
                body: 'Developing novel approaches in machine learning — recommendation systems, speaker diarization, and more.'
              },
              {
                icon: <Database size={22} />,
                title: 'Data Engineering',
                body: 'Building scalable data pipelines and cloud solutions on AWS, making complex data accessible for decisions.'
              },
              {
                icon: <Cpu size={22} />,
                title: 'Smart Systems',
                body: 'Creating intelligent IoT solutions and firmware that bridge hardware and intelligent software.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    background: 'var(--bg-tint)',
                    border: '1px solid var(--border)',
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    color: 'var(--accent-blue)'
                  }}>
                    {item.icon}
                  </div>
                  <h3 style={{ margin: 0, fontSize: 'var(--t-lg)', fontFamily: 'var(--font-primary)', fontWeight: 600 }}>
                    {item.title}
                  </h3>
                </div>
                <p style={{ margin: 0 }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      {recentBlogs.length > 0 && (
        <section className="section">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">Latest Insights</h2>
              <p className="section-subtitle">
                Recent thoughts from my journey in data science and AI
              </p>
            </motion.div>

            <div className="grid grid-2">
              {recentBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  className="blog-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  <div className="blog-meta">
                    <span className="blog-date">{blog.date}</span>
                    <div className="blog-tags">
                      {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span key={tagIndex} className="blog-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              style={{ textAlign: 'center', marginTop: '3rem' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link to="/blogs" className="btn btn-outline">
                View All Posts <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section">
        <div className="container">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Let's Build Something</h2>
            <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
              Interested in collaborating on AI/ML or data engineering work? I'd love to hear from you.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Start a Conversation <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
