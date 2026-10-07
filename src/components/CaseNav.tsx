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
    {/* Drax's logo, applied to the case like white cut-vinyl lettering */}
    <a href="#top" className="case-logo" aria-label="Drax Raw, back to top">
      <img src="img/logo.webp" alt="Drax Raw" width={700} height={436} />
    </a>

    <nav className="case-rail" aria-label="Main">
      <a href="#top" className="rail-mark" aria-label="Back to top">
        <img src="img/logo-mark.webp" alt="" width={240} height={234} />
      </a>
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
