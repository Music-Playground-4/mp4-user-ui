'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/app/Nav';
import { Field, Spinner } from '@/components/ui/AuthForm';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 한 번 제출(또는 blur)한 필드만 인라인 에러를 보여줍니다.
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const emailError =
    email.trim().length === 0 ? '이메일을 입력해 주세요'
    : !EMAIL_RE.test(email.trim()) ? '이메일 형식을 확인해 주세요'
    : null;
  const passwordError = password.length === 0 ? '비밀번호를 입력해 주세요' : null;
  const canSubmit = !emailError && !passwordError && !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (emailError || passwordError) return;

    setSubmitting(true);
    setError(null);
    try {
      await login({ email: email.trim(), password });
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '로그인에 실패했어요. 다시 시도해 주세요');
      setSubmitting(false);
    }
  };

  return (
    <>
      <TopBar title="로그인" backHref="/splash" />
      <form onSubmit={onSubmit} noValidate style={{ flex: 1, padding: '24px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          다시 만나서 반가워요
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-alternative)', marginBottom: 32 }}>
          이메일과 비밀번호를 입력해 주세요
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field
            label="이메일"
            type="email"
            value={email}
            onChange={setEmail}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="example@mp4.app"
            autoComplete="email"
            error={touched.email ? emailError : null}
          />
          <Field
            label="비밀번호"
            type="password"
            value={password}
            onChange={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="8자 이상"
            autoComplete="current-password"
            error={touched.password ? passwordError : null}
          />
        </div>

        {error && (
          <div role="alert" style={{ marginTop: 14, fontSize: 13, color: 'var(--color-negative)' }}>
            {error}
          </div>
        )}

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
          {submitting ? <Spinner /> : '로그인'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--fg-alternative)' }}>
          아직 계정이 없나요?{' '}
          <button
            type="button"
            onClick={() => router.push('/signup')}
            style={{ background: 'none', border: 0, padding: 0, color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            회원가입
          </button>
        </div>

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
