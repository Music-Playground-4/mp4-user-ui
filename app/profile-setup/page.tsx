'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { StepBar, Spinner } from '@/components/ui/AuthForm';
import { LoadingState } from '@/components/ui/State';
import { useAuth } from '@/lib/auth';
import { useAsync, errorText } from '@/lib/useApi';
import { usersApi, type UserProfile } from '@/lib/api';
import { POSITIONS, GENRES, REGIONS } from '@/lib/data';

const LEVELS = ['입문 6개월차', '입문 1년', '취미 2~3년', '경력 5년 이상', '세션·강사'];

export default function ProfileSetupPage() {
  const router = useRouter();
  const { token, status } = useAuth();

  const profile = useAsync<UserProfile>(token ? () => usersApi.me(token) : null, [token]);

  const [positions, setPositions] = useState<Set<string>>(new Set());
  const [genres, setGenres] = useState<Set<string>>(new Set());
  const [level, setLevel] = useState(LEVELS[0]);
  const [region, setRegion] = useState('');
  const [bio, setBio] = useState('');
  const [levelOpen, setLevelOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 이미 프로필이 있으면 "편집", 없으면 가입 3단계로 취급해 이동 경로를 나눈다
  const [isEdit, setIsEdit] = useState(false);

  // 서버 값으로 폼 초기화 (편집 진입 시 기존 선택이 그대로 보이도록)
  useEffect(() => {
    const p = profile.data;
    if (!p) return;
    if (p.position) setPositions(new Set([p.position]));
    if (p.genres.length) setGenres(new Set(p.genres));
    if (p.level) setLevel(p.level);
    if (p.region) setRegion(p.region);
    if (p.bio) setBio(p.bio);
    setIsEdit(Boolean(p.position || p.genres.length || p.level || p.region || p.bio));
  }, [profile.data]);

  const togglePos = (p: string) => {
    const next = new Set(positions);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    setPositions(next);
  };
  const toggleGenre = (g: string) => {
    const next = new Set(genres);
    if (next.has(g)) next.delete(g);
    else if (next.size < 5) next.add(g);
    setGenres(next);
  };

  const onSubmit = async () => {
    if (!token || positions.size === 0) return;
    setSaving(true);
    setError(null);
    try {
      await usersApi.update(token, {
        // 백엔드 position 은 단일 문자열(주 포지션)이라 첫 선택만 보낸다
        position: Array.from(positions)[0],
        genres: Array.from(genres),
        level,
        ...(region ? { region } : {}),
        ...(bio.trim() ? { bio: bio.trim() } : {}),
      });
      router.push(isEdit ? '/my' : '/signup/complete');
    } catch (e) {
      setError(errorText(e));
      setSaving(false);
    }
  };

  if (status === 'loading' || profile.loading) {
    return (
      <>
        <TopBar title="" />
        <LoadingState rows={3} />
      </>
    );
  }

  return (
    <>
      <TopBar title="" backHref={isEdit ? '/my' : '/signup/activity'} />
      <div style={{ flex: 1, padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {!isEdit && <StepBar step={3} />}

        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          {isEdit ? '프로필을 수정해요' : '연주하는 악기를 알려주세요'}
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

        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 10 }}>활동 지역</div>
        <button
          type="button"
          onClick={() => setRegionOpen(!regionOpen)}
          className="field"
          style={{ width: '100%', justifyContent: 'space-between', background: '#fff', cursor: 'pointer' }}
        >
          <span style={{ color: region ? 'var(--fg-strong)' : 'var(--fg-assistive)' }}>
            {region || '지역을 선택해 주세요'}
          </span>
          <Icon name={regionOpen ? 'chevU' : 'chevD'} size={18} color="var(--fg-assistive)" />
        </button>
        {regionOpen && (
          <div style={{ marginTop: 4, border: '1px solid var(--color-line)', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
            {REGIONS.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => {
                  setRegion(r);
                  setRegionOpen(false);
                }}
                style={{
                  width: '100%', textAlign: 'left', padding: '12px 14px', border: 0,
                  background: r === region ? 'var(--blue-99)' : '#fff',
                  color: r === region ? 'var(--color-primary)' : 'var(--fg-strong)',
                  fontSize: 14, fontWeight: r === region ? 600 : 400, cursor: 'pointer',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* 신뢰점수의 '프로필 완성' 항목이 bio 를 요구한다 (position·region·bio·avatar·genres) */}
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-strong)', margin: '24px 0 10px' }}>한 줄 소개</div>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 200))}
          placeholder="어떤 음악을 좋아하는지, 어떤 합주를 찾는지 적어 주세요"
          rows={3}
          className="field"
          style={{ width: '100%', resize: 'none', lineHeight: 1.6, padding: '12px 14px' }}
        />
        <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 4, textAlign: 'right' }}>
          {bio.length}/200
        </div>

        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-strong)', margin: '24px 0 10px' }}>경력</div>
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
          <div style={{ marginTop: 4, border: '1px solid var(--color-line)', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
            {LEVELS.map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => {
                  setLevel(l);
                  setLevelOpen(false);
                }}
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

        {error && (
          <div role="alert" style={{ marginTop: 16, fontSize: 13, color: 'var(--color-negative)' }}>
            {error}
          </div>
        )}

        <div style={{ flex: 1, minHeight: 24 }} />
        <button
          type="button"
          onClick={onSubmit}
          disabled={positions.size === 0 || saving}
          className="btn btn-lg btn-primary"
          style={{ width: '100%', marginTop: 16 }}
        >
          {saving ? <Spinner /> : isEdit ? '저장하기' : '시작하기 (3/3)'}
        </button>
      </div>
    </>
  );
}
