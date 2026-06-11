'use client';

import Link from 'next/link';

const FontHero = { fontFamily: 'var(--font-display)' };

export default function SplashPage() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '48px 24px 40px',
      background: 'var(--cool-neutral-5)', color: '#fff', minHeight: '100dvh',
    }}>
      <div style={{ paddingTop: 60 }}>
        <div style={{ ...FontHero, fontSize: 64, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95 }}>
          MP<span style={{ color: 'var(--blue-65)' }}>4</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,0.7)', letterSpacing: '-0.01em' }}>
          음악인을 위한 매칭 플랫폼
        </div>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.4, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>
          장비를 사고,<br />합주를 찾고,<br />무대를 만들고.
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 20, marginBottom: 24, letterSpacing: '0.01em' }}>
          이미 12,400명의 음악인이 함께하고 있어요
        </div>
        <Link href="/signup" className="btn btn-lg btn-primary" style={{ width: '100%' }}>
          시작하기
        </Link>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          이미 계정이 있나요?{' '}
          <Link href="/login" style={{ color: 'var(--blue-65)', fontWeight: 600 }}>로그인</Link>
        </div>
      </div>
    </div>
  );
}
