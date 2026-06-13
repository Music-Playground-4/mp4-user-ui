'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/app/Nav';
import { Field, Spinner, StepBar } from '@/components/ui/AuthForm';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }));

  const nameError = name.trim().length === 0 ? '이름(닉네임)을 입력해 주세요' : null;
  const emailError =
    email.trim().length === 0 ? '이메일을 입력해 주세요'
    : !EMAIL_RE.test(email.trim()) ? '이메일 형식을 확인해 주세요'
    : null;
  const passwordError =
    password.length === 0 ? '비밀번호를 입력해 주세요'
    : password.length < 8 ? '비밀번호는 8자 이상이어야 해요'
    : null;
  const confirmError =
    confirm.length === 0 ? '비밀번호를 한 번 더 입력해 주세요'
    : confirm !== password ? '비밀번호가 일치하지 않아요'
    : null;

  const canSubmit = !nameError && !emailError && !passwordError && !confirmError && agree && !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (nameError || emailError || passwordError || confirmError || !agree) return;

    setSubmitting(true);
    setError(null);
    try {
      await signup({ name: name.trim(), email: email.trim(), password });
      router.push('/signup/activity');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '회원가입에 실패했어요. 다시 시도해 주세요');
      setSubmitting(false);
    }
  };

  return (
    <>
      <TopBar title="" backHref="/splash" />
      <form onSubmit={onSubmit} noValidate style={{ flex: 1, padding: '8px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        <StepBar step={1} />

        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          계정을 만들어요
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-alternative)', marginBottom: 28 }}>
          이메일과 비밀번호로 가입해요
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field
            label="이름 (닉네임)"
            type="text"
            value={name}
            onChange={setName}
            onBlur={() => touch('name')}
            placeholder="활동에 사용할 이름"
            autoComplete="nickname"
            error={touched.name ? nameError : null}
          />
          <Field
            label="이메일"
            type="email"
            value={email}
            onChange={setEmail}
            onBlur={() => touch('email')}
            placeholder="example@mp4.app"
            autoComplete="email"
            error={touched.email ? emailError : null}
          />
          <Field
            label="비밀번호"
            type="password"
            value={password}
            onChange={setPassword}
            onBlur={() => touch('password')}
            placeholder="8자 이상"
            autoComplete="new-password"
            error={touched.password ? passwordError : null}
          />
          <Field
            label="비밀번호 확인"
            type="password"
            value={confirm}
            onChange={setConfirm}
            onBlur={() => touch('confirm')}
            placeholder="비밀번호 재입력"
            autoComplete="new-password"
            error={touched.confirm ? confirmError : null}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, fontSize: 13, color: 'var(--fg-normal)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
          />
          <span>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>이용약관</span> 및{' '}
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>개인정보 처리방침</span>에 동의해요
          </span>
        </label>

        {error && (
          <div role="alert" style={{ marginTop: 14, fontSize: 13, color: 'var(--color-negative)' }}>
            {error}
          </div>
        )}

        <div style={{ flex: 1, minHeight: 24 }} />
        <button type="submit" disabled={!canSubmit} className="btn btn-lg btn-primary" style={{ width: '100%', marginTop: 16 }}>
          {submitting ? <Spinner /> : '다음'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--fg-alternative)' }}>
          이미 계정이 있나요?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            style={{ background: 'none', border: 0, padding: 0, color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            로그인
          </button>
        </div>
      </form>
    </>
  );
}
