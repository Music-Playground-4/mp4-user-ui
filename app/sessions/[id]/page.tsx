'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { postById, userById, USERS } from '@/lib/data';

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const p = postById(id);
  const [fav, setFav] = useState(false);
  const [followed, setFollowed] = useState(false);

  if (!p) notFound();
  const author = userById(p.authorId);
  if (!author) notFound();

  return (
    <>
      <TopBar
        title="모집글"
        right={
          <>
            <button type="button" onClick={() => setFav(!fav)} className="topbar-action heart-btn" data-on={fav} style={{ color: fav ? 'var(--color-negative)' : 'var(--fg-strong)' }}>
              <span className="heart-icon" style={{ display: 'grid', placeItems: 'center' }}>
                <Icon name={fav ? 'heartFill' : 'heart'} size={20} />
              </span>
            </button>
            <button type="button" className="topbar-action">
              <Icon name="settings" size={20} />
            </button>
          </>
        }
      />

      <div className="scroll-region" style={{ paddingBottom: 80 }}>
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <span className="badge" style={{ background: 'rgba(0,191,64,0.14)', color: '#008C30', fontSize: 10 }}>{p.freq}</span>
            {p.level === '입문환영' && (
              <span className="badge" style={{ background: 'rgba(0,102,255,0.10)', color: 'var(--color-primary)', fontSize: 10 }}>입문환영</span>
            )}
            <span className="badge badge-neutral" style={{ fontSize: 10 }}>모집중 · D-12</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em', lineHeight: 1.4 }}>
            {p.title}
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 8 }}>{p.when} · 조회 234</div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0',
            marginTop: 12,
            borderTop: '1px solid var(--color-line-soft)',
            borderBottom: '1px solid var(--color-line-soft)',
          }}>
            <img src={author.avatar} alt={author.name} style={{ width: 44, height: 44, borderRadius: 22 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>{author.name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>{author.position} · {author.level}</div>
            </div>
            <button
              type="button"
              onClick={() => setFollowed(!followed)}
              style={{
                padding: '0 14px', height: 32, borderRadius: 8,
                border: '1px solid var(--color-line-strong)',
                background: followed ? 'var(--fg-strong)' : '#fff',
                fontSize: 12, fontWeight: 600,
                color: followed ? '#fff' : 'var(--fg-strong)',
                cursor: 'pointer',
              }}
            >
              {followed ? '팔로잉' : '팔로우'}
            </button>
          </div>
        </div>

        <div style={{ padding: '4px 16px 16px' }}>
          <DetailRow label="모집 포지션">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {p.positions.map((pos) => (
                <span key={pos} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                  borderRadius: 6, background: 'var(--blue-99)', color: 'var(--color-primary)',
                  fontSize: 12, fontWeight: 600,
                }}>
                  {pos}
                  <span style={{ color: 'var(--color-primary)', opacity: 0.6 }}>1</span>
                </span>
              ))}
            </div>
          </DetailRow>
          <DetailRow label="장르">{p.genre.join(' · ')}</DetailRow>
          <DetailRow label="지역">{p.region}</DetailRow>
          <DetailRow label="합주 빈도">주 1회 · 토요일 오후</DetailRow>
          <DetailRow label="레벨">{p.level}</DetailRow>
          <DetailRow label="합주실">신촌 라이브하우스(예정) · 회당 인당 12,000원</DetailRow>
        </div>

        <div style={{ padding: '4px 16px 0' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>소개</div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--fg-normal)' }}>
            {p.desc}
            <br /><br />
            지난주 첫 모임을 갖고 멤버를 더 모집합니다. 큰 부담 없이 즐기실 분 환영합니다. 카피곡 위주로 시작하고 익숙해지면 자작도 도전해보고 싶어요.
          </div>
        </div>

        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>현재 멤버 (3 / 5)</div>
            <Link href={`/sessions/${p.id}/applicants`} style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}>
              지원자 보기 →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {USERS.slice(1, 4).map((m) => (
              <div key={m.id} style={{ flex: 1, textAlign: 'center' }}>
                <img src={m.avatar} alt={m.name} style={{ width: 48, height: 48, borderRadius: 24, marginBottom: 4 }} />
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-normal)' }}>{m.position}</div>
                <div style={{ fontSize: 10, color: 'var(--fg-alternative)' }}>{m.name.charAt(0)}OO</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        padding: '10px 16px', borderTop: '1px solid var(--color-line)',
        background: '#fff', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>
          지원 <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 14 }}>{p.applicants.length}</span>명
        </span>
        <Link href={`/sessions/${p.id}/apply`} className="btn btn-md btn-primary" style={{ flex: 1, height: 44, marginLeft: 'auto' }}>
          지원하기
        </Link>
      </div>
    </>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--color-line-soft)', fontSize: 13 }}>
      <div style={{ width: 90, color: 'var(--fg-alternative)' }}>{label}</div>
      <div style={{ flex: 1, color: 'var(--fg-strong)', fontWeight: 500 }}>{children}</div>
    </div>
  );
}
