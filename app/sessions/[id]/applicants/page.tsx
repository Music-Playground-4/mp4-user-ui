'use client';

import { useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingState, ErrorState, EmptyState, LoginRequired } from '@/components/ui/State';
import { useAuth } from '@/lib/auth';
import { useAsync, errorText } from '@/lib/useApi';
import { sessionsApi, displayName, applicantOf, type Application, type Paged, type RecruitPost } from '@/lib/api';

export default function SessionApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { token, status } = useAuth();

  const post = useAsync<RecruitPost>(() => sessionsApi.detail(id, token), [id, token]);
  const list = useAsync<Paged<Application>>(
    token ? () => sessionsApi.applicants(token, id) : null,
    [token, id],
  );

  // 수락/거절 결과를 낙관적으로 반영한다 (목록 전체 재조회 없이)
  const [overrides, setOverrides] = useState<Record<string, Application['status']>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decide = useCallback(
    async (appId: string, next: 'ACCEPTED' | 'REJECTED') => {
      if (!token || busyId) return;
      const prev = overrides[appId];
      setOverrides((o) => ({ ...o, [appId]: next }));
      setBusyId(appId);
      setError(null);
      try {
        await sessionsApi.decide(token, id, appId, next);
      } catch (e) {
        setOverrides((o) => ({ ...o, [appId]: prev ?? 'PENDING' }));
        setError(errorText(e));
      } finally {
        setBusyId(null);
      }
    },
    [token, id, busyId, overrides],
  );

  if (status === 'guest') {
    return (
      <>
        <TopBar title="지원자" />
        <div className="scroll-region"><LoginRequired /></div>
      </>
    );
  }

  const applicants = list.data?.items ?? [];

  return (
    <>
      <TopBar title={`지원자${applicants.length ? ` (${applicants.length})` : ''}`} />

      <div style={{ padding: '10px 16px', background: 'var(--blue-99)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Icon name="spark" size={14} color="var(--color-primary)" strokeWidth={2.2} />
        <div style={{ fontSize: 12, color: 'var(--fg-normal)' }}>
          모집 악기{' '}
          <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
            {post.data?.instruments.join('·') ?? '-'}
          </span>
        </div>
      </div>

      <div className="scroll-region stagger" style={{ padding: '12px 16px 24px' }}>
        {list.loading && <LoadingState rows={3} />}

        {!list.loading && list.error && (
          <ErrorState
            message={list.status === 403 ? '모집글 작성자만 지원자를 볼 수 있어요' : list.error}
            onRetry={list.status === 403 ? undefined : list.reload}
          />
        )}

        {!list.loading && !list.error && applicants.length === 0 && (
          <EmptyState message="아직 지원자가 없어요" hint="모집글을 공유해 보세요." />
        )}

        {error && (
          <div role="alert" style={{ marginBottom: 12, fontSize: 13, color: 'var(--color-negative)' }}>{error}</div>
        )}

        {!list.loading && !list.error && applicants.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {applicants.map((a) => (
              <ApplicantCard
                key={a.id}
                app={a}
                status={overrides[a.id] ?? a.status}
                busy={busyId === a.id}
                onDecide={(s) => decide(a.id, s)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ApplicantCard({
  app,
  status,
  busy,
  onDecide,
}: {
  app: Application;
  status: Application['status'];
  busy: boolean;
  onDecide: (s: 'ACCEPTED' | 'REJECTED') => void;
}) {
  const router = useRouter();
  const u = applicantOf(app);
  const name = displayName(u);
  const decided = status !== 'PENDING';

  return (
    <div style={{ padding: 14, border: '1px solid var(--color-line)', borderRadius: 12, background: '#fff', opacity: status === 'REJECTED' ? 0.6 : 1 }}>
      <button
        type="button"
        onClick={() => u && router.push(`/users/${u.id}`)}
        className="pressable"
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left' }}
      >
        <Avatar src={u?.avatar} name={name} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>{name}</span>
            {status === 'ACCEPTED' && (
              <span className="badge" style={{ background: 'rgba(0,140,48,0.12)', color: 'var(--color-positive)', fontSize: 10 }}>수락됨</span>
            )}
            {status === 'REJECTED' && <span className="badge badge-neutral" style={{ fontSize: 10 }}>거절함</span>}
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 2 }}>
            {[u?.position, u?.region, u?.level].filter(Boolean).join(' · ') || '프로필 정보 없음'}
          </div>
        </div>
        <Icon name="chevR" size={16} color="var(--fg-assistive)" />
      </button>

      {app.message && (
        <div style={{ marginTop: 10, padding: 10, background: 'var(--neutral-99)', borderRadius: 8, fontSize: 12.5, lineHeight: 1.6, color: 'var(--fg-normal)', whiteSpace: 'pre-wrap' }}>
          {app.message}
        </div>
      )}

      {app.portfolio && (
        <a
          href={app.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}
        >
          <Icon name="play" size={12} /> 포트폴리오 보기
        </a>
      )}

      {!decided && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            type="button"
            onClick={() => onDecide('REJECTED')}
            disabled={busy}
            className="btn btn-md btn-outlined"
            style={{ flex: 1 }}
          >
            거절
          </button>
          <button
            type="button"
            onClick={() => onDecide('ACCEPTED')}
            disabled={busy}
            className="btn btn-md btn-primary"
            style={{ flex: 1.5 }}
          >
            수락하기
          </button>
        </div>
      )}
    </div>
  );
}
