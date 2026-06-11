'use client';

import { useState, useRef, useEffect, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { postById, USERS, type User } from '@/lib/data';

interface Msg {
  user: User | null;
  side: 'left' | 'right';
  text: string;
  time: string;
}

const INITIAL: Msg[] = [
  { user: USERS[0], side: 'left', text: '안녕하세요!! 잘 부탁드립니다 ㅎㅎ', time: '14:32' },
  { user: USERS[3], side: 'left', text: '반가워요 :) 토요일 보면 되는 거죠?', time: '14:33' },
  { user: null, side: 'right', text: '네 토요일 6시 신촌 라이브하우스에서 만나요', time: '14:36' },
  { user: USERS[1], side: 'left', text: '저 두번째 곡 좋아요', time: '11:20' },
];

export default function SessionChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const p = postById(id);
  if (!p) notFound();

  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [draft, setDraft] = useState('');
  const [voted, setVoted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

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
        borderBottom: '1px solid var(--color-line-soft)', background: '#fff',
        position: 'sticky', top: 0, zIndex: 5, flexShrink: 0,
      }}>
        <button type="button" onClick={() => router.back()} className="topbar-back">
          <Icon name="chevL" size={22} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{p.title}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>5명 · 토요일 18:00</div>
        </div>
        <button type="button" className="topbar-action">
          <Icon name="settings" size={20} />
        </button>
      </div>

      <div style={{ padding: '10px 16px', background: 'var(--neutral-99)', borderBottom: '1px solid var(--color-line-soft)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Icon name="pin" size={12} color="var(--fg-alternative)" strokeWidth={2} />
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-alternative)' }}>합주 셋리스트 · 5/14</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Yellow Fever - 새소년', '초록바다 - 잔나비', 'Antifreeze - 백예린'].map((t) => (
            <span key={t} className="chip" style={{ height: 24, padding: '0 8px', fontSize: 11, background: '#fff' }}>{t}</span>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scroll-region"
        style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--neutral-99)' }}
      >
        <DateBadge>2일 전</DateBadge>
        <SystemMsg>김민수님이 합류했어요</SystemMsg>

        {messages.slice(0, 3).map((m, i) => <GBubble key={i} {...m} />)}

        <DateBadge>오늘</DateBadge>

        <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: 14, borderRadius: 14, border: '1px solid var(--color-line)', background: '#fff' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="music" size={12} strokeWidth={2} /> 셋리스트 제안
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 6 }}>이번주 합주곡 추가 제안</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            {[{ t: 'Salty - The Volunteers', vote: voted ? 4 : 3 }, { t: 'I Wonder - 아도이', vote: 1 }].map((s) => (
              <div key={s.t} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--neutral-99)', borderRadius: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--fg-strong)' }}>{s.t}</span>
                <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>+{s.vote}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setVoted(!voted)}
            style={{
              width: '100%', height: 32, borderRadius: 6,
              border: '1px solid var(--color-primary)',
              background: voted ? 'var(--color-primary)' : 'rgba(0,102,255,0.05)',
              color: voted ? '#fff' : 'var(--color-primary)', fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {voted ? '투표 완료' : '투표하기'}
          </button>
        </div>

        {messages.slice(3).map((m, i) => <GBubble key={`b${i}`} {...m} />)}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        style={{ padding: '8px 12px 12px', borderTop: '1px solid var(--color-line-soft)', background: '#fff', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}
      >
        <button type="button" style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--neutral-95)', border: 0, display: 'grid', placeItems: 'center', color: 'var(--fg-normal)', cursor: 'pointer' }}>
          <Icon name="plus" size={20} />
        </button>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="메시지 입력"
          className="bubble-input"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          style={{ width: 36, height: 36, borderRadius: 18, background: draft.trim() ? 'var(--color-primary)' : 'var(--color-line)', border: 0, display: 'grid', placeItems: 'center', color: '#fff', cursor: draft.trim() ? 'pointer' : 'not-allowed' }}
        >
          <Icon name="chevR" size={18} strokeWidth={2.4} />
        </button>
      </form>
    </>
  );
}

function DateBadge({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ alignSelf: 'center', padding: '4px 12px', background: 'rgba(0,0,0,0.06)', color: 'var(--fg-alternative)', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
      {children}
    </div>
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
