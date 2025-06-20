import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
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
                onClick={() => {/* Navigation handled by Link */}}
              >
                <Link to={`/blogs/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h2 className="blog-title">{blog.title}</h2>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  
                  <div className="blog-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="blog-date">
                        <Calendar size={14} style={{ marginRight: '0.25rem' }} />
                        {new Date(blog.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <Clock size={14} style={{ marginRight: '0.25rem' }} />
                        5 min read
                      </span>
                    </div>
                    <div className="blog-tags">
                      {blog.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="blog-tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '1rem',
                    color: 'var(--primary-color)',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    Read More <ArrowRight size={16} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {blogs.length === 0 && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                No blog posts available at the moment. Check back soon for new content!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Topics */}
      <section className="section" style={{ background: 'var(--light-bg)' }}>
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
              Areas of expertise and interest that I explore through my writing
            </p>
          </motion.div>

          <div className="grid grid-3">
            <motion.div 
              className="card text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🧠
              </div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
                Machine Learning
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Novel approaches, algorithm implementations, and practical insights 
                from real-world ML projects and research.
              </p>
            </motion.div>

            <motion.div 
              className="card text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ☁️
              </div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
                Cloud & MLOps
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                AWS services, deployment strategies, and building scalable 
                AI solutions in production environments.
              </p>
            </motion.div>

            <motion.div 
              className="card text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🔬
              </div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
                Research & Innovation
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Cutting-edge research, experimental methodologies, and 
                breakthrough discoveries in AI and data science.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
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
              Get notified when I publish new insights and discoveries in data science and AI
            </p>
            
            <div style={{ 
              maxWidth: '500px', 
              margin: '0 auto',
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <input 
                type="email" 
                placeholder="Enter your email address"
                style={{
                  flex: '1',
                  minWidth: '250px',
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  background: 'var(--light-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
              <button className="btn btn-primary">
                Subscribe
              </button>
            </div>
            
            <p style={{ 
              marginTop: '1rem', 
              fontSize: '0.9rem', 
              color: 'var(--text-muted)' 
            }}>
              No spam, unsubscribe at any time. I respect your privacy.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
