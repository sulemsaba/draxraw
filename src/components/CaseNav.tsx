import React from 'react';
import { useLocation } from 'react-router-dom';
import { CameraIcon, FilmIcon, HomeIcon, PersonIcon, PhoneIcon, WhatsAppIcon } from './Icons';
import { GoLink } from './PageWipe';
import './CaseNav.css';

const LINKS = [
  { to: '/', label: 'Home', Icon: HomeIcon, phoneOnly: true },
  { to: '/films', label: 'Films', Icon: FilmIcon },
  { to: '/photos', label: 'Photos', Icon: CameraIcon },
  { to: '/wallpapers', label: 'Walls', Icon: PhoneIcon },
  { to: '/about', label: 'About', Icon: PersonIcon },
];

export const CaseNav: React.FC = () => {
  // GitHub Pages serves /films as /films/; compare without the trailing slash
  const pathname = useLocation().pathname.replace(/(.)\/$/, '$1');
  const current = (to: string) => (pathname === to ? 'page' : undefined);

  return (
    <>
      <GoLink to="/" className="case-logo" aria-label="Drax Raw, home">
        <img src="img/logo.webp" alt="Drax Raw" width={700} height={436} />
      </GoLink>

      {/* Phones: Book lives in the top bar */}
      <GoLink to="/book" className="top-book stuck" aria-current={current('/book')}>
        <span className="vinyl is-red top-book-inner label">
          <WhatsAppIcon size={18} /> Book
        </span>
      </GoLink>

      <nav className="case-rail" aria-label="Main">
        <GoLink to="/" className="rail-mark" aria-label="Home">
          <img src="img/logo-mark.webp" alt="" width={240} height={234} />
        </GoLink>
        <div className="rail-links">
          {LINKS.map(({ to, label, Icon, phoneOnly }) => (
            <GoLink
              key={to}
              to={to}
              className={`rail-link ${pathname === to ? 'is-active' : ''} ${phoneOnly ? 'phone-only' : ''}`}
              aria-current={current(to)}
            >
              <Icon />
              <span className="label">{label}</span>
            </GoLink>
          ))}
        </div>
        <GoLink to="/book" className={`rail-book stuck ${pathname === '/book' ? 'is-active' : ''}`} aria-current={current('/book')}>
          <span className="vinyl is-red rail-book-inner label">
            <WhatsAppIcon />
            <span>Book</span>
          </span>
        </GoLink>
      </nav>
    </>
  );
};
