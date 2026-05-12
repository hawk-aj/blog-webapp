import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Blogs = () => {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/blogs')
      .then(r => setBlogs(r.data))
      .catch(e => console.error('Error fetching blogs:', e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="blogs">
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-title">Blog Posts</h1>
            <p className="section-subtitle">
              Deep dives into data science, AI/ML research, and technical insights from my journey
            </p>
          </motion.div>

          <div className="grid grid-2">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                className="blog-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/blogs/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h2 className="blog-title">{blog.title}</h2>
                  <p className="blog-excerpt">{blog.excerpt}</p>

                  <div className="blog-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="blog-date">
                        <Calendar size={14} style={{ marginRight: '0.25rem' }} />
                        {new Date(blog.date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                        <Clock size={14} style={{ marginRight: '0.25rem' }} />
                        5 min read
                      </span>
                    </div>
                    <div className="blog-tags">
                      {blog.tags.map((tag, i) => (
                        <span key={i} className="blog-tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginTop: '1rem', color: 'var(--accent-blue)',
                    fontSize: '0.9rem', fontWeight: 500
                  }}>
                    Read More <ArrowRight size={16} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {blogs.length === 0 && (
            <motion.p
              className="text-center"
              style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              No blog posts yet — check back soon.
            </motion.p>
          )}
        </div>
      </section>

      {/* Topics */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Topics I Write About</h2>
            <p className="section-subtitle">
              Areas of expertise and interest I explore through my writing
            </p>
          </motion.div>

          <div className="grid grid-3">
            {[
              { emoji: '🧠', title: 'Machine Learning',     body: 'Novel approaches, algorithm implementations, and practical insights from real-world ML projects.' },
              { emoji: '☁️', title: 'Cloud & MLOps',        body: 'AWS services, deployment strategies, and building scalable AI solutions in production.' },
              { emoji: '🔬', title: 'Research & Innovation', body: 'Cutting-edge research, experimental methodologies, and discoveries in AI and data science.' },
            ].map(({ emoji, title, body }, i) => (
              <motion.div
                key={i}
                className="card text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{emoji}</div>
                <h3 style={{
                  fontFamily: 'var(--font-primary)', fontWeight: 600,
                  color: 'var(--text-primary)', marginBottom: '0.75rem'
                }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stay Updated */}
      <section className="section">
        <div className="container">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Stay Updated</h2>
            <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
              Get notified when I publish new insights in data science and AI
            </p>

            <div style={{
              maxWidth: '500px', margin: '0 auto',
              display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'
            }}>
              <input
                type="email"
                placeholder="Enter your email address"
                style={{
                  flex: 1, minWidth: '250px', padding: '0.75rem 1rem',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)', color: 'var(--text-primary)',
                  fontSize: '1rem', fontFamily: 'var(--font-primary)'
                }}
              />
              <button className="btn btn-primary">Subscribe</button>
            </div>

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              No spam, unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
