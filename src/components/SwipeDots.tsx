import React from 'react';
import './SwipeDots.css';

interface SwipeDotsProps {
  count: number;
  active: number;
  onPick: (i: number) => void;
  label: string;
}

/** Position dots under a swipe row (phones only). */
export const SwipeDots: React.FC<SwipeDotsProps> = ({ count, active, onPick, label }) => (
  <div className="swipe-dots" role="tablist" aria-label={label}>
    {Array.from({ length: count }, (_, i) => (
      <button
        key={i}
        type="button"
        role="tab"
        aria-selected={i === active}
        aria-label={`${i + 1} of ${count}`}
        className={i === active ? 'is-on' : ''}
        onClick={() => onPick(i)}
      />
    ))}
  </div>
);
