import React from 'react';
import { Sticker } from './Sticker';
import { PlayIcon, WhatsAppIcon } from './Icons';
import { WHATSAPP_URL } from '../data/site';
import './CaseHero.css';

export const CaseHero: React.FC = () => (
  <section className="case-hero" id="top" aria-label="Drax Raw, filmmaker in Dar es Salaam">
    <div className="hero-board">
      <h1 className="hero-name">
        <span className="sr-only">Drax Raw</span>
        <Sticker color="paper" torn={3} rotate={-1.5} className="name-drax" innerClassName="display">
          <span aria-hidden="true">DRAX</span>
        </Sticker>
        <Sticker color="red" torn={11} rotate={2} className="name-raw" innerClassName="display">
          <span aria-hidden="true">RAW</span>
        </Sticker>
      </h1>

      <figure className="hero-drax" data-slap="">
        <img
          src="img/drax-cutout.webp"
          alt="Drax in a red cap and headphones, checking a camera"
          width={1100}
          height={1680}
          fetchPriority="high"
        />
      </figure>

      <p className="hero-roles label" data-slap="">
        Filmmaker <i>/</i> Editor <i>/</i> Photographer
      </p>

      <div className="hero-actions">
        <a className="stuck btn-sticker" data-slap="" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <span className="vinyl is-red btn-inner label">
            <WhatsAppIcon /> Book on WhatsApp
          </span>
        </a>
        <a className="btn-plain label" data-slap="" href="#work">
          <PlayIcon size={16} /> Watch my films
        </a>
      </div>
    </div>
  </section>
);
