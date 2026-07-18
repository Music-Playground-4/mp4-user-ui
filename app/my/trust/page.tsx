'use client';

import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { LoadingState, ErrorState, LoginRequired } from '@/components/ui/State';
import { useAuth } from '@/lib/auth';
import { useAsync } from '@/lib/useApi';
import { usersApi, type TrustScore, type UserProfile } from '@/lib/api';

const R = 62;
const C = 2 * Math.PI * R;

/** 등급 경계 — 백엔드 집계 기준과 맞춘다 */
const NEXT_LEVEL: Record<string, { label: string; at: number } | null> = {
  C: { label: 'B', at: 40 },
  B: { label: 'A', at: 60 },
  A: { label: 'S', at: 80 },
  S: null,
};

export default function TrustPage() {
  const { token, status } = useAuth();

  const profile = useAsync<UserProfile>(token ? () => usersApi.me(token) : null, [token]);
  const myId = profile.data?.id ?? null;
  const trust = useAsync<TrustScore>(myId ? () => usersApi.trust(myId) : null, [myId]);

  if (status === 'guest') {
    return (
      <>
        <TopBar title="신뢰점수" />
        <div className="scroll-region">
          <LoginRequired />
        </div>
      </>
    );
  }

  const loading = profile.loading || trust.loading;
  const error = profile.error ?? trust.error;

  return (
    <>
      <TopBar title="신뢰점수" />
      <div className="scroll-region" style={{ padding: '16px 16px 24px' }}>
        {loading && <LoadingState rows={3} />}

        {!loading && error && (
          <ErrorState
            message={error}
            onRetry={() => {
              profile.reload();
              trust.reload();
            }}
          />
        )}

        {!loading && !error && trust.data && <TrustBody trust={trust.data} />}
      </div>
    </>
  );
}

function TrustBody({ trust }: { trust: TrustScore }) {
  const progress = Math.max(0, Math.min(1, trust.score / 100));
  const next = NEXT_LEVEL[trust.level] ?? null;
  const gap = next ? Math.max(0, next.at - trust.score) : 0;

  const earned = trust.items.filter((i) => i.earned);
  const remaining = trust.items.filter((i) => !i.earned);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0 16px' }}>
        <div style={{ position: 'relative', width: 148, height: 148 }}>
          <svg width="148" height="148" viewBox="0 0 148 148">
            <circle cx="74" cy="74" r={R} fill="none" stroke="var(--neutral-95)" strokeWidth="10" />
            <circle
              cx="74"
              cy="74"
              r={R}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="10"
              strokeDasharray={`${C * progress} ${C}`}
              strokeLinecap="round"
              transform="rotate(-90 74 74)"
              style={{ transition: 'stroke-dasharray var(--dur-slower) var(--ease-out)' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 38, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {trust.score}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 2 }}>Lv.{trust.level}</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-alternative)', marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
          {next ? (
            <>
              <span style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{gap}점</span>만 더 모으면 {next.label}등급이에요
            </>
          ) : (
            <>최고 등급이에요. 계속 활동해 주세요!</>
          )}
        </div>
      </div>

      {/* 배지·내역 모두 서버가 내려주는 items 를 그대로 쓴다 (프론트 하드코딩 금지) */}
      {trust.items.length > 0 && (
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
          {trust.items.map((b) => (
            <div
              key={b.key}
              style={{
                padding: '10px 6px', borderRadius: 10,
                border: '1px solid var(--color-line-soft)',
                background: b.earned ? '#fff' : 'var(--neutral-99)',
                opacity: b.earned ? 1 : 0.55,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 32, height: 32, borderRadius: 16, margin: '0 auto 4px',
                  background: b.earned ? 'rgba(0,102,255,0.12)' : 'var(--neutral-90)',
                  color: b.earned ? 'var(--color-primary)' : 'var(--fg-assistive)',
                  display: 'grid', placeItems: 'center',
                }}
              >
                <Icon name={b.earned ? 'check' : 'star'} size={16} strokeWidth={2.2} />
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, lineHeight: 1.3, color: b.earned ? 'var(--fg-strong)' : 'var(--fg-alternative)' }}>
                {b.label}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>
        점수 내역
        <span style={{ fontWeight: 500, color: 'var(--fg-alternative)', marginLeft: 6 }}>
          {earned.length}/{trust.items.length} 달성
        </span>
      </div>
      <div className="stagger" style={{ background: '#fff', border: '1px solid var(--color-line-soft)', borderRadius: 12, overflow: 'hidden' }}>
        {[...earned, ...remaining].map((d, i, arr) => (
          <div
            key={d.key}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--color-line-soft)' : 'none',
            }}
          >
            <div
              style={{
                width: 22, height: 22, borderRadius: 11,
                background: d.earned ? 'rgba(0,140,48,0.12)' : 'var(--neutral-95)',
                color: d.earned ? 'var(--color-positive)' : 'var(--fg-assistive)',
                display: 'grid', placeItems: 'center',
              }}
            >
              <Icon name="check" size={12} strokeWidth={3} />
            </div>
            <div style={{ flex: 1, fontSize: 13, color: d.earned ? 'var(--fg-strong)' : 'var(--fg-alternative)' }}>{d.label}</div>
            <div
              style={{
                fontSize: 12, fontWeight: 700,
                color: d.earned ? 'var(--color-positive)' : 'var(--fg-assistive)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              +{d.points}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: 'var(--blue-99)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Icon name="info" size={16} color="var(--color-primary)" strokeWidth={2} />
        <div style={{ fontSize: 11.5, color: 'var(--fg-normal)', lineHeight: 1.6, flex: 1 }}>
          <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>S등급 (80점 이상)이 되면?</div>
          합주실 예약 할인, 공연 매칭 우선권, 마켓 수수료 할인 등 다양한 혜택을 받을 수 있어요.
        </div>
      </div>
    </>
  );
}
