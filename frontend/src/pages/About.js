import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Github, Linkedin, Award, GraduationCap } from 'lucide-react';
import axios from 'axios';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="about">
      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-title">About Me</h1>
            <p className="section-subtitle">
              Get to know the person behind the algorithms and data insights
            </p>
          </motion.div>

          <div className="grid grid-2" style={{ alignItems: 'start', gap: '4rem' }}>
            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>My Journey</h2>
              <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  {profile?.bio || `I'm a passionate Data Science Specialist currently working at Atomberg Technologies, 
                  where I develop innovative AI/ML solutions that transform how we understand and interact with data. 
                  My journey in the world of data science began with a curiosity about patterns hidden in numbers 
                  and has evolved into a deep expertise in machine learning, computer vision, and cloud technologies.`}
                </p>
                
                <p style={{ marginBottom: '1.5rem' }}>
                  What drives me is the challenge of turning complex, seemingly chaotic data into clear, actionable insights. 
                  Whether it's developing novel recommendation engines that outperform traditional collaborative filtering 
                  or implementing custom speaker diarization pipelines, I thrive on pushing the boundaries of what's possible with AI.
                </p>
                
                <p style={{ marginBottom: '1.5rem' }}>
                  My approach combines rigorous research methodology with practical implementation skills. I believe that 
                  the best solutions come from understanding both the theoretical foundations and the real-world constraints 
                  of any problem. This philosophy has guided me through projects ranging from military defense applications 
                  to consumer IoT devices.
                </p>
                
                <p>
                  When I'm not diving deep into datasets or training models, you'll find me exploring the latest research papers, 
                  contributing to open-source projects, or sharing insights through my blog posts and ramblings. 
                  I'm always excited to collaborate on challenging problems and learn from fellow data enthusiasts.
                </p>
              </div>
            </motion.div>

            {/* Contact & Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="card">
                <h3 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>Get In Touch</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      background: 'var(--gradient-primary)', 
                      padding: '0.5rem', 
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MapPin size={18} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Location</div>
                      <div style={{ color: 'var(--text-secondary)' }}>{profile?.location}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      background: 'var(--gradient-primary)', 
                      padding: '0.5rem', 
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Mail size={18} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Email</div>
                      <a href={`mailto:${profile?.email}`} style={{ color: 'var(--primary-color)' }}>
                        {profile?.email}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      background: 'var(--gradient-primary)', 
                      padding: '0.5rem', 
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Phone size={18} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Phone</div>
                      <div style={{ color: 'var(--text-secondary)' }}>{profile?.phone}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      background: 'var(--gradient-primary)', 
                      padding: '0.5rem', 
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Github size={18} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>GitHub</div>
                      <a 
                        href={`https://github.com/${profile?.github}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        @{profile?.github}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      background: 'var(--gradient-primary)', 
                      padding: '0.5rem', 
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Linkedin size={18} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>LinkedIn</div>
                      <a 
                        href={`https://linkedin.com/in/${profile?.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        {profile?.linkedin}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education & Achievements */}
              <div className="card" style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>Education & Achievements</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <GraduationCap size={20} color="var(--primary-color)" />
                      <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Bachelor of Engineering</h4>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                      <div>Army Institute of Technology, Pune</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>CGPA: 9.44 | Jul 2019 - Jul 2023</div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Award size={20} color="var(--primary-color)" />
                      <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Key Achievements</h4>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>• NPTEL Course in Human Behaviour (Top 2% Nationally)</li>
                        <li style={{ marginBottom: '0.5rem' }}>• New Indian Express Readers Merit Scholarship</li>
                        <li style={{ marginBottom: '0.5rem' }}>• UdChalo Scholarship for Academic Excellence</li>
                        <li style={{ marginBottom: '0.5rem' }}>• Secretary, Cultural Board (2021-2022)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section" style={{ background: 'var(--light-bg)' }}>
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Skills & Expertise</h2>
            <p className="section-subtitle">
              Technologies and domains I work with to bring ideas to life
            </p>
          </motion.div>

          {profile?.skills && (
            <div className="skills-grid">
              <motion.div 
                className="skill-category"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4>Programming Languages</h4>
                <div className="skill-list">
                  {profile.skills.languages?.map((skill, index) => (
                    <span key={index} className="skill-item">{skill}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="skill-category"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4>Tools & Platforms</h4>
                <div className="skill-list">
                  {profile.skills.tools?.map((skill, index) => (
                    <span key={index} className="skill-item">{skill}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="skill-category"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4>Frameworks</h4>
                <div className="skill-list">
                  {profile.skills.frameworks?.map((skill, index) => (
                    <span key={index} className="skill-item">{skill}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="skill-category"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4>Expertise Areas</h4>
                <div className="skill-list">
                  {profile.skills.expertise?.map((skill, index) => (
                    <span key={index} className="skill-item">{skill}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
