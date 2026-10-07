import React from 'react';
import { INSTAGRAM_URL, YOUTUBE_URL } from '../data/site';
import { InstagramIcon, YouTubeIcon } from './Icons';
import { GoLink } from './PageWipe';
import './Footer.css';

const YEAR = new Date().getFullYear();

export const Footer: React.FC = () => (
  <footer className="case-foot">
    <GoLink to="/" aria-label="Drax Raw, home">
      <img className="foot-logo" src="img/logo.webp" alt="Drax Raw" width={700} height={436} loading="lazy" />
    </GoLink>
    <div className="foot-links">
      <GoLink to="/book" className="label">
        Book
      </GoLink>
      <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="label">
        <YouTubeIcon /> YouTube
      </a>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="label">
        <InstagramIcon /> Instagram
      </a>
    </div>
    <p className="foot-meta label">
      Drax Raw <span>/</span> Dar es Salaam, Tanzania <span>/</span> {YEAR}
    </p>
  </footer>
);
