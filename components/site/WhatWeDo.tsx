import { Glyph } from './BrandDefs';
import { SERVICES, SLOGAN, NEXT_SHOW } from '@/lib/content';

export function WhatWeDo() {
  return (
    <section className="section section--alt">
      <div className="eyebrow">WHAT WE DO</div>
      <h2 className="h-display h-display--loose">밴드할래?가 하는 것</h2>

      <div className="service-grid">
        {SERVICES.map((s) => (
          <div key={s.title} className="service-card">
            <Glyph id={s.icon} size={44} />
            <div className="service-title">{s.title}</div>
            <p className="service-desc">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="vol-banner">
        <div className="vol-slogan">
          {SLOGAN.top}
          <br />
          {SLOGAN.bottom}
        </div>
        {/* 다가오는 공연이 있을 때만 회차를 함께 보여줍니다. */}
        {NEXT_SHOW && (
          <div className="vol-num">
            VOL.
            <br />
            {NEXT_SHOW.volume}
          </div>
        )}
      </div>
    </section>
  );
}
