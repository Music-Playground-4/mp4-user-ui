import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppFrame } from '@/components/app/AppFrame';

export const metadata: Metadata = {
  title: 'MP4 — 음악인을 위한 매칭 플랫폼',
  description: '장비를 사고, 합주를 찾고, 무대를 만들고.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.4/packages/wanted-sans/fonts/webfonts/static/complete/WantedSans.min.css"
        />
      </head>
      <body>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
