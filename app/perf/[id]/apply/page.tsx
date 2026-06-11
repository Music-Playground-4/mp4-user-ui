'use client';

import { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { showById } from '@/lib/data';

const SETLIST = [
  'Yellow Fever - 새소년',
  'Antifreeze - 백예린',
  'Salty - The Volunteers (자작 어레인지)',
];

export default function PerfApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const s = showById(id);
  if (!s) notFound();

  const [unit, setUnit] = useState<'team' | 'solo'>('team');
  const [message, setMessage] = useState('지난달 합정 라이브 좋게 보고 신청합니다. 자작곡 어레인지 가능합니다.');

  const submit = () => {
    alert('지원이 접수되었어요! (mock)');
    router.push(`/perf/${s.id}`);
  };

  return (
    <>
      <TopBar title="공연 지원" />
      <div className="scroll-region" style={{ padding: '16px 16px' }}>
        <div style={{ padding: 12, borderRadius: 10, background: 'var(--neutral-99)', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>지원하는 공연</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginTop: 2 }}>{s.title}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 2 }}>{s.date}</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 10 }}>지원 단위</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setUnit('team')}
              className={unit === 'team' ? 'chip chip-active' : 'chip'}
              style={{ flex: 1, height: 48, justifyContent: 'center', flexDirection: 'column', gap: 0, padding: 0 }}
            >
              <div style={{ fontSize: 13, fontWeight: 600 }}>팀</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>이미 결성됨</div>
            </button>
            <button
              type="button"
              onClick={() => setUnit('solo')}
              className={unit === 'solo' ? 'chip chip-active' : 'chip'}
              style={{ flex: 1, height: 48, justifyContent: 'center', flexDirection: 'column', gap: 0, padding: 0 }}
            >
              <div style={{ fontSize: 13, fontWeight: 600 }}>솔로</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>자동매칭</div>
            </button>
          </div>
        </div>

        {unit === 'team' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>팀 선택</div>
            <div style={{ padding: 14, borderRadius: 10, border: '1.5px solid var(--color-primary)', background: 'rgba(0,102,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', flex: 1 }}>신촌 인디록 정기팀</div>
                <Icon name="check" size={18} color="var(--color-primary)" strokeWidth={2.4} />
              </div>
              <div style={{ display: 'flex', marginBottom: 8 }}>
                {[12, 47, 33, 49].map((a, j) => (
                  <img
                    key={j}
                    src={`https://i.pravatar.cc/40?img=${a}`}
                    alt=""
                    style={{ width: 26, height: 26, borderRadius: 13, marginLeft: j === 0 ? 0 : -6, border: '2px solid #fff' }}
                  />
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>4명 · 인디록 · 합주 6회</div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>셋리스트 (3곡)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SETLIST.map((t, i) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1px solid var(--color-line)', borderRadius: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--neutral-95)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: 'var(--fg-alternative)' }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 13, color: 'var(--fg-strong)' }}>{t}</div>
                <Icon name="play" size={12} color="var(--fg-alternative)" strokeWidth={2} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>주최자에게 한마디</div>
          <textarea
            className="field"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ minHeight: 80 }}
          />
        </div>
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-line)', background: '#fff', flexShrink: 0 }}>
        <button type="button" onClick={submit} className="btn btn-lg btn-primary" style={{ width: '100%' }}>
          지원 보내기
        </button>
      </div>
    </>
  );
}
