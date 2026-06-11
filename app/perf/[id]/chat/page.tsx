'use client';

import { useState, useRef, useEffect, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { showById, USERS, type User } from '@/lib/data';

interface Msg {
  user: User | null;
  side: 'left' | 'right';
  text: string;
  time: string;
}

const INITIAL: Msg[] = [
  { user: USERS[1], side: 'left', text: '감사합니다! 셋리스트 마지막 곡 어레인지 한번 다시 맞춰볼까요?', time: '13:01' },
  { user: USERS[2], side: 'left', text: '저는 수요일 9시 이후 가능합니다', time: '13:02' },
  { user: null, side: 'right', text: '저도 9시 좋아요', time: '13:05' },
];

const TABS = ['채팅', '셋리스트', '일정', '정산'];

export default function PerfChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const s = showById(id);
  if (!s) notFound();

  const [tab, setTab] = useState('채팅');
  const [messages, setMessages] = useState(INITIAL);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, tab]);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages([...messages, { user: null, side: 'right', text: draft.trim(), time }]);
    setDraft('');
  };

  return (
    <>
      <div style={{
        height: 54, padding: '0 8px', display: 'flex', alignItems: 'center',
        borderBottom: '1px solid var(--color-line-soft)', background: '#fff', flexShrink: 0,
      }}>
        <button type="button" onClick={() => router.back()} className="topbar-back">
          <Icon name="chevL" size={22} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
          <div style={{ fontSize: 10.5, color: 'var(--color-positive)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--color-positive)' }} />
            D-3 · 4명 모두 확정
          </div>
        </div>
        <button type="button" className="topbar-action">
          <Icon name="settings" size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', padding: '0 16px', background: '#fff', borderBottom: '1px solid var(--color-line-soft)', flexShrink: 0 }}>
        {TABS.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 12px', fontSize: 13, fontWeight: 600, background: 'transparent', border: 0,
              color: tab === t ? 'var(--fg-strong)' : 'var(--fg-alternative)',
              borderBottom: tab === t ? '2px solid var(--fg-strong)' : '2px solid transparent',
              marginBottom: -1, cursor: 'pointer',
            }}
          >
            {t}{t === '채팅' && <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--color-negative)', fontWeight: 700 }}>3</span>}
          </button>
        ))}
      </div>

      {tab === '채팅' && (
        <>
          <div style={{ padding: '10px 16px', background: 'var(--blue-99)', borderBottom: '1px solid var(--color-line-soft)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-primary)', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <Icon name="pin" size={16} strokeWidth={2.2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 700 }}>리허설 D-3</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>5/15 (수) 20:00 · 합정 H스튜디오</div>
            </div>
            <Icon name="chevR" size={16} color="var(--color-primary)" />
          </div>

          <div
            ref={scrollRef}
            className="scroll-region"
            style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--neutral-99)' }}
          >
            <SystemMsg>주최자가 큐시트를 공유했어요</SystemMsg>

            <div style={{ alignSelf: 'flex-start', maxWidth: '88%', padding: 12, borderRadius: 14, border: '1px solid var(--color-line)', background: '#fff' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-alternative)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon name="map" size={12} strokeWidth={2} /> {s.host} · 큐시트
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { t: '17:30', l: '사운드체크 입장' },
                  { t: '19:50', l: '2nd Set 무대' },
                  { t: '20:40', l: '정산 미팅' },
                ].map((c) => (
                  <div key={c.t} style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{c.t}</span>
                    <span style={{ color: 'var(--fg-strong)' }}>{c.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {messages.map((m, i) => <GBubble key={i} {...m} />)}

            <div style={{ alignSelf: 'flex-start', maxWidth: '82%', padding: 12, borderRadius: 14, border: '1px solid var(--color-line)', background: '#fff' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-accent)', marginBottom: 6 }}>정산 예정</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--fg-strong)', fontWeight: 600 }}>
                <span>1인 페이</span>
                <span>75,000원</span>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--fg-alternative)', marginTop: 2 }}>30만원 ÷ 4명 · 공연 종료 후 자동 분배</div>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            style={{ padding: '8px 12px 12px', borderTop: '1px solid var(--color-line-soft)', background: '#fff', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}
          >
            <button type="button" style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--neutral-95)', border: 0, display: 'grid', placeItems: 'center', color: 'var(--fg-normal)', cursor: 'pointer' }}>
              <Icon name="plus" size={20} />
            </button>
            <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="메시지 입력" className="bubble-input" />
            <button type="submit" disabled={!draft.trim()} style={{ width: 36, height: 36, borderRadius: 18, background: draft.trim() ? 'var(--color-primary)' : 'var(--color-line)', border: 0, display: 'grid', placeItems: 'center', color: '#fff', cursor: draft.trim() ? 'pointer' : 'not-allowed' }}>
              <Icon name="chevR" size={18} strokeWidth={2.4} />
            </button>
          </form>
        </>
      )}

      {tab !== '채팅' && (
        <div className="scroll-region" style={{ padding: 24, textAlign: 'center', color: 'var(--fg-alternative)', fontSize: 13 }}>
          {tab} 화면은 곧 만나요 (mock)
        </div>
      )}
    </>
  );
}

function SystemMsg({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ alignSelf: 'center', padding: '4px 12px', background: 'rgba(0,102,255,0.08)', color: 'var(--color-primary)', borderRadius: 8, fontSize: 11, fontWeight: 500 }}>
      {children}
    </div>
  );
}

function GBubble({ user, side, text, time }: Msg) {
  const isRight = side === 'right';
  return (
    <div className="anim-fade-up" style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      flexDirection: isRight ? 'row-reverse' : 'row',
      maxWidth: '85%', alignSelf: isRight ? 'flex-end' : 'flex-start',
    }}>
      {!isRight && user && <img src={user.avatar} alt={user.name} style={{ width: 30, height: 30, borderRadius: 15, flexShrink: 0 }} />}
      <div>
        {!isRight && user && <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginBottom: 2 }}>{user.name}</div>}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, flexDirection: isRight ? 'row-reverse' : 'row' }}>
          <div style={{
            padding: '9px 13px', borderRadius: 14,
            background: isRight ? 'var(--color-primary)' : '#fff',
            color: isRight ? '#fff' : 'var(--fg-strong)',
            border: isRight ? 'none' : '1px solid var(--color-line-soft)',
            fontSize: 13, lineHeight: 1.4, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {text}
          </div>
          <span style={{ fontSize: 10, color: 'var(--fg-assistive)' }}>{time}</span>
        </div>
      </div>
    </div>
  );
}
