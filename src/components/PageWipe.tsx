import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap, reducedMotion, ScrollTrigger, scrollTop } from '../lib/motion';
import { GoContext, useGo } from '../lib/go';
import './PageWipe.css';

const LABELS: Record<string, string> = {
  '/': 'Drax Raw',
  '/films': 'Films',
  '/photos': 'Photos',
  '/about': 'About',
  '/book': 'Book',
};

export const PageWipe: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname.replace(/(.)\/$/, '$1');
  const panel = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const [label, setLabel] = useState('');

  const go = useCallback(
    (to: string) => {
      if (to === pathname) {
        scrollTop();
        return;
      }
      if (reducedMotion() || covering.current) {
        navigate(to);
        scrollTop();
        return;
      }
      covering.current = true;
      setLabel(LABELS[to] ?? '');
      gsap
        .timeline()
        .set(panel.current, { autoAlpha: 1 })
        .fromTo(
          panel.current,
          { yPercent: 105, rotation: 5 },
          { yPercent: 0, rotation: 0, duration: 0.55, ease: 'power3.inOut' }
        )
        .fromTo(
          '.wipe-mark, .wipe-label',
          { scale: 1.5, opacity: 0, rotation: -12 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.32, ease: 'back.out(2)', stagger: 0.06 },
          '-=0.18'
        )
        .add(() => {
          navigate(to);
          scrollTop();
        }, '+=0.08');
    },
    [navigate, pathname]
  );

  // The new page is mounted under the panel: peel the panel off upward.
  useLayoutEffect(() => {
    if (!covering.current) return;
    gsap
      .timeline({
        delay: 0.12,
        onComplete: () => {
          covering.current = false;
          gsap.set(panel.current, { autoAlpha: 0 });
          ScrollTrigger.refresh();
        },
      })
      .to(panel.current, { yPercent: -105, rotation: -5, duration: 0.6, ease: 'power3.inOut' });
  }, [pathname]);

  return (
    <GoContext.Provider value={go}>
      {children}
      <div ref={panel} className="page-wipe" aria-hidden="true">
        <img className="wipe-mark" src="img/logo-mark.webp" alt="" width={240} height={234} />
        <span className="wipe-label display">{label}</span>
      </div>
    </GoContext.Provider>
  );
};

/** A link that uses the page wipe; still a real <a href> for new tabs and crawlers. */
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
