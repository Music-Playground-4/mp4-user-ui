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
import { sessionsApi, displayName, type RecruitPost } from '@/lib/api';
import { freqLabel, recruitLevelLabel } from '@/lib/enums';

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { token, user } = useAuth();

  const detail = useAsync<RecruitPost>(() => sessionsApi.detail(id, token), [id, token]);

  if (detail.loading) {
    return (
      <>
        <TopBar title="합주 모집" />
        <div className="scroll-region"><LoadingState rows={3} /></div>
      </>
    );
  }

  if (detail.error || !detail.data) {
    return (
      <>
        <TopBar title="합주 모집" />
        <div className="scroll-region">
          <ErrorState
            message={detail.status === 404 ? '삭제되었거나 없는 모집글이에요' : (detail.error ?? '불러오지 못했어요')}
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
  const fLabel = freqLabel(p.freq);
  const lLabel = recruitLevelLabel(p.level);

  return (
    <>
      <TopBar title="합주 모집" />

      <div className="scroll-region" style={{ paddingBottom: 80 }}>
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {fLabel && <span className="badge badge-info" style={{ fontSize: 10 }}>{fLabel}</span>}
            {lLabel && (
              <span className="badge" style={{ background: 'rgba(0,102,255,0.10)', color: 'var(--color-primary)', fontSize: 10 }}>
                {lLabel}
              </span>
            )}
            {closed && <span className="badge badge-neutral" style={{ fontSize: 10 }}>모집마감</span>}
          </div>

          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
            {p.title}
          </div>

          <button
            type="button"
            onClick={() => author && router.push(`/users/${author.id}`)}
            className="pressable"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, marginTop: 14,
              background: 'transparent', border: 0, padding: '4px 0', cursor: 'pointer', textAlign: 'left',
            }}
            aria-label={`${name} 프로필 보기`}
          >
            <Avatar src={author?.avatar} name={name} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>{name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>{p.location}</div>
            </div>
            <Icon name="chevR" size={16} color="var(--fg-assistive)" />
          </button>
        </div>

        <div style={{ height: 1, background: 'var(--color-line-soft)', margin: '16px 0' }} />

        <div style={{ padding: '0 16px' }}>
          <InfoRow icon="users" label="모집 악기" value={p.instruments.join(' · ') || '-'} />
          <InfoRow icon="music" label="장르" value={p.genres.join(' · ') || '-'} />
          <InfoRow icon="pin" label="지역" value={p.location} />
          <InfoRow icon="tag" label="비용" value={p.pay ?? '협의'} />
          <InfoRow icon="user" label="모집 인원" value={`${applied} / ${p.recruitCount}명 지원`} />
          {p.deadline && (
            <InfoRow icon="bell" label="마감" value={new Date(p.deadline).toLocaleDateString('ko-KR')} />
          )}
        </div>

        <div style={{ height: 1, background: 'var(--color-line-soft)', margin: '16px 0' }} />

        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>모집 내용</div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--fg-normal)', whiteSpace: 'pre-wrap' }}>
            {p.description}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '10px 16px', borderTop: '1px solid var(--color-line)',
          background: '#fff', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0,
        }}
      >
        {isMine ? (
          <Link href={`/sessions/${p.id}/applicants`} className="btn btn-md btn-primary" style={{ flex: 1, height: 44 }}>
            지원자 보기 ({applied})
          </Link>
        ) : (
          <>
            <Link href={`/sessions/${p.id}/chat`} className="btn btn-md btn-outlined" style={{ flex: 1, height: 44 }}>
              팀 채팅
            </Link>
            <button
              type="button"
              onClick={() => router.push(token ? `/sessions/${p.id}/apply` : '/login')}
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

function InfoRow({ icon, label, value }: { icon: 'users' | 'music' | 'pin' | 'tag' | 'user' | 'bell'; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
      <Icon name={icon} size={16} color="var(--fg-assistive)" strokeWidth={1.8} />
      <div style={{ fontSize: 12, color: 'var(--fg-alternative)', width: 72, flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--fg-strong)', fontWeight: 500, flex: 1 }}>{value}</div>
    </div>
  );
}
