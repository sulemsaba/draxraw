import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import './Preloader.css';

interface PreloaderProps {
  /** Fires at the START of the wipe-up phase — the homepage can begin welcoming. */
  onRevealed: () => void;
  /** Fires once the wipe-up is fully complete — the preloader can be unmounted. */
  onExited?: () => void;
}

const BOOT_MS = 3.0; // total time budget — slightly longer for the richer logo bloom

/**
 * The old television — now fills the WHOLE viewport.
 *
 * Black fills the screen. Static noise hisses. The Drax Raw logo
 * blooms in through the snow — scale + slight rotate + blur
 * settle + a touch of channel-tuning jitter, ending with a soft
 * bounce. The phosphor glow pulses in sync. A counter ticks
 * 00 → 100. Then the whole viewport collapses vertically to a
 * horizontal line, the line to a dot, and finally the panel
 * wipes UP off the screen to welcome the content — with the
 * homepage blooming up beneath it (handled in App.css).
 *
 * Reduced motion: the static never animates, the logo just
 * appears, the counter jumps to 100, the panel fades out.
 */
export const Preloader: React.FC<PreloaderProps> = ({ onRevealed, onExited }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const standByRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const [leaving, setLeaving] = useState(false);

  /* ---- Static noise canvas --------------------------------- */
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
    const FRAME_MS = 1000 / 30;

    const tick = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now;
        const data = img.data;
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
        if (countRef.current) countRef.current.textContent = '100';
        const tl = gsap.timeline({ onComplete: () => { onRevealed(); onExited?.(); } });
        tl.to(rootRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power1.inOut' });
        return;
      }

      /* ---- Phase 1: TV warm-up + logo bloom through the snow ----
         Richer than a simple fade. The logo:
           - starts at 65% scale, tilted -3deg, blurred 14px, invisible
           - blooms to full size with a slight overshoot (1.04) then settles
           - has 4 horizontal micro-jitters during the bloom (channel tuning)
           - the phosphor glow pulses 0.85 -> 1.1 -> 1 in sync
           - the static recedes as the logo sharpens
         The counter ticks 00 -> 100 over the same window. */

      const counter = { value: 0 };
      const noiseIntensity = { value: 1 };

      gsap.set(canvasRef.current, { opacity: noiseIntensity.value });
      gsap.set(logoRef.current, {
        autoAlpha: 0,
        scale: 0.65,
        rotation: -3,
        filter: 'blur(14px)',
        y: 24
      });
      gsap.set(glowRef.current, { autoAlpha: 0, scale: 0.85 });
      gsap.set([countRef.current, standByRef.current], { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          /* Self-unmount after the wipe-up completes. The App's
             preloaderDone flag will also flip, but this defends
             against any race. */
          setLeaving(true);
          onExited?.();
        }
      });

      tl /* the screen flicks to life */
        .fromTo(
          rootRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.1 },
          0
        )
        /* the standby caption cuts in early */
        .to(standByRef.current, { autoAlpha: 1, duration: 0.01 }, 0.15)
        /* the logo blooms: scale up with slight overshoot, rotate to 0,
           blur settles to 0, slight upward motion, opacity to 1 */
        .to(
          logoRef.current,
          {
            autoAlpha: 1,
            scale: 1.04,
            rotation: 0,
            filter: 'blur(0px)',
            y: 0,
            duration: 1.2,
            ease: 'power3.out'
          },
          0.4
        )
        /* subtle channel-tuning horizontal jitter during the bloom
           (4 quick x oscillations) */
        .to(
          logoRef.current,
          {
            x: -3,
            duration: 0.045,
            repeat: 5,
            yoyo: true,
            ease: 'none'
          },
          0.45
        )
        /* settle back to x:0 with a soft elastic bounce at the end */
        .to(
          logoRef.current,
          {
            x: 0,
            scale: 1,
            duration: 0.55,
            ease: 'elastic.out(1, 0.55)'
          },
          1.05
        )
        /* the phosphor glow blooms larger then settles in sync */
        .to(
          glowRef.current,
          {
            autoAlpha: 0.7,
            scale: 1.1,
            duration: 1.0,
            ease: 'power2.out'
          },
          0.45
        )
        .to(
          glowRef.current,
          {
            scale: 1,
            autoAlpha: 0.4,
            duration: 0.6,
            ease: 'power2.out'
          },
          1.45
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
          0.55
        )
        /* the counter ticks 00 -> 100 */
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
          0.45
        )
        /* the count + standby fade out before power-off */
        .to([countRef.current, standByRef.current], { autoAlpha: 0, duration: 0.25 }, 2.15)
        /* the static stops entirely */
        .to(canvasRef.current, { autoAlpha: 0, duration: 0.25 }, 2.15)

        /* ---- Phase 2: power-off collapse ----
           Vertical to a horizontal line, then the line to a dot. */
        .to(
          rootRef.current,
          { scaleY: 0.004, duration: 0.18, ease: 'power3.in', transformOrigin: '50% 50%' },
          2.4
        )
        .to(
          rootRef.current,
          { scaleX: 0.001, duration: 0.12, ease: 'power3.in', transformOrigin: '50% 50%' },
          2.58
        )

        /* ---- Phase 3: welcome the content ----
           The collapsed dot expands back to full size briefly,
           then the whole panel wipes UP off the screen. The
           homepage blooms up beneath (handled in App.css). The
           onRevealed callback fires HERE so the homepage can
           start its welcome animation in parallel with the wipe. */
        .set(rootRef.current, { transformOrigin: '50% 50%', scaleY: 1, scaleX: 1, yPercent: 0, autoAlpha: 1 }, 2.78)
        .call(() => onRevealed(), [], 2.78)
        .to(
          rootRef.current,
          {
            yPercent: -100,
            autoAlpha: 1,
            duration: 0.55,
            ease: 'power3.inOut'
          },
          2.78
        );
    },
    { scope: rootRef }
  );

  if (leaving) return null;

  return (
    <div ref={rootRef} className="preloader" role="status" aria-label="Drax Raw, loading">
      {/* Static noise canvas — fills the whole viewport */}
      <canvas ref={canvasRef} className="crt-static" width={200} height={150} aria-hidden="true" />

      {/* Phosphor glow behind the logo */}
      <div ref={glowRef} className="crt-glow" aria-hidden="true" />

      {/* The Drax Raw logo — blooms in through the snow with GSAP */}
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

      {/* Scan lines + vignette + curvature — pure CSS overlays, full viewport */}
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />
      <div className="crt-curvature" aria-hidden="true" />

      {/* Meta at the bottom of the viewport */}
      <div className="crt-meta">
        <span ref={standByRef} className="crt-standby" aria-hidden="true">
          Please stand by
        </span>
        <span ref={countRef} className="crt-count" aria-hidden="true">
          00
        </span>
      </div>
    </div>
  );
};

/** Used by App to size the hero hand-off without measuring anything. */
export const PRELOADER_HANDOFF_MS = BOOT_MS * 1000 * 0.72;
