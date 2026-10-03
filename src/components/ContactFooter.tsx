import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import { scrollToTarget } from '../lib/lenis';
import './ContactFooter.css';

const LINKS = [
  { label: 'Email', href: 'mailto:draxraw0@gmail.com', value: 'draxraw0@gmail.com' },
  { label: 'WhatsApp', href: 'https://wa.me/255666040825', value: '+255 666 040 825' },
  { label: 'Instagram', href: 'https://www.instagram.com/drax.raw/', value: '@drax.raw' },
  { label: 'YouTube', href: 'http://www.youtube.com/@DraxRaw', value: '@DraxRaw' }
];

/**
 * The close: one giant line, the real contact routes, and the
 * way back to the top. Same dark surface the last film ends on.
 */
export const ContactFooter: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 112 });
      gsap.set(listRef.current?.children ?? [], { autoAlpha: 0, y: 22 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 74%',
          once: true
        }
      });

      tl.to(line1Ref.current, { yPercent: 0, duration: 1.05, ease: 'power4.out' }, 0)
        .to(line2Ref.current, { yPercent: 0, duration: 1.05, ease: 'power4.out' }, 0.1)
        .to(
          listRef.current?.children ?? [],
          { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', stagger: 0.07 },
          0.45
        );

      /* magnetic pull on the contact rows, fine pointers only */
      const mm = gsap.matchMedia();
      mm.add('(pointer: fine)', () => {
        const rows = gsap.utils.toArray<HTMLElement>('.contact-row', rootRef.current);
        const magnets = rows.map((row) => {
          const xTo = gsap.quickTo(row, 'x', { duration: 0.45, ease: 'power3' });
          const onMove = (event: MouseEvent) => {
            const rect = row.getBoundingClientRect();
            const rel = (event.clientX - rect.left) / rect.width - 0.5;
            xTo(rel * 18);
          };
          const onLeave = () => xTo(0);
          row.addEventListener('mousemove', onMove);
          row.addEventListener('mouseleave', onLeave);
          return () => {
            row.removeEventListener('mousemove', onMove);
            row.removeEventListener('mouseleave', onLeave);
          };
        });
        return () => magnets.forEach((off) => off());
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  const toTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToTarget('#top');
  };

  return (
    <footer ref={rootRef} className="contact theme-dark" id="contact" data-theme="dark" aria-label="Contact">
      <div className="contact-inner">
        <p className="contact-kicker">Booking &amp; enquiries</p>
        <h2 className="contact-title display">
          <span className="line-mask">
            <span ref={line1Ref} className="line-inner">
              Let&rsquo;s make
            </span>
          </span>
          <span className="line-mask">
            <span ref={line2Ref} className="line-inner">
              something<span className="contact-dot">.</span>
            </span>
          </span>
        </h2>

        <ul ref={listRef} className="contact-list">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                className="contact-row"
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
              >
                <span className="contact-label">{link.label}</span>
                <span className="contact-value">{link.value}</span>
                <span className="contact-arrow" aria-hidden="true">
                  &#8599;
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="contact-base">
          <span>&copy; 2026 Drax Raw</span>
          <span>Dar es Salaam, Tanzania</span>
          <a href="#top" className="contact-top" onClick={toTop}>
            Back to top&nbsp;&uarr;
          </a>
        </div>
      </div>
    </footer>
  );
};
