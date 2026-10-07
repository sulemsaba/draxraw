import React from 'react';
import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_NUMBER, WHATSAPP_URL, YOUTUBE_URL } from '../data/site';
import { ArrowIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from './Icons';
import { Sticker } from './Sticker';
import './Book.css';

const YEAR = new Date().getFullYear();

export const Book: React.FC = () => (
  <section className="book" id="book" aria-labelledby="book-title">
    <div className="book-panel">
      <div className="book-inner">
      <h2 id="book-title" className="book-title">
        <Sticker color="paper" torn={101} rotate={-1.5} innerClassName="display book-word">
          Tuongee.
        </Sticker>
        <span className="book-sub label">Let's talk</span>
      </h2>

      <p className="book-copy">
        Tell me about your shoot.
      </p>

      <a className="book-cta stuck" data-slap="" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
        <span className="vinyl is-yellow wear-2 book-cta-inner label">
          <WhatsAppIcon size={30} />
          Message Drax on WhatsApp
        </span>
      </a>

      <ul className="book-lines">
        {[
          { label: 'WhatsApp', value: `+${WHATSAPP_NUMBER.replace(/^(\d{3})(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4')}`, href: WHATSAPP_URL },
          { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
          { label: 'Instagram', value: INSTAGRAM_HANDLE, href: INSTAGRAM_URL },
          { label: 'YouTube', value: '@DraxRaw', href: YOUTUBE_URL },
        ].map((line) => (
          <li key={line.label}>
            <a href={line.href} target={line.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer">
              <span className="label book-line-label">{line.label}</span>
              <span className="book-line-value">{line.value}</span>
              <ArrowIcon size={18} className="book-line-arrow" />
            </a>
          </li>
        ))}
      </ul>
      </div>

      <figure className="book-drax" aria-hidden="true">
        <span className="tape" />
        <img src="img/drax-seated.webp" alt="" loading="lazy" width={1100} height={1650} />
      </figure>
    </div>

    <footer className="case-foot">
      <img className="foot-logo" src="img/logo.webp" alt="Drax Raw" width={700} height={436} loading="lazy" />
      <div className="foot-links">
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
  </section>
);
