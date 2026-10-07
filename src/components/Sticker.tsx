import React from 'react';
import type { StickerColor } from '../data/site';
import { tornClip } from '../lib/torn';

interface StickerProps {
  color?: StickerColor | 'ink';
  /** Seed for the torn outline; omit for a clean die-cut rectangle. */
  torn?: number;
  rough?: number;
  rotate?: number;
  className?: string;
  innerClassName?: string;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p';
  children: React.ReactNode;
  /** Marks the sticker for the slap-on animation. */
  slap?: boolean;
  style?: React.CSSProperties;
}

/**
 * One vinyl sticker stuck to the case. The outer element carries the shadow
 * and tilt; the inner carries color, wear mask and torn outline (a mask or
 * clip on the same element would cut its own shadow off).
 */
export const Sticker: React.FC<StickerProps> = ({
  color = 'paper',
  torn,
  rough,
  rotate = 0,
  className = '',
  innerClassName = '',
  as: Tag = 'span',
  children,
  slap = true,
  style,
}) => (
  <Tag
    className={`stuck ${className}`}
    data-slap={slap ? '' : undefined}
    style={{ display: 'inline-block', rotate: `${rotate}deg`, ...style }}
  >
    <span
      className={`vinyl is-${color} wear-${((torn ?? rotate * 7) >>> 0) % 3 + 1} ${innerClassName}`}
      style={
        {
          clipPath: torn !== undefined ? tornClip(torn, Math.min(rough ?? 2.4, 1.6)) : undefined,
          '--wear-x': `${((torn ?? 3) * 37) % 300}px`,
          '--wear-y': `${((torn ?? 5) * 53) % 300}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  </Tag>
);
