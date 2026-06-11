'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/app/Nav';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('minsoo@gmail.com');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    router.push('/');
  };

  return (
    <>
      <TopBar title="로그인" backHref="/splash" />
      <form onSubmit={onSubmit} style={{ flex: 1, padding: '24px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          다시 만나서 반가워요
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-alternative)', marginBottom: 32 }}>
          이메일과 비밀번호를 입력해 주세요
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-alternative)', display: 'block', marginBottom: 6 }}>
              이메일
            </label>
            <input
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mp4.app"
              autoComplete="email"
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-alternative)', display: 'block', marginBottom: 6 }}>
              비밀번호
            </label>
            <input
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상"
              autoComplete="current-password"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 13 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-normal)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
            />
            로그인 유지
          </label>
          <span style={{ color: 'var(--fg-alternative)', cursor: 'pointer' }}>비밀번호 찾기</span>
        </div>

        <button type="submit" disabled={!canSubmit} className="btn btn-lg btn-primary" style={{ width: '100%', marginTop: 24 }}>
          로그인
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 16px', color: 'var(--fg-assistive)', fontSize: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-line)' }} />
          간편 로그인
          <div style={{ flex: 1, height: 1, background: 'var(--color-line)' }} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { bg: '#FEE500', fg: '#000', label: '카카오' },
            { bg: '#03C75A', fg: '#fff', label: '네이버' },
            { bg: '#000', fg: '#fff', label: 'Apple' },
          ].map((s) => (
            <button
              type="button"
              key={s.label}
              onClick={() => router.push('/')}
              style={{
                flex: 1, height: 48, borderRadius: 8, background: s.bg, color: s.fg,
                display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13,
                border: 0, cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </form>
    </>
  );
}
