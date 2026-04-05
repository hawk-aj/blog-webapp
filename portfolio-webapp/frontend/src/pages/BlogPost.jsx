import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Heart } from 'lucide-react';
import axios from 'axios';

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Blog post not found');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="section">
        <div className="container text-center">
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Blog Post Not Found
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blogs" className="btn btn-primary">
            <ArrowLeft size={20} /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post">
      <section className="section">
        <div className="container">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link 
              to="/blogs" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'var(--primary-color)',
                textDecoration: 'none',
                marginBottom: '2rem',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              <ArrowLeft size={16} /> Back to Blogs
            </Link>
          </motion.div>

          {/* Blog Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700',
                lineHeight: '1.2',
                marginBottom: '1.5rem',
                color: 'var(--text-primary)'
              }}>
                {blog.title}
              </h1>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} color="var(--text-muted)" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(blog.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="var(--text-muted)" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    8 min read
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Share2 size={16} color="var(--text-muted)" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Share
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                {blog.tags.map((tag, index) => (
                  <span key={index} className="blog-tag" style={{ fontSize: '0.9rem' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Blog Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div style={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: 'var(--text-secondary)'
            }}>
              {/* Blog content - in a real app, this would be rich text/markdown */}
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  {blog.content}
                </p>
                
                {blog.id === 1 && (
                  <>
                    <p style={{ marginBottom: '1.5rem' }}>
                      When we first encountered the limitations of traditional collaborative filtering at Atomberg Technologies, 
                      it became clear that we needed a fundamentally different approach. Market basket analysis had also failed 
                      to produce the results we were looking for, leaving us with a critical challenge: how do we create a 
                      recommendation system that truly understands user behavior?
                    </p>

                    <h2 style={{ 
                      color: 'var(--primary-color)', 
                      fontSize: '1.8rem', 
                      marginTop: '3rem', 
                      marginBottom: '1.5rem' 
                    }}>
                      The Problem with Traditional Approaches
                    </h2>

                    <p style={{ marginBottom: '1.5rem' }}>
                      Collaborative filtering, while powerful in many contexts, struggles with sparse data and cold start problems. 
                      In our case, user interactions were limited, and the traditional matrix factorization techniques weren't 
                      capturing the nuanced patterns we observed in user behavior. Market basket analysis, on the other hand, 
                      was too rigid for the dynamic nature of our user base.
                    </p>

                    <h2 style={{ 
                      color: 'var(--primary-color)', 
                      fontSize: '1.8rem', 
                      marginTop: '3rem', 
                      marginBottom: '1.5rem' 
                    }}>
                      The Convolution-Inspired Solution
                    </h2>

                    <p style={{ marginBottom: '1.5rem' }}>
                      The breakthrough came when I started thinking about user behavior patterns as spatial relationships, 
                      similar to how convolutional neural networks process images. Instead of treating user-item interactions 
                      as isolated points, we could view them as part of a larger behavioral landscape where proximity and 
                      context matter significantly.
                    </p>

                    <p style={{ marginBottom: '1.5rem' }}>
                      Our matrix-based approach applies convolution-like operations to user behavior matrices, allowing us to 
                      capture local patterns and relationships that traditional methods miss. This technique has shown remarkable 
                      improvements in recommendation accuracy and user engagement metrics.
                    </p>
                  </>
                )}

                {blog.id === 2 && (
                  <>
                    <p style={{ marginBottom: '1.5rem' }}>
                      Speaker diarization—the process of determining "who spoke when" in an audio recording—is one of the most 
                      challenging problems in speech processing. During my research internship at Simbo.ai, I had the opportunity 
                      to dive deep into this fascinating field and develop a custom pipeline that pushed the boundaries of 
                      existing approaches.
                    </p>

                    <h2 style={{ 
                      color: 'var(--primary-color)', 
                      fontSize: '1.8rem', 
                      marginTop: '3rem', 
                      marginBottom: '1.5rem' 
                    }}>
                      Understanding the Challenge
                    </h2>

                    <p style={{ marginBottom: '1.5rem' }}>
                      The complexity of speaker diarization lies in the multitude of variables: overlapping speech, background noise, 
                      varying acoustic conditions, and the need to distinguish between speakers with similar vocal characteristics. 
                      Traditional approaches often rely on clustering techniques that struggle with these real-world complexities.
                    </p>

                    <h2 style={{ 
                      color: 'var(--primary-color)', 
                      fontSize: '1.8rem', 
                      marginTop: '3rem', 
                      marginBottom: '1.5rem' 
                    }}>
                      Novel Clustering Approach
                    </h2>

                    <p style={{ marginBottom: '1.5rem' }}>
                      Our innovation centered around a novel clustering methodology that combines spectral analysis with 
                      temporal modeling. By incorporating submodules from various existing pipelines and introducing our 
                      own clustering algorithm, we achieved significant improvements in speaker separation accuracy, 
                      particularly in challenging acoustic environments.
                    </p>
                  </>
                )}

                {blog.id === 3 && (
                  <>
                    <p style={{ marginBottom: '1.5rem' }}>
                      Deploying machine learning models in production is where theory meets reality. During my time at Atomberg Technologies, 
                      I've learned that building a great model is only half the battle—the real challenge lies in making it scalable, 
                      reliable, and maintainable in a production environment.
                    </p>

                    <h2 style={{ 
                      color: 'var(--primary-color)', 
                      fontSize: '1.8rem', 
                      marginTop: '3rem', 
                      marginBottom: '1.5rem' 
                    }}>
                      The AWS Ecosystem for ML
                    </h2>

                    <p style={{ marginBottom: '1.5rem' }}>
                      AWS provides a comprehensive suite of tools for machine learning operations. AWS Glue has been instrumental 
                      in our data preprocessing pipelines, allowing us to transform and clean massive datasets efficiently. 
                      Lambda functions serve as the backbone for our real-time inference endpoints, providing the scalability 
                      we need without the overhead of managing servers.
                    </p>

                    <h2 style={{ 
                      color: 'var(--primary-color)', 
                      fontSize: '1.8rem', 
                      marginTop: '3rem', 
                      marginBottom: '1.5rem' 
                    }}>
                      Lessons Learned
                    </h2>

                    <p style={{ marginBottom: '1.5rem' }}>
                      One of the most important lessons I've learned is the importance of monitoring and observability. 
                      AWS RDS instances require careful design and maintenance, and making archival data queryable through 
                      Athena has been crucial for both debugging and business intelligence. The key is building systems 
                      that are not just functional, but also transparent and maintainable.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Author Bio & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div style={{ 
              maxWidth: '800px', 
              margin: '4rem auto 0',
              padding: '2rem',
              background: 'var(--light-bg)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                About the Author
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Aarya Jha is a Data Science Specialist at Atomberg Technologies, passionate about developing 
                innovative AI/ML solutions. With expertise in machine learning, computer vision, and cloud technologies, 
                he enjoys sharing insights from his journey in data science and research.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/about" className="btn btn-outline">
                  Learn More About Me
                </Link>
                <Link to="/contact" className="btn btn-primary">
                  Get In Touch
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Related Posts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div style={{ maxWidth: '800px', margin: '4rem auto 0' }}>
              <h3 style={{ 
                color: 'var(--primary-color)', 
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                Continue Reading
              </h3>
              <div style={{ textAlign: 'center' }}>
                <Link to="/blogs" className="btn btn-outline">
                  View All Blog Posts
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
