import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, Building } from 'lucide-react';
import axios from 'axios';

const Work = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await axios.get('/api/experience');
        setExperience(response.data);
      } catch (error) {
        console.error('Error fetching experience:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="work">
      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-title">My Work Experience</h1>
            <p className="section-subtitle">
              A journey through innovative projects and impactful solutions in data science and AI
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {experience.map((job, index) => (
              <motion.div
                key={job.id}
                className="experience-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="experience-header">
                  <div className="experience-title">
                    <h2 className="experience-company">
                      <Building size={24} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--primary-color)' }} />
                      {job.company}
                    </h2>
                    <h3 className="experience-position">{job.position}</h3>
                    <div className="experience-location">
                      <MapPin size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      {job.location}
                    </div>
                  </div>
                  <div className="experience-duration">
                    <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    {job.duration}
                  </div>
                </div>

                <ul className="experience-description">
                  {job.description.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.2) + (itemIndex * 0.1) + 0.3 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Projects Highlight */}
      <section className="section" style={{ background: 'var(--light-bg)' }}>
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
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                Novel Recommendation Engine
              </h3>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Developed a groundbreaking convolution-inspired matrix-based approach for user behavior analysis 
                that outperformed traditional collaborative filtering and market basket analysis methods. 
                This innovative solution addressed the limitations of existing recommendation strategies and 
                delivered significantly improved results for user engagement.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="skill-item">Machine Learning</span>
                <span className="skill-item">Matrix Operations</span>
                <span className="skill-item">User Analytics</span>
                <span className="skill-item">Python</span>
              </div>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                Custom Speaker Diarization Pipeline
              </h3>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Implemented a sophisticated speaker diarization system with novel clustering approaches, 
                preceded by extensive research into existing methodologies. The solution included 
                submodules from various existing pipelines, creating a robust and efficient system 
                for voice separation and identification.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="skill-item">NLP</span>
                <span className="skill-item">Audio Processing</span>
                <span className="skill-item">Clustering</span>
                <span className="skill-item">Research</span>
              </div>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                Smart Device Firmware & Cloud Integration
              </h3>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Led firmware development for smart devices with rule-based decision mechanisms and 
                integrated cloud capabilities using AWS Glue and Lambda. This project bridged 
                hardware and cloud technologies, making AI solutions accessible and scalable 
                while ensuring efficient data collection and processing.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="skill-item">IoT</span>
                <span className="skill-item">AWS Lambda</span>
                <span className="skill-item">AWS Glue</span>
                <span className="skill-item">Firmware</span>
              </div>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                Military & Defense ML Applications
              </h3>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Worked on implementing machine learning algorithms and IoT principles for 
                military and defense applications. Projects focused on core IoT principles 
                with hands-on approaches to ML algorithms, addressing unique challenges in 
                security-critical environments and specialized use cases.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="skill-item">Defense Tech</span>
                <span className="skill-item">IoT Systems</span>
                <span className="skill-item">ML Algorithms</span>
                <span className="skill-item">Security</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Achievements */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Technical Achievements</h2>
            <p className="section-subtitle">
              Key technical milestones and innovations in my professional journey
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
                fontSize: '3rem', 
                fontWeight: 'bold', 
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                3+
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>Years of Experience</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Professional experience in data science and AI/ML development
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
                fontSize: '3rem', 
                fontWeight: 'bold', 
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                10+
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>Major Projects</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Successful implementation of complex AI/ML and IoT solutions
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
                fontSize: '3rem', 
                fontWeight: 'bold', 
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                5+
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>Technologies Mastered</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                AWS services, ML frameworks, and programming languages
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Work;
