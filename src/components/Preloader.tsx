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
 * An old TV switching on, about 1.5 seconds, first visit only. Snow hisses,
 * the DX Raw logo tunes in through it, then the logo leaves the TV for its
 * place as the site's logo while the picture tube switches off behind it.
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

      // The site's logo waits for the TV logo to land on it
      gsap.set('.case-logo', { opacity: 0 });

      // Held until the logo has actually loaded, so the tuning-in is never missed
      const tl = gsap.timeline({ paused: true, onComplete: onExited });
      tl
        // Tuning in: the logo arrives split into red and cyan, blurred, shaking
        .fromTo(
          '.crt-logo',
          {
            opacity: 0,
            scale: 0.94,
            filter: 'blur(8px) drop-shadow(8px 0 0 rgba(255,40,40,0.9)) drop-shadow(-8px 0 0 rgba(0,230,255,0.9))',
          },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px) drop-shadow(0px 0 0 rgba(255,40,40,0)) drop-shadow(0px 0 0 rgba(0,230,255,0))',
            duration: 0.6,
            ease: 'power3.out',
          },
          0.05
        )
        .fromTo('.crt-logo', { x: -5, skewX: 6 }, { x: 0, skewX: 0, duration: 0.06, repeat: 4, yoyo: true, ease: 'none' }, 0.08)
        .set('.crt-logo', { x: 0, skewX: 0 }, 0.4)
        .to('.crt-static', { opacity: 0.1, duration: 0.6, ease: 'power2.inOut' }, 0.15)
        // Hand-over: the logo leaves the TV for its place as the site's logo,
        // while the set switches off behind it (picture to a line, line to a dot)
        .add(() => {
          const from = rootRef.current?.querySelector<HTMLElement>('.crt-logo')?.getBoundingClientRect();
          const target = document.querySelector<HTMLElement>('.case-logo img');
          const to = target?.getBoundingClientRect();
          if (!from || !to || !to.width) return;
          gsap.to('.crt-logo', {
            x: to.left + to.width / 2 - (from.left + from.width / 2),
            y: to.top + to.height / 2 - (from.top + from.height / 2),
            scale: to.width / from.width,
            duration: 0.6,
            ease: 'power3.inOut',
          });
        }, 0.85)
        .fromTo('.crt-screen', { scaleY: 1, filter: 'brightness(1)' }, { scaleY: 0.005, filter: 'brightness(4)', duration: 0.2, ease: 'power4.in', immediateRender: false }, 0.88)
        .to('.crt-screen', { scaleX: 0.002, duration: 0.15, ease: 'power4.in' }, 1.08)
        .set('.crt-screen', { opacity: 0 }, 1.23)
        .fromTo('.crt-dot', { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.2, duration: 0.22, ease: 'power2.in', immediateRender: false }, 1.23)
        .call(onRevealed, [], 1.12)
        .to(rootRef.current, { backgroundColor: 'rgba(0,0,0,0)', duration: 0.3, ease: 'power2.out' }, 1.2)
        // the logo has landed: the site's own logo takes over
        .set('.case-logo', { opacity: 1 }, 1.45)
        .to('.crt-logo', { opacity: 0, duration: 0.15 }, 1.45);

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
        <div className="crt-lines" aria-hidden="true" />
        <div className="crt-vignette" aria-hidden="true" />
      </div>
      {/* Outside the screen, so it can leave the TV when the set switches off */}
      <div className="crt-center">
        <img className="crt-logo" src="img/logo.webp" alt="Drax Raw" width={700} height={436} />
      </div>
      <span className="crt-dot" aria-hidden="true" />
    </div>
  );
};
