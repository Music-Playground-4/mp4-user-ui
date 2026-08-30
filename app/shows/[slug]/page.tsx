import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandDefs } from '@/components/site/BrandDefs';
import { Header } from '@/components/site/Header';
import { ShowHero } from '@/components/site/ShowHero';
import { ShowInfo } from '@/components/site/ShowInfo';
import { Lineup } from '@/components/site/Lineup';
import { PosterSection } from '@/components/site/PosterSection';
import { Join } from '@/components/site/Join';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SHOWS, getShow } from '@/lib/content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** 공연은 코드에 들어 있으므로 전부 정적으로 미리 만들어 둡니다. */
export function generateStaticParams() {
  return SHOWS.map((show) => ({ slug: show.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const show = getShow(slug);
  if (!show) return {};

  const title = `밴드할래? VOL.${show.volume} — ${show.title}`;
  const description = `${show.date} ${show.time} · ${show.venue}`;
  return { title, description, openGraph: { title, description } };
}

export default async function ShowPage({ params }: PageProps) {
  const { slug } = await params;
  const show = getShow(slug);
  if (!show) notFound();

  return (
    <div className="site">
      <BrandDefs />
      <Header />
      <main>
        <ShowHero show={show} />
        <ShowInfo show={show} />
        <Lineup show={show} />
        <PosterSection show={show} />
        <Join defaultShowSlug={show.slug} />
      </main>
      <SiteFooter />
    </div>
  );
}
