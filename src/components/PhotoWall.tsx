import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { Flip, gsap, reducedMotion, setScrollLocked } from '../lib/motion';
import { PRINTS } from '../data/site';
import { ArrowIcon, CloseIcon } from './Icons';
import './PhotoWall.css';

/**
 * Every still, big. Each one wipes open as it scrolls in; tapping one
 * grows it from its place on the wall to full screen (GSAP Flip) and
 * shrinks it back when closed.
 */
export const PhotoWall: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const closing = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.utils.toArray<HTMLElement>('.wall-photo').forEach((fig) => {
        // already on screen when the page opens: show it as is
        if (fig.getBoundingClientRect().top < window.innerHeight) return;
        const img = fig.querySelector('img');
        gsap
          .timeline({ scrollTrigger: { trigger: fig, start: 'top 88%', once: true } })
          .fromTo(fig, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out' })
          .fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0);
      });
    },
    { scope: rootRef }
  );

  const show = (i: number) => {
    const img = rootRef.current?.querySelector<HTMLImageElement>(`[data-flip-id="photo-${i}"]`);
    flipState.current = img && !reducedMotion() ? Flip.getState(img) : null;
    setOpen(i);
  };

  const hide = useCallback(() => {
    if (open === null || closing.current) return;
    const big = document.querySelector<HTMLElement>('.viewer-img');
    const target = rootRef.current?.querySelector<HTMLElement>(`[data-flip-id="photo-${open}"]`);
    if (!big || !target || reducedMotion()) {
      setOpen(null);
      return;
    }
    // Fly the big photo back into its spot on the wall
    closing.current = true;
    gsap.to('.viewer', { backgroundColor: 'rgba(8,8,9,0)', duration: 0.45 });
    gsap.to('.viewer-bar', { opacity: 0, duration: 0.2 });
    const r = target.getBoundingClientRect();
    const b = big.getBoundingClientRect();
    gsap.to(big, {
      x: r.left + r.width / 2 - (b.left + b.width / 2),
      y: r.top + r.height / 2 - (b.top + b.height / 2),
      scale: r.width / b.width,
      duration: 0.55,
      ease: 'power3.inOut',
      onComplete: () => {
        closing.current = false;
        setOpen(null);
      },
    });
  }, [open]);

  const lastDir = useRef(0);
  const step = useCallback((dir: number) => {
    lastDir.current = dir;
    setOpen((i) => (i === null ? i : (i + dir + PRINTS.length) % PRINTS.length));
  }, []);

  // Each new photo slides in from the side you swiped toward
  useEffect(() => {
    if (open === null || !lastDir.current || reducedMotion()) return;
    gsap.fromTo('.viewer-img', { x: lastDir.current * 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
    lastDir.current = 0;
  }, [open]);

  // Grow the clicked photo into the viewer
  useLayoutEffect(() => {
    if (open === null) return;
    const state = flipState.current;
    flipState.current = null;
    if (!state) return;
    Flip.from(state, { targets: '.viewer-img', duration: 0.65, ease: 'power3.inOut', scale: true });
    gsap.fromTo('.viewer', { backgroundColor: 'rgba(8,8,9,0)' }, { backgroundColor: 'rgba(8,8,9,0.96)', duration: 0.5 });
    gsap.fromTo('.viewer-bar', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.4 });
  }, [open]);

  useEffect(() => {
    setScrollLocked(open !== null);
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, hide, step]);

  return (
    <div ref={rootRef}>
      <ul className="wall">
        {PRINTS.map((p, i) => (
          <li key={p.src}>
            <button type="button" className="wall-photo" onClick={() => show(i)} aria-label={`View photo: ${p.alt}`}>
              <img
                src={p.src}
                srcSet={`${p.src.replace('.webp', '-800.webp')} 800w, ${p.src} 1600w`}
                sizes="(max-width: 899px) 100vw, 50vw"
                alt={p.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                width={1600}
                height={1067}
                data-flip-id={`photo-${i}`}
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          className="viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={(e) => e.target === e.currentTarget && hide()}
          // Swipe left / right for the next / previous photo, swipe down to close
          onTouchStart={(e) => {
            touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchEnd={(e) => {
            const start = touch.current;
            touch.current = null;
            if (!start) return;
            const dx = e.changedTouches[0].clientX - start.x;
            const dy = e.changedTouches[0].clientY - start.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
            else if (dy > 90) hide();
          }}
        >
          <img
            key={PRINTS[open].src}
            className="viewer-img"
            src={PRINTS[open].src}
            alt={PRINTS[open].alt}
            data-flip-id={`photo-${open}`}
            onClick={hide}
          />
          <div className="viewer-bar">
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo">
              <ArrowIcon className="flip-x" />
            </button>
            <span className="label">
              {open + 1} / {PRINTS.length}
            </span>
            <button type="button" onClick={() => step(1)} aria-label="Next photo">
              <ArrowIcon />
            </button>
            <button type="button" onClick={hide} aria-label="Close" autoFocus>
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
