'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { showById } from '@/lib/data';

type LineupStatus = '확정' | '매칭중' | '모집중';

interface LineupBlock {
  time: string;
  stage: string;
  team: string;
  members: number | string;
  status: LineupStatus;
  conf: boolean;
  avatars: number[];
}

const BLOCKS: LineupBlock[] = [
  { time: '19:00', stage: 'OPEN', team: 'The Volunteers', members: 4, status: '확정', conf: true, avatars: [12, 47, 33, 49] },
  { time: '19:50', stage: '2ND', team: '솔로 매칭팀 A', members: '3 / 4', status: '매칭중', conf: false, avatars: [12, 47, 33] },
  { time: '20:40', stage: 'HEADLINE', team: '미정', members: '0 / 4', status: '모집중', conf: false, avatars: [] },
];

const badgeClass = (s: LineupStatus) =>
  s === '확정' ? 'badge badge-positive' : s === '매칭중' ? 'badge badge-info' : 'badge badge-neutral';

export default function PerfLineupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const s = showById(id);
  if (!s) notFound();

  return (
    <>
      <TopBar title="라인업 보드" />
      <div style={{ padding: '14px 16px 8px', background: '#fff', flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em' }}>{s.host} {s.date.split(' ')[0]}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 2 }}>총 3팀 · 셋당 40분 · 사운드체크 18:00</div>
      </div>

      <div className="scroll-region" style={{ padding: '8px 16px 24px', background: 'var(--neutral-99)' }}>
        {BLOCKS.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 64, paddingTop: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', fontVariantNumeric: 'tabular-nums' }}>{b.time}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--fg-alternative)', letterSpacing: '0.05em', marginTop: 2 }}>{b.stage}</div>
            </div>
            <div style={{
              flex: 1, padding: 14, borderRadius: 12, background: '#fff',
              border: b.conf ? '1px solid var(--color-line)' : '1.5px dashed var(--color-line-strong)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: b.conf ? 'var(--fg-strong)' : 'var(--fg-alternative)' }}>{b.team}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 2 }}>
                    {typeof b.members === 'string' ? b.members : `${b.members}명`}
                  </div>
                </div>
                <span className={badgeClass(b.status)} style={{ fontSize: 10 }}>{b.status}</span>
              </div>
              <div style={{ display: 'flex' }}>
                {b.avatars.map((a, j) => (
                  <img
                    key={j}
                    src={`https://i.pravatar.cc/40?img=${a}`}
                    alt=""
                    style={{ width: 24, height: 24, borderRadius: 12, marginLeft: j === 0 ? 0 : -6, border: '2px solid #fff' }}
                  />
                ))}
                {typeof b.members === 'string' && b.members.includes('/') && (
                  <div style={{ width: 24, height: 24, borderRadius: 12, marginLeft: -6, border: '2px solid #fff', background: 'var(--neutral-95)', color: 'var(--fg-alternative)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>
                    ?
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 8, padding: 14, borderRadius: 12, background: 'var(--cool-neutral-5)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Icon name="mic" size={14} strokeWidth={2.2} color="#fff" />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>OPEN CALL</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>3번째 무대 팀을 찾고 있어요</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>4인 이상 팀 우선 · 인디록·얼터너티브 선호</div>
          <button type="button" style={{ width: '100%', height: 38, borderRadius: 6, border: 0, background: '#fff', color: 'var(--fg-strong)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            팀으로 지원
          </button>
        </div>
      </div>
    </>
  );
}
