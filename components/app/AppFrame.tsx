'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SideNav } from './Nav';

const UNFRAMED_PATHS = ['/gallery'];

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  const unframed = UNFRAMED_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (unframed) {
    return (
      <div key={pathname} className="route-enter" style={{ display: 'contents' }}>
        {children}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <SideNav />
      <main className="app-main">
        <div
          key={pathname}
          className="route-enter"
          style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', flex: 1 }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
