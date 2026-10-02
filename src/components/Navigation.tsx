import React, { useState, useEffect } from 'react';
import './Navigation.css';

interface NavigationProps {
  navRef?: React.RefObject<HTMLElement | null>;
}

export const Navigation: React.FC<NavigationProps> = ({ navRef }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      ref={navRef}
      className={`site-navigation ${isScrolled ? 'is-scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}
      id="main-navigation"
    >
      <div className="nav-container">
        {/* Brand Left */}
        <a href="#" className="nav-brand" onClick={closeMenu}>
          DRAX<span className="brand-dot">.</span>RAW
        </a>

        {/* Desktop Navigation Links Right */}
        <nav className="nav-desktop-links" aria-label="Main Navigation">
          <a href="#work" className="nav-link">
            <span className="nav-link-text">WORK</span>
          </a>
          <a href="#stills" className="nav-link">
            <span className="nav-link-text">STILLS</span>
          </a>
          <a href="#about" className="nav-link">
            <span className="nav-link-text">ABOUT</span>
          </a>
          <a href="#contact" className="nav-link">
            <span className="nav-link-text">CONTACT</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link nav-link-external"
            aria-label="Instagram profile"
          >
            <span className="nav-link-text">IG ↗</span>
          </a>
        </nav>

        {/* Mobile Minimal Menu Toggle */}
        <button
          type="button"
          className="nav-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <span className={`toggle-line ${isMobileMenuOpen ? 'open' : ''}`} />
          <span className={`toggle-line ${isMobileMenuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`nav-mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-overlay-header">
          <span className="mobile-meta">DAR ES SALAAM — TZ</span>
          <span className="mobile-meta">2026 ARCHIVE</span>
        </div>
        <nav className="mobile-links">
          <a href="#work" className="mobile-link" onClick={closeMenu}>
            <span className="link-num">01</span>
            <span className="link-label">WORK</span>
          </a>
          <a href="#stills" className="mobile-link" onClick={closeMenu}>
            <span className="link-num">02</span>
            <span className="link-label">STILLS</span>
          </a>
          <a href="#about" className="mobile-link" onClick={closeMenu}>
            <span className="link-num">03</span>
            <span className="link-label">ABOUT</span>
          </a>
          <a href="#contact" className="mobile-link" onClick={closeMenu}>
            <span className="link-num">04</span>
            <span className="link-label">CONTACT</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-link external"
            onClick={closeMenu}
          >
            <span className="link-num">05</span>
            <span className="link-label">INSTAGRAM ↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
