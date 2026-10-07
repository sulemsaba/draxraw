import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap, reducedMotion, ScrollTrigger, scrollTop } from '../lib/motion';
import { GoContext, useGo } from '../lib/go';
import './PageWipe.css';

type Kind = 'home' | 'films' | 'photos' | 'about' | 'book';

const kindOf = (to: string): Kind =>
  to === '/films' ? 'films' : to === '/photos' ? 'photos' : to === '/about' ? 'about' : to === '/book' ? 'book' : 'home';

// Hexagon aperture, centred on 0,0 (scaled by GSAP)
const HEX = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i + Math.PI / 6;
  return `${(Math.cos(a) * 10).toFixed(2)},${(Math.sin(a) * 10).toFixed(2)}`;
}).join(' ');

/**
 * Page changes, each in the language of where you are going:
 * Films: a film-leader countdown. Photos: a camera shutter.
 * About: a Polaroid of Drax developing. Book: a clapperboard.
 * Home: a TV changing channel.
 * Each one covers the page, the route changes underneath, then it clears.
 */
export const PageWipe: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname.replace(/(.)\/$/, '$1');
  const root = useRef<HTMLDivElement>(null);
  const pending = useRef<Kind | null>(null);

  const q = (sel: string) => root.current?.querySelector<HTMLElement>(sel) ?? null;
  const qa = (sel: string) => Array.from(root.current?.querySelectorAll<HTMLElement>(sel) ?? []);

  /** Cover the page; returns a timeline that ends covered. */
  const cover = (kind: Kind): gsap.core.Timeline => {
    const tl = gsap.timeline();
    const layer = q(`.tr-${kind}`);
    gsap.set(qa('.tr-layer'), { autoAlpha: 0 });
    tl.set(root.current, { autoAlpha: 1 }).set(layer, { autoAlpha: 1 });

    if (kind === 'films') {
      // Leader: cut to the countdown, the hand sweeps once per number
      const hand = { a: 0 };
      const sweep = q('.ld-sweep');
      const num = q('.ld-num');
      const paint = () => {
        if (sweep) sweep.style.background = `conic-gradient(rgba(241,234,214,0.22) ${hand.a}deg, transparent ${hand.a}deg)`;
      };
      const show = (n: string) => () => {
        if (num) num.textContent = n;
      };
      tl.call(show('3'))
        .fromTo(layer, { opacity: 0 }, { opacity: 1, duration: 0.08 })
        .fromTo(hand, { a: 0 }, { a: 360, duration: 0.34, ease: 'none', onUpdate: paint })
        .call(show('2'))
        .fromTo(hand, { a: 0 }, { a: 360, duration: 0.34, ease: 'none', onUpdate: paint })
        .call(show('1'));
    }

    if (kind === 'photos') {
      // Shutter: the aperture closes, rotating, and fires a flash
      tl.fromTo('.ap-hole', { scale: 9, rotation: 0 }, { scale: 0, rotation: 120, duration: 0.42, ease: 'power3.in', svgOrigin: '0 0' })
        .fromTo('.sh-flash', { opacity: 0 }, { opacity: 0.85, duration: 0.05 })
        .to('.sh-flash', { opacity: 0, duration: 0.25 });
    }

    if (kind === 'about') {
      // Polaroid: drops onto the dark, then develops from black to full colour
      tl.fromTo(layer, { backgroundColor: 'rgba(14,14,16,0)' }, { backgroundColor: 'rgba(14,14,16,1)', duration: 0.25 })
        .fromTo('.pol', { y: -80, rotation: -14, scale: 1.25, opacity: 0 }, { y: 0, rotation: -4, scale: 1, opacity: 1, duration: 0.38, ease: 'back.out(1.6)' }, 0.08)
        .fromTo('.pol img', { filter: 'brightness(0.05) saturate(0) sepia(0.6)' }, { filter: 'brightness(1) saturate(1) sepia(0)', duration: 0.6, ease: 'power1.inOut' }, 0.15)
        // a beat to see him before the print is flicked away
        .to({}, { duration: 0.18 });
    }

    if (kind === 'book') {
      // Clapperboard: comes up open, snaps shut, the board jolts
      tl.fromTo(layer, { backgroundColor: 'rgba(14,14,16,0)' }, { backgroundColor: 'rgba(14,14,16,1)', duration: 0.22 })
        .fromTo('.slate', { y: 60, scale: 0.85, opacity: 0, rotation: -3 }, { y: 0, scale: 1, opacity: 1, rotation: -3, duration: 0.32, ease: 'back.out(1.5)' }, 0.05)
        .fromTo('.slate-clap', { rotation: -28 }, { rotation: -28, duration: 0.12 })
        .to('.slate-clap', { rotation: 0, duration: 0.14, ease: 'power4.in' })
        .to('.slate', { y: 6, duration: 0.05, yoyo: true, repeat: 1 });
    }

    if (kind === 'home') {
      // Channel change: a burst of snow
      tl.fromTo(layer, { opacity: 0 }, { opacity: 1, duration: 0.12 }).to({}, { duration: 0.3 });
    }

    return tl;
  };

  /** Clear the cover over the new page. */
  const reveal = (kind: Kind) => {
    const layer = q(`.tr-${kind}`);
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root.current, { autoAlpha: 0 });
        gsap.set(layer, { clearProps: 'all' });
        ScrollTrigger.refresh();
      },
    });

    if (kind === 'films') {
      // "1", a flicker, and the reel runs
      tl.to(layer, { opacity: 0.3, duration: 0.05, repeat: 3, yoyo: true }).to(layer, { opacity: 0, duration: 0.12 });
    }
    if (kind === 'photos') {
      tl.fromTo('.ap-hole', { scale: 0 }, { scale: 9, rotation: 240, duration: 0.5, ease: 'power3.out', svgOrigin: '0 0' });
    }
    if (kind === 'about') {
      tl.to('.pol', { x: '60vw', y: -40, rotation: 18, duration: 0.45, ease: 'power3.in' }).to(
        layer,
        { backgroundColor: 'rgba(14,14,16,0)', duration: 0.3 },
        '-=0.15'
      );
    }
    if (kind === 'book') {
      tl.to('.slate', { y: '70vh', rotation: 6, duration: 0.45, ease: 'power3.in' }, 0.12).to(
        layer,
        { backgroundColor: 'rgba(14,14,16,0)', duration: 0.3 },
        '-=0.2'
      );
    }
    if (kind === 'home') {
      // The picture squeezes back on from a bright line
      tl.set('.tv-noise', { opacity: 0 })
        .fromTo('.tv-line', { scaleX: 1, scaleY: 1, opacity: 1 }, { scaleY: 120, opacity: 0, duration: 0.4, ease: 'power3.out' })
        .to(layer, { opacity: 0, duration: 0.25 }, 0.12);
    }
  };

  const go = useCallback(
    (to: string) => {
      if (to === pathname) {
        scrollTop();
        return;
      }
      if (reducedMotion() || pending.current) {
        navigate(to);
        scrollTop();
        return;
      }
      const kind = kindOf(to);
      pending.current = kind;
      cover(kind).add(() => {
        navigate(to);
        scrollTop();
      }, '+=0.02');
    },
    // cover() only touches refs and GSAP
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, pathname]
  );

  // The new page is mounted under the cover: clear it
  useLayoutEffect(() => {
    const kind = pending.current;
    if (!kind) return;
    pending.current = null;
    gsap.delayedCall(0.08, () => reveal(kind));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <GoContext.Provider value={go}>
      {children}
      <div ref={root} className="tr" aria-hidden="true">
        {/* Films: film leader */}
        <div className="tr-layer tr-films">
          <span className="ld-sweep" />
          <span className="ld-ring ld-ring-1" />
          <span className="ld-ring ld-ring-2" />
          <span className="ld-cross ld-cross-h" />
          <span className="ld-cross ld-cross-v" />
          <span className="ld-num display">3</span>
          <span className="ld-scratch" />
        </div>

        {/* Photos: shutter */}
        <div className="tr-layer tr-photos">
          <svg className="ap" viewBox="-50 -50 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <mask id="ap-mask">
                <rect x="-200" y="-200" width="400" height="400" fill="white" />
                <g className="ap-hole">
                  <polygon points={HEX} fill="black" />
                </g>
              </mask>
            </defs>
            <rect x="-200" y="-200" width="400" height="400" fill="#0b0b0c" mask="url(#ap-mask)" />
          </svg>
          <span className="sh-flash" />
        </div>

        {/* About: Polaroid */}
        <div className="tr-layer tr-about">
          <figure className="pol">
            <img src="img/drax-shades.webp" alt="" width={1100} height={1650} />
            <figcaption className="label">Who's Drax?</figcaption>
          </figure>
        </div>

        {/* Book: clapperboard */}
        <div className="tr-layer tr-book">
          <div className="slate">
            <div className="slate-clap" />
            <div className="slate-bar" />
            <div className="slate-body">
              <span className="slate-row label">
                <b>Prod.</b> Drax Raw
              </span>
              <span className="slate-row label">
                <b>Scene</b> Book <b>Take</b> 01
              </span>
              <span className="slate-row label">
                <b>Dir.</b> You + Drax
              </span>
            </div>
          </div>
        </div>

        {/* Home: channel change */}
        <div className="tr-layer tr-home">
          <span className="tv-noise" />
          <span className="tv-line" />
        </div>
      </div>
    </GoContext.Provider>
  );
};

/** A link that uses the page transition; still a real <a href> for new tabs and crawlers. */
export const GoLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }> = ({
  to,
  onClick,
  children,
  ...rest
}) => {
  const go = useGo();
  return (
    <a
      {...rest}
      href={`${import.meta.env.BASE_URL}${to.replace(/^\//, '')}`}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(to);
      }}
    >
      {children}
    </a>
  );
};
