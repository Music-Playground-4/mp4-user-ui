import Link from 'next/link';
import { Glyph } from './BrandDefs';
import { LINKS } from '@/lib/content';

export function Header() {
  return (
    <header className="header">
      <Link href="/" className="header-brand" aria-label="밴드할래? 홈">
        <Glyph id="mark" size={34} />
        <div className="wordmark">
          밴드할래<span>?</span>
        </div>
      </Link>
      <div className="header-actions">
        <a
          href={LINKS.instagram}
          className="icon-link"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="인스타그램"
        >
          <Glyph id="ic-insta" size={21} />
        </a>
        <a href="#apply" className="header-cta">
          문의하기
        </a>
      </div>
    </header>
  );
}
