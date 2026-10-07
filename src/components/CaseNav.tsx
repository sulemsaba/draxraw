import React from 'react';
import { CameraIcon, FilmIcon, PersonIcon, WhatsAppIcon } from './Icons';
import { WHATSAPP_URL } from '../data/site';
import './CaseNav.css';

const LINKS = [
  { href: '#work', label: 'Films', Icon: FilmIcon },
  { href: '#photos', label: 'Photos', Icon: CameraIcon },
  { href: '#about', label: 'About', Icon: PersonIcon },
];

export const CaseNav: React.FC = () => (
  <>
    <a href="#top" className="case-logo stuck" aria-label="Drax Raw, back to top">
      <span className="vinyl is-ink logo-inner display">
        DRAX<b>.</b>RAW
      </span>
    </a>

    <nav className="case-rail" aria-label="Main">
      <div className="rail-links">
        {LINKS.map(({ href, label, Icon }) => (
          <a key={href} href={href} className="rail-link">
            <Icon />
            <span className="label">{label}</span>
          </a>
        ))}
      </div>
      <a className="rail-book stuck" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
        <span className="vinyl is-red rail-book-inner label">
          <WhatsAppIcon />
          <span>Book</span>
        </span>
      </a>
    </nav>
  </>
);
