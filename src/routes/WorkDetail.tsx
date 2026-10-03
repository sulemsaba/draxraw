import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, Flip, ScrollTrigger, SplitText } from '../lib/gsap';
import { consumeFlipState, stashFlipState } from '../lib/flipState';
import { findProjectById, FILM_PROJECTS } from '../data/projects';
import { scrollToTarget } from '../lib/lenis';
import { ResponsiveImage } from '../components/ResponsiveImage';
import './WorkDetail.css';

/**
 * Project page. Six beats, vertical scroll, mobile-first.
 *
 * Each beat is choreographed — not a static template. The image
 * breathes. The title rises character by character from a mask. The
 * watch control is magnetic and morphs into the player. The stills
 * reveal with different clip-path directions so the sequence reads
 * like an edit, not a gallery. The next-project preview is darkened,
 * brightens on hover, and the cursor shows "Next".
 *
 * Beat 1 — Arrival. The carried thumbnail lands full-bleed and
 *          breathes. If a Flip state was stashed by the homepage
 *          click, the image animates from its old rect to the new
 *          one. If not, a simple reveal. No artificial hold.
 *
 * Beat 2 — Identity. Title wipes in via SplitText as the visitor
 *          scrolls. Type + year + role sit underneath, quiet, no
 *          numeral eyebrow. Type supports the image.
 *
 * Beat 3 — Watch. The still remains in the page. A magnetic,
 *          Drax-branded play control sits over it. On activation,
 *          the YouTube player loads inline with sound. The play
 *          control morphs into a small "sound on" indicator. CSS
 *          overlays hide the YouTube logo and title so the player
 *          reads as Drax's, not YouTube's. YouTube is the
 *          infrastructure, never the interface.
 *
 * Beat 4 — Context. Only when real project copy exists. Up to two
 *          concise paragraphs. Words reveal as the visitor scrolls
 *          through them (scrub, not a one-shot fade).
 *
 * Beat 5 — Frames. Two to four real project stills. Each reveals
 *          with a different clip-path direction (left, right, top,
 *          center-out) so the sequence reads like an edit. Subtle
 *          parallax per still. Magnetic hover on desktop.
 *
 * Beat 6 — Next. A large, darkened preview of the next project.
 *          Brightens on hover. Cursor shows "Next". Click carries
 *          the image forward through the same Flip system.
 */
