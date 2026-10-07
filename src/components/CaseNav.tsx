import React from 'react';
import { useLocation } from 'react-router-dom';
import { CameraIcon, FilmIcon, PersonIcon, WhatsAppIcon } from './Icons';
import { GoLink } from './PageWipe';
import './CaseNav.css';

const LINKS = [
  { to: '/films', label: 'Films', Icon: FilmIcon },
  { to: '/photos', label: 'Photos', Icon: CameraIcon },
  { to: '/about', label: 'About', Icon: PersonIcon },
];

export const CaseNav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <>
      <GoLink to="/" className="case-logo" aria-label="Drax Raw, home">
        <img src="img/logo.webp" alt="Drax Raw" width={700} height={436} />
      </GoLink>

      <nav className="case-rail" aria-label="Main">
        <GoLink to="/" className="rail-mark" aria-label="Home">
          <img src="img/logo-mark.webp" alt="" width={240} height={234} />
        </GoLink>
        <div className="rail-links">
          {LINKS.map(({ to, label, Icon }) => (
            <GoLink
              key={to}
              to={to}
              className={`rail-link ${pathname === to ? 'is-active' : ''}`}
              aria-current={pathname === to ? 'page' : undefined}
            >
              <Icon />
              <span className="label">{label}</span>
            </GoLink>
          ))}
        </div>
        <GoLink
          to="/book"
          className={`rail-book stuck ${pathname === '/book' ? 'is-active' : ''}`}
          aria-current={pathname === '/book' ? 'page' : undefined}
        >
          <span className="vinyl is-red rail-book-inner label">
            <WhatsAppIcon />
            <span>Book</span>
          </span>
        </GoLink>
      </nav>
    </>
  );
};
