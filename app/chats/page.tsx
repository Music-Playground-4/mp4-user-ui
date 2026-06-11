'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { BottomTabBar, TopBar } from '@/components/app/Nav';
import { CHAT_ROOMS } from '@/lib/data';

const KIND_LABEL = { market: '장터', group: '합주', perf: '공연' };

export default function ChatsPage() {
  return (
    <>
      <TopBar
        title="채팅"
        showBack={false}
        right={
          <button type="button" className="topbar-action" aria-label="검색">
            <Icon name="search" size={20} />
          </button>
        }
      />

      <div className="scroll-region stagger">
        {CHAT_ROOMS.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--fg-alternative)', fontSize: 13 }}>
            아직 채팅이 없어요
          </div>
        ) : CHAT_ROOMS.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            className="linkrow"
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--color-line-soft)' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 24, background: c.thumb ? `url(${c.thumb}) center/cover` : 'var(--blue-99)', display: 'grid', placeItems: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
              {!c.thumb && <Icon name={c.kind === 'market' ? 'speaker' : c.kind === 'group' ? 'music' : 'mic'} size={20} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.title}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--fg-alternative)', flexShrink: 0 }}>· {KIND_LABEL[c.kind]}</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--fg-alternative)', flexShrink: 0 }}>{c.when}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-alternative)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.preview}
              </div>
            </div>
            {c.unread > 0 && (
              <span style={{
                minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9,
                background: 'var(--color-negative)', color: '#fff', fontSize: 10, fontWeight: 700,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                {c.unread}
              </span>
            )}
          </Link>
        ))}
      </div>

      <BottomTabBar />
    </>
  );
}