export const WorkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = id ? findProjectById(id) : undefined;

  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const watchRef = useRef<HTMLButtonElement>(null);
  const watchBgRef = useRef<HTMLSpanElement>(null);
  const watchLabelRef = useRef<HTMLSpanElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const briefRef = useRef<HTMLParagraphElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLAnchorElement>(null);
  const [playing, setPlaying] = useState(false);

  /* The next project for the handoff. Wraps around the end of the list. */
  const nextProject = project
    ? FILM_PROJECTS[(FILM_PROJECTS.indexOf(project) + 1) % FILM_PROJECTS.length]
    : undefined;

  /* Sound-on inline player — loads only on activation.
     fs=0 + modestbranding=1 + rel=0 + iv_load_policy=3 + disablekb=1
     minimise YouTube chrome; we overlay our own on top to hide the
     rest of the branding (logo bottom-left, title top-left). */
  const embedSrc = project
    ? `https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0`
    : '';

  /* Per-still reveal choreography — each still wipes in from a
     different direction so the sequence reads like an edit, not a
     uniform fade. Cycles through 4 patterns. */
  const REVEALS = [
    { clipFrom: 'inset(0% 100% 0% 0%)', x: -28 }, /* wipe from left */
    { clipFrom: 'inset(0% 0% 0% 100%)', x: 28 },  /* wipe from right */
    { clipFrom: 'inset(50% 50% 50% 50%)', x: 0 }, /* iris open from center */
    { clipFrom: 'inset(0% 0% 100% 0%)', x: 0 }     /* wipe from top */
  ];

  useGSAP(
    () => {
      if (!project || !heroImgRef.current) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const flipCarrier = consumeFlipState(`project-${project.id}`);

      /* ---- BEAT 1 — Arrival ------------------------------------
         Either a Flip carry from the homepage thumbnail, or a
         simple reveal. Either way, the image then breathes:
         slow scale + scrubbed parallax drift on scroll. */
      if (flipCarrier && !reducedMotion) {
        try {
          Flip.from(flipCarrier.state, {
            targets: heroImgRef.current,
            duration: 0.85,
            ease: 'power3.inOut',
            absolute: true,
            nested: false,
            onComplete: () => {
              gsap.set(heroImgRef.current, { clearProps: 'transform' });
            }
          });
        } catch {
          gsap.fromTo(
            heroImgRef.current,
            { autoAlpha: 0, scale: 1.06 },
            { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power3.out' }
          );
        }
      } else if (!reducedMotion) {
        gsap.fromTo(
          heroImgRef.current,
          { autoAlpha: 0, scale: 1.08 },
          { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power3.out' }
        );
      }

      /* The hero image breathes: a slow scrub parallax + a yoyo
         scale. Mobile skips the parallax (no heavy transforms on
         mid-tier hardware). */
      const mm = gsap.matchMedia();
      mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
        const parallax = gsap.fromTo(
          heroImgRef.current,
          { yPercent: -6 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7
            }
          }
        );
        return () => parallax.kill();
      });

      /* ---- BEAT 2 — Identity -----------------------------------
         Title wipes in via SplitText as the visitor scrolls past
         the hero. No forced hold — visitor controls the pace. */
      if (!reducedMotion && titleRef.current) {
        const split = new SplitText(titleRef.current, { type: 'chars,words', mask: 'chars' });
        gsap.set(split.chars, { yPercent: 120 });
        gsap.set([metaRef.current, watchRef.current], { autoAlpha: 0, y: 24 });

        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom 70%',
            scrub: 0.55
          }
        });

        introTl
          .to(split.chars, { yPercent: 0, duration: 0.6, ease: 'power4.out', stagger: 0.025 }, 0)
          .to(metaRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.15)
          .to(watchRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3);

        return () => {
          split.revert();
          mm.revert();
        };
      }

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* ---- BEAT 4 — Context ----------------------------------------
     Brief reveals word-by-word as the visitor scrolls through it
     (scrub, not a one-shot fade). Same signature as the homepage
     About section — the page reads like Drax edits. */
  useGSAP(
    () => {
      if (!project?.brief || !briefRef.current) return;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      const split = new SplitText(briefRef.current, { type: 'words' });
      gsap.set(split.words, { autoAlpha: 0.16 });

      gsap.to(split.words, {
        autoAlpha: 1,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: {
          trigger: briefRef.current,
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: 0.4
        }
      });

      return () => split.revert();
    },
    { scope: rootRef }
  );

  /* ---- BEAT 5 — Frames -----------------------------------------
     Each still reveals with a different clip-path direction. Subtle
     parallax per still. Native ratio honoured — the layout adapts. */
  useGSAP(
    () => {
      if (!project?.stills?.length || !framesRef.current) return;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      const frameEls = framesRef.current.querySelectorAll<HTMLElement>('.frame-crop');

      frameEls.forEach((el, i) => {
        const reveal = REVEALS[i % REVEALS.length];
        gsap.fromTo(
          el,
          { clipPath: reveal.clipFrom, x: reveal.x },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            x: 0,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true
            }
          }
        );
      });

      /* Desktop-only parallax per still image (gentle, not jarring). */
      const mm = gsap.matchMedia();
      mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
        const parallax = gsap.utils.toArray<HTMLElement>('.frame-img-wrap', framesRef.current).map((img) =>
          gsap.fromTo(
            img,
            { yPercent: -4 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6
              }
            }
          )
        );
        return () => parallax.forEach((t) => t.kill());
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* ---- BEAT 6 — Next --------------------------------------------
     The next-project preview breathes slowly. On hover the cursor
     shows "Next" (cursor states handled in App's Cursor component
     via data-cursor="next"). The image stays darkened until hover
     brings it forward. */
  useGSAP(
    () => {
      if (!nextProject || !nextRef.current) return;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      const preview = nextRef.current.querySelector<HTMLElement>('.work-next-img-wrap');
      if (preview) {
        gsap.to(preview, {
          scale: 1.04,
          duration: 16,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      }

      /* The whole preview brightens on hover via CSS (transition),
         but the title also drifts slightly toward the cursor on
         desktop — a quiet magnetic pull. */
      const mm = gsap.matchMedia();
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const title = nextRef.current?.querySelector<HTMLElement>('.work-next-title');
        if (!title) return;
        const xTo = gsap.quickTo(title, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(title, 'y', { duration: 0.5, ease: 'power3' });
        const onMove = (event: MouseEvent) => {
          const rect = nextRef.current?.getBoundingClientRect();
          if (!rect) return;
          const nx = (event.clientX - rect.left) / rect.width - 0.5;
          const ny = (event.clientY - rect.top) / rect.height - 0.5;
          xTo(nx * 16);
          yTo(ny * 4);
        };
        const onLeave = () => { xTo(0); yTo(0); };
        nextRef.current?.addEventListener('mousemove', onMove);
        nextRef.current?.addEventListener('mouseleave', onLeave);
        return () => {
          nextRef.current?.removeEventListener('mousemove', onMove);
          nextRef.current?.removeEventListener('mouseleave', onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* ---- Magnetic watch control (desktop only) --------------------
     The big play button pulls gently toward the cursor when the
     pointer is near. The label scales up slightly. On click it
     morphs into the player. */
  useGSAP(
    () => {
      if (!watchRef.current) return;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      const mm = gsap.matchMedia();
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const btn = watchRef.current;
        if (!btn) return;
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'power3' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'power3' });
        const onMove = (event: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = event.clientX - cx;
          const dy = event.clientY - cy;
          const dist = Math.hypot(dx, dy);
          /* Only magnetic when cursor is within ~140px of the button. */
          if (dist < 140) {
            const pull = 1 - dist / 140;
            xTo(dx * 0.18 * pull);
            yTo(dy * 0.18 * pull);
          } else {
            xTo(0); yTo(0);
          }
        };
        const onLeave = () => { xTo(0); yTo(0); };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', onLeave);
        return () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseleave', onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* Activate the inline YouTube player. The morph: the play button
     fades and scales out, the still image dims, the iframe fades
     in over 0.5s. The "sound on" indicator slides in to take the
     play button's place. */
  const activateFilm = useCallback(() => {
    if (playing) return;
    if (watchRef.current && watchBgRef.current && watchLabelRef.current) {
      gsap.timeline({})
        .to(watchLabelRef.current, { autoAlpha: 0, duration: 0.25 }, 0)
        .to(watchBgRef.current, { scale: 0.4, autoAlpha: 0, duration: 0.35, ease: 'power3.in' }, 0)
        .to(watchRef.current, { autoAlpha: 0, duration: 0.2 }, 0.35)
        .add(() => setPlaying(true), 0.4);
    } else {
      setPlaying(true);
    }
  }, [playing]);

  /* Click the next-project preview. Same Flip carry mechanic. */
  const openNext = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!nextProject) return;
      event.preventDefault();
      const previewImg = nextRef.current?.querySelector<HTMLElement>('[data-flip-id]');
      if (previewImg) {
        stashFlipState(`project-${nextProject.id}`, previewImg);
      }
      navigate(`/work/${nextProject.id}`);
    },
    [nextProject, navigate]
  );

  const backToWork = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate('/');
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => scrollToTarget('#film'));
    });
  };

  /* Scroll to top when the project id changes (rare, but defensive). */
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [id]);

  /* If the id doesn't match a real project, fall back to the index. */
  if (!project) {
    return (
      <section className="work-not-found">
        <p>This project could not be found.</p>
        <Link to="/" className="back-link">
          Back to all work
        </Link>
      </section>
    );
  }

  return (
    <article ref={rootRef} className="work-detail theme-dark" data-theme="dark" aria-label={`${project.title} project`}>
      {/* BEAT 1 — ARRIVAL */}
      <section className="work-hero" ref={heroRef} aria-label="Project hero">
        <div className="work-hero-img-wrap" ref={heroImgRef} data-flip-id={`project-${project.id}`}>
          <ResponsiveImage
            src={project.thumbnail}
            alt={`${project.title} — featured still`}
            imgClassName="work-hero-img"
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            data-flip-id={`project-${project.id}`}
          />
        </div>
        <div className="work-hero-veil" aria-hidden="true" />
      </section>

      {/* BEAT 2 — IDENTITY (no numeral eyebrow per art direction) */}
      <section className="work-identity" aria-label="Project details">
        <h1 ref={titleRef} className="work-title display">
          {project.title}
        </h1>
        <p ref={metaRef} className="work-meta">
          {project.type} &middot; {project.year} &middot; {project.role}
        </p>
      </section>

      {/* BEAT 3 — WATCH */}
      <section className="work-watch" aria-label="Watch film">
        <div className="work-watch-frame" ref={playerRef} style={{ aspectRatio: project.vertical ? '9 / 16' : '16 / 9' }}>
          {!playing ? (
            <>
              <ResponsiveImage
                src={project.thumbnail}
                alt=""
                imgClassName="work-watch-poster"
                loading="eager"
                sizes="(max-width: 768px) 100vw, 56rem"
              />
              <div className="work-watch-grain" aria-hidden="true" />
              <button
                ref={watchRef}
                type="button"
                className="work-watch-control"
                onClick={activateFilm}
                aria-label={`Watch ${project.title} with sound`}
                data-cursor="play"
              >
                <span ref={watchBgRef} className="work-watch-bg" aria-hidden="true">
                  <span className="work-watch-triangle" aria-hidden="true">
                    &#9658;
                  </span>
                </span>
                <span ref={watchLabelRef} className="work-watch-label">
                  Watch&nbsp;film
                </span>
              </button>
            </>
          ) : (
            <>
              <iframe
                src={embedSrc}
                title={`${project.title} — playing with sound`}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
              {/* CSS overlays hide YouTube's logo (bottom-left) and title (top-left)
                  so the player reads as Drax's, not YouTube's. */}
              <div className="yt-chrome yt-chrome-logo" aria-hidden="true" />
              <div className="yt-chrome yt-chrome-title" aria-hidden="true" />
              <div className="yt-chrome yt-chrome-controls" aria-hidden="true" />
              <div className="work-watch-sound-on" aria-hidden="true">
                <span className="work-watch-sound-dot" />
                Sound on
              </div>
            </>
          )}
        </div>
      </section>

      {/* BEAT 4 — CONTEXT (only if real brief exists) */}
      {project.brief && (
        <section className="work-context" aria-label="Project context">
          <p ref={briefRef} className="work-brief">
            {project.brief}
          </p>
        </section>
      )}

      {/* BEAT 5 — FRAMES (only if real stills exist) */}
      {project.stills && project.stills.length > 0 && (
        <section className="work-frames" ref={framesRef} aria-label="Project stills">
          {project.stills.map((still, i) => (
            <figure
              key={still.src}
              className={`frame frame-${still.width ?? 'full'} frame-align-${still.align ?? 'center'}`}
              aria-label={`Frame ${i + 1}`}
            >
              <div className="frame-crop">
                <div className="frame-img-wrap">
                  <ResponsiveImage
                    src={still.src}
                    alt={still.alt}
                    imgClassName="frame-img"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-cursor="view"
                  />
                </div>
              </div>
            </figure>
          ))}
        </section>
      )}

      {/* BEAT 6 — NEXT */}
      {nextProject && (
        <section className="work-next" aria-label="Next project">
          <a
            ref={nextRef}
            href={`/work/${nextProject.id}`}
            className="work-next-link"
            onClick={openNext}
            data-cursor="next"
            aria-label={`Next project: ${nextProject.title}`}
          >
            <div className="work-next-img-wrap">
              <ResponsiveImage
                src={nextProject.thumbnail}
                alt={`Next project: ${nextProject.title}`}
                imgClassName="work-next-img"
                loading="lazy"
                sizes="100vw"
                data-flip-id={`project-${nextProject.id}`}
              />
              <div className="work-next-veil" aria-hidden="true" />
            </div>
            <div className="work-next-meta">
              <span className="work-next-eyebrow">Next</span>
              <span className="work-next-title display">{nextProject.title}</span>
            </div>
          </a>
        </section>
      )}

      {/* Discreet back-to-all-work, always reachable */}
      <a href="#film" className="work-all" onClick={backToWork}>
        All work &uarr;
      </a>
    </article>
  );
};
