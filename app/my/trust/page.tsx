'use client';

import { Icon, type IconName } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';

const BADGES: { label: string; icon: IconName; color: string; earned: boolean }[] = [
  { label: '본인인증', icon: 'check', color: 'var(--color-primary)', earned: true },
  { label: '노쇼 0', icon: 'check', color: 'var(--color-positive)', earned: true },
  { label: '후기왕', icon: 'star', color: 'var(--color-accent)', earned: true },
  { label: '단골', icon: 'heartFill', color: 'var(--fg-assistive)', earned: false },
];

const DETAILS = [
  { label: '본인인증 완료', done: true, points: 15 },
  { label: '프로필 100% 작성', done: true, points: 10 },
  { label: '합주 약속 지킴 (12 / 12)', done: true, points: 24 },
  { label: '받은 후기 평균 4.8 (8건)', done: true, points: 16 },
  { label: '거래 완료 3건', done: true, points: 11 },
  { label: '연주 데모 등록', done: true, points: 8 },
  { label: '연속 활동 30일', done: false, points: 10 },
  { label: 'A등급 장비 보유', done: false, points: 6 },
];

const R = 62;
const C = 2 * Math.PI * R;
const PROGRESS = 0.76;

export default function TrustPage() {
  return (
    <>
      <TopBar title="신뢰점수" />
      <div className="scroll-region" style={{ padding: '16px 16px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0 16px' }}>
          <div style={{ position: 'relative', width: 148, height: 148 }}>
            <svg width="148" height="148" viewBox="0 0 148 148">
              <circle cx="74" cy="74" r={R} fill="none" stroke="var(--neutral-95)" strokeWidth="10" />
              <circle
                cx="74" cy="74" r={R}
                fill="none" stroke="var(--color-primary)" strokeWidth="10"
                strokeDasharray={`${C * PROGRESS} ${C}`}
                strokeLinecap="round"
                transform="rotate(-90 74 74)"
                style={{
                  animation: 'trust-fill 900ms cubic-bezier(0.16,1,0.3,1) both',
                }}
              />
              <style>{`
                @keyframes trust-fill {
                  from { stroke-dasharray: 0 ${C}; }
                  to   { stroke-dasharray: ${C * PROGRESS} ${C}; }
                }
              `}</style>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.03em', lineHeight: 1 }}>76</div>
              <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 2 }}>Lv.B</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-alternative)', marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>4점</span>만 더 모으면 A등급이에요
          </div>
        </div>

        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
          {BADGES.map((b) => (
            <div key={b.label} style={{
              padding: '10px 6px', borderRadius: 10,
              border: '1px solid var(--color-line-soft)',
              background: b.earned ? '#fff' : 'var(--neutral-99)',
              opacity: b.earned ? 1 : 0.55,
              textAlign: 'center',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 16, margin: '0 auto 4px',
                background: b.earned ? `${b.color}20` : 'var(--neutral-90)',
                color: b.earned ? b.color : 'var(--fg-assistive)',
                display: 'grid', placeItems: 'center',
              }}>
                <Icon name={b.icon} size={16} strokeWidth={2.2} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: b.earned ? 'var(--fg-strong)' : 'var(--fg-alternative)' }}>{b.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>점수 내역</div>
        <div className="stagger" style={{ background: '#fff', border: '1px solid var(--color-line-soft)', borderRadius: 12, overflow: 'hidden' }}>
          {DETAILS.map((d, i) => (
            <div key={d.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px',
              borderBottom: i < DETAILS.length - 1 ? '1px solid var(--color-line-soft)' : 'none',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 11,
                background: d.done ? 'rgba(0,140,48,0.12)' : 'var(--neutral-95)',
                color: d.done ? 'var(--color-positive)' : 'var(--fg-assistive)',
                display: 'grid', placeItems: 'center',
              }}>
                <Icon name="check" size={12} strokeWidth={3} />
              </div>
              <div style={{ flex: 1, fontSize: 13, color: d.done ? 'var(--fg-strong)' : 'var(--fg-alternative)' }}>{d.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: d.done ? 'var(--color-positive)' : 'var(--fg-assistive)', fontVariantNumeric: 'tabular-nums' }}>
                +{d.points}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: 'var(--blue-99)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon name="info" size={16} color="var(--color-primary)" strokeWidth={2} />
          <div style={{ fontSize: 11.5, color: 'var(--fg-normal)', lineHeight: 1.6, flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>S등급 (80점 이상)이 되면?</div>
            합주실 예약 할인, 공연 매칭 우선권, 마켓 수수료 할인 등 다양한 혜택을 받을 수 있어요.
          </div>
        </div>
      </div>
    </>
  );
}
