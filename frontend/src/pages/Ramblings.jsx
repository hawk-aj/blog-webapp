import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Coffee, Moon, Sun, Lightbulb, Eye, Heart, Clock } from 'lucide-react';
import axios from 'axios';

const Ramblings = () => {
  const [ramblings, setRamblings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRamblings = async () => {
      try {
        const response = await axios.get('/api/ramblings');
        setRamblings(response.data);
      } catch (error) {
        console.error('Error fetching ramblings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRamblings();
  }, []);

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'contemplative':
        return <Moon size={20} />;
      case 'caffeinated':
        return <Coffee size={20} />;
      case 'reflective':
        return <Lightbulb size={20} />;
      case 'observant':
        return <Eye size={20} />;
      case 'inspired':
        return <Lightbulb size={20} />;
      case 'peaceful':
        return <Sun size={20} />;
      case 'thoughtful':
        return <Coffee size={20} />;
      case 'nostalgic':
        return <Heart size={20} />;
      default:
        return <Sun size={20} />;
    }
  };

  const getMoodColor = (mood) => {
    // Using variations of our three colors for different moods
    switch (mood) {
      case 'contemplative':
        return 'rgba(252, 52, 38, 0.9)'; // Deep red
      case 'caffeinated':
        return 'rgba(252, 52, 38, 0.8)'; // Deep red with opacity
      case 'reflective':
        return 'rgba(252, 52, 38, 0.7)'; // Deep red with opacity
      case 'observant':
        return 'rgba(252, 52, 38, 0.85)'; // Deep red with opacity
      case 'inspired':
        return 'rgba(252, 52, 38, 0.75)'; // Deep red with opacity
      case 'peaceful':
        return 'rgba(252, 52, 38, 0.65)'; // Deep red with opacity
      case 'thoughtful':
        return 'rgba(252, 52, 38, 0.6)'; // Deep red with opacity
      case 'nostalgic':
        return 'rgba(252, 52, 38, 0.95)'; // Deep red with opacity
      default:
        return '#FC3426'; // Deep red
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
    <div className="ramblings">
      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-title">Random Ramblings</h1>
            <p className="section-subtitle">
              Raw, unfiltered thoughts scribbled down in moments of clarity, confusion, and everything in between
            </p>
          </motion.div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {ramblings.map((rambling, index) => (
              <motion.div
                key={rambling.id}
                className="rambling-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{ marginBottom: '2rem' }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  marginBottom: '1rem' 
                }}>
                  <div style={{ 
                    color: getMoodColor(rambling.mood),
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {getMoodIcon(rambling.mood)}
                  </div>
                  <h2 className="rambling-title" style={{ margin: 0 }}>
                    {rambling.title}
                  </h2>
                </div>

                <div className="rambling-content">
                  {rambling.content}
                </div>

                <div className="rambling-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} />
                    <span>
                      {new Date(rambling.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div 
                    className="rambling-mood"
                    style={{ 
                      background: getMoodColor(rambling.mood),
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: 'var(--soft-cream)'
                    }}
                  >
                    {getMoodIcon(rambling.mood)}
                    {rambling.mood}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {ramblings.length === 0 && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                No ramblings available at the moment. Check back soon for more thoughts!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Ramblings */}
      <section className="section" style={{ background: 'var(--light-bg)' }}>
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Why I Ramble</h2>
            <p className="section-subtitle">
              My brain dump - messy, honest, and sometimes surprising even to me
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
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginBottom: '1rem' 
              }}>
                <div style={{ 
                  background: 'var(--gradient-primary)', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Coffee size={24} color="var(--soft-cream)" />
                </div>
                <h3>Cafe Chronicles</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                From Cafe Goodluck to German bakeries in Koregaon Park, some of the best insights come 
                while sipping coffee and watching the world go by. These are observations from Pune's 
                vibrant cafe culture and how it mirrors data patterns.
              </p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginBottom: '1rem' 
              }}>
                <div style={{ 
                  background: 'var(--gradient-primary)', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sun size={24} color="var(--soft-cream)" />
                </div>
                <h3>Sunset Reflections</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Watching sunsets from my terrace in Pune often leads to unexpected connections between 
                nature's algorithms and machine learning. These peaceful moments reveal insights about 
                optimization, gradients, and the beauty of natural processes.
              </p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginBottom: '1rem' 
              }}>
                <div style={{ 
                  background: 'var(--gradient-primary)', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Heart size={24} color="var(--soft-cream)" />
                </div>
                <h3>Historical Connections</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Stories from WW2 codebreakers, family war tales, and historical parallels to modern 
                data science challenges. Sometimes the past holds the keys to solving today's 
                algorithmic puzzles.
              </p>
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginBottom: '1rem' 
              }}>
                <div style={{ 
                  background: 'var(--gradient-primary)', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={24} color="var(--soft-cream)" />
                </div>
                <h3>3 AM Epiphanies</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Late-night coding sessions often lead to unexpected breakthroughs. These are the 
                caffeine-fueled thoughts that emerge when the world is quiet and the mind is free 
                to make unusual connections.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mood Legend */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">My Moods</h2>
            <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
              Because my thoughts change with my state of mind
            </p>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'var(--soft-cream)',
                borderRadius: '25px',
                border: '1px solid var(--soft-cream)',
                justifyContent: 'center'
              }}>
                <Coffee size={18} color="var(--deep-red)" />
                <span style={{ color: 'var(--deep-red)' }}>Caffeinated</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'var(--soft-cream)',
                borderRadius: '25px',
                border: '1px solid var(--soft-cream)',
                justifyContent: 'center'
              }}>
                <Moon size={18} color="var(--deep-red)" />
                <span style={{ color: 'var(--deep-red)' }}>Contemplative</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'var(--soft-cream)',
                borderRadius: '25px',
                border: '1px solid var(--soft-cream)',
                justifyContent: 'center'
              }}>
                <Sun size={18} color="var(--deep-red)" />
                <span style={{ color: 'var(--deep-red)' }}>Peaceful</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'var(--soft-cream)',
                borderRadius: '25px',
                border: '1px solid var(--soft-cream)',
                justifyContent: 'center'
              }}>
                <Heart size={18} color="var(--deep-red)" />
                <span style={{ color: 'var(--deep-red)' }}>Nostalgic</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'var(--soft-cream)',
                borderRadius: '25px',
                border: '1px solid var(--soft-cream)',
                justifyContent: 'center'
              }}>
                <Eye size={18} color="var(--deep-red)" />
                <span style={{ color: 'var(--deep-red)' }}>Observant</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'var(--soft-cream)',
                borderRadius: '25px',
                border: '1px solid var(--soft-cream)',
                justifyContent: 'center'
              }}>
                <Lightbulb size={18} color="var(--deep-red)" />
                <span style={{ color: 'var(--deep-red)' }}>Inspired</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Ramblings;
