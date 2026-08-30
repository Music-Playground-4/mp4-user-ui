import Link from 'next/link';
import { NEXT_SHOW, SLOGAN } from '@/lib/content';

/** 메인 페이지 히어로. 다가오는 공연이 있으면 날짜 스탬프로 함께 알립니다. */
export function Hero() {
  return (
    <section className="hero">
      {/* 배경 장식 — 로고 실루엣을 크게 눕혀 깔아둡니다. */}
      <svg width="420" height="420" viewBox="0 0 100 100" className="hero-ghost" aria-hidden="true">
        <g filter="url(#rgh)" transform="rotate(14 50 50)">
          <use href="#ghost" />
        </g>
      </svg>

      <div className="hero-body">
        {NEXT_SHOW && (
          <div className="hero-badges">
            <div className="date-stamp">{NEXT_SHOW.badge}</div>
            <div className="hero-badge-sub">{NEXT_SHOW.badgeSub}</div>
          </div>
        )}

        <h1 className="hero-title">
          {SLOGAN.top}
          <br />
          <span>{SLOGAN.bottom}</span>
        </h1>

        <p className="hero-lede">
          합주만 하고 무대는 아직인 팀, 멤버는 모였는데 시작을 못 한 팀. 그 첫 무대를 우리가 처음부터 끝까지 같이
          만듭니다.
        </p>

        <div className="cta-row">
          <Link href="#shows" className="cta cta--ink">
            공연 일정 보기
          </Link>
          <Link href="#apply" className="cta cta--orange">
            밴드 참여 문의
          </Link>
        </div>

        <div className="scroll-hint">아래로 스크롤</div>
      </div>
    </section>
  );
}
