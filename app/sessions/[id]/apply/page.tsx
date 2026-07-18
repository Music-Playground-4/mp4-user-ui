'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { Spinner } from '@/components/ui/AuthForm';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingState, ErrorState, LoginRequired } from '@/components/ui/State';
import { useAuth } from '@/lib/auth';
import { useAsync, errorText } from '@/lib/useApi';
import { sessionsApi, usersApi, displayName, type RecruitPost, type UserProfile } from '@/lib/api';

export default function SessionApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { token, user, status } = useAuth();

  const post = useAsync<RecruitPost>(() => sessionsApi.detail(id, token), [id, token]);
  const profile = useAsync<UserProfile>(token ? () => usersApi.me(token) : null, [token]);

  const [message, setMessage] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!token || !message.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await sessionsApi.apply(token, id, {
        message: message.trim(),
        ...(portfolio.trim() ? { portfolio: portfolio.trim() } : {}),
      });
      router.push(`/sessions/${id}`);
    } catch (e) {
      setError(errorText(e));
      setSubmitting(false);
    }
  };

  if (status === 'guest') {
    return (
      <>
        <TopBar title="지원하기" />
        <div className="scroll-region"><LoginRequired message="로그인 후 지원할 수 있어요" /></div>
      </>
    );
  }

  if (post.loading) {
    return (
      <>
        <TopBar title="지원하기" />
        <div className="scroll-region"><LoadingState rows={2} /></div>
      </>
    );
  }

  if (post.error || !post.data) {
    return (
      <>
        <TopBar title="지원하기" />
        <div className="scroll-region">
          <ErrorState message={post.error ?? '모집글을 불러오지 못했어요'} onRetry={post.reload} />
        </div>
      </>
    );
  }

  const p = post.data;
  const me = profile.data;
  const myName = displayName(me ?? null, user?.name);

  return (
    <>
      <TopBar title="지원하기" />
      <div className="scroll-region" style={{ padding: '16px 16px 16px' }}>
        <div style={{ padding: 12, borderRadius: 10, background: 'var(--neutral-99)', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginBottom: 2 }}>지원하는 모집글</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>{p.title}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 4 }}>
            모집 악기 {p.instruments.join(' · ')} · {p.location}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>
            자기 소개 <span style={{ color: 'var(--color-negative)' }}>*</span>
          </div>
          <textarea
            className="field"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            placeholder="연주 경력, 가능한 시간대, 어떤 합주를 원하는지 적어 주세요."
            style={{ minHeight: 120, lineHeight: 1.6 }}
          />
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', textAlign: 'right', marginTop: 4 }}>
            {message.length} / 500
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>
            포트폴리오 링크 <span style={{ fontWeight: 400, color: 'var(--fg-alternative)' }}>(선택)</span>
          </div>
          <input
            className="field"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            placeholder="유튜브·사운드클라우드 연주 영상 링크"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>내 프로필</div>
          <div style={{ padding: 14, border: '1px solid var(--color-line)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar src={me?.avatar} name={myName} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>{myName}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>
                  {[me?.position, me?.region, me?.level].filter(Boolean).join(' · ') || '프로필이 비어 있어요'}
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 12, padding: '10px 12px', background: 'var(--blue-99)', borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <Icon name="info" size={16} color="var(--color-primary)" strokeWidth={2} />
              <div style={{ flex: 1, fontSize: 12, color: 'var(--fg-strong)' }}>
                프로필이 작성자에게 함께 전달돼요.
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" style={{ fontSize: 13, color: 'var(--color-negative)' }}>{error}</div>
        )}
      </div>

      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-line)', background: '#fff', flexShrink: 0 }}>
        <button
          type="button"
          onClick={submit}
          disabled={!message.trim() || submitting}
          className="btn btn-lg btn-primary"
          style={{ width: '100%' }}
        >
          {submitting ? <Spinner /> : '지원 보내기'}
        </button>
      </div>
    </>
  );
}
