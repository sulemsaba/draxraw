import React from 'react';

type IconProps = { size?: number; className?: string };

const svg = (size: number, className: string | undefined, children: React.ReactNode, fill = false) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill ? 'currentColor' : 'none'}
    stroke={fill ? 'none' : 'currentColor'}
    strokeWidth={2.4}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const WhatsAppIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(
    size,
    className,
    <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.3 1 2.5.1.2 1.7 2.7 4.2 3.7 1.6.6 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.4Z" />,
    true
  );

export const PlayIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(size, className, <path d="M7 4.5v15l12.5-7.5L7 4.5Z" />, true);

export const ArrowIcon: React.FC<IconProps> = ({ size = 20, className }) =>
  svg(size, className, <path d="M4 12h15M13 5.5l6.5 6.5-6.5 6.5" />);

export const CloseIcon: React.FC<IconProps> = ({ size = 20, className }) =>
  svg(size, className, <path d="M5 5l14 14M19 5L5 19" />);

export const FilmIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(
    size,
    className,
    <>
      <rect x="3" y="4" width="18" height="16" />
      <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
    </>
  );

export const CameraIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(
    size,
    className,
    <>
      <path d="M3 7h4l2-3h6l2 3h4v13H3V7Z" />
      <circle cx="12" cy="13" r="3.6" />
    </>
  );

export const PersonIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(
    size,
    className,
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4.2 4.2-6.5 8-6.5s7 2.3 8 6.5" />
    </>
  );

export const YouTubeIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(
    size,
    className,
    <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />,
    true
  );

export const InstagramIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(
    size,
    className,
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  );

export const PauseIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(size, className, <path d="M6 4.5h4.2v15H6zM13.8 4.5H18v15h-4.2z" />, true);

export const SoundIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(
    size,
    className,
    <>
      <path d="M4 9.5h4l5-4v13l-5-4H4v-5Z" fill="currentColor" stroke="none" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </>
  );

export const MutedIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(
    size,
    className,
    <>
      <path d="M4 9.5h4l5-4v13l-5-4H4v-5Z" fill="currentColor" stroke="none" />
      <path d="M16.5 9.5l5 5M21.5 9.5l-5 5" />
    </>
  );

export const ExpandIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(size, className, <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />);

export const ReplayIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(size, className, <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4.2h4.2" />);

export const DownloadIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(size, className, <path d="M12 3.5v12M6.5 10l5.5 5.5 5.5-5.5M4.5 20h15" />);

export const HomeIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(size, className, <path d="M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5" />);

export const PhoneIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(
    size,
    className,
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </>
  );

export const SunIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(
    size,
    className,
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
    </>
  );

export const MoonIcon: React.FC<IconProps> = ({ size = 22, className }) =>
  svg(size, className, <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />);
