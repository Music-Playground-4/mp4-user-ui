'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';

interface SkillOpt { id: string; label: string; sub: string; dot: number; }
interface IntentOpt { id: string; icon: IconName; label: string; }

const SKILLS: SkillOpt[] = [
  { id: 'beg', label: '입문', sub: '코드 4~5개 정도 알아요', dot: 1 },
  { id: 'ele', label: '초급', sub: '카피곡 1~2곡 가능해요', dot: 2 },
  { id: 'mid', label: '중급', sub: '여러 곡 자유롭게 연주해요', dot: 3 },
  { id: 'pro', label: '경력자', sub: '5년 이상, 합주·세션 경험', dot: 4 },
];

const INTENTS: IntentOpt[] = [
  { id: 'reg', icon: 'music', label: '정기 합주' },
  { id: 'short', icon: 'spark', label: '단기 프로젝트' },
  { id: 'stage', icon: 'mic', label: '공연 무대' },
  { id: 'trade', icon: 'speaker', label: '장비 거래' },
  { id: 'lesson', icon: 'headset', label: '레슨·강습' },
  { id: 'friend', icon: 'users', label: '친구 교류' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [skill, setSkill] = useState<string>('ele');
  const [intents, setIntents] = useState<Set<string>>(new Set(['reg', 'stage']));

  const toggleIntent = (id: string) => {
    const next = new Set(intents);
    if (next.has(id)) next.delete(id); else next.add(id);
    setIntents(next);
  };

  return (
    <>
      <TopBar title="" />
      <div className="scroll-region" style={{ padding: '8px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= 2 ? 'var(--color-primary)' : 'var(--color-line)',
            }} />
          ))}
        </div>

        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          어느 정도 연주하세요?
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-alternative)', marginBottom: 20 }}>
          비슷한 레벨의 음악인을 우선 추천해드려요
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {SKILLS.map((s) => {
            const sel = skill === s.id;
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => setSkill(s.id)}
                style={{
                  padding: '14px 16px', borderRadius: 12,
                  border: `1.5px solid ${sel ? 'var(--color-primary)' : 'var(--color-line)'}`,
                  background: sel ? 'rgba(0,102,255,0.04)' : '#fff',
                  display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 18 }}>
                  {[1, 2, 3, 4].map((b) => (
                    <div key={b} style={{
                      width: 4, height: `${b * 4 + 2}px`, borderRadius: 1,
                      background: b <= s.dot
                        ? (sel ? 'var(--color-primary)' : 'var(--fg-strong)')
                        : 'var(--neutral-90)',
                    }} />
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-strong)' }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-alternative)', marginTop: 2 }}>{s.sub}</div>
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

        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 4 }}>관심사 (다중 선택)</div>
        <div style={{ fontSize: 12, color: 'var(--fg-alternative)', marginBottom: 14 }}>
          매칭에 활용돼요 ({intents.size}개)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {INTENTS.map((it) => {
            const sel = intents.has(it.id);
            return (
              <button
                type="button"
                key={it.id}
                onClick={() => toggleIntent(it.id)}
                style={{
                  padding: '14px 8px', borderRadius: 12,
                  border: `1.5px solid ${sel ? 'var(--color-primary)' : 'var(--color-line)'}`,
                  background: sel ? 'rgba(0,102,255,0.04)' : '#fff',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  cursor: 'pointer',
                }}
              >
                <Icon name={it.icon} size={22} color={sel ? 'var(--color-primary)' : 'var(--fg-normal)'} />
                <div style={{ fontSize: 12, fontWeight: 600, color: sel ? 'var(--color-primary)' : 'var(--fg-strong)' }}>
                  {it.label}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, minHeight: 24 }} />
        <button
          type="button"
          onClick={() => router.push('/my')}
          disabled={intents.size === 0}
          className="btn btn-lg btn-primary"
          style={{ width: '100%', marginTop: 16 }}
        >
          완료 (3/3)
        </button>
      </div>
    </>
  );
}
