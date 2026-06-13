'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/lib/auth';

export default function SignupCompletePage() {
  const router = useRouter();
  const { user, status } = useAuth();

  // 가입(인증) 안 된 상태로 직접 들어오면 가입 시작으로 되돌림
  useEffect(() => {
    if (status === 'guest') router.replace('/signup');
  }, [status, router]);

  if (status !== 'authenticated') return null;

  return (
    <div style={{
      flex: 1, minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px 24px 40px', textAlign: 'center',
    }}>
      <div className="anim-pop-in" style={{
        width: 84, height: 84, borderRadius: 42, background: 'var(--color-primary)',
        display: 'grid', placeItems: 'center', boxShadow: '0 8px 28px rgba(0,102,255,0.32)',
      }}>
        <Icon name="check" size={42} strokeWidth={3} color="#fff" />
      </div>

      <div className="anim-fade-up" style={{ marginTop: 24, fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em' }}>
        가입이 완료됐어요{user ? `, ${user.name}님` : ''}
      </div>
      <div className="anim-fade-up" style={{ marginTop: 8, fontSize: 14, color: 'var(--fg-alternative)', lineHeight: 1.5 }}>
        이제 MP4에서 합주 멤버를 찾고,<br />장비를 거래하고, 무대에 설 수 있어요.
      </div>

      <button
        type="button"
        onClick={() => router.replace('/')}
        className="btn btn-lg btn-primary anim-fade-up"
        style={{ width: '100%', maxWidth: 360, marginTop: 36 }}
      >
        MP4 시작하기
      </button>
    </div>
  );
}
