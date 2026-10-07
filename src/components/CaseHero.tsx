import React from 'react';
import { Sticker } from './Sticker';
import { PlayIcon, WhatsAppIcon } from './Icons';
import { WHATSAPP_URL, type StickerColor } from '../data/site';
import { tornClip } from '../lib/torn';
import './CaseHero.css';

// Older stickers already on the case: years of them, overlapping, bleaching,
// some torn half off down to the adhesive. Seeded so every load is the same case.
const WORDS = ['REC', 'DAR', 'CUT', 'TZ', '4K', 'COLOR', 'EDIT', 'FILM', 'RAW', 'A7C', 'BONGO', 'LIVE', 'ROLL', 'SOUND', 'DSM', 'ACTION', 'B-CAM', 'WRAP'];
const COLORS: (StickerColor | 'residue')[] = ['red', 'blue', 'yellow', 'purple', 'paper', 'red', 'residue', 'blue', 'yellow'];

const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const FRAGMENTS = (() => {
  const r = seeded(20260);
  return Array.from({ length: 12 }, () => {
    const color = COLORS[Math.floor(r() * COLORS.length)];
    return {
      word: color === 'residue' ? '' : WORDS[Math.floor(r() * WORDS.length)],
      color,
      // keep the old stickers out at the edges, never behind the name
      x: r() < 0.5 ? r() * 18 - 10 : 82 + r() * 18,
      y: r() * 104 - 6,
      r: (r() * 2 - 1) * 24,
      s: 0.55 + r() * 1.1,
      phoneHide: true,
    };
  });
})();

export const CaseHero: React.FC = () => (
  <section className="case-hero" id="top" aria-label="Drax Raw, filmmaker in Dar es Salaam">
    <div className="accretion" aria-hidden="true">
      {FRAGMENTS.map((f, i) => (
        <span
          key={i}
          className={`fragment vinyl is-${f.color === 'residue' ? 'paper' : f.color} wear-${(i % 3) + 1} ${
            f.color === 'residue' ? 'is-residue' : ''
          } ${f.phoneHide ? 'phone-hide' : ''}`}
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            rotate: `${f.r}deg`,
            fontSize: `calc(clamp(2.6rem, 8vw, 7.5rem) * ${f.s})`,
            clipPath: tornClip(i * 13 + 5, f.color === 'residue' ? 14 : 7),
          }}
        >
          {f.word || 'XXXX'}
        </span>
      ))}
    </div>

    <div className="hero-board">
      <h1 className="hero-name">
        <span className="sr-only">Drax Raw</span>
        <Sticker color="paper" torn={3} rough={2} rotate={-1.5} className="name-drax" innerClassName="display">
          <span aria-hidden="true">DRAX</span>
        </Sticker>
        <Sticker color="red" torn={11} rough={3} rotate={2} className="name-raw" innerClassName="display">
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

      <Sticker color="ink" rotate={-6} className="hero-badge" innerClassName="badge-inner label">
        Dar es
        <br />
        Salaam
        <span className="badge-tz">TZ</span>
      </Sticker>

      <Sticker color="yellow" torn={21} rough={4} rotate={-0.8} className="hero-roles" innerClassName="roles-inner label">
        Filmmaker <i>/</i> Editor <i>/</i> Photographer
      </Sticker>

      <p className="hero-line">
        <b>I shoot it.</b> <b>I cut it.</b> <b>I color it.</b>
        <span> Films and photos for weddings, NGOs, brands and artists.</span>
      </p>

      <div className="hero-actions">
        <a className="stuck btn-sticker" data-slap="" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <span className="vinyl is-red btn-inner label">
            <WhatsAppIcon /> Book on WhatsApp
          </span>
        </a>
        <a className="stuck btn-sticker" data-slap="" href="#work">
          <span className="vinyl is-paper btn-inner label">
            <PlayIcon size={18} /> Watch my films
          </span>
        </a>
      </div>
    </div>
  </section>
);
