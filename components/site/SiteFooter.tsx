import { Glyph } from './BrandDefs';
import { LINKS } from '@/lib/content';

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Glyph id="mark" size={40} />
        <div className="wordmark">
          밴드할래<span>?</span>
        </div>
      </div>

      <div className="footer-links">
        <a href={LINKS.instagram} target="_blank" rel="noreferrer noopener">
          <Glyph id="ic-insta" size={17} />
          {LINKS.instagramHandle}
        </a>
        <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
      </div>

      <div className="footer-copy">© 2026 밴드할래? All rights reserved.</div>
    </footer>
  );
}
