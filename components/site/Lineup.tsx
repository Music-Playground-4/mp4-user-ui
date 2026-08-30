import { Glyph } from './BrandDefs';
import type { Band, Show } from '@/lib/content';

function BandLinks({ band }: { band: Band }) {
  // 채널이 아직 없는 팀은 링크 줄을 생략합니다.
  const links = (
    [
      { href: band.instagram, icon: 'ic-insta', label: '인스타그램' },
      { href: band.youtube, icon: 'ic-play', label: '유튜브' },
      { href: band.appleMusic, icon: 'ic-note', label: '음원' },
    ] as const
  ).filter((l) => Boolean(l.href));

  if (links.length === 0) return null;

  return (
    <div className="band-links">
      {links.map((l) => (
        <a
          key={l.icon}
          href={l.href}
          className="band-link"
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${band.name ?? l.label} ${l.label}`}
        >
          <Glyph id={l.icon} size={17} />
        </a>
      ))}
    </div>
  );
}

function BandCard({ band }: { band: Band }) {
  // 이름이 있으면 공개된 팀, 없으면 slot 에 따라 두 종류의 자리 카드가 됩니다.
  const revealed = Boolean(band.name);
  const open = !revealed && band.slot === 'open';

  const cardClass = revealed ? 'band-card' : `band-card band-card--${open ? 'open' : 'tba'}`;

  return (
    <article className={cardClass}>
      <div className="band-photo">
        <svg width="150" height="150" viewBox="0 0 100 100" className="band-photo-ghost" aria-hidden="true">
          <g filter="url(#rgh)">
            <use href="#ghost" />
          </g>
        </svg>
        <div className="band-no">{band.no}</div>
        <div className="band-photo-hint">{revealed ? '팀 사진 영역' : open ? '모집 중' : '공개 예정'}</div>
      </div>

      <div className="band-body">
        {revealed ? (
          <>
            <div className="band-name-row">
              <h3 className="band-name">{band.name}</h3>
              <BandLinks band={band} />
            </div>
            {band.tagline && <p className="band-tagline">{band.tagline}</p>}
            {band.members && band.members.length > 0 && (
              <div className="band-members">
                {band.members.map((m, i) => (
                  <span key={`${m}-${i}`} className="member-tag">
                    {m}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : open ? (
          <>
            <h3 className="band-name band-name--open">찾고 있어요</h3>
            <p className="band-tagline">이 카드의 주인공이 될 팀을 기다리고 있어요.</p>
            <a href="#apply" className="band-open-cta">
              참여 문의하기 →
            </a>
          </>
        ) : (
          <>
            <h3 className="band-name-tba">COMING SOON</h3>
            <p className="band-tagline">곧 공개할게요.</p>
          </>
        )}
      </div>
    </article>
  );
}

export function Lineup({ show }: { show: Show }) {
  return (
    <section id="lineup" className="section">
      <div className="lineup-head">
        <div className="eyebrow">LINE UP</div>
        <div className="lineup-count">{show.lineup.length}팀</div>
      </div>
      <h2 className="h-display">이번 무대를 채울 팀</h2>

      <div className="lineup-list">
        {show.lineup.map((band) => (
          <BandCard key={band.no} band={band} />
        ))}
      </div>

      <p className="lineup-note">{show.lineupNote}</p>
    </section>
  );
}
