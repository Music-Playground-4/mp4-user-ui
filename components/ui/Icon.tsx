import type { CSSProperties } from 'react';

export type IconName =
  | 'home' | 'search' | 'plus' | 'user' | 'chat' | 'heart' | 'heartFill'
  | 'chevR' | 'chevL' | 'chevD' | 'chevU' | 'close' | 'filter' | 'bell'
  | 'pin' | 'check' | 'music' | 'play' | 'pause' | 'mic' | 'headset'
  | 'waveform' | 'spark' | 'badgeNew' | 'map' | 'settings' | 'speaker'
  | 'users' | 'info' | 'tag' | 'star' | 'grid' | 'list';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}

const PATHS: Record<IconName, (color: string) => React.ReactNode> = {
  home: () => (<><path d="M3 10.5l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/></>),
  search: () => (<><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-3.5-3.5"/></>),
  plus: () => (<><path d="M12 5v14M5 12h14"/></>),
  user: () => (<><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></>),
  chat: () => (<><path d="M21 12a8 8 0 11-3-6.2L21 5l-1 3.4A8 8 0 0121 12z"/></>),
  heart: () => (<><path d="M12 20s-7-4.5-9-9.5C1.5 6.5 4 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3 0 5.5 2.5 4 6.5-2 5-9 9.5-9 9.5z"/></>),
  heartFill: (c) => (<><path d="M12 20s-7-4.5-9-9.5C1.5 6.5 4 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3 0 5.5 2.5 4 6.5-2 5-9 9.5-9 9.5z" fill={c} stroke="none"/></>),
  chevR: () => (<><path d="M9 6l6 6-6 6"/></>),
  chevL: () => (<><path d="M15 6l-6 6 6 6"/></>),
  chevD: () => (<><path d="M6 9l6 6 6-6"/></>),
  chevU: () => (<><path d="M6 15l6-6 6 6"/></>),
  close: () => (<><path d="M6 6l12 12M18 6L6 18"/></>),
  filter: () => (<><path d="M4 6h16M7 12h10M10 18h4"/></>),
  bell: () => (<><path d="M18 16V11a6 6 0 10-12 0v5l-1.5 2h15L18 16z"/><path d="M10 20a2 2 0 004 0"/></>),
  pin: () => (<><path d="M12 21s-6-5.5-6-11a6 6 0 1112 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/></>),
  check: () => (<><path d="M5 12.5l4.5 4.5L19 7.5"/></>),
  music: () => (<><path d="M9 18V6l12-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>),
  play: (c) => (<><path d="M7 5l12 7-12 7V5z" fill={c} stroke="none"/></>),
  pause: (c) => (<><rect x="7" y="5" width="3.5" height="14" rx="1" fill={c} stroke="none"/><rect x="13.5" y="5" width="3.5" height="14" rx="1" fill={c} stroke="none"/></>),
  mic: () => (<><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></>),
  headset: () => (<><path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="3" y="13" width="4" height="7" rx="1"/><rect x="17" y="13" width="4" height="7" rx="1"/></>),
  waveform: () => (<><path d="M4 12h2M8 8v8M12 5v14M16 9v6M20 11v2"/></>),
  spark: () => (<><path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8"/></>),
  badgeNew: () => (<><path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3L4.3 7.6l5.3-.8L12 2z"/></>),
  map: () => (<><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></>),
  settings: () => (<><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.2l2-1.6-2-3.5-2.4.9a7 7 0 00-2.1-1.2L14 3h-4l-.4 2.4a7 7 0 00-2.1 1.2l-2.4-.9-2 3.5 2 1.6A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.5 2.4-.9c.6.5 1.3.9 2.1 1.2L10 21h4l.4-2.4a7 7 0 002.1-1.2l2.4.9 2-3.5-2-1.6c.1-.4.1-.8.1-1.2z"/></>),
  speaker: () => (<><path d="M11 5L7 9H4v6h3l4 4V5z"/><path d="M16 9a4 4 0 010 6"/></>),
  users: () => (<><circle cx="9" cy="9" r="3.5"/><path d="M3 19c.8-3 3.2-4.5 6-4.5s5.2 1.5 6 4.5"/><circle cx="17" cy="7" r="2.5"/><path d="M17 12c2.2 0 3.7 1 4.5 2.8"/></>),
  info: () => (<><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></>),
  tag: (c) => (<><path d="M3 11V4h7l11 11-7 7L3 11z"/><circle cx="7.5" cy="7.5" r="1.2" fill={c}/></>),
  star: () => (<><path d="M12 4l2.4 5.2 5.6.7-4.2 4 1.1 5.6L12 17l-4.9 2.5 1.1-5.6-4.2-4 5.6-.7L12 4z"/></>),
  grid: () => (<><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></>),
  list: () => (<><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>),
};

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.6, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      {PATHS[name](color)}
    </svg>
  );
}
