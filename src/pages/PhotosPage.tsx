import React, { useRef } from 'react';
import { Sticker } from '../components/Sticker';
import { PhotoWall } from '../components/PhotoWall';
import { CtaBand } from '../components/CtaBand';
import { usePageMotion } from '../lib/usePageMotion';

export const PhotosPage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref);
  return (
    <div ref={ref} className="page">
      <section className="section" aria-labelledby="photos-title">
        <div className="section-inner">
          <header className="page-head">
            <Sticker as="h1" color="paper" torn={59} rotate={-0.8} innerClassName="display section-title-inner">
              <span id="photos-title">Photos</span>
            </Sticker>
            <p className="page-note" data-rise="">
              Tap a photo to see it full screen.
            </p>
          </header>
          <PhotoWall />
        </div>
      </section>
      <CtaBand />
    </div>
  );
};
