import React, { useCallback, useEffect, useRef, useState } from 'react';
import './Navigation.css';

interface NavigationProps {
  navRef?: React.RefObject<HTMLElement | null>;
}

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Stills', href: '#stills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
] as const;

export const Navigation: React.FC<NavigationProps> = ({ navRef }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const frame = useRef<number>(0);

  /* Which themed section sits under the navigation? */
  useEffect(() => {
    const readTheme = () => {
      frame.current = 0;
      const probe = window.scrollY + 40;
      const sections = document.querySelectorAll<HTMLElement>('[data-theme]');
      let current: 'light' | 'dark' = 'light';
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (probe >= top) current = section.dataset.theme === 'dark' ? 'dark' : 'light';
      });
      setTheme((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(readTheme);
    };

    readTheme();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  /* Lock page scroll while the mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      ref={navRef}
      className={`site-nav nav-on-${theme} ${menuOpen ? 'is-open' : ''}`}
    >
      <div className="site-nav-inner">
        <a href="#top" className="nav-brand" onClick={closeMenu}>
          DRAX.RAW
        </a>

        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link nav-link-external"
            aria-label="Instagram (opens in a new tab)"
          >
            IG&nbsp;&#8599;
          </a>
        </nav>

        <button
          type="button"
          className="nav-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`nav-mobile-menu ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="mobile-link" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              {link.label}
            </a>
          ))}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-link"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            Instagram&nbsp;&#8599;
          </a>
        </nav>
      </div>
    </header>
  );
};
