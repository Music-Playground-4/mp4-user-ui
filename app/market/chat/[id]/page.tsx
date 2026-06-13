'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { gearById, userById, formatPrice } from '@/lib/data';

interface Msg { side: 'left' | 'right'; text: string; time: string; }

export default function MarketChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const g = gearById(id);
  const seller = g ? userById(g.seller ?? '') : null;
  if (!g || !seller) notFound();

  const [messages, setMessages] = useState<Msg[]>([
    { side: 'left', text: '안녕하세요, 게시글 보고 연락드려요. 미사용 상태인가요?', time: '14:31' },
    { side: 'right', text: '네 녹음할 때만 잠깐 잡았었어요. 외관은 사진 그대로입니다.', time: '14:32' },
    { side: 'left', text: '10만원에 거래 가능할까요?', time: '14:33' },
    { side: 'right', text: '11만원이면 케이블도 같이 드릴게요. 합정역 가능하세요?', time: '14:35' },
  ]);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reserved, setReserved] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages([...messages, { side: 'right', text: draft.trim(), time }]);
    setDraft('');
  };

  return (
    <>
      <TopBar
        title={seller.name}
        right={
          <button type="button" className="topbar-action">
            <Icon name="settings" size={20} />
          </button>
        }
      />

      <div style={{
        padding: '10px 16px', background: 'var(--neutral-99)', display: 'flex', gap: 10,
        alignItems: 'center', borderBottom: '1px solid var(--color-line-soft)', flexShrink: 0,
      }}>
        <Link
          href={`/market/${g.id}`}
          className="pressable"
          style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6 }}
          aria-label="상품 상세 보기"
        >
          <div style={{ width: 44, height: 44, borderRadius: 6, background: `url(${g.images?.[0]}) center/cover`, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: 'var(--fg-alternative)' }}>{reserved ? '예약중' : '거래중'}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 1 }}>{formatPrice(g.price)}</div>
          </div>
          <Icon name="chevR" size={16} color="var(--fg-assistive)" />
        </Link>
        <button
          type="button"
          onClick={() => setReserved(!reserved)}
          style={{ height: 32, padding: '0 12px', border: '1px solid var(--color-line)', borderRadius: 6, background: reserved ? 'var(--color-primary)' : '#fff', color: reserved ? '#fff' : 'var(--fg-strong)', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
        >
          {reserved ? '예약중' : '예약하기'}
        </button>
      </div>

      <div
        ref={scrollRef}
        className="scroll-region"
        style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--neutral-99)' }}
      >
        <DateBadge>오늘</DateBadge>
        {messages.map((m, i) => <Bubble key={i} {...m} />)}
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

function Bubble({ side, text, time }: Msg) {
  const isRight = side === 'right';
  return (
    <div className="anim-fade-up" style={{
      alignSelf: isRight ? 'flex-end' : 'flex-start',
      maxWidth: '75%', display: 'flex', alignItems: 'flex-end',
      gap: 6, flexDirection: isRight ? 'row-reverse' : 'row',
    }}>
      <div style={{
        padding: '9px 13px', borderRadius: 16,
        background: isRight ? 'var(--color-primary)' : '#fff',
        color: isRight ? '#fff' : 'var(--fg-strong)',
        border: isRight ? 'none' : '1px solid var(--color-line-soft)',
        fontSize: 13, lineHeight: 1.4, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        {text}
      </div>
      <span style={{ fontSize: 10, color: 'var(--fg-assistive)', marginBottom: 2 }}>{time}</span>
    </div>
  );
}
