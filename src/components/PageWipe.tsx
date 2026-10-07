import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap, reducedMotion, ScrollTrigger, scrollTop } from '../lib/motion';
import { GoContext, useGo } from '../lib/go';
import './PageWipe.css';

type Kind = 'home' | 'films' | 'photos' | 'about' | 'book' | 'walls';

const KINDS: Record<string, Kind> = { '/films': 'films', '/photos': 'photos', '/about': 'about', '/book': 'book', '/wallpapers': 'walls' };
const kindOf = (to: string): Kind => KINDS[to] ?? 'home';

// Frames on the Films projector strip (it lands on the first film's frame)
const FS_FRAMES = ['HxAhX2KDeos', 'hyaAb77XwGI', 'tK7P7bwisdo', 'QoEMUUKstAI', '1LPbfrHc6-U'];
const FS_LAND = 10;

// Tiles for the wallpapers mosaic
const TILES = ['starring', 'countdown', 'redroom', 'slate', 'mark', 'vinyl'];


/**
 * Page changes, each in the language of where you are going:
 * Films: a projector film strip racing through the gate. Photos: a viewfinder locks focus and the
 * shutter curtains fire. About: a movie character intro freeze-frame.
 * Book: a full-screen clapperboard. Wallpapers: a mosaic of his photos.
 * Home: a cinema iris closing on the DX mark and opening again.
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
      // Projector: a strip of his frames races through the gate, slows, locks on
      // one frame, and that frame grows to fill the screen
      const track = q('.fs-track');
      const frames = qa('.fs-frame');
      const land = frames[FS_LAND];
      const strip = q('.fs-strip');
      const pitch = frames[1] && frames[0] ? frames[1].offsetTop - frames[0].offsetTop : 0;
      const endY = land && strip ? -(land.offsetTop - (strip.clientHeight - land.offsetHeight) / 2) : 0;
      const scale =
        land ? Math.max(window.innerWidth / land.offsetWidth, window.innerHeight / land.offsetHeight) * 1.04 : 1;
      tl.set('.fs-strip', { scale: 1 })
        .set('.fs-sprockets', { opacity: 0.85 })
        .fromTo(layer, { opacity: 0 }, { opacity: 1, duration: 0.15 })
        .fromTo(track, { y: endY + pitch * 8 }, { y: endY, duration: 0.95, ease: 'power3.out' }, 0)
        .fromTo(track, { filter: 'blur(6px)' }, { filter: 'blur(0px)', duration: 0.8, ease: 'power2.in' }, 0)
        // the gate flickers as it locks
        .to('.fs-gate', { opacity: 0.35, duration: 0.05, repeat: 3, yoyo: true }, 0.9)
        .to('.fs-strip', { scale, duration: 0.4, ease: 'power3.inOut' }, 1.08)
        .to('.fs-sprockets', { opacity: 0, duration: 0.2 }, 1.08);
    }

    if (kind === 'photos') {
      // Viewfinder over the page: focus hunts and locks, then the curtains fire
      tl.set('.vf', { opacity: 1 })
        .set('.vf-focus', { borderColor: '#ede4d0' })
        .fromTo(layer, { backgroundColor: 'rgba(0,0,0,0)' }, { backgroundColor: 'rgba(0,0,0,0.35)', duration: 0.2 })
        .fromTo('.vf-corner', { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: 'power3.out', stagger: 0.03 }, 0)
        .fromTo('.vf-focus', { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: 'power3.out' }, 0.08)
        .to('.vf-focus', { scale: 0.92, duration: 0.07, yoyo: true, repeat: 1 })
        .set('.vf-focus', { borderColor: '#f1b51c' })
        .fromTo('.vf-read', { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.15)
        .fromTo('.sh-top', { yPercent: -101 }, { yPercent: 0, duration: 0.17, ease: 'power4.in' }, '+=0.06')
        .fromTo('.sh-bottom', { yPercent: 101 }, { yPercent: 0, duration: 0.17, ease: 'power4.in' }, '<')
        .fromTo('.sh-flash', { opacity: 0 }, { opacity: 0.9, duration: 0.04 })
        .to('.sh-flash', { opacity: 0, duration: 0.22 })
        .set('.vf', { opacity: 0 });
    }

    if (kind === 'about') {
      // Character intro: the screen cuts to him, his name slaps on, freeze-frame
      tl.set('.ci-stage', { filter: 'none' })
        .fromTo(layer, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.32, ease: 'power3.inOut' })
        .fromTo('.ci-drax', { xPercent: 25, opacity: 0, filter: 'blur(10px)' }, { xPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.42, ease: 'power3.out' }, 0.12)
        .fromTo('.ci-name', { scale: 1.6, opacity: 0, rotation: -8 }, { scale: 1, opacity: 1, rotation: -3, duration: 0.3, ease: 'back.out(2)' }, 0.32)
        .fromTo('.ci-role', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.25, ease: 'power2.out' }, 0.5)
        // freeze frame
        .fromTo('.ci-flash', { opacity: 0 }, { opacity: 0.7, duration: 0.04 }, 0.78)
        .to('.ci-flash', { opacity: 0, duration: 0.2 })
        .set('.ci-stage', { filter: 'grayscale(1) contrast(1.15)' }, 0.8)
        .to({}, { duration: 0.12 });
    }

    if (kind === 'book') {
      // Full-screen clapperboard: the striped bars slam together, the slate pops
      tl.fromTo('.cb-top', { yPercent: -100, rotation: -10 }, { yPercent: 0, rotation: -10, duration: 0.3, ease: 'power3.out' })
        .fromTo('.cb-bottom', { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: 'power3.out' }, '<')
        .fromTo('.cb-card', { scale: 0.6, opacity: 0, rotation: 6 }, { scale: 1, opacity: 1, rotation: -2, duration: 0.3, ease: 'back.out(1.8)' }, 0.12)
        .to('.cb-top', { rotation: 0, duration: 0.13, ease: 'power4.in' }, 0.5)
        .to('.tr-book', { y: 8, duration: 0.05, yoyo: true, repeat: 1 }, 0.63)
        .to({}, { duration: 0.1 });
    }

    if (kind === 'walls') {
      // Mosaic: his photos flip in tile by tile from the centre
      tl.fromTo(
        '.mz-tile',
        { rotationY: -90, opacity: 0 },
        { rotationY: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: { each: 0.035, from: 'center', grid: 'auto' } }
      ).to({}, { duration: 0.08 });
    }

    if (kind === 'home') {
      // Cinema iris closing to black around the DX mark
      tl.fromTo(layer, { '--r': '150vmax' }, { '--r': '0vmax', duration: 0.55, ease: 'power3.in' })
        .fromTo('.iris-mark', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' }, 0.42)
        .to({}, { duration: 0.12 });
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
      tl.to(layer, { opacity: 0, duration: 0.4, ease: 'power2.out' });
    }
    if (kind === 'photos') {
      tl.to('.sh-top', { yPercent: -101, duration: 0.38, ease: 'power3.out' })
        .to('.sh-bottom', { yPercent: 101, duration: 0.38, ease: 'power3.out' }, '<')
        .to(layer, { backgroundColor: 'rgba(0,0,0,0)', duration: 0.2 }, '<');
    }
    if (kind === 'about') {
      tl.to(layer, { xPercent: -100, skewX: -6, duration: 0.5, ease: 'power3.in' });
    }
    if (kind === 'book') {
      tl.to('.cb-card', { scale: 0.8, opacity: 0, duration: 0.2 })
        .to('.cb-top', { yPercent: -100, duration: 0.4, ease: 'power3.in' }, 0.08)
        .to('.cb-bottom', { yPercent: 100, duration: 0.4, ease: 'power3.in' }, 0.08);
    }
    if (kind === 'walls') {
      tl.to('.mz-tile', { rotationY: 90, opacity: 0, duration: 0.35, ease: 'power3.in', stagger: { each: 0.03, from: 'edges', grid: 'auto' } });
    }
    if (kind === 'home') {
      tl.to('.iris-mark', { scale: 0.6, opacity: 0, duration: 0.18 })
        .to(layer, { '--r': '150vmax', duration: 0.6, ease: 'power3.out' }, 0.1);
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
        {/* Films: projector film strip */}
        <div className="tr-layer tr-films">
          <div className="fs-strip">
            <div className="fs-track">
              {Array.from({ length: 14 }, (_, k) => (
                <img key={k} className="fs-frame" src={`img/films/${FS_FRAMES[k % FS_FRAMES.length]}.webp`} alt="" />
              ))}
            </div>
            <span className="fs-sprockets fs-left" />
            <span className="fs-sprockets fs-right" />
            <span className="fs-gate" />
          </div>
        </div>

        {/* Photos: viewfinder and focal-plane shutter */}
        <div className="tr-layer tr-photos">
          <div className="vf">
            <span className="vf-corner vf-tl" />
            <span className="vf-corner vf-tr" />
            <span className="vf-corner vf-bl" />
            <span className="vf-corner vf-br" />
            <span className="vf-focus" />
            <span className="vf-read label">
              <b>1/250</b> f/2.8 <b>ISO</b> 400
            </span>
          </div>
          <span className="sh-top" />
          <span className="sh-bottom" />
          <span className="sh-flash" />
        </div>

        {/* About: character intro freeze-frame */}
        <div className="tr-layer tr-about">
          <div className="ci-stage">
            <img className="ci-drax" src="img/drax-cutout.webp" alt="" width={1100} height={1680} />
            <div className="ci-card">
              <span className="ci-name display">Drax</span>
              <span className="ci-role label">Filmmaker / Editor / Photographer</span>
            </div>
          </div>
          <span className="ci-flash" />
        </div>

        {/* Book: full-screen clapperboard */}
        <div className="tr-layer tr-book">
          <span className="cb-top" />
          <span className="cb-bottom" />
          <div className="cb-card">
            <span className="label">
              <b>Prod.</b> Drax Raw
            </span>
            <span className="label">
              <b>Scene</b> Book <b>Take</b> 01
            </span>
          </div>
        </div>

        {/* Wallpapers: photo mosaic */}
        <div className="tr-layer tr-walls">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="mz-tile" style={{ backgroundImage: `url(img/walls/${TILES[i % TILES.length]}-phone.webp)` }} />
          ))}
        </div>

        {/* Home: cinema iris */}
        <div className="tr-layer tr-home">
          <img className="iris-mark" src="img/logo-mark.webp" alt="" width={240} height={234} />
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
