import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [floating, setFloating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setIsOpen(false); }, [location]);

  const navItems = [
    { path: '/',          label: 'Home' },
    { path: '/about',     label: 'About' },
    { path: '/work',      label: 'Work' },
    { path: '/blogs',     label: 'Blogs' },
    { path: '/ramblings', label: 'Ramblings' },
    { path: '/contact',   label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${floating ? 'floating' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Aarya Jha
        </Link>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button className="nav-toggle" onClick={() => setIsOpen(o => !o)} aria-label="Toggle menu">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
