import React, { useRef } from 'react';
import { Book } from '../components/Book';
import { usePageMotion } from '../lib/usePageMotion';

export const BookPage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref);
  return (
    <div ref={ref} className="page">
      <Book />
    </div>
  );
};
