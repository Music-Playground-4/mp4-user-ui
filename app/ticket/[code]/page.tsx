import type { Metadata } from 'next';
import { BrandDefs } from '@/components/site/BrandDefs';
import { Header } from '@/components/site/Header';
import { PageHero } from '@/components/site/PageHero';
import { TicketView } from '@/components/site/TicketView';
import { SiteFooter } from '@/components/site/SiteFooter';

// 개인 티켓이라 검색에 잡히지 않게 합니다.
export const metadata: Metadata = {
  title: '내 티켓 — 밴드할래?',
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ k?: string; new?: string }>;
}

export default async function TicketPage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const { k, new: isNew } = await searchParams;

  return (
    <div className="site">
      <BrandDefs />
      <Header cta={{ href: '/ticket', label: '예매 조회' }} />
      <main>
        <PageHero backHref="/" backLabel="밴드할래? 홈" title="내 티켓" />
        <section className="section tv-section">
          <TicketView ticketKey={{ code: decodeURIComponent(code).toUpperCase(), token: k ?? '' }} isNew={isNew === '1'} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
