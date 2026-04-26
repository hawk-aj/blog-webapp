import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    axios.get(`/api/blogs/${id}`)
      .then(r => setBlog(r.data))
      .catch(e => { console.error('Error fetching blog:', e); setError(true); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (error || !blog) {
    return (
      <div className="section">
        <div className="container text-center">
          <h1 style={{ marginBottom: '1rem' }}>Blog Post Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blogs" className="btn btn-primary">
            <ArrowLeft size={18} /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  /* Inline content sections keyed by blog.id */
  const extraContent = {
    1: (
      <>
        <p>
          When we first encountered the limitations of traditional collaborative filtering at Atomberg Technologies,
          it became clear that we needed a fundamentally different approach. Market basket analysis had also failed
          to produce the results we were looking for, leaving us with a critical challenge: how do we create a
          recommendation system that truly understands user behaviour?
        </p>
        <h2>The Problem with Traditional Approaches</h2>
        <p>
          Collaborative filtering, while powerful in many contexts, struggles with sparse data and cold start problems.
          In our case, user interactions were limited, and the traditional matrix factorisation techniques weren't
          capturing the nuanced patterns we observed in user behaviour. Market basket analysis, on the other hand,
          was too rigid for the dynamic nature of our user base.
        </p>
        <h2>The Convolution-Inspired Solution</h2>
        <p>
          The breakthrough came when I started thinking about user behaviour patterns as spatial relationships,
          similar to how convolutional neural networks process images. Instead of treating user-item interactions
          as isolated points, we could view them as part of a larger behavioural landscape where proximity and
          context matter significantly.
        </p>
        <p>
          Our matrix-based approach applies convolution-like operations to user behaviour matrices, allowing us to
          capture local patterns and relationships that traditional methods miss.
        </p>
      </>
    ),
    2: (
      <>
        <p>
          Speaker diarization — the process of determining "who spoke when" in an audio recording — is one of the
          most challenging problems in speech processing. During my research internship at Simbo.ai, I had the
          opportunity to dive deep into this fascinating field.
        </p>
        <h2>Understanding the Challenge</h2>
        <p>
          The complexity of speaker diarization lies in the multitude of variables: overlapping speech, background
          noise, varying acoustic conditions, and the need to distinguish between speakers with similar vocal
          characteristics.
        </p>
        <h2>Novel Clustering Approach</h2>
        <p>
          Our innovation centred around a novel clustering methodology that combines spectral analysis with temporal
          modelling. By incorporating submodules from various existing pipelines and introducing our own clustering
          algorithm, we achieved significant improvements in speaker separation accuracy.
        </p>
      </>
    ),
    3: (
      <>
        <p>
          Deploying machine learning models in production is where theory meets reality. Building a great model is
          only half the battle — the real challenge lies in making it scalable, reliable, and maintainable.
        </p>
        <h2>The AWS Ecosystem for ML</h2>
        <p>
          AWS Glue has been instrumental in our data preprocessing pipelines, allowing us to transform and clean
          massive datasets efficiently. Lambda functions serve as the backbone for real-time inference endpoints.
        </p>
        <h2>Lessons Learned</h2>
        <p>
          One of the most important lessons I've learned is the importance of monitoring and observability.
          Building systems that are not just functional, but also transparent and maintainable, is key.
        </p>
      </>
    ),
  };

  return (
    <div className="blog-post">
      <section className="section">
        <div className="container">

          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link to="/blogs" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              color: 'var(--accent-blue)', marginBottom: '2rem',
              fontSize: 'var(--t-sm)', fontWeight: 500
            }}>
              <ArrowLeft size={16} /> Back to Blogs
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 400,
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2,
                marginBottom: '1.5rem', color: 'var(--text-primary)'
              }}>
                {blog.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: 'var(--t-sm)' }}>
                  <Calendar size={14} color="var(--text-muted)" />
                  {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: 'var(--t-sm)' }}>
                  <Clock size={14} color="var(--text-muted)" />
                  8 min read
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                {blog.tags.map((tag, i) => (
                  <span key={i} className="blog-tag">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div style={{
              maxWidth: '800px', margin: '0 auto',
              fontSize: '1.05rem', lineHeight: 1.85,
              color: 'var(--text-secondary)'
            }}
              className="blog-body"
            >
              <p>{blog.content}</p>
              {extraContent[blog.id]}
            </div>
          </motion.div>

          {/* About the Author */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div style={{ maxWidth: '800px', margin: '4rem auto 0' }} className="card">
              <h3 style={{
                fontFamily: 'var(--font-primary)', fontWeight: 600,
                color: 'var(--text-primary)', marginBottom: '1rem'
              }}>
                About the Author
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Aarya Jha is a Data Engineer II at S&P Global, passionate about developing innovative AI/ML
                solutions. With expertise in machine learning, cloud technologies, and data engineering,
                he shares insights from his journey in data science and research.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/about" className="btn btn-outline">Learn More About Me</Link>
                <Link to="/contact" className="btn btn-primary">Get In Touch</Link>
              </div>
            </div>
          </motion.div>

          {/* Continue Reading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div style={{ maxWidth: '800px', margin: '4rem auto 0', textAlign: 'center' }}>
              <h3 style={{
                fontFamily: 'var(--font-primary)', fontWeight: 600,
                color: 'var(--text-primary)', marginBottom: '1.5rem'
              }}>
                Continue Reading
              </h3>
              <Link to="/blogs" className="btn btn-outline">View All Blog Posts</Link>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default BlogPost;
