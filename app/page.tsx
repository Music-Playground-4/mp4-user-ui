import { BrandDefs } from '@/components/site/BrandDefs';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { ShowList } from '@/components/site/ShowList';
import { WhatWeDo } from '@/components/site/WhatWeDo';
import { Join } from '@/components/site/Join';
import { SiteFooter } from '@/components/site/SiteFooter';

export default function HomePage() {
  return (
    <div className="site">
      <BrandDefs />
      <Header />
      <main>
        <Hero />
        <ShowList />
        <WhatWeDo />
        <Join />
      </main>
      <SiteFooter />
    </div>
  );
}
