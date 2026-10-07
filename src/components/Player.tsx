import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, reducedMotion, setScrollLocked } from '../lib/motion';
import { loadYouTube, YT_STATE, type YTPlayer } from '../lib/youtube';
import type { Film } from '../data/site';
import { CloseIcon, ExpandIcon, MutedIcon, PauseIcon, PlayIcon, ReplayIcon, SoundIcon, YouTubeIcon } from './Icons';
import './Player.css';

interface PlayerProps {
  film: Film | null;
  onClose: () => void;
}

type Phase = 'tuning' | 'playing' | 'paused' | 'ended' | 'blocked';

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

/**
 * The film player. While the film loads you see its own still frame, which
 * fades smoothly into the film once it is really playing. YouTube's own
 * title, logo and buttons are cropped out of view and covered by our own
 * controls, so nothing on screen says YouTube.
 */
export const Player: React.FC<PlayerProps> = ({ film, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const phaseRef = useRef<Phase>('tuning');
  const [phase, setPhaseState] = useState<Phase>('tuning');
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState({ now: 0, total: 0 });

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  // Open / close the dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (film && !dialog.open) dialog.showModal();
    if (!film && dialog.open) dialog.close();
    setScrollLocked(!!film);
  }, [film]);

  // Smooth fade from the film's still frame into the film once it is really playing
  const revealFilm = useCallback(() => {
    if (reducedMotion()) {
      gsap.set('.tv-cover', { autoAlpha: 0 });
      return;
    }
    // Fade from the still into the film
    gsap.to('.tv-cover', { autoAlpha: 0, duration: 1.8, delay: 0.3, ease: 'power2.inOut' });
  }, []);

  // Build the YouTube player for this film
  useEffect(() => {
    if (!film) return;
    let cancelled = false;
    let blockTimer = 0;
    let preroll = 0;
    let ticker = 0;
    gsap.set('.tv-cover', { autoAlpha: 1 });
    const mount = mountRef.current;

    loadYouTube()
      .then((YT) => {
        if (cancelled || !mount) return;
        const host = document.createElement('div');
        mount.appendChild(host);
        playerRef.current = new YT.Player(host, {
          host: 'https://www.youtube-nocookie.com',
          videoId: film.id,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            cc_load_policy: 0,
          },
          events: {
            onReady: (e) => {
              e.target.playVideo();
              // Some phones refuse to start at all: offer our own play button
              blockTimer = window.setTimeout(() => {
                if (phaseRef.current === 'tuning' && !preroll) setPhase('blocked');
              }, 4000);
            },
            onStateChange: (e) => {
              if (e.data === YT_STATE.PLAYING) {
                if (phaseRef.current === 'tuning' || phaseRef.current === 'blocked') {
                  // Silent slow-motion pre-roll under the still: YouTube shows and hides
                  // its own start-up buttons while only about a second of film passes.
                  // No seeking afterwards, because any jump brings those buttons back.
                  if (preroll) return;
                  e.target.setPlaybackRate(0.25);
                  preroll = window.setTimeout(() => {
                    e.target.setPlaybackRate(1);
                    e.target.unMute();
                    setMuted(e.target.isMuted());
                    setPhase('playing');
                    revealFilm();
                  }, 3800);
                  return;
                }
                gsap.to('.tv-cover', { autoAlpha: 0, duration: 0.6, delay: 0.4 });
                setPhase('playing');
                setMuted(e.target.isMuted());
              } else if (e.data === YT_STATE.PAUSED && phaseRef.current === 'playing') {
                setPhase('paused');
                gsap.to('.tv-cover', { autoAlpha: 1, duration: 0.35 });
              } else if (e.data === YT_STATE.ENDED) {
                setPhase('ended');
                gsap.to('.tv-cover', { autoAlpha: 1, duration: 0.6 });
              }
            },
          },
        });
        ticker = window.setInterval(() => {
          const p = playerRef.current;
          if (!p?.getDuration) return;
          const now = phaseRef.current === 'tuning' ? 0 : p.getCurrentTime() || 0;
          setTime({ now, total: p.getDuration() || 0 });
        }, 250);
      })
      .catch(() => !cancelled && setPhase('blocked'));

    return () => {
      cancelled = true;
      window.clearTimeout(blockTimer);
      window.clearTimeout(preroll);
      window.clearInterval(ticker);
      playerRef.current?.destroy();
      playerRef.current = null;
      if (mount) mount.innerHTML = '';
    };
  }, [film, revealFilm]);

  const toggle = () => {
    const p = playerRef.current;
    if (!p) return;
    if (phaseRef.current === 'playing') p.pauseVideo();
    else {
      if (phaseRef.current === 'ended') p.seekTo(0, true);
      p.playVideo();
    }
  };

  const toggleSound = () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) p.unMute();
    else p.mute();
    setMuted(!muted);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const p = playerRef.current;
    if (!p || !time.total) return;
    const r = e.currentTarget.getBoundingClientRect();
    p.seekTo(((e.clientX - r.left) / r.width) * time.total, true);
  };

  const fullscreen = () => {
    const el = screenRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      toggle();
    }
    if (e.key === 'm') toggleSound();
  };

  // Back to a fresh set for the next film
  const close = () => {
    setPhase('tuning');
    setMuted(false);
    setTime({ now: 0, total: 0 });
    onClose();
  };

  const showCoverButton = phase === 'paused' || phase === 'ended' || phase === 'blocked';

  return (
    <dialog
      ref={dialogRef}
      className="player"
      onClose={close}
      onKeyDown={onKey}
      onClick={(e) => e.target === e.currentTarget && close()}
      aria-label={film ? `Playing ${film.title}` : 'Film player'}
    >
      {film && (
        <div className="tv-set">
          <div className="lid-head">
            <span className="lid-title display">{film.title}</span>
            <button type="button" className="lid-close stuck" onClick={close} autoFocus>
              <span className="vinyl is-paper label">
                <CloseIcon size={18} /> Close
              </span>
            </button>
          </div>

          <div ref={screenRef} className={`tv-screen ${film.vertical ? 'is-vertical' : ''}`}>
            <div className="tv-glass">
              {/* YouTube lives here, oversized so its title bar and logo fall outside the glass */}
              <div ref={mountRef} className="tv-yt" />

              {/* The film's still frame, covering YouTube until the film is really playing */}
              <div className="tv-cover">
                <img className="tv-frame" src={`img/films/${film.id}.webp`} alt="" />
                {phase === 'tuning' && <span className="tv-loading" />}
              </div>

              {/* Takes every click, so YouTube never shows its own buttons */}
              <button type="button" className="tv-hit" onClick={toggle} aria-label={phase === 'playing' ? 'Pause' : 'Play'}>
                {showCoverButton && (
                  <span className="tv-big">{phase === 'ended' ? <ReplayIcon size={34} /> : <PlayIcon size={34} />}</span>
                )}
              </button>

            </div>

            <div className="tv-controls">
              <button type="button" onClick={toggle} aria-label={phase === 'playing' ? 'Pause' : 'Play'}>
                {phase === 'playing' ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
              </button>
              <div
                className="tv-progress"
                onClick={seek}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={Math.round(time.total)}
                aria-valuenow={Math.round(time.now)}
                tabIndex={-1}
              >
                <span style={{ transform: `scaleX(${time.total ? time.now / time.total : 0})` }} />
              </div>
              <span className="tv-time label">
                {fmt(time.now)} / {fmt(time.total)}
              </span>
              <button type="button" onClick={toggleSound} aria-label={muted ? 'Sound on' : 'Mute'}>
                {muted ? <MutedIcon size={20} /> : <SoundIcon size={20} />}
              </button>
              <button type="button" onClick={fullscreen} aria-label="Full screen">
                <ExpandIcon size={20} />
              </button>
            </div>
          </div>

          {muted && phase === 'playing' && (
            <button type="button" className="tv-sound-chip label" onClick={toggleSound}>
              <SoundIcon size={18} /> Tap for sound
            </button>
          )}

          <a className="lid-yt label" href={`https://youtu.be/${film.id}`} target="_blank" rel="noopener noreferrer">
            <YouTubeIcon size={18} /> Watch on YouTube
          </a>
        </div>
      )}
    </dialog>
  );
};
