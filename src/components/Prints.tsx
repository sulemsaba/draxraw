import React, { useEffect, useRef, useState } from 'react';
import { PRINTS } from '../data/site';
import { Sticker } from './Sticker';
import { ArrowIcon, CloseIcon } from './Icons';
import { tapeClip, tilt } from '../lib/torn';
import './Prints.css';

export const Prints: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const step = (dir: number) => setOpen((i) => (i === null ? i : (i + dir + PRINTS.length) % PRINTS.length));

  return (
    <section className="section prints" id="photos" aria-labelledby="photos-title">
      <div className="section-inner">
        <Sticker as="h2" color="paper" torn={59} rotate={-0.8} innerClassName="display section-title-inner">
          <span id="photos-title">From the field</span>
        </Sticker>
        <p className="prints-note">Stills from shoots around Dar es Salaam. Tap a print to see it big.</p>
      </div>

      <ul className="prints-wall">
        {PRINTS.map((p, i) => (
          <li key={p.src} className={`print print-${i + 1}`} style={{ rotate: `${tilt(i * 4 + 20, 1.6)}deg` }} data-tape="">
            <button type="button" className="print-hit" onClick={() => setOpen(i)} aria-label={`Open photo: ${p.alt}`}>
              <span className="tape" style={{ clipPath: tapeClip(i + 3), rotate: `${tilt(i + 30, 4)}deg` }} />
              <img src={p.src} alt={p.alt} loading="lazy" width={1600} height={1067} />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={ref}
        className="lightbox"
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
      >
        {open !== null && (
          <>
            <img key={PRINTS[open].src} src={PRINTS[open].src} alt={PRINTS[open].alt} className="lightbox-img" />
            <div className="lightbox-bar">
              <button type="button" className="lb-btn" onClick={() => step(-1)} aria-label="Previous photo">
                <ArrowIcon className="flip" />
              </button>
              <span className="label lb-count">
                {open + 1} / {PRINTS.length}
              </span>
              <button type="button" className="lb-btn" onClick={() => step(1)} aria-label="Next photo">
                <ArrowIcon />
              </button>
              <button type="button" className="lb-btn" onClick={() => setOpen(null)} aria-label="Close" autoFocus>
                <CloseIcon />
              </button>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
};
