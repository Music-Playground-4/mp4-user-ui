'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Icon, type IconName } from '@/components/ui/Icon';
import { GradePill } from '@/components/ui/Pills';
import { BottomTabBar } from '@/components/app/Nav';
import { POSTS, GEARS, USERS, formatPrice } from '@/lib/data';

const FontHero = { fontFamily: 'var(--font-display)' };

const QUICK_ACTIONS: { label: string; icon: IconName; color: string; fg: string; href: string }[] = [
  { label: '합주 찾기', icon: 'music', color: 'var(--blue-99)', fg: 'var(--color-primary)', href: '/sessions' },
  { label: '장비 거래', icon: 'speaker', color: 'rgba(0,191,64,0.10)', fg: '#008C30', href: '/market' },
  { label: '공연 매칭', icon: 'mic', color: 'rgba(151,71,255,0.10)', fg: '#6B2FB7', href: '/perf' },
  { label: '세션 모집', icon: 'plus', color: 'rgba(0,152,178,0.10)', fg: '#006B80', href: '/sessions' },
];

export default function HomePage() {
  return (
    <>
      <div style={{
        height: 54, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-line-soft)', background: '#fff',
        position: 'sticky', top: 0, zIndex: 5, flexShrink: 0,
      }}>
        <div style={{ ...FontHero, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
          MP<span style={{ color: 'var(--color-primary)' }}>4</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Link href="/market" className="topbar-action" aria-label="검색">
            <Icon name="search" size={20} />
          </Link>
          <Link href="/my/activity" className="topbar-action" aria-label="알림">
            <Icon name="bell" size={20} />
            <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: 3, background: 'var(--color-negative)' }} />
          </Link>
        </div>
      </div>

      <div className="scroll-region">
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{ fontSize: 13, color: 'var(--fg-alternative)' }}>안녕하세요, 김민수님</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em', marginTop: 2 }}>
            오늘은 어떤 활동을 해볼까요?
          </div>
        </div>

        <div className="stagger" style={{ padding: '8px 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {QUICK_ACTIONS.map((q) => (
            <Link key={q.label} href={q.href} className="pressable" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 4, borderRadius: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: q.color, color: q.fg, display: 'grid', placeItems: 'center' }}>
                <Icon name={q.icon} size={24} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-normal)', fontWeight: 500 }}>{q.label}</div>
            </Link>
          ))}
        </div>

        <div style={{ padding: '8px 16px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.01em' }}>오늘의 추천 합주</div>
          <Link href="/sessions" style={{ fontSize: 12, color: 'var(--fg-alternative)' }}>전체 보기</Link>
        </div>
        <div className="stagger" style={{ padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {POSTS.slice(0, 2).map((p) => {
            const author = USERS.find((u) => u.id === p.authorId)!;
            return (
              <Link key={p.id} href={`/sessions/${p.id}`} style={{ border: '1px solid var(--color-line)', borderRadius: 12, padding: 14, background: '#fff', display: 'block' }} className="pressable card-lift">
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <span className="badge badge-info" style={{ fontSize: 10 }}>{p.freq}</span>
                  {p.level === '입문환영' && (
                    <span className="badge" style={{ background: 'rgba(0,102,255,0.10)', color: 'var(--color-primary)', fontSize: 10 }}>입문환영</span>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 6 }}>{p.title}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {p.positions.map((pos) => (
                    <span key={pos} className="chip chip-soft" style={{ height: 22, fontSize: 11 }}>{pos}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--fg-alternative)' }}>
                  <Image src={author.avatar} alt={author.name} width={18} height={18} style={{ borderRadius: 9 }} unoptimized />
                  {author.name} · {p.region} · {p.when}
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ padding: '8px 16px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.01em' }}>지금 뜨는 장비</div>
          <Link href="/market" style={{ fontSize: 12, color: 'var(--fg-alternative)' }}>전체 보기</Link>
        </div>
        <div className="stagger" style={{ padding: '8px 16px 24px', display: 'flex', gap: 10, overflowX: 'auto' }}>
          {GEARS.slice(0, 4).map((g) => (
            <Link key={g.id} href={`/market/${g.id}`} className="card-lift" style={{ width: 140, flexShrink: 0 }}>
              <div style={{
                width: 140, height: 140, borderRadius: 12,
                background: `url(${g.images?.[0]}) center/cover`,
                marginBottom: 8, position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <GradePill grade={g.grade} />
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-normal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {g.title}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 2 }}>
                {formatPrice(g.price)}
              </div>
            </Link>
          ))}
        </div>

        <div style={{ padding: '0 16px 24px' }}>
          <Link href="/gallery" style={{
            display: 'block', padding: 14, borderRadius: 12,
            background: 'var(--neutral-99)', border: '1px solid var(--color-line-soft)',
            fontSize: 12, color: 'var(--fg-alternative)', textAlign: 'center',
          }}>
            26개 전체 화면 갤러리 보기 →
          </Link>
        </div>
      </div>

      <BottomTabBar />
    </>
  );
}
