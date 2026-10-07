import React, { useRef } from 'react';
import { Films } from '../components/Films';
import { CtaBand } from '../components/CtaBand';
import { usePageMotion } from '../lib/usePageMotion';

export const FilmsPage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref);
  return (
    <div ref={ref} className="page">
      <Films title="Films" as="h1" />
      <CtaBand />
    </div>
  );
};
