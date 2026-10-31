'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TICKET_LABEL,
  TICKET_NOTE,
  TICKET_STATE_CHIPS,
  SHOW_TICKET_STATE_SWITCHER,
  type Show,
  type TicketState,
} from '@/lib/content';

interface Props {
  show: Show;
  /** 실제 판매 상태. 예매 저장소가 연결되지 않았으면 서버가 'soon' 으로 낮춰서 넘겨줍니다. */
  ticketState: TicketState;
}

export function ShowInfo({ show, ticketState }: Props) {
  // 개발 참고용 칩으로만 바뀝니다.
  const [ticket, setTicket] = useState<TicketState>(ticketState);
  const note = TICKET_NOTE[ticket];

  return (
    <section id="info" className="section section--dark">
      <div className="eyebrow eyebrow--lead">SHOW INFO</div>

      <div className="info-layout">
        <div className="info-rows">
          <div className="info-row">
            <div className="info-label">일시</div>
            <div className="info-value">
              {show.date}
              <br />
              <span className="info-accent">{show.time}</span> <span className="info-sub">{show.timeNote}</span>
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">장소</div>
            <div className="info-value">
              {show.venue}
              <br />
              <span className="info-sub info-sub--sm">{show.venueNote}</span>
              {show.venueMapUrl && (
                <div className="info-row-action">
                  <a href={show.venueMapUrl} className="map-link" target="_blank" rel="noreferrer noopener">
                    지도에서 보기 →
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">티켓</div>
            <div className="info-value">
              {show.ticketPrice}
              <br />
              <span className="info-sub">{show.ticketPriceNote}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="ticket-slot">
            {ticket === 'presale' && show.ticketing ? (
              <>
                <Link href={`/shows/${show.slug}/tickets`} className="ticket-btn ticket-btn--presale">
                  {TICKET_LABEL[ticket]}
                </Link>
                <div className="ticket-note">
                  {show.ticketing.closesLabel}까지 온라인 예매 ·{' '}
                  <Link href="/ticket" className="ticket-note-link">
                    예매 조회
                  </Link>
                </div>
              </>
            ) : (
              <button type="button" className={`ticket-btn ticket-btn--${ticket}`} disabled>
                {TICKET_LABEL[ticket]}
              </button>
            )}
            {note && <div className="ticket-note">{note}</div>}
          </div>

          {SHOW_TICKET_STATE_SWITCHER && (
            <div className="dev-panel">
              <div className="dev-panel-label">버튼 상태 (개발 참고)</div>
              <div className="dev-chips">
                {TICKET_STATE_CHIPS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className="chip"
                    aria-pressed={ticket === c.value}
                    onClick={() => setTicket(c.value)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
