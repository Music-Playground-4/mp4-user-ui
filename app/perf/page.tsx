'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { BottomTabBar, TopBar } from '@/components/app/Nav';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/State';
import { useAuth } from '@/lib/auth';
import { useAsync } from '@/lib/useApi';
import { concertsApi, displayName, type RecruitPost, type Paged } from '@/lib/api';
import { POSITIONS } from '@/lib/data';

export default function PerfListPage() {
  return (
    <Suspense fallback={<LoadingState rows={4} />}>
      <PerfList />
    </Suspense>
  );
}

function PerfList() {
  const { token } = useAuth();
  const params = useSearchParams();

  const [tab, setTab] = useState<'find' | 'recruit'>('find');
  const [instrument, setInstrument] = useState<string | null>(params.get('instrument'));
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [debounced, setDebounced] = useState(params.get('q') ?? '');
  const [searchOpen, setSearchOpen] = useState(Boolean(params.get('q')));

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const list = useAsync<Paged<RecruitPost>>(
    () =>
      concertsApi.list(
        { instrument: instrument ?? undefined, q: debounced || undefined, limit: 50 },
        token,
      ),
    [instrument, debounced, token],
  );

  const posts = list.data?.items ?? [];

  return (
    <>
      <TopBar
        title="공연 매칭"
        showBack={false}
        right={
          <button type="button" className="topbar-action" aria-label="검색" onClick={() => setSearchOpen((v) => !v)}>
            <Icon name="search" size={20} />
          </button>
        }
      />

      <div style={{ padding: '8px 16px 12px', background: '#fff', borderBottom: '1px solid var(--color-line-soft)', flexShrink: 0 }}>
        <div style={{ display: 'flex', height: 40, padding: 3, background: 'var(--neutral-95)', borderRadius: 10 }}>
          <button
            type="button"
            onClick={() => setTab('find')}
            style={{
              flex: 1, borderRadius: 8, border: 0, cursor: 'pointer',
              background: tab === 'find' ? '#fff' : 'transparent',
              boxShadow: tab === 'find' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              fontSize: 13, fontWeight: tab === 'find' ? 600 : 500,
              color: tab === 'find' ? 'var(--fg-strong)' : 'var(--fg-alternative)',
            }}
          >
            공연 찾기
          </button>
          <button
            type="button"
            onClick={() => setTab('recruit')}
            style={{
              flex: 1, borderRadius: 8, border: 0, cursor: 'pointer',
              background: tab === 'recruit' ? '#fff' : 'transparent',
              boxShadow: tab === 'recruit' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              fontSize: 13, fontWeight: tab === 'recruit' ? 600 : 500,
              color: tab === 'recruit' ? 'var(--fg-strong)' : 'var(--fg-alternative)',
            }}
          >
            출연자 모집
          </button>
        </div>

        {tab === 'find' && (
          <>
            {searchOpen && (
              <div style={{ height: 40, padding: '0 12px', marginTop: 10, background: 'var(--neutral-95)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="search" size={16} color="var(--fg-alternative)" />
                <input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="공연 모집글 검색"
                  style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--fg-strong)' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', marginRight: -16 }}>
              <button
                type="button"
                onClick={() => setInstrument(null)}
                className={instrument === null ? 'chip chip-active' : 'chip'}
                style={{ height: 30, fontSize: 12, flexShrink: 0 }}
              >
                악기 전체
              </button>
              {POSITIONS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setInstrument((cur) => (cur === p ? null : p))}
                  className={instrument === p ? 'chip chip-active' : 'chip'}
                  style={{ height: 30, fontSize: 12, flexShrink: 0 }}
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {tab === 'recruit' ? (
        <div className="scroll-region" style={{ padding: '12px 16px 80px' }}>
          <div key="recruit" className="anim-fade-up" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--fg-alternative)', fontSize: 13, lineHeight: 1.6 }}>
            출연자를 모집하는 공연 등록은<br />
            곧 지원될 예정이에요
          </div>
        </div>
      ) : (
        <div className="scroll-region" style={{ padding: '12px 16px 80px' }}>
          {list.loading && <LoadingState rows={4} />}

          {!list.loading && list.error && <ErrorState message={list.error} onRetry={list.reload} />}

          {!list.loading && !list.error && posts.length === 0 && (
            <EmptyState
              message={instrument || debounced ? '조건에 맞는 공연 모집글이 없어요' : '아직 공연 모집글이 없어요'}
              hint={instrument || debounced ? '필터를 바꿔 보세요.' : '첫 번째 공연 모집글을 올려 보세요.'}
            />
          )}

          {!list.loading && !list.error && posts.length > 0 && (
            <div key="find" className="stagger">
              {posts.map((p) => (
                <PerfCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      )}

      <BottomTabBar />
    </>
  );
}

function PerfCard({ post }: { post: RecruitPost }) {
  const author = post.author;
  const name = displayName(author);
  const applied = post._count?.applications ?? 0;
  const dateLabel = post.date ? new Date(post.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }) : null;

  return (
    <Link
      href={`/perf/${post.id}`}
      className="pressable card-lift"
      style={{ display: 'block', marginBottom: 14, borderRadius: 12, border: '1px solid var(--color-line)', overflow: 'hidden', background: '#fff' }}
    >
      <div style={{ height: 120, background: 'linear-gradient(135deg, #2b2d42, #4a4e69)', position: 'relative' }}>
        {dateLabel && (
          <div style={{ position: 'absolute', top: 10, left: 10, padding: '4px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 11, fontWeight: 600 }}>
            {dateLabel}
          </div>
        )}
        {post.status !== 'OPEN' && (
          <div style={{ position: 'absolute', top: 10, right: 10, padding: '4px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
            모집마감
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14, color: '#fff', fontSize: 16, fontWeight: 700, lineHeight: 1.35, letterSpacing: '-0.01em' }}>
          {post.title}
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {post.genres.slice(0, 2).map((g) => (
            <span key={g} className="badge badge-accent" style={{ fontSize: 10 }}>{g}</span>
          ))}
          <span className="badge badge-neutral" style={{ fontSize: 10 }}>{post.pay ?? '협의'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar src={author?.avatar} name={name} size={24} />
          <span style={{ fontSize: 12, color: 'var(--fg-alternative)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name} · {post.venue ?? post.location}
          </span>
          <span style={{ fontSize: 11, color: 'var(--fg-alternative)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <Icon name="users" size={12} /> {applied}/{post.recruitCount}
          </span>
        </div>
        {post.instruments.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 10 }}>
            {post.instruments.map((n) => (
              <span key={n} className="chip chip-soft" style={{ height: 22, padding: '0 8px', fontSize: 11 }}>모집 {n}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
