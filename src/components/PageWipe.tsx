import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap, reducedMotion, ScrollTrigger, scrollTop } from '../lib/motion';
import { GoContext, useGo } from '../lib/go';
import { PRINTS } from '../data/site';
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
 * Home: an iris closing on the DX mark and opening again.
 * Each one covers the page, the route changes underneath, then it clears.
 */
export const PageWipe: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname.replace(/(.)\/$/, '$1');
  const root = useRef<HTMLDivElement>(null);
  const pending = useRef<Kind | null>(null);

  // Warm the transition images up in the background so they never pop in
  useEffect(() => {
    const warm = () =>
      qa('.tr img, .mz-tile').forEach((el) => {
        if (el instanceof HTMLImageElement) {
          el.loading = 'eager';
          el.decode?.().catch(() => {});
        } else {
          const url = el.style.backgroundImage.match(/url\("?([^")]+)"?\)/)?.[1];
          if (url) new Image().src = url;
        }
      });
    const t = window.setTimeout(warm, 3500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = (sel: string) => root.current?.querySelector<HTMLElement>(sel) ?? null;
  const qa = (sel: string) => Array.from(root.current?.querySelectorAll<HTMLElement>(sel) ?? []);

  /** Pin an element to a screen rectangle. */
  const place = (el: HTMLElement, r: DOMRect | { left: number; top: number; width: number; height: number }) =>
    gsap.set(el, { left: r.left, top: r.top, width: r.width, height: r.height });

  /** Fly an image from where it is to a target rectangle on the new page. */
  const flyTo = (el: HTMLElement, r: DOMRect, duration: number) =>
    gsap.to(el, { left: r.left, top: r.top, width: r.width, height: r.height, duration, ease: 'power3.inOut' });

  /** Cover the page; returns a timeline that ends covered. */
  const cover = (kind: Kind): gsap.core.Timeline => {
    const tl = gsap.timeline();
    const layer = q(`.tr-${kind}`);
    gsap.set(qa('.tr-layer'), { autoAlpha: 0 });
    tl.set(root.current, { autoAlpha: 1 }).set(layer, { autoAlpha: 1 });

    if (kind === 'films') {
      // Projector: a strip of his frames races through the gate, locks on one
      // frame, and that frame pushes in under the lamp
      const track = q('.fs-track');
      const frames = qa('.fs-frame');
      const land = frames[FS_LAND];
      const strip = q('.fs-strip');
      const pitch = frames[1] && frames[0] ? frames[1].offsetTop - frames[0].offsetTop : 0;
      const endY = land && strip ? -(land.offsetTop - (strip.clientHeight - land.offsetHeight) / 2) : 0;
      tl.set('.fs-strip', { scale: 1 })
        .set('.fs-sprockets', { opacity: 0.85 })
        .fromTo(layer, { opacity: 0 }, { opacity: 1, duration: 0.12 })
        .fromTo(track, { y: endY + pitch * 7 }, { y: endY, duration: 0.75, ease: 'power3.out' }, 0)
        .to('.fs-gate', { opacity: 0.35, duration: 0.04, repeat: 3, yoyo: true }, 0.68)
        .to({}, { duration: 0.12 });
    }

    if (kind === 'photos') {
      // Viewfinder locks focus, then the shutter curtains fire
      tl.set('.vf', { opacity: 1 })
        .set('.vf-focus', { borderColor: '#ede4d0' })
        .fromTo('.vf-dim', { opacity: 0 }, { opacity: 1, duration: 0.15 })
        .fromTo('.vf-corner', { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: 'power3.out', stagger: 0.02 }, 0)
        .fromTo('.vf-focus', { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: 'power3.out' }, 0.05)
        .to('.vf-focus', { scale: 0.93, duration: 0.06, yoyo: true, repeat: 1 })
        .set('.vf-focus', { borderColor: '#f1b51c' })
        .fromTo('.vf-read', { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.1)
        .fromTo('.sh-top', { yPercent: -101 }, { yPercent: 0, duration: 0.15, ease: 'power4.in' }, '+=0.04')
        .fromTo('.sh-bottom', { yPercent: 101 }, { yPercent: 0, duration: 0.15, ease: 'power4.in' }, '<')
        .add(() => {
          const shot = q('.ph-shot');
          if (shot) {
            place(shot, { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight });
            gsap.set(shot, { autoAlpha: 1 });
          }
        })
        .fromTo('.sh-flash', { opacity: 0 }, { opacity: 0.85, duration: 0.04 })
        .to('.sh-flash', { opacity: 0, duration: 0.16 })
        .set('.vf', { opacity: 0 })
        .set('.vf-dim', { opacity: 0 });
    }

    if (kind === 'about') {
      // Character intro: the red card slides in, he arrives, his name slaps on, freeze
      tl.set('.ci-stage', { filter: 'none' })
        .fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: 0.3, ease: 'power3.out' })
        .fromTo('.ci-photo', { xPercent: 18, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.32, ease: 'power3.out' }, 0.1)
        .fromTo('.ci-name', { scale: 1.5, opacity: 0, rotation: -8 }, { scale: 1, opacity: 1, rotation: -3, duration: 0.24, ease: 'back.out(2)' }, 0.22)
        .fromTo('.ci-role', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' }, 0.36)
        .fromTo('.ci-flash', { opacity: 0 }, { opacity: 0.6, duration: 0.03 }, 0.56)
        .to('.ci-flash', { opacity: 0, duration: 0.16 })
        .set('.ci-stage', { filter: 'grayscale(1) contrast(1.15)' }, 0.58)
        .to({}, { duration: 0.08 });
    }

    if (kind === 'book') {
      // Full-screen clapperboard: the striped bars slam together, the slate pops
      tl.fromTo('.cb-top', { yPercent: -100, rotation: -10 }, { yPercent: 0, rotation: -10, duration: 0.24, ease: 'power3.out' })
        .fromTo('.cb-bottom', { yPercent: 100 }, { yPercent: 0, duration: 0.24, ease: 'power3.out' }, '<')
        .fromTo('.cb-card', { scale: 0.7, opacity: 0, rotation: 6 }, { scale: 1, opacity: 1, rotation: -2, duration: 0.24, ease: 'back.out(1.8)' }, 0.08)
        .to('.cb-top', { rotation: 0, duration: 0.11, ease: 'power4.in' }, 0.36)
        .to('.tr-book', { y: 6, duration: 0.04, yoyo: true, repeat: 1 }, 0.47);
    }

    if (kind === 'walls') {
      // Mosaic: the wallpapers flip in tile by tile from the centre
      tl.fromTo(
        '.mz-tile',
        { rotationY: -90, opacity: 0 },
        { rotationY: 0, opacity: 1, duration: 0.32, ease: 'power3.out', stagger: { each: 0.025, from: 'center', grid: 'auto' } }
      );
    }

    if (kind === 'home') {
      // Iris: a black disc closes in on the DX mark
      tl.fromTo(layer, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 0.42, ease: 'power3.in' })
        .fromTo('.iris-mark', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.24, ease: 'back.out(2)' }, 0.26);
    }

    return tl;
  };

  /** Clear the cover over the new page (already measured, so nothing jumps). */
  const reveal = (kind: Kind) => {
    const layer = q(`.tr-${kind}`);
    const tl = gsap.timeline({
      defaults: { force3D: true },
      onComplete: () => {
        gsap.set(root.current, { autoAlpha: 0 });
        gsap.set(layer, { clearProps: 'all' });
        gsap.set(qa('.tr-fly, .ph-shot'), { autoAlpha: 0 });
        gsap.set(qa('.tr-fly'), { clearProps: 'filter,objectPosition,rotation,borderRadius' });
      },
    });

    if (kind === 'films') {
      // Hand-over: the locked frame flies into its place as the first film card
      const land = qa('.fs-frame')[FS_LAND];
      const target = document.querySelector<HTMLElement>('main .film-photo img');
      const fly = q('.tr-fly') as HTMLImageElement | null;
      if (land && target && fly) {
        fly.src = (land as HTMLImageElement).src;
        place(fly, land.getBoundingClientRect());
        gsap.set(fly, { autoAlpha: 1, rotation: 0 });
        gsap.set(land, { opacity: 0 });
        // look exactly like the card's picture, so the swap at the end is invisible
        const look = getComputedStyle(target);
        gsap.set(fly, { borderRadius: look.borderRadius });
        fly.style.filter = look.filter;
        // The card sits at a slight angle: land on its true (unrotated) box and
        // turn to its angle, so the frame settles onto the card with no snap
        const card = target.closest<HTMLElement>('.film');
        const angle = card ? parseFloat(getComputedStyle(card).rotate) || 0 : 0;
        const box = target.getBoundingClientRect();
        const w = target.offsetWidth;
        const h = target.offsetHeight;
        const left = box.left + box.width / 2 - w / 2;
        const top = box.top + box.height / 2 - h / 2;
        // the card's own picture waits until the flying frame lands on it
        gsap.set(target, { opacity: 0 });
        // the strip clears first, then the frame glides home
        tl.to('.fs-strip .fs-frame:not(:nth-child(' + (FS_LAND + 1) + ')), .fs-sprockets, .fs-gate', { opacity: 0, duration: 0.22, ease: 'power1.out' }, 0)
          .to(layer, { opacity: 0, duration: 0.38, ease: 'power1.out' }, 0.14)
          .to(fly, { left, top, width: w, height: h, rotation: angle, duration: 0.7, ease: 'power3.inOut' }, 0.05)
          // swap in one frame: same picture, same place, same look
          .set(target, { opacity: 1 }, 0.76)
          .set(fly, { autoAlpha: 0 }, 0.78)
          .set('.fs-strip .fs-frame, .fs-sprockets, .fs-gate', { clearProps: 'opacity' })
          .set(land, { opacity: 1 });
      } else {
        tl.to(layer, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      }
    }
    if (kind === 'photos') {
      // Hand-over: the shot you just "took" fills the screen, then settles
      // into its place as the first photo on the wall
      const shot = q('.ph-shot');
      const target = document.querySelector<HTMLElement>('main .wall-photo img');
      tl.to('.sh-top', { yPercent: -101, duration: 0.3, ease: 'power3.out' }).to(
        '.sh-bottom',
        { yPercent: 101, duration: 0.3, ease: 'power3.out' },
        '<'
      );
      if (shot && target) {
        tl.add(flyTo(shot, target.getBoundingClientRect(), 0.65), '+=0.12').to(shot, { autoAlpha: 0, duration: 0.18 });
      } else if (shot) {
        tl.to(shot, { autoAlpha: 0, duration: 0.3 }, '<');
      }
    }
    if (kind === 'about') {
      // Hand-over: the frozen black-and-white portrait flies into the Polaroid
      // on the About page, turning to its angle and coming back into colour
      const photo = q('.ci-photo');
      const target = document.querySelector<HTMLElement>('main .about-print img');
      const fly = q('.tr-fly') as HTMLImageElement | null;
      if (photo && target && fly) {
        fly.src = (photo as HTMLImageElement).src;
        place(fly, photo.getBoundingClientRect());
        gsap.set(fly, { autoAlpha: 1, rotation: 0, objectPosition: 'center 18%', filter: 'grayscale(1) contrast(1.15)' });
        gsap.set(photo, { opacity: 0 });
        gsap.set(target, { opacity: 0 });
        const print = target.closest<HTMLElement>('.about-print');
        const angle = print ? parseFloat(getComputedStyle(print).rotate) || 0 : 0;
        const box = target.getBoundingClientRect();
        const w = target.offsetWidth;
        const h = target.offsetHeight;
        tl.to(layer, { opacity: 0, duration: 0.38, ease: 'power1.out' }, 0.1)
          .to(
            fly,
            {
              left: box.left + box.width / 2 - w / 2,
              top: box.top + box.height / 2 - h / 2,
              width: w,
              height: h,
              rotation: angle,
              filter: 'grayscale(0) contrast(1)',
              duration: 0.7,
              ease: 'power3.inOut',
            },
            0.05
          )
          .set(target, { opacity: 1 }, 0.75)
          .to(fly, { autoAlpha: 0, duration: 0.2 }, 0.76)
          .set(photo, { opacity: 1 });
      } else {
        tl.to(layer, { xPercent: -100, duration: 0.38, ease: 'power3.inOut' });
      }
    }
    if (kind === 'book') {
      tl.to('.cb-card', { scale: 0.85, opacity: 0, duration: 0.14 })
        .to('.cb-top', { yPercent: -100, duration: 0.32, ease: 'power3.inOut' }, 0.04)
        .to('.cb-bottom', { yPercent: 100, duration: 0.32, ease: 'power3.inOut' }, 0.04);
    }
    if (kind === 'walls') {
      tl.to('.mz-tile', {
        rotationY: 90,
        opacity: 0,
        duration: 0.26,
        ease: 'power2.in',
        stagger: { each: 0.02, from: 'edges', grid: 'auto' },
      });
    }
    if (kind === 'home') {
      tl.to('.iris-mark', { scale: 0.6, opacity: 0, duration: 0.14 }).to(
        layer,
        { clipPath: 'circle(0% at 50% 50%)', duration: 0.42, ease: 'power3.out' },
        0.06
      );
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
    // Let the new page paint and settle under the cover, measure it there,
    // then lift the cover on a page that will not move
    // (pages load on demand: wait, briefly, until the new one is really there)
    const t0 = performance.now();
    const ready = () => {
      const page = document.querySelector('main > .page, main .case-hero');
      if (!page && performance.now() - t0 < 2000) return requestAnimationFrame(ready);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          reveal(kind);
        })
      );
    };
    ready();
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
          <span className="vf-dim" />
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
          <img className="ph-shot" src={PRINTS[0].src} alt="" />
          <span className="sh-top" />
          <span className="sh-bottom" />
          <span className="sh-flash" />
        </div>

        {/* About: character intro freeze-frame */}
        <div className="tr-layer tr-about">
          <div className="ci-stage">
            <img className="ci-photo" src="img/drax-shades.webp" alt="" width={1100} height={1650} />
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
        {/* The image that carries over into the new page */}
        <img className="tr-fly" alt="" />
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
