import React from 'react';
import { WHATSAPP_URL } from '../data/site';
import { Sticker } from './Sticker';
import { WhatsAppIcon, ArrowIcon } from './Icons';
import { GoLink } from './PageWipe';
import './CtaBand.css';

/** Short booking band at the end of a page. */
export const CtaBand: React.FC = () => (
  <section className="cta-band" aria-labelledby="cta-title">
    <div className="cta-inner">
      <h2 id="cta-title" className="cta-title">
        <Sticker color="paper" torn={101} rotate={-1.5} innerClassName="display cta-word">
          Tuongee.
        </Sticker>
        <span className="label cta-sub">Let's talk about your shoot</span>
      </h2>
      <div className="cta-actions">
        <a className="stuck cta-btn" data-slap="" data-magnetic="" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <span className="vinyl is-yellow wear-2 cta-btn-inner label">
            <WhatsAppIcon size={26} /> Message on WhatsApp
          </span>
        </a>
        <GoLink to="/book" className="cta-more label">
          All contacts <ArrowIcon size={18} />
        </GoLink>
      </div>
    </div>
  </section>
);
