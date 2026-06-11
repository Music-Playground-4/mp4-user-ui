'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { GradePill } from '@/components/ui/Pills';
import { BottomTabBar, TopBar } from '@/components/app/Nav';
import { USERS, GEARS, formatPrice } from '@/lib/data';

const TABS = ['내 장터', '내 모집', '일정', '지난활동'];

export default function MyProfilePage() {
  const me = USERS[0];
  const [tab, setTab] = useState(TABS[0]);

  return (
    <>
      <TopBar
        title=""
        showBack={false}
        right={
          <>
            <Link href="/my/activity" className="topbar-action" aria-label="알림">
              <Icon name="bell" size={20} />
            </Link>
            <Link href="/my/settings" className="topbar-action" aria-label="설정">
              <Icon name="settings" size={20} />
            </Link>
          </>
        }
      />

      <div className="scroll-region">
        <div style={{ padding: '8px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={me.avatar} alt={me.name} style={{ width: 64, height: 64, borderRadius: 32 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.01em' }}>{me.name}</div>
                <span className="badge" style={{ background: 'rgba(0,102,255,0.10)', color: 'var(--color-primary)', fontSize: 10 }}>본인인증</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-alternative)' }}>{me.position} · {me.region}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 1 }}>{me.level} · {me.genres.join(' · ')}</div>
            </div>
          </div>

          <Link href="/my/trust" className="pressable" style={{
            display: 'block', marginTop: 14, padding: 14, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--blue-50), var(--blue-30))',
            color: '#fff', textDecoration: 'none',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, letterSpacing: '0.04em', marginBottom: 4 }}>신뢰점수</div>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>76<span style={{ fontSize: 14, opacity: 0.7, fontWeight: 600 }}>/100</span></div>
                <div style={{ fontSize: 11, marginTop: 4, opacity: 0.85 }}>Lv.B · 활동 늘리면 A등급으로!</div>
              </div>
              <Icon name="chevR" size={18} color="rgba(255,255,255,0.7)" />
            </div>
            <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
              <div style={{ width: '76%', height: '100%', background: '#fff', borderRadius: 3 }} />
            </div>
          </Link>

          <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
            <Stat n="3" l="장터 거래" />
            <Stat n="2" l="모집글" />
            <Stat n="12" l="합주" />
            <Stat n="4" l="공연" />
          </div>
        </div>

        <div style={{ display: 'flex', padding: '0 16px', borderBottom: '1px solid var(--color-line-soft)' }}>
          {TABS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '12px 14px', fontSize: 13, fontWeight: 600, background: 'transparent', border: 0,
                color: tab === t ? 'var(--fg-strong)' : 'var(--fg-alternative)',
                borderBottom: tab === t ? '2px solid var(--fg-strong)' : '2px solid transparent',
                marginBottom: -1, cursor: 'pointer',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === '내 장터' && (
          <div style={{ padding: '16px 16px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {GEARS.slice(0, 3).map((g) => (
              <Link key={g.id} href={`/market/${g.id}`}>
                <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 8, background: `url(${g.images?.[0]}) center/cover`, position: 'relative', marginBottom: 6 }}>
                  <div style={{ position: 'absolute', top: 6, left: 6 }}>
                    <GradePill grade={g.grade} />
                  </div>
                  {g.status === 'sold' && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                      display: 'grid', placeItems: 'center', borderRadius: 8,
                      color: '#fff', fontSize: 13, fontWeight: 700,
                    }}>
                      판매완료
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-normal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {g.title}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 2 }}>{formatPrice(g.price)}</div>
              </Link>
            ))}
          </div>
        )}

        {tab !== '내 장터' && (
          <div style={{ padding: '40px 16px 80px', textAlign: 'center', color: 'var(--fg-alternative)', fontSize: 13 }}>
            {tab} 데이터가 없어요
          </div>
        )}
      </div>

      <BottomTabBar />
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div style={{ flex: 1, padding: '10px 6px', background: 'var(--neutral-99)', borderRadius: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', fontVariantNumeric: 'tabular-nums' }}>{n}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 1 }}>{l}</div>
    </div>
  );
}
