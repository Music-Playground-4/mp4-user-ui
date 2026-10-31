import type { Metadata } from 'next';
import { BrandDefs } from '@/components/site/BrandDefs';
import { Header } from '@/components/site/Header';
import { PageHero } from '@/components/site/PageHero';
import { AdminConsole } from '@/components/site/AdminConsole';

export const metadata: Metadata = {
  title: '예매 관리 — 밴드할래?',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="site">
      <BrandDefs />
      <Header cta={{ href: '/', label: '사이트 홈' }} />
      <main>
        <PageHero backHref="/" backLabel="사이트 홈" title="예매 관리" />
        <section className="section adm-section">
          <AdminConsole />
        </section>
      </main>
    </div>
  );
}
