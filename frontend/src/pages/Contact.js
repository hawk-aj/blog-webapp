import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Send, MessageCircle, Coffee } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post('/api/contact', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-title">Get In Touch</h1>
            <p className="section-subtitle">
              Let's discuss data science, AI innovations, or grab a coffee in Pune
            </p>
          </motion.div>

          <div className="grid grid-2" style={{ alignItems: 'start', gap: '4rem' }}>
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>
                Let's Connect
              </h2>
              
              <div style={{ marginBottom: '3rem' }}>
                <p style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: '1.7', 
                  color: 'var(--text-secondary)',
                  marginBottom: '1.5rem'
                }}>
                  I'm always excited to discuss new opportunities, collaborate on interesting projects, 
                  or simply chat about the latest developments in AI and machine learning.
                </p>
                
                <p style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: '1.7', 
                  color: 'var(--text-secondary)',
                  marginBottom: '1.5rem'
                }}>
                  Whether you're looking for a data science consultant, want to explore research 
                  collaborations, or just want to grab a coffee at one of Pune's amazing cafes, 
                  I'd love to hear from you.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    background: 'var(--gradient-primary)', 
                    padding: '0.75rem', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Mail size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      Email
                    </div>
                    <a 
                      href="mailto:aj240502@gmail.com" 
                      style={{ 
                        color: 'var(--primary-color)', 
                        textDecoration: 'none',
                        fontSize: '1.1rem'
                      }}
                    >
                      aj240502@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    background: 'var(--gradient-primary)', 
                    padding: '0.75rem', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Phone size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      Phone
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                      +91 6263883707
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    background: 'var(--gradient-primary)', 
                    padding: '0.75rem', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MapPin size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      Location
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                      Pune, Maharashtra, India
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    background: 'var(--gradient-primary)', 
                    padding: '0.75rem', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Coffee size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      Coffee Chat
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                      Available for meetups in Pune
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                  Find Me Online
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a 
                    href="https://github.com/hawk-aj" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      background: 'var(--light-bg)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'var(--border-color)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <Github size={18} />
                    GitHub
                  </a>
                  
                  <a 
                    href="https://linkedin.com/in/aarya-jha-2402" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      background: 'var(--light-bg)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'var(--border-color)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <Linkedin size={18} />
                    LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="contact-form">
                <h3 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>
                  Send Me a Message
                </h3>

                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What would you like to discuss?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell me about your project, idea, or just say hello..."
                    rows="6"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ 
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      color: '#10b981',
                      textAlign: 'center'
                    }}
                  >
                    Thank you for your message! I'll get back to you soon.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      color: '#ef4444',
                      textAlign: 'center'
                    }}
                  >
                    Something went wrong. Please try again or email me directly.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section" style={{ background: 'var(--light-bg)' }}>
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Common questions about collaboration and consulting
            </p>
          </motion.div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                  What kind of projects do you work on?
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  I specialize in machine learning, recommendation systems, computer vision, NLP, 
                  and cloud-based AI solutions. I'm particularly interested in novel approaches 
                  to traditional problems and research-oriented projects.
                </p>
              </motion.div>

              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                  Are you available for consulting?
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Yes! I'm open to consulting opportunities, especially for projects involving 
                  data science strategy, ML implementation, or AWS cloud solutions. Feel free 
                  to reach out to discuss your specific needs.
                </p>
              </motion.div>

              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                  Can we meet for coffee in Pune?
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Absolutely! I love meeting fellow data enthusiasts, researchers, and entrepreneurs. 
                  Some of my favorite spots include Cafe Goodluck and the German bakery in Koregaon Park. 
                  Let's grab a coffee and discuss ideas!
                </p>
              </motion.div>

              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                  How quickly do you respond to messages?
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  I typically respond within 24-48 hours. For urgent matters, feel free to 
                  mention it in your message subject line, and I'll prioritize accordingly.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
