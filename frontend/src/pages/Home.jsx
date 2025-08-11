import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Database, Code, Cpu, GitBranch, Zap } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, blogsRes] = await Promise.all([
          axios.get('/api/profile'),
          axios.get('/api/blogs')
        ]);
        setProfile(profileRes.data);
        setRecentBlogs(blogsRes.data.slice(0, 2)); // Get latest 2 blogs
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="floating-element">
          <Brain size={60} />
        </div>
        <div className="floating-element">
          <Database size={50} />
        </div>
        <div className="floating-element">
          <Code size={55} />
        </div>
        
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero-title" variants={itemVariants}>
            {profile?.name || 'Aarya Jha'}
          </motion.h1>
          
          <motion.p className="hero-subtitle" variants={itemVariants}>
            {profile?.title || 'Data Science Specialist & AI/ML Researcher'}
          </motion.p>
          
          <motion.p className="hero-tagline" variants={itemVariants}>
            {profile?.tagline || 'Transforming Data into Intelligence, One Algorithm at a Time'}
          </motion.p>
          
          <motion.div className="hero-cta" variants={itemVariants}>
            <Link to="/work" className="btn btn-primary">
              Explore My Work <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Get In Touch
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick About Section */}
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
              Passionate about turning complex data into actionable insights through innovative AI/ML solutions
            </p>
          </motion.div>

          <div className="grid grid-3">
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ 
                  background: 'var(--gradient-primary)', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Brain size={24} color="white" />
                </div>
                <h3>AI/ML Research</h3>
              </div>
              <p>
                Developing novel approaches in machine learning, from recommendation systems to speaker diarization, 
                pushing the boundaries of what's possible with AI.
              </p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ 
                  background: 'var(--gradient-primary)', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Database size={24} color="white" />
                </div>
                <h3>Data Engineering</h3>
              </div>
              <p>
                Building scalable data pipelines and cloud solutions using AWS services, 
                making complex data accessible and actionable for business decisions.
              </p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ 
                  background: 'var(--gradient-primary)', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Cpu size={24} color="white" />
                </div>
                <h3>Smart Systems</h3>
              </div>
              <p>
                Creating intelligent IoT solutions and firmware development for smart devices, 
                bridging the gap between hardware and intelligent software.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Blogs Section */}
      {recentBlogs.length > 0 && (
        <section className="section" style={{ background: 'var(--light-bg)' }}>
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
                Recent thoughts and discoveries from my journey in data science and AI
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
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link to="/blogs" className="btn btn-outline">
                View All Posts <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Let's Build Something Amazing</h2>
            <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
              Interested in collaborating on cutting-edge AI/ML projects or discussing data science innovations?
            </p>
            <Link to="/contact" className="btn btn-primary">
              Start a Conversation <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
