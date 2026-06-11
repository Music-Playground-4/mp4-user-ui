'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Grade = 'S' | 'A' | 'B' | 'C';

export default function MarketFilterPage() {
  const router = useRouter();
  const [grades, setGrades] = useState<Set<Grade>>(new Set(['S', 'A']));
  const [distance, setDistance] = useState('3km');
  const [demoOnly, setDemoOnly] = useState(true);
  const [directOnly, setDirectOnly] = useState(false);
  const [beginnerPick, setBeginnerPick] = useState(false);

  const toggle = <T,>(set: Set<T>, value: T): Set<T> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value); else next.add(value);
    return next;
  };

  return (
    <div style={{ flex: 1, position: 'relative', background: 'transparent', minHeight: '100dvh' }}>
      <div
        onClick={() => router.back()}
        className="sheet-backdrop"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
      />
      <div className="sheet-surface" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 80,
        background: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        padding: '12px 0 0', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--color-line-strong)' }} />
        </div>
        <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>필터</div>
          <button
            type="button"
            onClick={() => {
              setGrades(new Set());
              setDistance('전체');
              setDemoOnly(false);
              setDirectOnly(false);
              setBeginnerPick(false);
            }}
            style={{ fontSize: 13, color: 'var(--fg-alternative)', border: 0, background: 'transparent', cursor: 'pointer' }}
          >
            초기화
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 0' }}>
          <FilterBlock label="등급">
            <div style={{ display: 'flex', gap: 6 }}>
              {(['S', 'A', 'B', 'C'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrades((s) => toggle(s, g))}
                  className={grades.has(g) ? 'chip chip-active' : 'chip'}
                  style={{ flex: 1, height: 36, justifyContent: 'center', fontSize: 13 }}
                >
                  {g}급
                </button>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock label="가격대">
            <div style={{ height: 40, position: 'relative', margin: '8px 4px' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 3, background: 'var(--color-line)', borderRadius: 2, transform: 'translateY(-50%)' }} />
              <div style={{ position: 'absolute', top: '50%', left: '15%', right: '40%', height: 3, background: 'var(--color-primary)', borderRadius: 2, transform: 'translateY(-50%)' }} />
              <div style={{ position: 'absolute', top: '50%', left: '15%', width: 18, height: 18, borderRadius: 9, background: '#fff', border: '2px solid var(--color-primary)', transform: 'translate(-50%,-50%)', boxShadow: '0 1px 4px rgba(0,0,0,0.16)' }} />
              <div style={{ position: 'absolute', top: '50%', left: '60%', width: 18, height: 18, borderRadius: 9, background: '#fff', border: '2px solid var(--color-primary)', transform: 'translate(-50%,-50%)', boxShadow: '0 1px 4px rgba(0,0,0,0.16)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>
              <span>10만원</span>
              <span>50만원</span>
            </div>
          </FilterBlock>

          <FilterBlock label="거리">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['1km', '3km', '5km', '10km', '전체'].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDistance(d)}
                  className={distance === d ? 'chip chip-active' : 'chip'}
                  style={{ height: 32, fontSize: 12 }}
                >
                  {d}
                </button>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock label="추가 옵션">
            <ToggleRow label="사운드 데모 있는 매물만" on={demoOnly} onChange={setDemoOnly} />
            <ToggleRow label="직거래 가능" on={directOnly} onChange={setDirectOnly} />
            <ToggleRow label="입문자 추천 가격대" on={beginnerPick} onChange={setBeginnerPick} />
          </FilterBlock>
        </div>

        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-line-soft)', display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => router.back()} className="btn btn-lg btn-outlined" style={{ flex: 1 }}>닫기</button>
          <button type="button" onClick={() => router.back()} className="btn btn-lg btn-primary" style={{ flex: 1.5 }}>적용</button>
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  );
}

function ToggleRow({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', background: 'transparent', border: 0, cursor: 'pointer' }}
    >
      <span style={{ fontSize: 14, color: 'var(--fg-normal)' }}>{label}</span>
      <div style={{
        width: 44, height: 26, borderRadius: 13,
        background: on ? 'var(--color-primary)' : 'var(--color-line)',
        position: 'relative', transition: 'background .15s',
      }}>
        <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 22, height: 22, borderRadius: 11, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left .15s' }} />
      </div>
    </button>
  );
}
