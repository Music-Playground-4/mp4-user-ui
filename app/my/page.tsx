'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { BottomTabBar, TopBar } from '@/components/app/Nav';
import { LoadingState, ErrorState, EmptyState, LoginRequired } from '@/components/ui/State';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/lib/auth';
import { useAsync } from '@/lib/useApi';
import { usersApi, displayName, type UserProfile, type TrustScore } from '@/lib/api';
import { formatPrice } from '@/lib/data';

const TABS = ['내 장터', '내 모집', '일정', '지난활동'];

export default function MyProfilePage() {
  const { user, token, status } = useAuth();
  const [tab, setTab] = useState(TABS[0]);

  const profile = useAsync<UserProfile>(token ? () => usersApi.me(token) : null, [token]);

  // 신뢰점수는 프로필 id 가 확정된 뒤에 조회한다
  const myId = profile.data?.id ?? null;
  const trust = useAsync<TrustScore>(myId ? () => usersApi.trust(myId) : null, [myId]);

  const reloadAll = useCallback(() => {
    profile.reload();
    trust.reload();
  }, [profile, trust]);

  const header = (
    <TopBar
      title="마이페이지"
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
  );

  if (status === 'guest') {
    return (
      <>
        {header}
        <div className="scroll-region">
          <LoginRequired />
        </div>
        <BottomTabBar />
      </>
    );
  }

  return (
    <>
      {header}

      <div className="scroll-region">
        {profile.loading && <LoadingState rows={2} />}

        {!profile.loading && profile.error && (
          <ErrorState message={profile.error} onRetry={reloadAll} />
        )}

        {!profile.loading && !profile.error && profile.data && (
          <>
            <div style={{ padding: '8px 16px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Avatar src={profile.data.avatar} name={displayName(profile.data, user?.name)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.01em' }}>
                      {displayName(profile.data, user?.name)}
                    </div>
                    {profile.data.phoneVerified && (
                      <span className="badge" style={{ background: 'rgba(0,102,255,0.10)', color: 'var(--color-primary)', fontSize: 10 }}>
                        본인인증
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-alternative)' }}>
                    {[profile.data.position, profile.data.region].filter(Boolean).join(' · ') || '프로필을 완성해 주세요'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 1 }}>
                    {[profile.data.level, profile.data.genres.join(' · ')].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <Link href="/profile-setup" className="btn btn-sm btn-outlined" style={{ flexShrink: 0 }}>
                  편집
                </Link>
              </div>

              <TrustCard trust={trust.data} loading={trust.loading} />

              <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
                <Stat n={profile.data._count?.items ?? 0} l="장터 매물" />
                <Stat n={profile.data._count?.sessionPosts ?? 0} l="합주 모집" />
                <Stat n={profile.data._count?.concertPosts ?? 0} l="공연 모집" />
                <Stat n={profile.data._count?.reviewsReceived ?? 0} l="받은 후기" />
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

            {tab === '내 장터' ? (
              <MyItems id={profile.data.id} />
            ) : (
              <div style={{ padding: '40px 16px 80px' }}>
                <EmptyState message={`${tab} 데이터가 없어요`} />
              </div>
            )}
          </>
        )}
      </div>

      <BottomTabBar />
    </>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return (
    <div style={{ flex: 1, padding: '10px 6px', background: 'var(--neutral-99)', borderRadius: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', fontVariantNumeric: 'tabular-nums' }}>{n}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 1 }}>{l}</div>
    </div>
  );
}

/** 신뢰점수 요약 카드. 점수·등급은 서버 집계값을 그대로 쓴다. */
function TrustCard({ trust, loading }: { trust: TrustScore | null; loading: boolean }) {
  const score = trust?.score ?? 0;
  const level = trust?.level ?? 'C';
  // 다음 등급까지 남은 점수 (S 80 / A 60 기준)
  const nextGap = score >= 80 ? 0 : score >= 60 ? 80 - score : 60 - score;

  return (
    <Link
      href="/my/trust"
      className="pressable"
      style={{
        display: 'block', marginTop: 14, padding: 14, borderRadius: 12,
        background: 'linear-gradient(135deg, var(--blue-50), var(--blue-30))',
        color: '#fff', textDecoration: 'none',
        opacity: loading ? 0.6 : 1,
        transition: 'opacity var(--dur-fast) var(--ease-out)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, letterSpacing: '0.04em', marginBottom: 4 }}>신뢰점수</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {score}
            <span style={{ fontSize: 14, opacity: 0.7, fontWeight: 600 }}>/100</span>
          </div>
          <div style={{ fontSize: 11, marginTop: 4, opacity: 0.85 }}>
            Lv.{level}
            {nextGap > 0 && ` · ${nextGap}점 더 모으면 등급이 올라가요`}
          </div>
        </div>
        <Icon name="chevR" size={18} color="rgba(255,255,255,0.7)" />
      </div>
      <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: '#fff', borderRadius: 3, transition: 'width var(--dur-slow) var(--ease-out)' }} />
      </div>
    </Link>
  );
}

/** 공개 프로필 API 가 함께 내려주는 매물 요약 */
interface MarketItemSummary {
  id: string;
  title: string;
  price: number;
  status?: string;
  images?: string[];
}

/** 내가 등록한 매물 목록 */
function MyItems({ id }: { id: string }) {
  const { data, loading, error, reload } = useAsync<UserProfile>(() => usersApi.byId(id), [id]);

  if (loading) return <LoadingState rows={2} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const items = (data?.items ?? []) as MarketItemSummary[];

  if (items.length === 0) {
    return (
      <div style={{ padding: '40px 16px 80px' }}>
        <EmptyState
          message="등록한 매물이 없어요"
          hint="쓰지 않는 장비를 올려 보세요."
          action={<Link href="/market/sell" className="btn btn-md btn-primary">장비 등록하기</Link>}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 16px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {items.map((g) => (
        <Link key={g.id} href={`/market/${g.id}`}>
          <div
            style={{
              width: '100%', aspectRatio: '1 / 1', borderRadius: 8, marginBottom: 6, position: 'relative',
              background: g.images?.[0] ? `url(${g.images[0]}) center/cover` : 'var(--neutral-95)',
            }}
          >
            {g.status === 'SOLD' && (
              <div
                style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                  display: 'grid', placeItems: 'center', borderRadius: 8,
                  color: '#fff', fontSize: 13, fontWeight: 700,
                }}
              >
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
  );
}
