import Link from 'next/link';
import { Glyph } from './BrandDefs';
import { LINKS } from '@/lib/content';

interface HeaderProps {
  /** 오른쪽 버튼. 기본은 같은 페이지의 참여 문의(#apply)로 내려가는 '문의하기'. */
  cta?: { href: string; label: string };
}

export function Header({ cta = { href: '#apply', label: '문의하기' } }: HeaderProps) {
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
        <a href={cta.href} className="header-cta">
          {cta.label}
        </a>
      </div>
    </header>
  );
}
