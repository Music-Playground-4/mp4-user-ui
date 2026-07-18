'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/State';
import { useAsync } from '@/lib/useApi';
import { usersApi, displayName, type UserProfile, type ReviewList, type TrustScore } from '@/lib/api';
import { formatPrice } from '@/lib/data';

/** 공개 프로필에 함께 내려오는 매물 요약 */
interface ItemSummary {
  id: string;
  title: string;
  price: number;
  status?: string;
  images?: string[];
}

export default function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const profile = useAsync<UserProfile>(() => usersApi.byId(id), [id]);
  const reviews = useAsync<ReviewList>(() => usersApi.reviews(id), [id]);
  const trust = useAsync<TrustScore>(() => usersApi.trust(id), [id]);

  // 백엔드가 /api/users/:id 에 name 을 포함하지 않아 nickname 만으로 표시한다.
  // name 이 내려오기 시작하면 두 번째 인자에 넘기면 된다.
  const name = displayName(profile.data);

  if (profile.loading) {
    return (
      <>
        <TopBar title="프로필" />
        <div className="scroll-region">
          <LoadingState rows={3} />
        </div>
      </>
    );
  }

  if (profile.error || !profile.data) {
    return (
      <>
        <TopBar title="프로필" />
        <div className="scroll-region">
          <ErrorState
            message={profile.status === 404 ? '없는 사용자예요' : (profile.error ?? '불러오지 못했어요')}
            onRetry={profile.status === 404 ? undefined : profile.reload}
          />
        </div>
      </>
    );
  }

  const u = profile.data;
  const listings = (u.items ?? []) as ItemSummary[];
  const onSale = listings.filter((g) => g.status !== 'SOLD');
  const avg = reviews.data?.avgRating ?? 0;

  return (
    <>
      <TopBar title={name} />

      <div className="scroll-region">
        <div style={{ padding: '8px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar src={u.avatar} name={name} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.01em' }}>{name}</div>
                {trust.data && (
                  <span
                    className="badge"
                    style={{ background: 'rgba(0,102,255,0.10)', color: 'var(--color-primary)', fontSize: 10 }}
                  >
                    신뢰 Lv.{trust.data.level}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-alternative)' }}>
                {[u.position, u.region].filter(Boolean).join(' · ') || '프로필 정보가 없어요'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 1 }}>
                {[u.level, u.genres.join(' · ')].filter(Boolean).join(' · ')}
              </div>
            </div>
            {avg > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 14, fontWeight: 700, color: 'var(--color-primary)' }}>
                {avg.toFixed(1)} ★
              </div>
            )}
          </div>

          {u.bio && <div style={{ marginTop: 14, fontSize: 13, lineHeight: 1.6, color: 'var(--fg-normal)' }}>{u.bio}</div>}

          <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
            <Stat n={String(u._count?.items ?? listings.length)} l="장터 매물" />
            <Stat n={String(u._count?.reviewsReceived ?? reviews.data?.total ?? 0)} l="받은 후기" />
            <Stat n={avg > 0 ? avg.toFixed(1) : '-'} l="평점" />
            <Stat n={trust.data ? String(trust.data.score) : '-'} l="신뢰점수" />
          </div>
        </div>

        <div style={{ height: 8, background: 'var(--neutral-99)' }} />

        <div style={{ padding: '16px 16px 8px', fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>
          판매 중인 장비 {onSale.length > 0 && `(${onSale.length})`}
        </div>

        {onSale.length > 0 ? (
          <div style={{ padding: '8px 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {onSale.map((g) => (
              <Link key={g.id} href={`/market/${g.id}`}>
                <div
                  style={{
                    width: '100%', aspectRatio: '1 / 1', borderRadius: 8, marginBottom: 6, position: 'relative',
                    background: g.images?.[0] ? `url(${g.images[0]}) center/cover` : 'var(--neutral-95)',
                  }}
                />
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-normal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {g.title}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 2 }}>{formatPrice(g.price)}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ padding: '8px 16px 16px' }}>
            <EmptyState message="판매 중인 장비가 없어요" />
          </div>
        )}

        <div style={{ height: 8, background: 'var(--neutral-99)' }} />

        <div style={{ padding: '16px 16px 8px', fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>
          받은 후기 {(reviews.data?.total ?? 0) > 0 && `(${reviews.data?.total})`}
        </div>
        <Reviews state={reviews} />
      </div>

      <div
        style={{
          padding: '10px 16px', borderTop: '1px solid var(--color-line)',
          background: '#fff', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0,
        }}
      >
        <button type="button" className="btn btn-md btn-outlined" style={{ flex: 1, height: 44 }}>
          팔로우
        </button>
        <button
          type="button"
          onClick={() => router.push('/chats')}
          className="btn btn-md btn-primary"
          style={{ flex: 1.5, height: 44 }}
        >
          채팅하기
        </button>
      </div>
    </>
  );
}

function Reviews({ state }: { state: ReturnType<typeof useAsync<ReviewList>> }) {
  if (state.loading) return <LoadingState rows={2} />;
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;

  const items = state.data?.items ?? [];
  if (items.length === 0) {
    return (
      <div style={{ padding: '8px 16px 96px' }}>
        <EmptyState message="아직 받은 후기가 없어요" />
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 16px 96px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((r) => (
        <div key={r.id} style={{ padding: 12, border: '1px solid var(--color-line-soft)', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Avatar src={r.reviewer?.avatar} name={displayName(r.reviewer ?? null)} size={28} />
            <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: 'var(--fg-strong)' }}>
              {displayName(r.reviewer ?? null)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>
              <Icon name="star" size={12} strokeWidth={2.4} />
              {r.rating}
            </div>
          </div>
          {r.content && <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fg-normal)' }}>{r.content}</div>}
        </div>
      ))}
    </div>
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
