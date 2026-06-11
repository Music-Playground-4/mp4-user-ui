'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { BottomTabBar, TopBar } from '@/components/app/Nav';
import { POSTS, USERS, type Frequency } from '@/lib/data';

type FreqFilter = '전체' | Frequency;

const FILTERS: FreqFilter[] = ['전체', '정기', '단기', '원타임'];

export default function SessionsListPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FreqFilter>('전체');

  const list = useMemo(() => {
    if (filter === '전체') return POSTS;
    return POSTS.filter((p) => p.freq === filter);
  }, [filter]);

  return (
    <>
      <TopBar
        title="합주 매칭"
        showBack={false}
        right={
          <button type="button" className="topbar-action" aria-label="검색">
            <Icon name="search" size={20} />
          </button>
        }
      />

      <div style={{ padding: '10px 16px 0', background: '#fff', borderBottom: '1px solid var(--color-line-soft)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, paddingBottom: 10, overflowX: 'auto', marginRight: -16 }}>
          {FILTERS.map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'chip chip-active' : 'chip'}
              style={{ height: 32, fontSize: 12, gap: 4 }}
            >
              {f === '정기' && <span style={{ width: 8, height: 8, borderRadius: 4, background: filter === f ? '#fff' : 'var(--color-positive)' }} />}
              {f}
            </button>
          ))}
          <div className="chip" style={{ height: 32, fontSize: 12, gap: 4 }}>
            <Icon name="filter" size={12} strokeWidth={2} /> 필터
          </div>
        </div>
      </div>

      <div className="scroll-region">
        <div style={{ padding: '14px 16px 6px' }}>
          <div style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.04em' }}>FOR YOU</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 2 }}>김민수님 취향에 맞춰서</div>
        </div>

        <div className="stagger" style={{ padding: '4px 16px 12px', display: 'flex', gap: 10, overflowX: 'auto', marginRight: -16 }}>
          {POSTS.slice(0, 3).map((p) => {
            const author = USERS.find((u) => u.id === p.authorId)!;
            return (
              <Link key={p.id} href={`/sessions/${p.id}`} className="pressable card-lift" style={{
                width: 240, flexShrink: 0, padding: 14, borderRadius: 12,
                border: '1px solid var(--color-line)', background: '#fff',
                display: 'block',
              }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <span className="badge badge-info" style={{ fontSize: 10 }}>{p.freq}</span>
                  {p.level === '입문환영' && (
                    <span className="badge" style={{ background: 'rgba(0,102,255,0.10)', color: 'var(--color-primary)', fontSize: 10 }}>입문환영</span>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8, lineHeight: 1.4, minHeight: 38 }}>
                  {p.title}
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                  {p.positions.map((pos) => (
                    <span key={pos} className="chip chip-soft" style={{ height: 22, padding: '0 8px', fontSize: 11 }}>{pos}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src={author.avatar} alt={author.name} style={{ width: 20, height: 20, borderRadius: 10 }} />
                  <span style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>{author.name} · {p.region}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ padding: '8px 16px 4px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>최근 모집글</div>
        </div>
        <div key={filter} className="stagger" style={{ padding: '4px 16px 80px' }}>
          {list.length === 0 ? (
            <div className="anim-fade" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--fg-alternative)', fontSize: 13 }}>
              조건에 맞는 모집글이 없어요
            </div>
          ) : list.map((p) => {
            const author = USERS.find((u) => u.id === p.authorId)!;
            return (
              <Link key={p.id} href={`/sessions/${p.id}`} className="pressable" style={{ padding: '14px 0', borderBottom: '1px solid var(--color-line-soft)', display: 'block' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color:
                      p.freq === '정기' ? 'var(--color-positive)'
                      : p.freq === '단기' ? 'var(--color-informative)'
                      : 'var(--color-accent)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {p.freq}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--fg-assistive)' }}>·</span>
                  <span style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>{p.region}</span>
                  {p.applicants.length > 0 && (
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>
                      지원 {p.applicants.length}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 6, letterSpacing: '-0.01em' }}>
                  {p.title}
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                  {p.positions.map((pos) => (
                    <span key={pos} className="chip" style={{ height: 22, padding: '0 8px', fontSize: 11 }}>모집 {pos}</span>
                  ))}
                  {p.genre.map((g) => (
                    <span key={g} className="chip" style={{ height: 22, padding: '0 8px', fontSize: 11, color: 'var(--fg-alternative)' }}>{g}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--fg-alternative)' }}>
                  <img src={author.avatar} alt={author.name} style={{ width: 18, height: 18, borderRadius: 9 }} />
                  {author.name} · {p.when}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <button type="button" onClick={() => router.push('/perf')} className="fab fab-primary anim-pop-in" aria-label="공연 매칭으로">
        <Icon name="plus" size={22} strokeWidth={2.2} />
      </button>

      <BottomTabBar />
    </>
  );
}
