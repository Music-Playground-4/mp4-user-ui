'use client';

import { useState } from 'react';
import {
  TICKET_LABEL,
  TICKET_NOTE,
  TICKET_STATE_CHIPS,
  SHOW_TICKET_STATE_SWITCHER,
  type Show,
  type TicketState,
} from '@/lib/content';

export function ShowInfo({ show }: { show: Show }) {
  // 기본값은 공연 데이터의 ticketState. 개발 참고용 칩으로만 바뀝니다.
  const [ticket, setTicket] = useState<TicketState>(show.ticketState);
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
            {/* 예매처가 정해지면 presale 상태에서만 <a href={예매URL}> 로 바꾸면 됩니다. */}
            <button type="button" className={`ticket-btn ticket-btn--${ticket}`} disabled={ticket !== 'presale'}>
              {TICKET_LABEL[ticket]}
            </button>
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
