import Link from 'next/link';

interface Props {
  backHref: string;
  backLabel: string;
  /** 날짜 스탬프 (예: 11.14). 없으면 생략 */
  stamp?: string;
  stampSub?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
}

/** 예매·티켓·운영진 같은 보조 페이지 상단. 공연 상세 히어로와 같은 톤을 씁니다. */
export function PageHero({ backHref, backLabel, stamp, stampSub, title, lede }: Props) {
  return (
    <section className="show-hero page-hero">
      <svg width="360" height="360" viewBox="0 0 100 100" className="hero-ghost" aria-hidden="true">
        <g filter="url(#rgh)" transform="rotate(14 50 50)">
          <use href="#ghost" />
        </g>
      </svg>

      <div className="hero-body">
        <Link href={backHref} className="back-link">
          ← {backLabel}
        </Link>

        {stamp && (
          <div className="hero-badges">
            <div className="date-stamp">{stamp}</div>
            {stampSub && <div className="hero-badge-sub">{stampSub}</div>}
          </div>
        )}

        <h1 className="show-hero-title">{title}</h1>
        {lede && <p className="page-hero-lede">{lede}</p>}
      </div>
    </section>
  );
}
