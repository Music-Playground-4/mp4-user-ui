'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';

const OPTS = [
  { id: 'play', label: '합주·세션', sub: '정기·단기 멤버를 찾아요', count: '5,200명' },
  { id: 'perform', label: '공연·무대', sub: '팀을 꾸려 무대에 서요', count: '2,800명' },
  { id: 'trade', label: '장비 거래', sub: '악기·이펙터를 사고 팔아요', count: '8,100명' },
  { id: 'learn', label: '음악 입문', sub: '처음 시작해요', count: '1,400명' },
];

export default function SignupPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set(['play', 'perform']));

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <>
      <TopBar title="" backHref="/splash" />
      <div style={{ flex: 1, padding: '8px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i === 1 ? 'var(--color-primary)' : 'var(--color-line)',
            }} />
          ))}
        </div>

        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          어떤 활동을 하고 계세요?
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-alternative)', marginBottom: 24 }}>
          여러 항목을 선택할 수 있어요
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {OPTS.map((o) => {
            const sel = selected.has(o.id);
            return (
              <button
                type="button"
                key={o.id}
                onClick={() => toggle(o.id)}
                style={{
                  padding: '14px 16px',
                  border: `1.5px solid ${sel ? 'var(--color-primary)' : 'var(--color-line)'}`,
                  borderRadius: 12,
                  background: sel ? 'rgba(0,102,255,0.04)' : '#fff',
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-strong)' }}>{o.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-alternative)', marginTop: 2 }}>
                    {o.sub} · <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{o.count}</span>
                  </div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 11,
                  border: `1.5px solid ${sel ? 'var(--color-primary)' : 'var(--color-line-strong)'}`,
                  background: sel ? 'var(--color-primary)' : 'transparent',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  {sel && <Icon name="check" size={12} strokeWidth={3} color="#fff" />}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, minHeight: 24 }} />
        <button
          type="button"
          onClick={() => router.push('/profile-setup')}
          disabled={selected.size === 0}
          className="btn btn-lg btn-primary"
          style={{ width: '100%', marginTop: 24 }}
        >
          다음 ({selected.size})
        </button>
      </div>
    </>
  );
}
