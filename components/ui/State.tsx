'use client';

// 로딩 / 에러 / 빈 상태 — API 연동 화면 전반에서 반복되는 표시를 통일합니다.

import { Icon } from '@/components/ui/Icon';

/** 목록·카드 자리를 잡아주는 스켈레톤 한 줄 */
export function Skeleton({ height = 16, width = '100%', radius = 6 }: {
  height?: number | string;
  width?: number | string;
  radius?: number;
}) {
  return (
    <div
      style={{
        height, width, borderRadius: radius,
        background: 'var(--neutral-95)',
        animation: 'skeleton-pulse 1.2s var(--ease-in-out) infinite',
      }}
    />
  );
}

/** 화면 전체 로딩. 목록형 화면에서 카드 자리를 미리 잡아 레이아웃 점프를 줄입니다. */
export function LoadingState({ rows = 3, label }: { rows?: number; label?: string }) {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }} aria-busy="true" aria-label={label ?? '불러오는 중'}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton width={64} height={64} radius={8} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton height={14} width="70%" />
            <Skeleton height={12} width="45%" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 조회 실패. 재시도 가능하면 onRetry 를 넘깁니다. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }} role="alert">
      <div style={{
        width: 44, height: 44, borderRadius: 22, margin: '0 auto 12px',
        background: 'rgba(255,66,66,0.10)', color: 'var(--color-negative)',
        display: 'grid', placeItems: 'center',
      }}>
        <Icon name="info" size={22} strokeWidth={2} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 4 }}>
        불러오지 못했어요
      </div>
      <div style={{ fontSize: 13, color: 'var(--fg-alternative)', lineHeight: 1.5 }}>{message}</div>
      {onRetry && (
        <button type="button" className="btn btn-md btn-outlined" style={{ marginTop: 16 }} onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}

/** 정상 조회했지만 결과가 0건 */
export function EmptyState({ message, hint, action }: {
  message: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 4 }}>{message}</div>
      {hint && <div style={{ fontSize: 13, color: 'var(--fg-alternative)', lineHeight: 1.5 }}>{hint}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

/** 로그인이 필요한 화면 */
export function LoginRequired({ message = '로그인이 필요해요' }: { message?: string }) {
  return (
    <EmptyState
      message={message}
      hint="로그인하면 내 활동을 확인할 수 있어요."
      action={<a href="/login" className="btn btn-md btn-primary">로그인하기</a>}
    />
  );
}
