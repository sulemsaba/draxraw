import React, { useRef } from 'react';
import { CaseHero } from '../components/CaseHero';
import { Ticker } from '../components/Ticker';
import { Lens } from '../components/Lens';
import { Films } from '../components/Films';
import { PhotoStrip } from '../components/PhotoStrip';
import { CtaBand } from '../components/CtaBand';
import { usePageMotion } from '../lib/usePageMotion';

export const Home: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref);
  return (
    <div ref={ref}>
      <CaseHero />
      <Ticker />
      <Lens />
      <Films limit={3} title="Latest films" />
      <PhotoStrip />
      <CtaBand />
    </div>
  );
};
