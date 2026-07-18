'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { useAuth } from '@/lib/auth';

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [toggles, setToggles] = useState({
    autoMatch: true,
    beginnerOnly: false,
    newMatch: true,
    chat: true,
    priceAlert: false,
    promo: false,
  });

  const flip = (k: keyof typeof toggles) => setToggles({ ...toggles, [k]: !toggles[k] });

  return (
    <>
      <TopBar title="설정" />
      <div className="scroll-region" style={{ background: 'var(--neutral-99)', paddingBottom: 20 }}>
        <Section title="계정">
          <Row icon="user" label="개인정보 수정" onClick={() => alert('개인정보 수정 (mock)')} />
          <Row icon="check" label="본인인증" value="완료" />
          <Row icon="tag" label="결제·정산 정보" onClick={() => alert('결제 정보 (mock)')} />
        </Section>

        <Section title="활동">
          <Row icon="pin" label="활동 지역" value="마포·서대문 +1" onClick={() => alert('활동 지역 (mock)')} />
          <Row icon="music" label="포지션·장르" value="기타 · 인디록" onClick={() => router.push('/profile-setup')} />
          <Row icon="spark" label="자동 매칭 알림" toggle={toggles.autoMatch} onToggle={() => flip('autoMatch')} />
          <Row icon="users" label="입문자만 매칭" toggle={toggles.beginnerOnly} onToggle={() => flip('beginnerOnly')} />
        </Section>

        <Section title="알림">
          <Row label="신규 매칭" toggle={toggles.newMatch} onToggle={() => flip('newMatch')} />
          <Row label="채팅 메시지" toggle={toggles.chat} onToggle={() => flip('chat')} />
          <Row label="마켓 가격 알림" toggle={toggles.priceAlert} onToggle={() => flip('priceAlert')} />
          <Row label="이벤트·혜택" toggle={toggles.promo} onToggle={() => flip('promo')} />
        </Section>

        <Section title="기타">
          <Row icon="info" label="공지사항" onClick={() => alert('공지사항 (mock)')} />
          <Row icon="info" label="이용약관·개인정보처리방침" onClick={() => alert('약관 (mock)')} />
          <Row icon="info" label="버전 정보" value="1.2.0" />
          <LinkRow href="/my/onboarding" icon="spark" label="온보딩 다시 보기" />
        </Section>

        <Section title="">
          <Row
            label="로그아웃"
            danger
            onClick={async () => {
              await logout();
              router.push('/splash');
            }}
          />
          <Row label="회원 탈퇴" danger onClick={() => confirm('정말 탈퇴하시겠어요?') && router.push('/splash')} />
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {title && (
        <div style={{
          padding: '14px 16px 8px',
          fontSize: 11, fontWeight: 600, color: 'var(--fg-alternative)',
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          {title}
        </div>
      )}
      <div style={{ background: '#fff' }}>{children}</div>
    </div>
  );
}

interface RowProps {
  icon?: IconName;
  label: string;
  value?: string;
  toggle?: boolean;
  danger?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}

function Row({ icon, label, value, toggle, danger, onToggle, onClick }: RowProps) {
  const Tag: keyof React.JSX.IntrinsicElements = onClick || onToggle ? 'button' : 'div';
  return (
    <Tag
      onClick={onToggle ?? onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        padding: '14px 16px', borderBottom: '1px solid var(--color-line-soft)',
        background: 'transparent', border: 0, cursor: onClick || onToggle ? 'pointer' : 'default',
        textAlign: 'left',
      }}
    >
      {icon && (
        <div style={{ width: 22, height: 22, color: danger ? 'var(--color-negative)' : 'var(--fg-normal)' }}>
          <Icon name={icon} size={18} />
        </div>
      )}
      <div style={{ flex: 1, fontSize: 14, color: danger ? 'var(--color-negative)' : 'var(--fg-strong)', fontWeight: danger ? 600 : 400 }}>
        {label}
      </div>
      {value && <div style={{ fontSize: 13, color: 'var(--fg-alternative)' }}>{value}</div>}
      {toggle !== undefined ? (
        <div style={{
          width: 42, height: 24, borderRadius: 12,
          background: toggle ? 'var(--color-primary)' : 'var(--color-line)',
          padding: 2, position: 'relative', transition: 'background .15s',
        }}>
          <div style={{
            position: 'absolute', top: 2, left: toggle ? 20 : 2,
            width: 20, height: 20, borderRadius: 10, background: '#fff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.16)', transition: 'left .15s',
          }} />
        </div>
      ) : (
        !value && onClick && <Icon name="chevR" size={16} color="var(--fg-assistive)" />
      )}
    </Tag>
  );
}

function LinkRow({ href, icon, label }: { href: string; icon?: IconName; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px', borderBottom: '1px solid var(--color-line-soft)',
      }}
    >
      {icon && (
        <div style={{ width: 22, height: 22, color: 'var(--fg-normal)' }}>
          <Icon name={icon} size={18} />
        </div>
      )}
      <div style={{ flex: 1, fontSize: 14, color: 'var(--fg-strong)' }}>{label}</div>
      <Icon name="chevR" size={16} color="var(--fg-assistive)" />
    </Link>
  );
}
