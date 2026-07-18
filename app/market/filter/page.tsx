'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONDITIONS, GRADES, type Grade, type ItemCondition } from '@/lib/enums';

export default function MarketFilterPage() {
  return (
    <Suspense fallback={null}>
      <FilterSheet />
    </Suspense>
  );
}

function FilterSheet() {
  const router = useRouter();
  const params = useSearchParams();

  // 목록에서 넘어온 현재 조건을 그대로 이어받는다
  const [grade, setGrade] = useState<Grade | null>((params.get('grade') as Grade) || null);
  const [condition, setCondition] = useState<ItemCondition | null>(
    (params.get('condition') as ItemCondition) || null,
  );
  const [minPrice, setMinPrice] = useState(params.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') ?? '');

  const reset = () => {
    setGrade(null);
    setCondition(null);
    setMinPrice('');
    setMaxPrice('');
  };

  const apply = () => {
    // 목록이 이미 들고 있던 조건(카테고리·정렬·검색어)은 유지하고 필터만 덮어쓴다
    const next = new URLSearchParams();
    for (const key of ['category', 'sort', 'q'] as const) {
      const v = params.get(key);
      if (v) next.set(key, v);
    }
    if (grade) next.set('grade', grade);
    if (condition) next.set('condition', condition);
    if (minPrice.trim()) next.set('minPrice', String(Number(minPrice.replace(/[^\d]/g, '')) || 0));
    if (maxPrice.trim()) next.set('maxPrice', String(Number(maxPrice.replace(/[^\d]/g, '')) || 0));

    const qs = next.toString();
    router.push(qs ? `/market?${qs}` : '/market');
  };

  return (
    <div style={{ flex: 1, position: 'relative', background: 'transparent', minHeight: '100dvh' }}>
      <div
        onClick={() => router.back()}
        className="sheet-backdrop"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
      />
      <div
        className="sheet-surface"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, top: 80,
          background: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
          padding: '12px 0 0', display: 'flex', flexDirection: 'column',
          boxShadow: '0 -8px 24px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--color-line-strong)' }} />
        </div>
        <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>필터</div>
          <button
            type="button"
            onClick={reset}
            style={{ fontSize: 13, color: 'var(--fg-alternative)', border: 0, background: 'transparent', cursor: 'pointer' }}
          >
            초기화
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 0' }}>
          {/* 서버가 grade 를 단일 값으로 받으므로 다중 선택을 쓰지 않는다 */}
          <FilterBlock label="거래 등급">
            <div style={{ display: 'flex', gap: 6 }}>
              {GRADES.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade((cur) => (cur === g ? null : g))}
                  className={grade === g ? 'chip chip-active' : 'chip'}
                  style={{ flex: 1, height: 36, justifyContent: 'center', fontSize: 13 }}
                >
                  {g}급
                </button>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock label="상태">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CONDITIONS.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setCondition((cur) => (cur === c.value ? null : c.value))}
                  className={condition === c.value ? 'chip chip-active' : 'chip'}
                  style={{ height: 32, fontSize: 12 }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock label="가격대">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                inputMode="numeric"
                className="field"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="최소"
                style={{ flex: 1 }}
              />
              <span style={{ color: 'var(--fg-alternative)' }}>~</span>
              <input
                type="number"
                inputMode="numeric"
                className="field"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="최대"
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {[
                { label: '10만원 이하', min: '', max: '100000' },
                { label: '10~50만원', min: '100000', max: '500000' },
                { label: '50~100만원', min: '500000', max: '1000000' },
                { label: '100만원 이상', min: '1000000', max: '' },
              ].map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => {
                    setMinPrice(p.min);
                    setMaxPrice(p.max);
                  }}
                  className={minPrice === p.min && maxPrice === p.max ? 'chip chip-active' : 'chip'}
                  style={{ height: 30, fontSize: 12 }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </FilterBlock>
        </div>

        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-line-soft)', display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => router.back()} className="btn btn-lg btn-outlined" style={{ flex: 1 }}>
            닫기
          </button>
          <button type="button" onClick={apply} className="btn btn-lg btn-primary" style={{ flex: 1.5 }}>
            적용
          </button>
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
