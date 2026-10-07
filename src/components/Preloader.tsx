import React, { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/motion';
import './Preloader.css';

interface PreloaderProps {
  /** The screen has switched off: the page can start its entrance. */
  onRevealed: () => void;
  /** Fully gone: unmount. */
  onExited: () => void;
}

/**
 * An old TV switching on. Snow hisses, the DX Raw logo tunes in through it
 * (colour fringes pulling into focus), the set counts up while you stand by,
 * then the picture tube switches off: the screen squeezes into a bright line,
 * the line into a dot, the dot fades, and the site is underneath.
 */
export const Preloader: React.FC<PreloaderProps> = ({ onRevealed, onExited }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // The plain HTML stand-in (shown before any JavaScript loads) hands over to this
  useEffect(() => {
    document.getElementById('boot')?.remove();
  }, []);

  // Snow: random grey pixels, 30 frames a second, on a small canvas scaled up
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const img = ctx.createImageData(canvas.width, canvas.height);
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 33) {
        last = now;
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          delay: 0.6,
          onStart: onRevealed,
          onComplete: onExited,
        });
        return;
      }

      const count = { v: 0 };
      const countEl = rootRef.current?.querySelector('.crt-count');

      // Held until the logo has actually loaded, so the tuning-in is never missed
      const tl = gsap.timeline({ paused: true, onComplete: onExited });
      tl
        // Tuning in: the logo arrives split into red and cyan, blurred, shaking
        .fromTo(
          '.crt-logo',
          {
            opacity: 0,
            scale: 0.92,
            filter: 'blur(10px) drop-shadow(10px 0 0 rgba(255,40,40,0.9)) drop-shadow(-10px 0 0 rgba(0,230,255,0.9))',
          },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px) drop-shadow(0px 0 0 rgba(255,40,40,0)) drop-shadow(0px 0 0 rgba(0,230,255,0))',
            duration: 1.1,
            ease: 'power3.out',
          },
          0.2
        )
        .fromTo('.crt-logo', { x: -6, skewX: 8 }, { x: 0, skewX: 0, duration: 0.07, repeat: 7, yoyo: true, ease: 'none' }, 0.25)
        .set('.crt-logo', { x: 0, skewX: 0 }, 0.82)
        // The snow settles as the signal locks
        .to('.crt-static', { opacity: 0.1, duration: 1.2, ease: 'power2.inOut' }, 0.45)
        .fromTo('.crt-glow', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.5)
        .fromTo('.crt-meta', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, 0.35)
        .to(
          count,
          {
            v: 100,
            duration: 1.6,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (countEl) countEl.textContent = String(Math.round(count.v)).padStart(2, '0');
            },
          },
          0.35
        )
        // Switching off: the picture squeezes into a bright line ...
        .to('.crt-meta', { opacity: 0, duration: 0.2 }, 2.05)
        .fromTo('.crt-screen', { scaleY: 1, filter: 'brightness(1)' }, { scaleY: 0.005, filter: 'brightness(4)', duration: 0.24, ease: 'power4.in', immediateRender: false }, 2.2)
        // ... the line into a dot ...
        .to('.crt-screen', { scaleX: 0.002, duration: 0.18, ease: 'power4.in' }, 2.44)
        .set('.crt-screen', { opacity: 0 }, 2.62)
        .fromTo('.crt-dot', { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.2, duration: 0.28, ease: 'power2.in', immediateRender: false }, 2.62)
        // ... and the room lights up: the site starts arriving as the dot fades
        .call(onRevealed, [], 2.5)
        .to(rootRef.current, { backgroundColor: 'rgba(0,0,0,0)', duration: 0.35, ease: 'power2.out' }, 2.62);

      const logo = rootRef.current?.querySelector<HTMLImageElement>('.crt-logo');
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        tl.play();
      };
      logo?.decode().then(start, start);
      // never keep anyone waiting on a slow connection
      const fallback = window.setTimeout(start, 2500);
      return () => window.clearTimeout(fallback);
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="preloader" role="status" aria-label="Drax Raw is loading">
      <div className="crt-screen">
        <canvas ref={canvasRef} className="crt-static" width={240} height={150} aria-hidden="true" />
        <div className="crt-roll" aria-hidden="true" />
        <div className="crt-glow" aria-hidden="true" />
        <div className="crt-center">
          <img className="crt-logo" src="img/logo.webp" alt="Drax Raw" width={700} height={436} />
        </div>
        <p className="crt-meta label" aria-hidden="true">
          <span className="crt-rec" />
          Please stand by
          <span className="crt-count">00</span>
        </p>
        <div className="crt-lines" aria-hidden="true" />
        <div className="crt-vignette" aria-hidden="true" />
      </div>
      <span className="crt-dot" aria-hidden="true" />
    </div>
  );
};
