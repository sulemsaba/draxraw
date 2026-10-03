import React, { useEffect, useRef, useState } from 'react';
import manifest from '../data/manifest.json';
import './ResponsiveImage.css';

interface ResponsiveImageProps {
  /** The original /images/foo.jpg path. Must exist in manifest. */
  src: string;
  alt: string;
  /** Tailwind/CSS class on the wrapper. */
  className?: string;
  /** Tailwind/CSS class on the <img>. */
  imgClassName?: string;
  /** Sizes attribute for responsive srcset selection. */
  sizes?: string;
  /** Lazy by default; pass 'eager' for above-the-fold hero images. */
  loading?: 'lazy' | 'eager';
  /** Priority hint for above-the-fold. */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Flip carrier id (drax carry mechanic). Pass-through to <img>. */
  'data-flip-id'?: string;
  /** Optional aspect-ratio override (CSS). When set, the wrapper uses this. */
  aspectRatio?: string;
}

type ManifestEntry = {
  original: string;
  width: number;
  height: number;
  aspectRatio: string;
  avif: string;
  webp: string;
  lqip: string;
  srcset: Array<{ w: number; h: number; avif: string; webp: string; jpg: string }>;
};

const manifestMap = manifest as Record<string, ManifestEntry>;

/**
 * Image component with:
 *   - AVIF first, WebP fallback, JPEG last resort
 *   - Responsive srcset across breakpoints (modern browsers pick AVIF)
 *   - LQIP blur-up placeholder (tiny base64 PNG)
 *   - Stable aspect-ratio wrapper (no layout shift while loading)
 *   - Fade-up reveal when the real image arrives
 *   - Pass-through data-flip-id for the GSAP Flip carry mechanic
 *
 * When a path isn't in the manifest (e.g. user-supplied image later),
 * the component falls back to a plain <img src={src}>.
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  imgClassName,
  sizes = '100vw',
  loading = 'lazy',
  fetchPriority,
  'data-flip-id': flipId,
  aspectRatio
}) => {
  const entry = manifestMap[src];
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    if (img.complete) {
      setLoaded(true);
    }
  }, []);

  const handleLoad = () => setLoaded(true);

  if (!entry) {
    /* Fallback path — unknown image, just render a plain <img>. */
    return (
      <div className={className} style={aspectRatio ? { aspectRatio } : undefined}>
        <img
          src={src}
          alt={alt}
          className={imgClassName}
          loading={loading}
          fetchPriority={fetchPriority}
          data-flip-id={flipId}
        />
      </div>
    );
  }

  const ratio = aspectRatio ?? entry.aspectRatio;

  const avifSrcset = entry.srcset.map((v) => `${v.avif} ${v.w}w`).join(', ');
  const webpSrcset = entry.srcset.map((v) => `${v.webp} ${v.w}w`).join(', ');
  const jpgSrcset = entry.srcset.map((v) => `${v.jpg} ${v.w}w`).join(', ');

  return (
    <div className={`responsive-image ${className ?? ''}`} style={{ aspectRatio: ratio }}>
      {/* LQIP placeholder — visible until the real image is loaded */}
      <div
        className="responsive-lqip"
        style={{ backgroundImage: `url(${entry.lqip})` }}
        aria-hidden="true"
        data-loaded={loaded ? 'true' : 'false'}
      />
      <picture>
        {avifSrcset && (
          <source type="image/avif" srcSet={avifSrcset} sizes={sizes} />
        )}
        {webpSrcset && (
          <source type="image/webp" srcSet={webpSrcset} sizes={sizes} />
        )}
        <img
          ref={imgRef}
          src={entry.original}
          srcSet={jpgSrcset || undefined}
          sizes={sizes}
          alt={alt}
          className={`responsive-img ${imgClassName ?? ''}`}
          loading={loading}
          fetchPriority={fetchPriority}
          onLoad={handleLoad}
          data-loaded={loaded ? 'true' : 'false'}
          data-flip-id={flipId}
          width={entry.width}
          height={entry.height}
        />
      </picture>
    </div>
  );
};
