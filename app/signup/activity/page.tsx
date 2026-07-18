'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { StepBar, Spinner } from '@/components/ui/AuthForm';
import { useAuth } from '@/lib/auth';
import { errorText } from '@/lib/useApi';
import { usersApi } from '@/lib/api';

const OPTS = [
  { id: 'play', label: '합주·세션', sub: '정기·단기 멤버를 찾아요', count: '5,200명' },
  { id: 'perform', label: '공연·무대', sub: '팀을 꾸려 무대에 서요', count: '2,800명' },
  { id: 'trade', label: '장비 거래', sub: '악기·이펙터를 사고 팔아요', count: '8,100명' },
  { id: 'learn', label: '음악 입문', sub: '처음 시작해요', count: '1,400명' },
];

export default function SignupActivityPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set(['play', 'perform']));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // activityTypes 값은 화면 id 와 백엔드 값이 동일해 변환이 필요 없다
  const onNext = async () => {
    if (selected.size === 0) return;
    if (!token) {
      // 토큰이 없으면(로그인 만료 등) 저장을 건너뛰고 흐름은 유지한다
      router.push('/profile-setup');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await usersApi.update(token, { activityTypes: Array.from(selected) });
      router.push('/profile-setup');
    } catch (e) {
      setError(errorText(e));
      setSaving(false);
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <>
      <TopBar title="" backHref="/signup" />
      <div style={{ flex: 1, padding: '8px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        <StepBar step={2} />

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

        {error && (
          <div role="alert" style={{ marginTop: 16, fontSize: 13, color: 'var(--color-negative)' }}>
            {error}
          </div>
        )}

        <div style={{ flex: 1, minHeight: 24 }} />
        <button
          type="button"
          onClick={onNext}
          disabled={selected.size === 0 || saving}
          className="btn btn-lg btn-primary"
          style={{ width: '100%', marginTop: 24 }}
        >
          {saving ? <Spinner /> : `다음 (${selected.size})`}
        </button>
      </div>
    </>
  );
}
