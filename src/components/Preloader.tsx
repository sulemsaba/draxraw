import React, { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import './Preloader.css';

interface PreloaderProps {
  /** Fires once the curtain has left the screen. */
  onRevealed: () => void;
}

const BOOT_MS = 2.6; // total time budget — the TV takes a moment to warm up

/**
 * The old television. Black CRT screen fills the viewport. Static
 * noise hisses on first paint, then settles as the Drax Raw logo
 * fades in through the snow — phosphor glow, scan lines, vignette.
 * A counter ticks 00 to 100. Then the screen collapses vertically
 * to a single horizontal line, the line collapses to a dot, and the
 * dot blinks out. Black hands the stage to the hero.
 *
 * Reduced motion: the static never animates, the logo just appears,
 * the counter jumps to 100, the screen fades out. The visitor is
 * never made to wait for an effect they cannot see comfortably.
 */
export const Preloader: React.FC<PreloaderProps> = ({ onRevealed }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const standByRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  /* ---- Static noise canvas --------------------------------- */
  /* A tiny canvas (200x150) gets scaled up via CSS to fill the
     viewport. Updating ImageData on a small canvas is fast
     enough to run at 30fps without jank. The CSS image-rendering
     keeps the upscaling crisp-pixel, matching the CRT aesthetic. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const img = ctx.createImageData(W, H);

    let last = 0;
    const FRAME_MS = 1000 / 30; // 30fps is enough for snow

    const tick = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now;
        const data = img.data;
        /* Fill with random grayscale noise. The alpha is full so
           the noise canvas sits opaque over the black screen. */
        for (let i = 0; i < data.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        /* No animation. Show the logo, jump to 100, fade out. */
        if (countRef.current) countRef.current.textContent = '100';
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          ease: 'power1.inOut',
          onComplete: onRevealed
        });
        return;
      }

      /* ---- Phase 1: TV warm-up + logo through the snow ------ */
      /* The static starts dense. The logo fades in through it
         while the phosphor glow pulses gently. The counter ticks
         00 → 100 over the same window. */

      const counter = { value: 0 };
      const noiseIntensity = { value: 1 }; // drives canvas alpha via CSS

      gsap.set(canvasRef.current, { opacity: noiseIntensity.value });
      gsap.set(logoRef.current, { autoAlpha: 0, scale: 1.06, filter: 'blur(8px)' });
      gsap.set(glowRef.current, { autoAlpha: 0, scale: 0.85 });
      gsap.set([countRef.current, standByRef.current], { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: onRevealed
      });

      tl /* the screen flicks to life */
        .fromTo(
          screenRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.08 },
          0
        )
        /* the standby caption cuts in early */
        .to(standByRef.current, { autoAlpha: 1, duration: 0.01 }, 0.12)
        /* the logo fades in through the static, blur settling */
        .to(
          logoRef.current,
          { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power2.out' },
          0.35
        )
        /* the phosphor glow blooms behind the logo */
        .to(
          glowRef.current,
          { autoAlpha: 0.7, scale: 1, duration: 1.1, ease: 'power2.out' },
          0.4
        )
        /* the static recedes as the logo sharpens */
        .to(
          noiseIntensity,
          {
            value: 0.06,
            duration: 1.6,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (canvasRef.current) {
                canvasRef.current.style.opacity = String(noiseIntensity.value);
              }
            }
          },
          0.5
        )
        /* the counter ticks 00 → 100 */
        .fromTo(
          counter,
          { value: 0 },
          {
            value: 100,
            duration: 1.7,
            ease: 'power1.inOut',
            snap: { value: 1 },
            onUpdate: () => {
              if (countRef.current) {
                countRef.current.textContent = String(Math.round(counter.value)).padStart(2, '0');
              }
            }
          },
          0.4
        )
        /* the count + standby fade out just before power-off */
        .to([countRef.current, standByRef.current], { autoAlpha: 0, duration: 0.25 }, 2.0)
        /* the static stops entirely */
        .to(canvasRef.current, { autoAlpha: 0, duration: 0.25 }, 2.0)
        /* the logo + glow hold a beat, full clarity */
        .to(glowRef.current, { autoAlpha: 0.4, duration: 0.3 }, 2.1)
        /* ---- Phase 2: power-off collapse ---- */
        /* The screen collapses vertically to a single horizontal
           line, then the line collapses horizontally to a dot,
           then the dot blinks out. Classic CRT shutdown. */
        .to(
          screenRef.current,
          { scaleY: 0.004, duration: 0.18, ease: 'power3.in', transformOrigin: '50% 50%' },
          2.3
        )
        .to(
          screenRef.current,
          { scaleX: 0.001, duration: 0.12, ease: 'power3.in', transformOrigin: '50% 50%' },
          2.48
        )
        .to(
          rootRef.current,
          { autoAlpha: 0, duration: 0.18, ease: 'power1.inOut' },
          2.6
        );
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="preloader" role="status" aria-label="Drax Raw, loading">
      <div ref={screenRef} className="crt-screen">
        {/* Static noise canvas — CSS-scaled up to fill the screen */}
        <canvas ref={canvasRef} className="crt-static" width={200} height={150} aria-hidden="true" />

        {/* Phosphor glow behind the logo */}
        <div ref={glowRef} className="crt-glow" aria-hidden="true" />

        {/* The Drax Raw logo — fades in through the snow.
            Transparent source lets it sit cleanly on the dark
            CRT screen without a black box around it. AVIF first
            (62KB), WebP fallback (154KB), PNG last resort (400KB
            but lossless with full alpha). */}
        <picture>
          <source srcSet="/images/drax-logo.avif" type="image/avif" />
          <source srcSet="/images/drax-logo.webp" type="image/webp" />
          <img
            ref={logoRef}
            src="/images/drax-logo.png"
            alt="Drax Raw"
            className="crt-logo"
            loading="eager"
            fetchPriority="high"
          />
        </picture>

        {/* Scan lines + vignette — pure CSS overlays */}
        <div className="crt-scanlines" aria-hidden="true" />
        <div className="crt-vignette" aria-hidden="true" />
        <div className="crt-curvature" aria-hidden="true" />

        {/* Meta lives INSIDE the screen — more CRT-authentic
            (channel indicator on the tube, not on the bezel)
            and saves the vertical space a separate row would
            need below the screen. Critical for mobile. */}
        <div className="crt-meta">
          <span ref={standByRef} className="crt-standby" aria-hidden="true">
            Please stand by
          </span>
          <span ref={countRef} className="crt-count" aria-hidden="true">
            00
          </span>
        </div>
      </div>
    </div>
  );
};

/** Used by App to size the hero hand-off without measuring anything. */
export const PRELOADER_HANDOFF_MS = BOOT_MS * 1000 * 0.72;
