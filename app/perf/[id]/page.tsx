'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingState, ErrorState } from '@/components/ui/State';
import { useAuth } from '@/lib/auth';
import { useAsync } from '@/lib/useApi';
import { concertsApi, displayName, type RecruitPost } from '@/lib/api';

export default function PerfDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { token, user } = useAuth();

  const detail = useAsync<RecruitPost>(() => concertsApi.detail(id, token), [id, token]);

  if (detail.loading) {
    return (
      <>
        <TopBar title="공연" />
        <div className="scroll-region"><LoadingState rows={3} /></div>
      </>
    );
  }

  if (detail.error || !detail.data) {
    return (
      <>
        <TopBar title="공연" />
        <div className="scroll-region">
          <ErrorState
            message={detail.status === 404 ? '삭제되었거나 없는 공연이에요' : (detail.error ?? '불러오지 못했어요')}
            onRetry={detail.status === 404 ? undefined : detail.reload}
          />
        </div>
      </>
    );
  }

  const p = detail.data;
  const author = p.author;
  const name = displayName(author);
  const isMine = user?.id === author?.id;
  const closed = p.status !== 'OPEN';
  const applied = p._count?.applications ?? 0;
  const dateLabel = p.date ? new Date(p.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }) : null;

  return (
    <>
      <TopBar title="공연" />

      <div className="scroll-region" style={{ paddingBottom: 80 }}>
        <div style={{ height: 200, background: 'linear-gradient(135deg, #2b2d42, #4a4e69)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.7), transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, color: '#fff' }}>
            {dateLabel && (
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {dateLabel}
              </div>
            )}
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em' }}>
              {p.title}
            </div>
          </div>
          {closed && (
            <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
              모집마감
            </div>
          )}
        </div>

        <div style={{ padding: '14px 16px' }}>
          <DetailRow label="장소" v={p.venue ?? p.location} />
          <DetailRow label="지역" v={p.location} />
          <DetailRow label="페이" v={p.pay ?? '협의'} />
          <DetailRow label="모집 악기" v={p.instruments.join(' · ') || '-'} />
          <DetailRow label="모집 인원" v={`${applied} / ${p.recruitCount}명 지원`} />
        </div>

        {p.genres.length > 0 && (
          <div style={{ padding: '4px 16px 0' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>선호 장르</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {p.genres.map((g) => (
                <span key={g} className="chip" style={{ height: 28, fontSize: 12 }}>{g}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 10 }}>주최자</div>
          <button
            type="button"
            onClick={() => author && router.push(`/users/${author.id}`)}
            className="pressable"
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left' }}
            aria-label={`${name} 프로필 보기`}
          >
            <Avatar src={author?.avatar} name={name} size={44} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>{name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>{p.location}</div>
            </div>
            <Icon name="chevR" size={16} color="var(--fg-assistive)" />
          </button>
        </div>

        {p.description && (
          <div style={{ padding: '20px 16px 0' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>소개</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--fg-normal)', whiteSpace: 'pre-wrap' }}>{p.description}</div>
          </div>
        )}
      </div>

      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-line)', background: '#fff', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        {isMine ? (
          <Link href={`/perf/${p.id}/applicants`} className="btn btn-md btn-primary" style={{ flex: 1, height: 44 }}>
            지원자 보기 ({applied})
          </Link>
        ) : (
          <>
            <Link href={`/perf/${p.id}/chat`} className="btn btn-md btn-outlined" style={{ flex: 1, height: 44 }}>
              팀 채팅
            </Link>
            <button
              type="button"
              onClick={() => router.push(token ? `/perf/${p.id}/apply` : '/login')}
              disabled={closed}
              className="btn btn-md btn-primary"
              style={{ flex: 1.5, height: 44 }}
            >
              {closed ? '모집 마감' : '지원하기'}
            </button>
          </>
        )}
      </div>
    </>
  );
}

function DetailRow({ label, v }: { label: string; v: string }) {
  return (
    <div style={{ display: 'flex', padding: '8px 0', fontSize: 13 }}>
      <div style={{ width: 80, color: 'var(--fg-alternative)' }}>{label}</div>
      <div style={{ flex: 1, color: 'var(--fg-strong)', fontWeight: 500 }}>{v}</div>
    </div>
  );
}
