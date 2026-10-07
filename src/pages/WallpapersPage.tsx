import React, { useRef } from 'react';
import { Sticker } from '../components/Sticker';
import { SwipeDots } from '../components/SwipeDots';
import { CtaBand } from '../components/CtaBand';
import { DownloadIcon } from '../components/Icons';
import { WALLPAPERS } from '../data/site';
import { usePageMotion } from '../lib/usePageMotion';
import { useSwipeDots } from '../lib/useSwipeDots';
import './WallpapersPage.css';

export const WallpapersPage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLUListElement>(null);
  const { active, goTo } = useSwipeDots(rowRef);
  usePageMotion(ref);

  return (
    <div ref={ref} className="page">
      <section className="section" aria-labelledby="walls-title">
        <div className="section-inner">
          <header className="page-head">
            <Sticker as="h1" color="yellow" torn={77} rotate={-0.8} innerClassName="display section-title-inner">
              <span id="walls-title">Wallpapers</span>
            </Sticker>
            <p className="page-note" data-rise="">
              Made by Drax Raw. Free for your phone and your computer.
            </p>
          </header>

          <ul ref={rowRef} className="walls">
            {WALLPAPERS.map((w) => (
              <li key={w.slug} className="wall-card" data-rise="">
                <div className="wall-phone">
                  <img src={`img/walls/${w.slug}-phone.webp`} alt={`${w.title} wallpaper`} loading="lazy" width={420} height={910} />
                </div>
                <div className="wall-info">
                  <span className="wall-title display">{w.title}</span>
                  <div className="wall-dl">
                    <a className="label" href={`wallpapers/${w.slug}-phone.jpg`} download={`drax-raw-${w.slug}-phone.jpg`}>
                      <DownloadIcon size={18} /> Phone
                    </a>
                    <a className="label" href={`wallpapers/${w.slug}-desktop.jpg`} download={`drax-raw-${w.slug}-desktop.jpg`}>
                      <DownloadIcon size={18} /> Desktop
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <SwipeDots count={WALLPAPERS.length} active={active} onPick={goTo} label="Wallpapers" />
        </div>
      </section>
      <CtaBand />
    </div>
  );
};
