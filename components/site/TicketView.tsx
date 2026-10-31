'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiError, fetchTicket } from '@/lib/api';
import { formatWon, getShow, LINKS, TICKET_ACCOUNT } from '@/lib/content';
import { formatKst, saveMyTicket } from '@/lib/myTickets';
import { TICKET_STATUS_LABEL, type PublicTicket, type TicketKey } from '@/lib/tickets';
import { CopyButton } from './CopyButton';

// 입금 대기 중에는 이 간격으로 다시 확인해서, 운영진이 입금 확인을 누르면 화면이 저절로 티켓으로 바뀝니다.
const POLL_MS = 15_000;

/** 1초마다 바뀌는 시계. 스크린샷이 아니라 지금 열려 있는 화면이라는 걸 입구에서 바로 알아보게 합니다. */
function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <span className="tk-clock">--:--:--</span>;
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);
  return <span className="tk-clock">{time}</span>;
}

function Ticket({ ticket }: { ticket: PublicTicket }) {
  const show = getShow(ticket.showSlug);
  const entered = ticket.status === 'entered';

  return (
    <div className={`tk${entered ? ' tk--used' : ''}`}>
      <div className="tk-shine" aria-hidden="true" />
      <div className="tk-main">
        <div className="tk-top">
          <span className="tk-brand">
            밴드할래? <span>VOL.{show?.volume}</span>
          </span>
          <span className="tk-admit">ADMIT {ticket.qty}</span>
        </div>

        <div className="tk-title">{show?.title}</div>

        <dl className="tk-meta">
          <div>
            <dt>DATE</dt>
            <dd>{show?.badge}</dd>
          </div>
          <div>
            <dt>TIME</dt>
            <dd>{show?.time}</dd>
          </div>
          <div className="tk-meta-wide">
            <dt>VENUE</dt>
            <dd>{show?.venue}</dd>
          </div>
        </dl>

        <div className="tk-holder">
          <span className="tk-holder-label">예매자</span>
          <span className="tk-holder-name">{ticket.name}</span>
          <span className="tk-holder-qty">{ticket.qty}매</span>
        </div>
      </div>

      <div className="tk-perf" aria-hidden="true" />

      <div className="tk-stub">
        <div className="tk-code">{ticket.code}</div>
        <div className="tk-live">
          <span className="tk-dot" aria-hidden="true" />
          {entered ? '입장 완료' : 'LIVE'} <LiveClock />
        </div>
        <div className="tk-guide">
          {entered ? `${formatKst(ticket.enteredAt)} 입장했어요. 즐거운 공연 되세요!` : '입구에서 이 화면을 보여주세요'}
        </div>
      </div>

      {entered && (
        <div className="tk-stamp" aria-hidden="true">
          ENTERED
        </div>
      )}
    </div>
  );
}

function PendingCard({ ticket, link }: { ticket: PublicTicket; link: string }) {
  const show = getShow(ticket.showSlug);
  return (
    <div className="pay-card">
      <div className="pay-head">
        <span className="pay-badge">입금 대기</span>
        <span className="pay-code">{ticket.code}</span>
      </div>

      <div className="pay-amount">
        {formatWon(ticket.amount)}
        <span>원</span>
      </div>
      <div className="pay-amount-sub">
        {ticket.qty}매 × {formatWon(ticket.amount / Math.max(ticket.qty, 1))}원
      </div>

      <dl className="pay-rows">
        <div className="pay-row">
          <dt>은행</dt>
          <dd>{TICKET_ACCOUNT.bank}</dd>
        </div>
        <div className="pay-row">
          <dt>계좌번호</dt>
          <dd>
            <span className="pay-account">{TICKET_ACCOUNT.number}</span>
            <CopyButton text={TICKET_ACCOUNT.number.replace(/-/g, '')} />
          </dd>
        </div>
        <div className="pay-row">
          <dt>예금주</dt>
          <dd>{TICKET_ACCOUNT.holder}</dd>
        </div>
        <div className="pay-row">
          <dt>입금자명</dt>
          <dd>
            <strong>{ticket.depositor}</strong>
          </dd>
        </div>
      </dl>

      <p className="pay-note">
        {show?.ticketing?.depositNote} 입금자명이 다르면 확인이 늦어질 수 있어요.
      </p>

      <div className="pay-wait">
        <span className="pay-wait-dot" aria-hidden="true" />
        <span>
          입금이 확인되면 이 화면이 바로 <strong>모바일 티켓</strong>으로 바뀌어요.
        </span>
      </div>

      <div className="pay-save">
        <span>이 페이지 주소가 곧 티켓이에요. 꼭 저장해 두세요.</span>
        <CopyButton text={link} label="티켓 링크 복사" className="copy-btn--wide" />
      </div>
    </div>
  );
}

