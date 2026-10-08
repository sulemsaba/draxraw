import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Sticker } from '../components/Sticker';
import { CtaBand } from '../components/CtaBand';
import { ArrowIcon, CloseIcon, DownloadIcon, PhoneIcon } from '../components/Icons';
import { WALLPAPERS } from '../data/site';
import { gsap, reducedMotion, setScrollLocked } from '../lib/motion';
import { usePageMotion } from '../lib/usePageMotion';
import './WallpapersPage.css';

type Device = 'phone' | 'desktop';

const SIZE: Record<Device, string> = { phone: '1080 × 2340', desktop: '2560 × 1440' };

const DesktopIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
    <rect x="2.5" y="4" width="19" height="12.5" rx="1.5" />
    <path d="M8.5 20.5h7M12 16.5v4" />
  </svg>
);

const clock = () => {
  const d = new Date();
  return {
    time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    date: d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }),
  };
};

export const WallpapersPage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<Device>(() =>
    window.matchMedia('(max-width: 899px)').matches ? 'phone' : 'desktop'
  );
  const [open, setOpen] = useState<number | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  usePageMotion(ref);

  const step = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + WALLPAPERS.length) % WALLPAPERS.length)),
    []
  );

  useEffect(() => {
    setScrollLocked(open !== null);
    if (open === null) return;
    if (!reducedMotion()) gsap.fromTo('.wv-stage', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step]);

  const w = open !== null ? WALLPAPERS[open] : null;
  const now = clock();

  return (
    <div ref={ref} className="page">
      <section className="section" aria-labelledby="walls-title">
        <div className="section-inner">
          <header className="page-head walls-head">
            <Sticker as="h1" color="yellow" torn={77} rotate={-0.8} innerClassName="display section-title-inner">
              <span id="walls-title">Wallpapers</span>
            </Sticker>
            <p className="page-note">Made by Drax Raw. Tap one to preview it, then download if you like it.</p>

            <div className="walls-switch" role="tablist" aria-label="Device">
              {(['phone', 'desktop'] as Device[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={device === d}
                  className={`label ${device === d ? 'is-on' : ''}`}
                  onClick={() => setDevice(d)}
                >
                  {d === 'phone' ? <PhoneIcon size={18} /> : <DesktopIcon />}
                  {d === 'phone' ? 'Phone' : 'Desktop'}
                </button>
              ))}
            </div>
          </header>

          <ul className={`walls-grid is-${device}`}>
            {WALLPAPERS.map((wp, i) => (
              <li key={wp.slug}>
                <button type="button" className="walls-card" onClick={() => setOpen(i)} aria-label={`Preview ${wp.title}`}>
                  <span className={`mock mock-${device}`}>
                    <span className="mock-screen">
                      <img
                        src={`img/walls/${wp.slug}-${device}.webp`}
                        alt=""
                        loading="lazy"
                        width={device === 'phone' ? 420 : 1000}
                        height={device === 'phone' ? 910 : 563}
                      />
                    </span>
                  </span>
                  <span className="walls-meta">
                    <span className="walls-title display">{wp.title}</span>
                    <span className="walls-hint label">Preview</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {w && open !== null && (
        <div
          className="wv"
          role="dialog"
          aria-modal="true"
          aria-label={`${w.title} wallpaper preview`}
          onClick={(e) => e.target === e.currentTarget && setOpen(null)}
          onTouchStart={(e) => {
            touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchEnd={(e) => {
            const s = touch.current;
            touch.current = null;
            if (!s) return;
            const dx = e.changedTouches[0].clientX - s.x;
            const dy = e.changedTouches[0].clientY - s.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
            else if (dy > 90) setOpen(null);
          }}
        >
          <div className="wv-stage" key={`${w.slug}-${device}`}>
            <div className={`wv-frame wv-${device}`}>
              <img src={`wallpapers/${w.slug}-${device}.jpg`} alt={`${w.title} wallpaper`} />
              {device === 'phone' && (
                <span className="wv-lock" aria-hidden="true">
                  <span className="wv-date">{now.date}</span>
                  <span className="wv-time">{now.time}</span>
                </span>
              )}
            </div>
          </div>

          <div className="wv-bar">
            <button type="button" className="wv-icon" onClick={() => step(-1)} aria-label="Previous wallpaper">
              <ArrowIcon className="flip-x" />
            </button>
            <div className="wv-info">
              <span className="wv-title display">{w.title}</span>
              <span className="wv-size label">
                {device === 'phone' ? 'Phone' : 'Desktop'} / {SIZE[device]}
              </span>
            </div>
            <button type="button" className="wv-icon" onClick={() => step(1)} aria-label="Next wallpaper">
              <ArrowIcon />
            </button>
          </div>

          <div className="wv-actions">
            <a className="wv-dl label" href={`wallpapers/${w.slug}-${device}.jpg`} download={`drax-raw-${w.slug}-${device}.jpg`}>
              <DownloadIcon size={20} /> Download
            </a>
            <button type="button" className="wv-close label" onClick={() => setOpen(null)} autoFocus>
              <CloseIcon size={18} /> Close
            </button>
          </div>
        </div>
      )}

      <CtaBand />
    </div>
  );
};
