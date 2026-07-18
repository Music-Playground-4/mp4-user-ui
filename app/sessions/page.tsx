'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { BottomTabBar, TopBar } from '@/components/app/Nav';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/State';
import { useAuth } from '@/lib/auth';
import { useAsync } from '@/lib/useApi';
import { sessionsApi, displayName, type RecruitPost, type Paged } from '@/lib/api';
import { FREQUENCIES, freqLabel, recruitLevelLabel, type Frequency } from '@/lib/enums';
import { POSITIONS } from '@/lib/data';

export default function SessionsListPage() {
  return (
    <Suspense fallback={<LoadingState rows={4} />}>
      <SessionsList />
    </Suspense>
  );
}

function SessionsList() {
  const { token } = useAuth();
  const params = useSearchParams();

  // 악기(instrument)는 서버가 지원하는 필터라 쿼리로 보낸다
  const [instrument, setInstrument] = useState<string | null>(params.get('instrument'));
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [debounced, setDebounced] = useState(params.get('q') ?? '');
  // freq 는 서버 필터 파라미터가 없어 받아온 목록에서 걸러낸다
  const [freq, setFreq] = useState<Frequency | null>(null);
  const [searchOpen, setSearchOpen] = useState(Boolean(params.get('q')));

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const list = useAsync<Paged<RecruitPost>>(
    () =>
      sessionsApi.list(
        { instrument: instrument ?? undefined, q: debounced || undefined, limit: 50 },
        token,
      ),
    [instrument, debounced, token],
  );

  const posts = useMemo(() => {
    const all = list.data?.items ?? [];
    return freq ? all.filter((p) => p.freq === freq) : all;
  }, [list.data, freq]);

  return (
    <>
      <TopBar
        title="합주 매칭"
        showBack={false}
        right={
          <button type="button" className="topbar-action" aria-label="검색" onClick={() => setSearchOpen((v) => !v)}>
            <Icon name="search" size={20} />
          </button>
        }
      />

      <div style={{ padding: '10px 16px 0', background: '#fff', borderBottom: '1px solid var(--color-line-soft)', flexShrink: 0 }}>
        {searchOpen && (
          <div style={{ height: 40, padding: '0 12px', marginBottom: 10, background: 'var(--neutral-95)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="search" size={16} color="var(--fg-alternative)" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="모집글 검색"
              style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--fg-strong)' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, paddingBottom: 10, overflowX: 'auto', marginRight: -16 }}>
          <button
            type="button"
            onClick={() => setFreq(null)}
            className={freq === null ? 'chip chip-active' : 'chip'}
            style={{ height: 32, fontSize: 12, flexShrink: 0 }}
          >
            전체
          </button>
          {FREQUENCIES.map((f) => (
            <button
              type="button"
              key={f.value}
              onClick={() => setFreq(f.value)}
              className={freq === f.value ? 'chip chip-active' : 'chip'}
              style={{ height: 32, fontSize: 12, gap: 4, flexShrink: 0 }}
            >
              {f.value === 'REGULAR' && (
                <span style={{ width: 8, height: 8, borderRadius: 4, background: freq === f.value ? '#fff' : 'var(--color-positive)' }} />
              )}
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, paddingBottom: 10, overflowX: 'auto', marginRight: -16 }}>
          <button
            type="button"
            onClick={() => setInstrument(null)}
            className={instrument === null ? 'chip chip-active' : 'chip'}
            style={{ height: 28, fontSize: 11, flexShrink: 0 }}
          >
            악기 전체
          </button>
          {POSITIONS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setInstrument((cur) => (cur === p ? null : p))}
              className={instrument === p ? 'chip chip-active' : 'chip'}
              style={{ height: 28, fontSize: 11, flexShrink: 0 }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-region">
        {list.loading && <LoadingState rows={4} />}

        {!list.loading && list.error && <ErrorState message={list.error} onRetry={list.reload} />}

        {!list.loading && !list.error && posts.length === 0 && (
          <EmptyState
            message={freq || instrument || debounced ? '조건에 맞는 모집글이 없어요' : '아직 모집글이 없어요'}
            hint={freq || instrument || debounced ? '필터를 바꿔 보세요.' : '첫 번째 합주 모집글을 올려 보세요.'}
          />
        )}

        {!list.loading && !list.error && posts.length > 0 && (
          <div className="stagger" style={{ padding: '8px 16px 80px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>

      <BottomTabBar />
    </>
  );
}

function PostCard({ post }: { post: RecruitPost }) {
  const author = post.author;
  const name = displayName(author);
  const fLabel = freqLabel(post.freq);
  const lLabel = recruitLevelLabel(post.level);
  const applied = post._count?.applications ?? 0;

  return (
    <Link
      href={`/sessions/${post.id}`}
      className="pressable card-lift"
      style={{ display: 'block', padding: 14, borderRadius: 12, border: '1px solid var(--color-line)', background: '#fff' }}
    >
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        {fLabel && <span className="badge badge-info" style={{ fontSize: 10 }}>{fLabel}</span>}
        {lLabel === '입문환영' && (
          <span className="badge" style={{ background: 'rgba(0,102,255,0.10)', color: 'var(--color-primary)', fontSize: 10 }}>
            입문환영
          </span>
        )}
        {post.status === 'CLOSED' && <span className="badge badge-neutral" style={{ fontSize: 10 }}>모집마감</span>}
      </div>

      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8, lineHeight: 1.4 }}>
        {post.title}
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        {post.instruments.map((ins) => (
          <span key={ins} className="chip" style={{ height: 22, padding: '0 8px', fontSize: 11 }}>
            {ins}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar src={author?.avatar} name={name} size={24} />
        <span style={{ fontSize: 12, color: 'var(--fg-alternative)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name} · {post.location}
        </span>
        <span style={{ fontSize: 11, color: 'var(--fg-alternative)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
          <Icon name="users" size={12} /> {applied}/{post.recruitCount}
        </span>
      </div>
    </Link>
  );
}
