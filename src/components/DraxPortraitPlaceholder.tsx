import React from 'react';
import './DraxPortraitPlaceholder.css';

interface DraxPortraitPlaceholderProps {
  className?: string;
  imageSrc?: string;
}

export const DraxPortraitPlaceholder: React.FC<DraxPortraitPlaceholderProps> = ({
  className = '',
  imageSrc = '/images/drax-portrait.png'
}) => {
  return (
    <div
      className={`drax-portrait-container ${className}`}
      id="drax-portrait-placeholder"
      data-testid="drax-portrait-placeholder"
      aria-label="Drax Cutout Portrait Area"
    >
      {imageSrc ? (
        <div className="drax-portrait-frame-with-image">
          {/* Viewfinder crosshairs & technical metadata */}
          <div className="portrait-hud top-left">
            <span>REC [●]</span>
            <span className="hud-dim">24FPS</span>
          </div>
          <div className="portrait-hud top-right">
            <span>RAW 14-BIT</span>
          </div>

          {/* Actual Cutout Portrait of Drax */}
          <img
            src={imageSrc}
            alt="Drax — Filmmaker & Visual Storyteller"
            className="drax-portrait-img"
            loading="eager"
          />

          {/* Technical identifier label */}
          <div className="portrait-hud bottom-label">
            <span className="portrait-tag-marker">DRAX // FILMMAKER</span>
            <span className="portrait-tag-sub">DAR ES SALAAM — TZ</span>
          </div>

          {/* Corner focus brackets */}
          <div className="corner-bracket br-tl" />
          <div className="corner-bracket br-tr" />
          <div className="corner-bracket br-bl" />
          <div className="corner-bracket br-br" />
        </div>
      ) : (
        <div className="drax-portrait-silhouette-frame">
          <div className="portrait-hud top-left">
            <span>REC [●]</span>
            <span className="hud-dim">24FPS</span>
          </div>
          <div className="portrait-hud top-right">
            <span>RAW 14-BIT</span>
          </div>

          <div className="portrait-hud bottom-label">
            <span className="portrait-tag-marker">[ CUTOUT PORTRAIT AREA ]</span>
            <span className="portrait-tag-sub">DRAX — DAR ES SALAAM</span>
          </div>

          <div className="corner-bracket br-tl" />
          <div className="corner-bracket br-tr" />
          <div className="corner-bracket br-bl" />
          <div className="corner-bracket br-br" />
        </div>
      )}
    </div>
  );
};
