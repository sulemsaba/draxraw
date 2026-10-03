import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme, type ThemeMode } from '../theme/ThemeContext';
import { scrollToTarget } from '../lib/lenis';
import './Navigation.css';

interface NavigationProps {
  navRef?: React.RefObject<HTMLElement | null>;
  /** Cross-route nav handler from App so links work on project pages too. */
  onNavigate?: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const LINKS = [
  { label: 'Film', href: '#film' },
  { label: 'About', href: '#about' },
  { label: 'Photography', href: '#photography' },
  { label: 'Contact', href: '#contact' }
] as const;

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'hybrid', label: 'Hybrid' }
];

/** Quiet text control — Light / Dark / Hybrid. */
const ThemeToggle: React.FC<{ variant: 'bar' | 'menu' }> = ({ variant }) => {
  const { mode, setMode } = useTheme();

  return (
    <div className={`nav-themes nav-themes-${variant}`} role="group" aria-label="Colour theme">
      {THEME_OPTIONS.map((option, i) => (
        <React.Fragment key={option.value}>
          {i > 0 && (
            <span className="theme-sep" aria-hidden="true">
              /
            </span>
          )}
          <button
            type="button"
            className={`theme-option${mode === option.value ? ' is-active' : ''}`}
            aria-pressed={mode === option.value}
            onClick={() => setMode(option.value)}
          >
            {option.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export const Navigation: React.FC<NavigationProps> = ({ navRef, onNavigate }) => {
  const { mode } = useTheme();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const frame = useRef<number>(0);

  /* Which surface sits under the navigation?
     Forced modes answer instantly; hybrid probes the sections. */
  useEffect(() => {
    const readTheme = () => {
      frame.current = 0;

      if (mode !== 'hybrid') {
        setTheme((prev) => (prev === mode ? prev : mode));
        return;
      }

      setScrolled(window.scrollY > 24);

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
  }, [mode]);

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

  /* Smooth-scroll anchors through Lenis, then close the menu.
     When on a project page, App's onNavigate routes home first. */
  const goSection = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    closeMenu();
    if (onNavigate) {
      onNavigate(event, href);
    } else {
      scrollToTarget(href);
    }
  };

  return (
    <header
      ref={navRef}
      className={`site-nav nav-on-${theme} ${scrolled ? 'is-scrolled' : ''} ${
        menuOpen ? 'is-open' : ''
      }`}
    >
      <div className="site-nav-inner">
        <a href="#top" className="nav-brand" onClick={(e) => goSection(e, '#top')}>
          Drax Raw
        </a>

        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              onClick={(e) => goSection(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://www.instagram.com/drax.raw/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link nav-link-external"
            aria-label="Instagram (opens in a new tab)"
          >
            IG&nbsp;&#8599;
          </a>
          <ThemeToggle variant="bar" />
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
        className={`nav-mobile-menu theme-light ${menuOpen ? 'is-open' : ''}`}
        data-theme="light"
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-link"
              onClick={(e) => goSection(e, link.href)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://www.instagram.com/drax.raw/"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-link"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            Instagram&nbsp;&#8599;
          </a>
        </nav>

        <ThemeToggle variant="menu" />
      </div>
    </header>
  );
};
