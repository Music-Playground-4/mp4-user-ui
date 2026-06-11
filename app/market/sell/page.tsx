'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { GEARS, CATEGORIES } from '@/lib/data';

const GRADES = ['S', 'A', 'B', 'C'] as const;

export default function MarketSellPage() {
  const router = useRouter();
  const [title, setTitle] = useState('Boss Katana 50 MkII');
  const [cat, setCat] = useState('앰프');
  const [grade, setGrade] = useState<typeof GRADES[number]>('A');
  const [price, setPrice] = useState('220000');
  const [region, setRegion] = useState('서울 마포구 합정동');
  const [desc, setDesc] = useState('기능 정상, 외관 깨끗합니다. 리모트 미포함.\n약 1년 사용. 직거래 우선합니다.');

  const onSubmit = () => {
    if (!title.trim() || !price.trim()) return;
    alert('장비가 등록되었어요! (mock)');
    router.push('/market');
  };

  return (
    <>
      <TopBar
        title="장비 등록"
        right={
          <button type="button" style={{ padding: '0 12px', height: 32, border: 0, background: 'transparent', color: 'var(--color-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            임시저장
          </button>
        }
      />
      <div className="scroll-region" style={{ padding: '16px 16px 20px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
          <button
            type="button"
            style={{
              width: 80, height: 80, border: '1.5px dashed var(--color-line-strong)', borderRadius: 8,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 4, color: 'var(--fg-alternative)', flexShrink: 0, background: '#fff', cursor: 'pointer',
            }}
          >
            <Icon name="plus" size={18} strokeWidth={1.8} />
            <span style={{ fontSize: 11 }}>0/10</span>
          </button>
          <div style={{
            width: 80, height: 80, borderRadius: 8,
            background: `url(${GEARS[1].images?.[0]}) center/cover`,
            position: 'relative', flexShrink: 0,
          }}>
            <div style={{ position: 'absolute', top: 4, left: 4, padding: '2px 6px', borderRadius: 4, background: 'var(--color-primary)', color: '#fff', fontSize: 9, fontWeight: 700 }}>
              대표
            </div>
          </div>
          <div style={{ width: 80, height: 80, borderRadius: 8, background: `url(${GEARS[2].images?.[0]}) center/cover`, flexShrink: 0 }} />
        </div>

        <div style={{ padding: 14, border: '1px solid var(--color-primary)', borderRadius: 12, background: 'rgba(0,102,255,0.04)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Icon name="mic" size={16} color="var(--color-primary)" strokeWidth={2} />
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>사운드 데모 추가 (선택)</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', lineHeight: 1.5 }}>
            10~30초 직접 연주 녹음을 첨부하면 신뢰도가 올라가고, 매수자가 톤을 미리 들을 수 있어요.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="제목">
            <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예) Boss Katana 50 MkII" />
          </Field>

          <Field label="카테고리">
            <select
              className="field"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              style={{ appearance: 'none', background: '#fff' }}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-alternative)', marginBottom: 8 }}>등급</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {GRADES.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade(g)}
                  style={{
                    flex: 1, height: 44, borderRadius: 8,
                    border: g === grade ? '1.5px solid var(--color-primary)' : '1px solid var(--color-line)',
                    background: g === grade ? 'rgba(0,102,255,0.04)' : '#fff',
                    color: g === grade ? 'var(--color-primary)' : 'var(--fg-strong)',
                    display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {g}급
                </button>
              ))}
            </div>
          </div>

          <Field label="가격">
            <input
              type="number"
              className="field"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="원 단위"
            />
          </Field>

          <Field label="거래 지역">
            <input className="field" value={region} onChange={(e) => setRegion(e.target.value)} />
          </Field>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-alternative)', marginBottom: 8 }}>설명</div>
            <textarea
              className="field"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={1000}
              style={{ minHeight: 96 }}
            />
            <div style={{ fontSize: 11, color: 'var(--fg-alternative)', textAlign: 'right', marginTop: 4 }}>
              {desc.length} / 1000
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-line)', background: '#fff', flexShrink: 0 }}>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!title.trim() || !price.trim()}
          className="btn btn-lg btn-primary"
          style={{ width: '100%' }}
        >
          등록하기
        </button>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-alternative)', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