export function TicketView({ ticketKey, isNew }: { ticketKey: TicketKey; isNew: boolean }) {
  const [ticket, setTicket] = useState<PublicTicket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState('');

  const load = useCallback(async () => {
    try {
      const t = await fetchTicket(ticketKey);
      setTicket(t);
      setError(null);
    } catch (err) {
      // 이미 화면에 티켓이 있으면 잠깐의 네트워크 오류로 지우지 않습니다.
      setError(err instanceof ApiError ? err.message : '잠시 후 다시 시도해 주세요.');
    }
  }, [ticketKey]);

  useEffect(() => {
    setLink(`${window.location.origin}/ticket/${ticketKey.code}?k=${ticketKey.token}`);
    // 다른 기기에서 받은 링크로 열어도 이 기기의 '내 티켓'에 남깁니다.
    saveMyTicket(ticketKey);
    void load();
  }, [ticketKey, load]);

  useEffect(() => {
    if (ticket?.status !== 'pending') return;
    const id = setInterval(() => void load(), POLL_MS);
    return () => clearInterval(id);
  }, [ticket?.status, load]);

  if (!ticket) {
    return (
      <div className="tv-empty">
        {error ? (
          <>
            <p className="tv-empty-title">{error}</p>
            <Link href="/ticket" className="tv-link">
              이름·연락처로 예매 찾기 →
            </Link>
          </>
        ) : (
          <p className="tv-loading">티켓을 불러오는 중…</p>
        )}
      </div>
    );
  }

  const show = getShow(ticket.showSlug);

  return (
    <div className="tv">
      {isNew && ticket.status === 'pending' && (
        <div className="tv-done">
          <div className="sent-title">예매 신청 완료!</div>
          <p>아래 계좌로 입금하면 예매가 확정돼요.</p>
        </div>
      )}

      {ticket.status === 'pending' && <PendingCard ticket={ticket} link={link} />}
      {(ticket.status === 'paid' || ticket.status === 'entered') && <Ticket ticket={ticket} />}
      {ticket.status === 'canceled' && (
        <div className="pay-card">
          <div className="pay-head">
            <span className="pay-badge pay-badge--off">취소됨</span>
            <span className="pay-code">{ticket.code}</span>
          </div>
          <p className="pay-note">
            취소된 예매예요. 잘못 취소됐다면 인스타그램 DM({LINKS.instagramHandle})으로 예매번호와 함께 알려 주세요.
          </p>
        </div>
      )}

      <dl className="tv-info">
        <div>
          <dt>상태</dt>
          <dd>{TICKET_STATUS_LABEL[ticket.status]}</dd>
        </div>
        <div>
          <dt>공연</dt>
          <dd>
            {show ? (
              <Link href={`/shows/${show.slug}`}>
                {show.date} {show.time}
              </Link>
            ) : (
              ticket.showSlug
            )}
          </dd>
        </div>
        <div>
          <dt>장소</dt>
          <dd>{show?.venue}</dd>
        </div>
        <div>
          <dt>예매자</dt>
          <dd>
            {ticket.name} · {ticket.phoneMasked}
          </dd>
        </div>
        <div>
          <dt>보러 오는 팀</dt>
          <dd>{ticket.team}</dd>
        </div>
        <div>
          <dt>신청</dt>
          <dd>{formatKst(ticket.createdAt)}</dd>
        </div>
      </dl>

      <p className="tv-help">
        문의는 인스타그램 DM{' '}
        <a href={LINKS.instagram} target="_blank" rel="noreferrer noopener">
          {LINKS.instagramHandle}
        </a>{' '}
        으로 예매번호와 함께 보내 주세요.
      </p>
    </div>
  );
}
