import React from 'react';
import { Sticker } from './Sticker';
import { tapeClip } from '../lib/torn';
import './About.css';

export const About: React.FC = () => (
  <section className="section about" id="about" aria-labelledby="about-title">
    <div className="section-inner about-grid">
      <figure className="about-print" data-tape="">
        <span className="tape" style={{ clipPath: tapeClip(71), rotate: '-6deg' }} />
        <img src="img/drax-shades.webp" alt="Portrait of Drax in sunglasses and a white tee" loading="lazy" width={1100} height={1650} />
      </figure>

      <div className="about-copy">
        <Sticker as="h2" color="red" torn={83} rotate={-1} innerClassName="display section-title-inner">
          <span id="about-title">Who's Drax?</span>
        </Sticker>

        <Sticker color="paper" torn={91} rough={1.6} rotate={0.8} className="about-note" innerClassName="about-note-inner no-wear">
          {/* Drax's own words, from his existing site */}
          <span className="about-p">
            I'm Drax, a filmmaker and professional video editor based in Dar es Salaam, Tanzania.
          </span>
          <span className="about-p">
            I transform raw footage into meaningful visual stories through editing, color, sound and cinematic
            storytelling. My work spans short films, documentaries, corporate productions and short form content.
          </span>
          <span className="about-p">
            For me, editing is not simply about cutting clips. It is about knowing when a moment needs to breathe,
            when the story needs to move and when silence can say more than words.
          </span>
        </Sticker>

      </div>
    </div>
  </section>
);
