import React, { useRef } from 'react';
import { About } from '../components/About';
import { Services } from '../components/Services';
import { CtaBand } from '../components/CtaBand';
import { usePageMotion } from '../lib/usePageMotion';

export const AboutPage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref);
  return (
    <div ref={ref} className="page">
      <About />
      <Services />
      <CtaBand />
    </div>
  );
};
