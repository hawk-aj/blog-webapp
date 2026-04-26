import React, { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, Building } from 'lucide-react';
import './SideStack.css';

/**
 * SideStack — scroll-driven stacked experience cards.
 *
 * Props:
 *   cards  — array of experience objects from the API
 *            { id, company, position, location, duration, description[] }
 */
const SideStack = ({ cards = [] }) => {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track window height for responsive sticky offset calculation
  useEffect(() => {
    if (!cards.length) return;

    const section = sectionRef.current;
    if (!section) return;

    // Set track height: 100vh per card transition + 1 for the last card to rest
    section.style.height = `${window.innerHeight * (cards.length + 0.5)}px`;

    const onScroll = () => {
      const sectionTop    = section.getBoundingClientRect().top + window.scrollY;
      const scrolledInto  = window.scrollY - sectionTop;
      const progress      = scrolledInto / window.innerHeight;
      const newActive     = Math.max(0, Math.min(Math.floor(progress), cards.length - 1));
      setActiveIndex(newActive);
    };

    const onResize = () => {
      section.style.height = `${window.innerHeight * (cards.length + 0.5)}px`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll(); // run once on mount

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [cards.length]);

  if (!cards.length) return null;

  return (
    <div ref={sectionRef} className="side-stack-section">
      <div className="side-stack-track">
        {cards.map((job, i) => {
          const isReceding = i < activeIndex;
          const isHidden   = i < activeIndex - 2;

          return (
            <div
              key={job.id ?? i}
              className={[
                'side-stack-card',
                isReceding ? 'receding' : '',
                isHidden   ? 'hidden'   : '',
              ].filter(Boolean).join(' ')}
              style={{ zIndex: i + 1 }}
            >
              <div className="ss-header">
                <div className="ss-title-block">
                  <div className="ss-company">
                    <Building size={18} />
                    {job.company}
                  </div>
                  <div className="ss-position">{job.position}</div>
                  {job.location && (
                    <div className="ss-location">
                      <MapPin size={13} />
                      {job.location}
                    </div>
                  )}
                </div>
                {job.duration && (
                  <div className="ss-duration">
                    <Calendar size={13} style={{ display: 'inline', marginRight: '0.35rem' }} />
                    {job.duration}
                  </div>
                )}
              </div>

              {job.description?.length > 0 && (
                <ul className="ss-bullets">
                  {job.description.map((point, pi) => (
                    <li key={pi}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="ss-counter">
        {activeIndex + 1} / {cards.length}
      </div>
    </div>
  );
};

export default SideStack;
