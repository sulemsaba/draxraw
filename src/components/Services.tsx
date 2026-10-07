import React from 'react';
import { SERVICES } from '../data/site';
import { Sticker } from './Sticker';
import './Services.css';

export const Services: React.FC = () => (
  <section className="section services" aria-labelledby="services-title">
    <div className="section-inner">
      <Sticker as="h2" color="yellow" torn={47} rotate={0.8} innerClassName="display section-title-inner">
        <span id="services-title">What I shoot</span>
      </Sticker>

      <ul className="services-list">
        {SERVICES.map((s) => (
          <li key={s.label} className="display" data-slap="">
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  </section>
);
