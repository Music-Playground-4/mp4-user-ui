'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { showById } from '@/lib/data';

export default function PerfDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const s = showById(id);
  const [fav, setFav] = useState(false);

  if (!s) notFound();

  return (
    <>
      <TopBar
        title="공연"
        right={
          <button type="button" onClick={() => setFav(!fav)} className="topbar-action heart-btn" data-on={fav} style={{ color: fav ? 'var(--color-negative)' : 'var(--fg-strong)' }}>
            <span className="heart-icon" style={{ display: 'grid', placeItems: 'center' }}>
              <Icon name={fav ? 'heartFill' : 'heart'} size={20} />
            </span>
          </button>
        }
      />

      <div className="scroll-region" style={{ paddingBottom: 80 }}>
        <div style={{ height: 200, background: `url(${s.img}) center/cover`, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.7), transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, color: '#fff' }}>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {s.date}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em' }}>
              {s.title}
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 16px' }}>
          <DetailRow label="장소" v={s.venue ?? s.host} />
          <DetailRow label="공연시간" v="40분 · 무대당" />
          <DetailRow label="페이" v={s.pay} />
          <DetailRow label="모집" v={`${s.need.length}팀 (현재 1팀 확정)`} />
          <DetailRow label="합주실" v="현장 사운드체크 60분 제공" />
        </div>

        {s.preferGenres && (
          <div style={{ padding: '4px 16px 0' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>선호 장르</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {s.preferGenres.map((g) => (
                <span key={g} className="chip" style={{ height: 28, fontSize: 12 }}>{g}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>확정 라인업</div>
            <Link href={`/perf/${s.id}/lineup`} style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}>
              전체 보기 →
            </Link>
          </div>
          <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--color-line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>OPEN ACT · The Volunteers</div>
              <span className="badge badge-positive" style={{ fontSize: 10 }}>확정</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-alternative)' }}>4인 풀밴드 · 30분 셋</div>
          </div>
          <Link href={`/perf/${s.id}/auto-team`} className="pressable" style={{
            display: 'block', marginTop: 8, padding: 14, borderRadius: 10,
            border: '1.5px dashed var(--color-line-strong)',
            background: 'var(--neutral-99)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-alternative)', marginBottom: 4 }}>2번째 무대 · 모집중</div>
            <div style={{ fontSize: 12, color: 'var(--fg-alternative)' }}>솔로 4명 자동 매칭 진행중 (3/4) →</div>
          </Link>
        </div>

        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 10 }}>주최자</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--cool-neutral-5)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
              {s.host.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>{s.host}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>주최 18회 · 평점 4.8</div>
            </div>
          </div>
        </div>

        {s.intro && (
          <div style={{ padding: '20px 16px 0' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>소개</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--fg-normal)' }}>{s.intro}</div>
          </div>
        )}
      </div>

      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-line)', background: '#fff', display: 'flex', gap: 8, flexShrink: 0 }}>
        <Link href={`/perf/${s.id}/apply`} className="btn btn-md btn-outlined" style={{ flex: 1, height: 44 }}>팀으로 지원</Link>
        <Link href={`/perf/${s.id}/auto-team`} className="btn btn-md btn-primary" style={{ flex: 1.4, height: 44 }}>솔로 자동매칭</Link>
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
