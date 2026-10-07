import React from 'react';
import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_NUMBER, WHATSAPP_URL, YOUTUBE_URL } from '../data/site';
import { ArrowIcon, WhatsAppIcon } from './Icons';
import { Sticker } from './Sticker';
import './Book.css';

export const Book: React.FC = () => (
  <section className="book" id="book" aria-labelledby="book-title">
    <div className="book-panel">
      <div className="book-inner">
      <h1 id="book-title" className="book-title">
        <Sticker color="paper" torn={101} rotate={-1.5} innerClassName="display book-word">
          Tuongee.
        </Sticker>
        <span className="book-sub label">Let's talk</span>
      </h1>

      <p className="book-copy">
        Tell me about your shoot.
      </p>

      <a className="book-cta stuck" data-slap="" data-magnetic="" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
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

  </section>
);
