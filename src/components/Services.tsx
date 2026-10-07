import React from 'react';
import { SERVICES } from '../data/site';
import { Sticker } from './Sticker';
import { tilt } from '../lib/torn';
import './Services.css';

export const Services: React.FC = () => (
  <section className="section services" aria-labelledby="services-title">
    <div className="section-inner">
      <Sticker as="h2" color="yellow" torn={47} rotate={0.8} innerClassName="display section-title-inner">
        <span id="services-title">What I shoot</span>
      </Sticker>

      <ul className="services-pile">
        {SERVICES.map((s, i) => (
          <li key={s.label}>
            <Sticker
              color={s.color}
              rotate={tilt(i * 3 + 11, 1.8)}
              torn={i % 2 ? i * 9 + 3 : undefined}
              innerClassName={`service display ${i % 2 ? '' : 'is-diecut'}`}
            >
              {s.label}
            </Sticker>
          </li>
        ))}
      </ul>

      <p className="services-note">
        One person, start to finish. I plan it, shoot it, edit it and color it, so nothing gets lost between a crew and an
        editor.
      </p>
    </div>
  </section>
);
