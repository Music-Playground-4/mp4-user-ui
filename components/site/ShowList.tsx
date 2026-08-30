import Link from 'next/link';
import { UPCOMING_SHOWS, PAST_SHOWS, TICKET_BADGE, type Show } from '@/lib/content';

function ShowCard({ show }: { show: Show }) {
  return (
    <Link href={`/shows/${show.slug}`} className="show-card">
      <div className="show-card-top">
        <div className="date-stamp">{show.badge}</div>
        <div className="show-card-vol">VOL.{show.volume}</div>
        <span className={`show-badge show-badge--${show.ticketState}`}>{TICKET_BADGE[show.ticketState]}</span>
      </div>

      <div className="show-card-title">{show.title}</div>

      <dl className="show-card-meta">
        <dt>일시</dt>
        <dd>
          {show.date} {show.time}
        </dd>
        <dt>장소</dt>
        <dd>{show.venue}</dd>
      </dl>

      <div className="show-card-more">자세히 보기 →</div>
    </Link>
  );
}

export function ShowList() {
  return (
    <section id="shows" className="section section--alt">
      <div className="eyebrow">SHOWS</div>
      <h2 className="h-display">다가오는 공연</h2>

      {UPCOMING_SHOWS.length > 0 ? (
        <div className="show-list">
          {UPCOMING_SHOWS.map((show) => (
            <ShowCard key={show.slug} show={show} />
          ))}
        </div>
      ) : (
        <p className="show-empty">
          준비 중인 공연이 아직 없어요. 아래에서 알림을 신청해 두시면 새 공연이 열릴 때 가장 먼저 알려드릴게요.
        </p>
      )}

      {PAST_SHOWS.length > 0 && (
        <>
          <h3 className="show-past-title">지난 공연</h3>
          <div className="show-list">
            {PAST_SHOWS.map((show) => (
              <ShowCard key={show.slug} show={show} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
