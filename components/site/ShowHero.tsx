import Link from 'next/link';
import type { Show } from '@/lib/content';

/** 공연 상세 페이지 상단. 목록으로 돌아가는 링크를 함께 둡니다. */
export function ShowHero({ show }: { show: Show }) {
  return (
    <section className="show-hero">
      <svg width="360" height="360" viewBox="0 0 100 100" className="hero-ghost" aria-hidden="true">
        <g filter="url(#rgh)" transform="rotate(14 50 50)">
          <use href="#ghost" />
        </g>
      </svg>

      <div className="hero-body">
        <Link href="/#shows" className="back-link">
          ← 공연 목록
        </Link>

        <div className="hero-badges">
          <div className="date-stamp">{show.badge}</div>
          <div className="hero-badge-sub">{show.badgeSub}</div>
        </div>

        <h1 className="show-hero-title">
          밴드할래? <span className="show-hero-vol">VOL.{show.volume}</span>
          <br />
          {show.title}
        </h1>
      </div>
    </section>
  );
}
