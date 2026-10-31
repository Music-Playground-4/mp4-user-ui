import type { Metadata } from 'next';
import { BrandDefs } from '@/components/site/BrandDefs';
import { Header } from '@/components/site/Header';
import { PageHero } from '@/components/site/PageHero';
import { TicketLookup } from '@/components/site/TicketLookup';
import { SiteFooter } from '@/components/site/SiteFooter';

export const metadata: Metadata = {
  title: '예매 조회 — 밴드할래?',
  robots: { index: false, follow: false },
};

export default function TicketLookupPage() {
  return (
    <div className="site">
      <BrandDefs />
      <Header cta={{ href: '/ticket', label: '예매 조회' }} />
      <main>
        <PageHero backHref="/" backLabel="밴드할래? 홈" title="예매 조회" lede="티켓 링크를 잃어버렸다면 여기서 다시 찾을 수 있어요." />
        <section className="section tv-section">
          <TicketLookup />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
