'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/Icon';
import { USERS, CHAT_ROOMS } from '@/lib/data';

interface TopBarProps {
  title?: ReactNode;
  showBack?: boolean;
  backHref?: string;
  right?: ReactNode;
}

export function TopBar({ title, showBack = true, backHref, right }: TopBarProps) {
  const router = useRouter();
  const onBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };
  return (
    <div className="topbar">
      {showBack ? (
        <button type="button" className="topbar-back" onClick={onBack} aria-label="뒤로">
          <Icon name="chevL" size={22} />
        </button>
      ) : (
        <div style={{ width: 40 }} />
      )}
      <div className="topbar-title">{title}</div>
      <div style={{ display: 'flex', gap: 2 }}>{right}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Shared nav model
   ───────────────────────────────────────────────────────────── */
type TabId = 'home' | 'market' | 'sessions' | 'perf' | 'chat' | 'me';

interface NavEntry {
  id: TabId;
  label: string;
  icon: IconName;
  href: string;
  matchPrefixes: string[];
  /** Show in mobile bottom tab bar */
  mobile?: boolean;
  /** Show in desktop sidebar */
  desktop?: boolean;
}

const ENTRIES: NavEntry[] = [
  { id: 'home', label: '홈', icon: 'home', href: '/', matchPrefixes: ['/'], mobile: false, desktop: true },
  { id: 'market', label: '마켓', icon: 'speaker', href: '/market', matchPrefixes: ['/market'], mobile: true, desktop: true },
  { id: 'sessions', label: '합주', icon: 'music', href: '/sessions', matchPrefixes: ['/sessions'], mobile: true, desktop: true },
  { id: 'perf', label: '공연', icon: 'mic', href: '/perf', matchPrefixes: ['/perf'], mobile: false, desktop: true },
  { id: 'chat', label: '채팅', icon: 'chat', href: '/chats', matchPrefixes: ['/chats'], mobile: true, desktop: true },
  { id: 'me', label: '마이', icon: 'user', href: '/my', matchPrefixes: ['/my'], mobile: true, desktop: true },
];

function activeId(pathname: string): TabId | undefined {
  // Priority: longest matching prefix wins. '/' must be exact.
  const exact = ENTRIES.find((e) => e.matchPrefixes.includes(pathname));
  if (exact) return exact.id;
  const prefixed = ENTRIES
    .filter((e) => e.matchPrefixes.some((p) => p !== '/' && (pathname === p || pathname.startsWith(p + '/'))))
    .sort((a, b) =>
      Math.max(...b.matchPrefixes.map((p) => p.length)) -
      Math.max(...a.matchPrefixes.map((p) => p.length))
    )[0];
  return prefixed?.id;
}

/* ── Mobile bottom tab bar ───────────────────────────────────── */
export function BottomTabBar() {
  const pathname = usePathname() || '/';
  const active = activeId(pathname);
  const tabs = ENTRIES.filter((e) => e.mobile);

  return (
    <div className="tabbar">
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <Link key={t.id} href={t.href} className={'tabbar-item' + (isActive ? ' active' : '')}>
            <Icon name={t.icon} size={22} strokeWidth={isActive ? 2.2 : 1.6} />
            <span className="tabbar-label">{t.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

/* ── Desktop sidebar nav ─────────────────────────────────────── */
export function SideNav() {
  const pathname = usePathname() || '/';
  const active = activeId(pathname);
  const items = ENTRIES.filter((e) => e.desktop);
  const me = USERS[0];
  const totalUnread = CHAT_ROOMS.reduce((s, c) => s + c.unread, 0);

  return (
    <aside className="app-sidebar">
      <Link href="/" className="sidenav-logo">
        MP<span style={{ color: 'var(--color-primary)' }}>4</span>
      </Link>

      <div className="sidenav-section-label">메뉴</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((it) => {
          const isActive = active === it.id;
          const unread = it.id === 'chat' && totalUnread > 0 ? totalUnread : null;
          return (
            <Link
              key={it.id}
              href={it.href}
              className={'sidenav-item' + (isActive ? ' active' : '')}
            >
              <Icon name={it.icon} size={20} strokeWidth={isActive ? 2 : 1.6} />
              <span>{it.label}</span>
              {unread !== null && <span className="sidenav-badge">{unread}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidenav-section-label">바로가기</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Link href="/my/trust" className="sidenav-item">
          <Icon name="star" size={20} strokeWidth={1.6} />
          <span>신뢰점수</span>
        </Link>
        <Link href="/my/activity" className="sidenav-item">
          <Icon name="bell" size={20} strokeWidth={1.6} />
          <span>활동 내역</span>
        </Link>
        <Link href="/my/settings" className="sidenav-item">
          <Icon name="settings" size={20} strokeWidth={1.6} />
          <span>설정</span>
        </Link>
        <Link href="/gallery" className="sidenav-item">
          <Icon name="info" size={20} strokeWidth={1.6} />
          <span>전체 화면 갤러리</span>
        </Link>
      </nav>

      <Link href="/my" className="sidenav-user">
        <img src={me.avatar} alt={me.name} style={{ width: 36, height: 36, borderRadius: 18 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {me.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>{me.position} · {me.level}</div>
        </div>
        <Icon name="chevR" size={16} color="var(--fg-assistive)" />
      </Link>
    </aside>
  );
}
