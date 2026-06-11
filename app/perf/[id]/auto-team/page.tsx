'use client';

import { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { showById, USERS, type User } from '@/lib/data';

interface Slot {
  pos: string;
  user: User | null;
  status: string;
  match: number | null;
  me?: boolean;
}

export default function PerfAutoTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const s = showById(id);
  if (!s) notFound();

  const [confirmed, setConfirmed] = useState(false);
  const [slots] = useState<Slot[]>([
    { pos: '보컬', user: USERS[1], status: '확정', match: 91 },
    { pos: '기타', user: USERS[0], status: '나 (대기중)', match: 88, me: true },
    { pos: '베이스', user: null, status: '매칭중', match: null },
    { pos: '드럼', user: USERS[2], status: '확정', match: 84 },
  ]);

  const filledCount = slots.filter((s) => s.user).length;

  return (
    <>
      <TopBar title="자동 팀빌딩" />
      <div className="scroll-region" style={{ padding: '20px 16px' }}>
        <div style={{ padding: 14, borderRadius: 12, background: 'var(--blue-99)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Icon name="spark" size={16} color="var(--color-primary)" strokeWidth={2.2} />
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>당신을 포함한 4인 솔로팀이 자동 구성돼요</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-normal)', lineHeight: 1.5 }}>
            장르·실력·지역을 고려해 매칭하고, 합주가 시작되면 단체방이 열립니다. 마음에 들지 않으면 다음 주차 매칭으로 미룰 수 있어요.
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 10 }}>
          구성 현황 · {filledCount} / 4
        </div>
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {slots.map((slot) => (
            <div key={slot.pos} style={{
              padding: 14, borderRadius: 10,
              border: slot.me ? '1.5px solid var(--color-primary)' : '1px solid var(--color-line)',
              background: slot.me ? 'rgba(0,102,255,0.04)' : '#fff',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--neutral-95)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: 'var(--fg-strong)' }}>
                {slot.pos}
              </div>
              {slot.user ? (
                <>
                  <img src={slot.user.avatar} alt={slot.user.name} style={{ width: 36, height: 36, borderRadius: 18 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>
                      {slot.user.name}{slot.me && ' (나)'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>{slot.user.level} · {slot.user.region}</div>
                  </div>
                  {slot.match && <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 700 }}>{slot.match}%</span>}
                </>
              ) : (
                <>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--neutral-90)', display: 'grid', placeItems: 'center', color: 'var(--fg-alternative)' }}>
                    <Icon name="user" size={18} />
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--fg-alternative)' }}>매칭중...</div>
                  <div className="anim-spin" style={{ width: 14, height: 14, borderRadius: 7, border: '2px solid var(--color-primary)', borderTopColor: 'transparent' }} />
                </>
              )}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 10 }}>팀 장르 매칭</div>
        <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--color-line)', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginBottom: 6 }}>4명 모두 즐기는 장르</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            <span className="chip chip-active" style={{ height: 26, fontSize: 12 }}>인디록 · 100%</span>
            <span className="chip" style={{ height: 26, fontSize: 12 }}>시티팝 · 75%</span>
          </div>
          <div style={{ height: 1, background: 'var(--color-line-soft)', margin: '10px 0' }} />
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginBottom: 4 }}>제안 셋리스트</div>
          <div style={{ fontSize: 12, color: 'var(--fg-strong)' }}>새소년, 잔나비, 검정치마, The Volunteers 카피 추천</div>
        </div>

        <div style={{ padding: 12, borderRadius: 10, background: 'var(--neutral-99)', fontSize: 11.5, color: 'var(--fg-alternative)', lineHeight: 1.6 }}>
          매칭 마감까지 D-3. 미확정 시 다음 매칭 주차로 자동 이월돼요.
        </div>

        {confirmed && (
          <div className="anim-fade-up" style={{ marginTop: 16, padding: 14, borderRadius: 10, background: 'var(--green-99)', color: '#008C30', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="anim-pop-in" style={{ display: 'grid', placeItems: 'center' }}>
              <Icon name="check" size={18} strokeWidth={2.4} />
            </span>
            팀 확정 완료! 단체 채팅방을 열었어요
          </div>
        )}
      </div>

      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-line)', background: '#fff', display: 'flex', gap: 8, flexShrink: 0 }}>
        <button type="button" onClick={() => router.back()} className="btn btn-md btn-outlined" style={{ flex: 1, height: 44 }}>다음 주차로</button>
        {confirmed ? (
          <button type="button" onClick={() => router.push(`/perf/${s.id}/chat`)} className="btn btn-md btn-primary" style={{ flex: 1.5, height: 44 }}>
            팀챗으로 이동
          </button>
        ) : (
          <button type="button" onClick={() => setConfirmed(true)} className="btn btn-md btn-primary" style={{ flex: 1.5, height: 44 }}>
            이 팀으로 확정
          </button>
        )}
      </div>

    </>
  );
}
