'use client';

import { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { postById, USERS } from '@/lib/data';

export default function SessionApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const p = postById(id);
  if (!p) notFound();

  const [position, setPosition] = useState(p.positions[0]);
  const [intro, setIntro] = useState('안녕하세요, 마포에 사는 김민수입니다. 입문 6개월차이지만 일주일에 5~6시간 정도 연습하고 있어요. 인디록 좋아하고 토요일 합주 가능합니다 :)');
  const me = USERS[0];

  const submit = () => {
    if (!intro.trim()) return;
    alert('지원이 접수되었어요! (mock)');
    router.push(`/sessions/${p.id}`);
  };

  return (
    <>
      <TopBar title="지원하기" />
      <div className="scroll-region" style={{ padding: '16px 16px 16px' }}>
        <div style={{ padding: 12, borderRadius: 10, background: 'var(--neutral-99)', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginBottom: 2 }}>지원하는 모집글</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>{p.title}</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>지원 포지션</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {p.positions.map((pos) => (
              <button
                type="button"
                key={pos}
                onClick={() => setPosition(pos)}
                className={position === pos ? 'chip chip-active' : 'chip'}
                style={{ flex: 1, height: 44, justifyContent: 'center', fontSize: 14 }}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>자기 소개</div>
          <textarea
            className="field"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            maxLength={500}
            style={{ minHeight: 120 }}
          />
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', textAlign: 'right', marginTop: 4 }}>
            {intro.length} / 500
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>내 프로필 첨부</div>
            <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>편집</span>
          </div>
          <div style={{ padding: 14, border: '1px solid var(--color-line)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <img src={me.avatar} alt={me.name} style={{ width: 40, height: 40, borderRadius: 20 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>{me.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>{me.position} · {me.region} · {me.level}</div>
              </div>
            </div>

            <div style={{
              padding: '10px 12px', background: 'var(--blue-99)', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Icon name="speaker" size={16} color="var(--color-primary)" strokeWidth={2} />
              <div style={{ flex: 1, fontSize: 12, color: 'var(--fg-strong)' }}>
                보유 장비 <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{me.gears.length}개</span> · 마켓 거래내역 자동 연결
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-line)', background: '#fff', flexShrink: 0 }}>
        <button type="button" onClick={submit} disabled={!intro.trim()} className="btn btn-lg btn-primary" style={{ width: '100%' }}>
          지원 보내기
        </button>
      </div>
    </>
  );
}
