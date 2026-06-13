'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { StepBar } from '@/components/ui/AuthForm';
import { POSITIONS, GENRES } from '@/lib/data';

const LEVELS = ['입문 6개월차', '입문 1년', '취미 2~3년', '경력 5년 이상', '세션·강사'];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<Set<string>>(new Set(['기타']));
  const [genres, setGenres] = useState<Set<string>>(new Set(['인디록', '시티팝']));
  const [level, setLevel] = useState('입문 6개월차');
  const [levelOpen, setLevelOpen] = useState(false);

  const togglePos = (p: string) => {
    const next = new Set(positions);
    if (next.has(p)) next.delete(p); else next.add(p);
    setPositions(next);
  };
  const toggleGenre = (g: string) => {
    const next = new Set(genres);
    if (next.has(g)) next.delete(g);
    else if (next.size < 5) next.add(g);
    setGenres(next);
  };

  return (
    <>
      <TopBar title="" backHref="/signup/activity" />
      <div style={{ flex: 1, padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <StepBar step={3} />

        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          연주하는 악기를 알려주세요
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-alternative)', marginBottom: 16 }}>
          매칭에 활용돼요. 나중에 변경할 수 있어요
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          {POSITIONS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => togglePos(p)}
              className={positions.has(p) ? 'chip chip-active' : 'chip'}
              style={{ height: 36, padding: '0 14px', fontSize: 13 }}
            >
              {p}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 6 }}>좋아하는 장르</div>
        <div style={{ fontSize: 12, color: 'var(--fg-alternative)', marginBottom: 14 }}>
          최대 5개까지 선택 ({genres.size}/5)
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
          {GENRES.map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => toggleGenre(g)}
              className={genres.has(g) ? 'chip chip-active' : 'chip'}
              style={{ fontSize: 12 }}
            >
              {g}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 10 }}>경력</div>
        <button
          type="button"
          onClick={() => setLevelOpen(!levelOpen)}
          className="field"
          style={{ width: '100%', justifyContent: 'space-between', background: '#fff', cursor: 'pointer' }}
        >
          <span style={{ color: 'var(--fg-strong)' }}>{level}</span>
          <Icon name={levelOpen ? 'chevU' : 'chevD'} size={18} color="var(--fg-assistive)" />
        </button>
        {levelOpen && (
          <div style={{
            marginTop: 4, border: '1px solid var(--color-line)', borderRadius: 8, background: '#fff',
            overflow: 'hidden',
          }}>
            {LEVELS.map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => { setLevel(l); setLevelOpen(false); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '12px 14px', border: 0,
                  background: l === level ? 'var(--blue-99)' : '#fff',
                  color: l === level ? 'var(--color-primary)' : 'var(--fg-strong)',
                  fontSize: 14, fontWeight: l === level ? 600 : 400, cursor: 'pointer',
                }}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        <div style={{ flex: 1, minHeight: 24 }} />
        <button
          type="button"
          onClick={() => router.push('/signup/complete')}
          disabled={positions.size === 0}
          className="btn btn-lg btn-primary"
          style={{ width: '100%', marginTop: 16 }}
        >
          시작하기 (3/3)
        </button>
      </div>
    </>
  );
}
