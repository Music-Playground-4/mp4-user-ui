import type { Metadata, Viewport } from 'next';
import './globals.css';
import { NEXT_SHOW, SLOGAN } from '@/lib/content';

// 폰트는 Google Fonts CSS2 API 로 불러옵니다.
// next/font 는 Gaegu·Gothic A1 의 korean 서브셋을 제공하지 않아(latin 전용) 한글이 폴백되므로,
// unicode-range 로 필요한 글리프만 내려주는 CSS2 링크 방식을 씁니다.
const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Gothic+A1:wght@400;500;700;800;900&family=Archivo+Black&display=swap';

const TITLE = `밴드할래? — ${SLOGAN.top} ${SLOGAN.bottom}`;

const DESCRIPTION =
  '합주만 하고 무대는 아직인 팀, 멤버는 모였는데 시작을 못 한 팀. 그 첫 무대를 우리가 처음부터 끝까지 같이 만듭니다.';

// 공연 정보가 바뀌면 공유 카드 문구도 함께 따라오도록 content.ts 에서 만듭니다.
const OG_DESCRIPTION = NEXT_SHOW
  ? `${NEXT_SHOW.date} ${NEXT_SHOW.time} · ${NEXT_SHOW.venue}. 함께 설 팀을 찾습니다.`
  : DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: OG_DESCRIPTION,
    type: 'website',
    locale: 'ko_KR',
    images: [{ url: '/brand/bandhallae-post-1080x1080.png', width: 1080, height: 1080 }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#EFE7D6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONT_CSS} />
      </head>
      <body>{children}</body>
    </html>
  );
}
