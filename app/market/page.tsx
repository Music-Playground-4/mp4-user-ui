'use client';

import { Suspense, useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { GradePill } from '@/components/ui/Pills';
import { BottomTabBar } from '@/components/app/Nav';
import { PullToRefresh } from '@/components/app/PullToRefresh';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/State';
import { useAuth } from '@/lib/auth';
import { useAsync } from '@/lib/useApi';
import { marketApi, normalizeImages, type MarketItem, type Paged } from '@/lib/api';
import { CATEGORIES, SORTS, statusLabel, type ItemCategory, type ItemSort } from '@/lib/enums';
import { formatPrice } from '@/lib/data';

const PAGE_SIZE = 20;

export default function MarketListPage() {
  // useSearchParams 는 Suspense 경계가 필요하다 (Next 15 프리렌더 규칙)
  return (
    <Suspense fallback={<LoadingState rows={4} />}>
      <MarketList />
    </Suspense>
  );
}

function MarketList() {
  const { token } = useAuth();
  const params = useSearchParams();

  // 필터 시트에서 넘어온 조건 — URL 을 단일 출처로 삼는다
  const grade = params.get('grade') ?? undefined;
  const condition = params.get('condition') ?? undefined;
  const minPrice = params.get('minPrice') ? Number(params.get('minPrice')) : undefined;
  const maxPrice = params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined;
  const filterCount = [grade, condition, minPrice, maxPrice].filter((v) => v !== undefined).length;

  const [cat, setCat] = useState<ItemCategory | null>((params.get('category') as ItemCategory) || null);
  const [sort, setSort] = useState<ItemSort>((params.get('sort') as ItemSort) || 'latest');
  const [query, setQuery] = useState(params.get('q') ?? '');
  // 입력 즉시 요청하면 타이핑마다 호출되므로 디바운스한 값으로만 조회한다
  const [debouncedQuery, setDebouncedQuery] = useState(params.get('q') ?? '');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const list = useAsync<Paged<MarketItem>>(
    () =>
      marketApi.list(
        {
          category: cat ?? undefined,
          sort,
          q: debouncedQuery || undefined,
          grade,
          condition,
          minPrice,
          maxPrice,
          limit: PAGE_SIZE,
        },
        token,
      ),
    [cat, sort, debouncedQuery, grade, condition, minPrice, maxPrice, token],
  );

  const handleRefresh = useCallback(async () => {
    list.reload();
  }, [list]);

  const items = useMemo(() => list.data?.items ?? [], [list.data]);
  const sortLabel = SORTS.find((s) => s.value === sort)?.label ?? '최신순';

  return (
    <>
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 5,
          background: 'var(--common-0)',
          borderBottom: '1px solid var(--color-line-soft)',
          flexShrink: 0,
        }}
      >
        <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px 0 16px' }}>
          <div style={{ flex: 1, height: 40, padding: '0 12px', background: 'var(--neutral-95)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="search" size={16} color="var(--fg-alternative)" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="장비, 브랜드 검색"
              style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--fg-strong)' }}
            />
          </div>
          <Link href="/chats" className="topbar-action" aria-label="알림">
            <Icon name="bell" size={20} />
          </Link>
        </div>
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', gap: 6, padding: '0 0 12px', overflowX: 'auto', marginRight: -16 }}>
            <button
              type="button"
              onClick={() => setCat(null)}
              className={cat === null ? 'chip chip-active' : 'chip'}
              style={{ flexShrink: 0, height: 32, fontSize: 12 }}
            >
              전체
            </button>
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.value}
                onClick={() => setCat(c.value)}
                className={c.value === cat ? 'chip chip-active' : 'chip'}
                style={{ flexShrink: 0, height: 32, fontSize: 12 }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <PullToRefresh onRefresh={handleRefresh}>
        <div style={{ padding: '12px 16px', display: 'flex', gap: 6, alignItems: 'center', borderBottom: '1px solid var(--color-line-soft)' }}>
          <Link
            href={`/market/filter?${new URLSearchParams({
              ...(cat ? { category: cat } : {}),
              ...(sort !== 'latest' ? { sort } : {}),
              ...(debouncedQuery ? { q: debouncedQuery } : {}),
              ...(grade ? { grade } : {}),
              ...(condition ? { condition } : {}),
              ...(minPrice !== undefined ? { minPrice: String(minPrice) } : {}),
              ...(maxPrice !== undefined ? { maxPrice: String(maxPrice) } : {}),
            }).toString()}`}
            className={filterCount > 0 ? 'chip chip-active' : 'chip'}
            style={{ height: 30, fontSize: 12, gap: 4 }}
          >
            <Icon name="filter" size={12} strokeWidth={2} /> 필터{filterCount > 0 ? ` ${filterCount}` : ''}
          </Link>
          {!list.loading && !list.error && (
            <span style={{ fontSize: 12, color: 'var(--fg-alternative)' }}>{list.data?.total ?? 0}개</span>
          )}
          <div style={{ flex: 1 }} />

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              style={{
                border: 0, background: 'transparent', cursor: 'pointer',
                fontSize: 12, color: 'var(--fg-alternative)',
                display: 'flex', alignItems: 'center', gap: 2,
              }}
            >
              {sortLabel} <Icon name={sortOpen ? 'chevU' : 'chevD'} size={12} />
            </button>
            {sortOpen && (
              <div
                style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 6, zIndex: 10,
                  background: '#fff', border: '1px solid var(--color-line)', borderRadius: 8,
                  overflow: 'hidden', minWidth: 120,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
              >
                {SORTS.map((s) => (
                  <button
                    type="button"
                    key={s.value}
                    onClick={() => {
                      setSort(s.value);
                      setSortOpen(false);
                    }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', border: 0,
                      padding: '10px 12px', fontSize: 13, cursor: 'pointer',
                      background: s.value === sort ? 'var(--blue-99)' : '#fff',
                      color: s.value === sort ? 'var(--color-primary)' : 'var(--fg-strong)',
                      fontWeight: s.value === sort ? 600 : 400,
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', border: '1px solid var(--color-line)', borderRadius: 8, overflow: 'hidden', marginLeft: 8 }}>
            {(['list', 'grid'] as const).map((v) => (
              <button
                type="button"
                key={v}
                onClick={() => setView(v)}
                aria-label={v === 'list' ? '리스트 보기' : '카드 보기'}
                aria-pressed={view === v}
                style={{
                  width: 32, height: 30, border: 0, display: 'grid', placeItems: 'center', cursor: 'pointer',
                  background: view === v ? 'var(--fg-strong)' : '#fff',
                  color: view === v ? '#fff' : 'var(--fg-alternative)',
                }}
              >
                <Icon name={v} size={16} strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>

        {list.loading && <LoadingState rows={4} />}

        {!list.loading && list.error && <ErrorState message={list.error} onRetry={list.reload} />}

        {!list.loading && !list.error && items.length === 0 && (
          <EmptyState
            message={debouncedQuery || cat || filterCount ? '조건에 맞는 장비가 없어요' : '아직 등록된 장비가 없어요'}
            hint={debouncedQuery || cat || filterCount ? '검색어나 필터를 바꿔 보세요.' : '첫 번째로 장비를 올려 보세요.'}
            action={<Link href="/market/sell" className="btn btn-md btn-primary">장비 등록하기</Link>}
          />
        )}

        {!list.loading && !list.error && items.length > 0 && (
          view === 'list' ? (
            <div className="stagger" style={{ padding: '4px 16px 80px' }}>
              {items.map((g) => (
                <ListRow key={g.id} item={g} />
              ))}
            </div>
          ) : (
            <div className="stagger" style={{ padding: '12px 16px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {items.map((g) => (
                <GridCard key={g.id} item={g} />
              ))}
            </div>
          )
        )}
      </PullToRefresh>

      <Link href="/market/sell" className="fab" aria-label="장비 등록">
        <Icon name="plus" size={24} color="#fff" strokeWidth={2.4} />
      </Link>

      <BottomTabBar />
    </>
  );
}

/** 목록 썸네일 — 이미지가 없을 수 있어 배경색으로 폴백한다 */
function Thumb({ url, radius, children }: { url?: string; radius: number; children?: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100%', height: '100%', borderRadius: radius, position: 'relative',
        background: url ? `url(${url}) center/cover` : 'var(--neutral-95)',
      }}
    >
      {children}
    </div>
  );
}

function SoldOverlay({ status, radius }: { status: string; radius: number }) {
  const label = statusLabel(status);
  if (!label) return null;
  return (
    <div
      style={{
        position: 'absolute', inset: 0, borderRadius: radius,
        background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center',
        color: '#fff', fontSize: 13, fontWeight: 700,
      }}
    >
      {label}
    </div>
  );
}

function ListRow({ item }: { item: MarketItem }) {
  const img = normalizeImages(item.images)[0];
  return (
    <Link
      href={`/market/${item.id}`}
      className="pressable"
      style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--color-line-soft)' }}
    >
      <div style={{ position: 'relative', flexShrink: 0, width: 96, height: 96 }}>
        <Thumb url={img} radius={8}>
          {item.grade && (
            <div style={{ position: 'absolute', top: 6, left: 6 }}>
              <GradePill grade={item.grade as 'S' | 'A' | 'B' | 'C'} size="sm" />
            </div>
          )}
          <SoldOverlay status={item.status} radius={8} />
        </Thumb>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.title}
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 2 }}>
            {[item.brand, item.location].filter(Boolean).join(' · ') || '지역 미지정'}
          </div>
          {item.demoSec ? (
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              <span className="chip" style={{ height: 20, padding: '0 6px', fontSize: 10, gap: 2 }}>
                <Icon name="play" size={9} strokeWidth={2} /> 데모 {item.demoSec}초
              </span>
            </div>
          ) : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>{formatPrice(item.price)}</div>
          <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--fg-alternative)' }}>
            <span style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Icon name={item.isFavorited ? 'heartFill' : 'heart'} size={12} /> {item.favCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function GridCard({ item }: { item: MarketItem }) {
  const img = normalizeImages(item.images)[0];
  return (
    <Link href={`/market/${item.id}`} className="pressable" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', marginBottom: 8 }}>
        <Thumb url={img} radius={10}>
          {item.grade && (
            <div style={{ position: 'absolute', top: 6, left: 6 }}>
              <GradePill grade={item.grade as 'S' | 'A' | 'B' | 'C'} size="sm" />
            </div>
          )}
          {item.demoSec ? (
            <span
              className="chip"
              style={{
                position: 'absolute', bottom: 6, left: 6, height: 20, padding: '0 6px',
                fontSize: 10, gap: 2, background: 'rgba(0,0,0,0.55)', color: '#fff', border: 0,
              }}
            >
              <Icon name="play" size={9} strokeWidth={2} color="#fff" /> {item.demoSec}초
            </span>
          ) : null}
          <SoldOverlay status={item.status} radius={10} />
        </Thumb>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.title}
      </div>
      <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 2 }}>
        {[item.brand, item.location].filter(Boolean).join(' · ') || '지역 미지정'}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{formatPrice(item.price)}</div>
        <span style={{ display: 'flex', gap: 2, alignItems: 'center', fontSize: 11, color: 'var(--fg-alternative)' }}>
          <Icon name={item.isFavorited ? 'heartFill' : 'heart'} size={12} /> {item.favCount}
        </span>
      </div>
    </Link>
  );
}
