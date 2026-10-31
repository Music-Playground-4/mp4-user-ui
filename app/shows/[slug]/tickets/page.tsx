import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandDefs } from '@/components/site/BrandDefs';
import { Header } from '@/components/site/Header';
import { PageHero } from '@/components/site/PageHero';
import { TicketBooking } from '@/components/site/TicketBooking';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SHOWS, formatWon, getShow } from '@/lib/content';
import { effectiveTicketState } from '@/lib/ticketStore';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SHOWS.filter((s) => s.ticketing).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const show = getShow(slug);
  if (!show) return {};
  const title = `티켓 예매 — 밴드할래? VOL.${show.volume}`;
  const description = `${show.date} ${show.time} · ${show.venue} · ${show.ticketPrice}`;
  return { title, description, openGraph: { title, description } };
}

export default async function TicketsPage({ params }: PageProps) {
  const { slug } = await params;
  const show = getShow(slug);
  if (!show?.ticketing) notFound();

  return (
    <div className="site">
      <BrandDefs />
      <Header cta={{ href: '/ticket', label: '예매 조회' }} />
      <main>
        <PageHero
          backHref={`/shows/${show.slug}`}
          backLabel="공연 정보"
          stamp={show.badge}
          stampSub={`${show.date} ${show.time}`}
          title={
            <>
              <span className="show-hero-vol">VOL.{show.volume}</span>
              <br />
              티켓 예매
            </>
          }
          lede={
            <>
              {show.venue} · 1매 <b>{formatWon(show.ticketing.price)}원</b>
            </>
          }
        />
        <TicketBooking show={show} ticketing={show.ticketing} ready={effectiveTicketState(show) === 'presale'} />
      </main>
      <SiteFooter />
    </div>
  );
}
