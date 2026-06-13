'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { GradePill } from '@/components/ui/Pills';
import { TopBar } from '@/components/app/Nav';
import { userById, GEARS, formatPrice } from '@/lib/data';

export default function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const u = userById(id);

  if (!u) notFound();

  // 이 판매자가 올린 장터 매물
  const listings = GEARS.filter((g) => g.seller === u.id);

  return (
    <>
      <TopBar
        title={u.name}
        right={
          <button type="button" className="topbar-action" aria-label="더보기">
            <Icon name="settings" size={20} />
          </button>
        }
      />

      <div className="scroll-region">
        <div style={{ padding: '8px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={u.avatar} alt={u.name} style={{ width: 64, height: 64, borderRadius: 32 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.01em' }}>{u.name}</div>
                <span className="badge" style={{ background: 'rgba(0,102,255,0.10)', color: 'var(--color-primary)', fontSize: 10 }}>본인인증</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-alternative)' }}>{u.position} · {u.region}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 1 }}>{u.level} · {u.genres.join(' · ')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 14, fontWeight: 700, color: 'var(--color-primary)' }}>
              4.9 ★
            </div>
          </div>

          {u.bio && (
            <div style={{ marginTop: 14, fontSize: 13, lineHeight: 1.6, color: 'var(--fg-normal)' }}>{u.bio}</div>
          )}

          <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
            <Stat n={String(listings.length)} l="장터 매물" />
            <Stat n="12" l="거래완료" />
            <Stat n="4.9" l="평점" />
            <Stat n="98%" l="응답률" />
          </div>
        </div>

        <div style={{ height: 8, background: 'var(--neutral-99)' }} />

        <div style={{ padding: '16px 16px 8px', fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>
          판매 중인 장비 {listings.length > 0 && `(${listings.length})`}
        </div>

        {listings.length > 0 ? (
          <div style={{ padding: '8px 16px 96px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {listings.map((g) => (
              <Link key={g.id} href={`/market/${g.id}`}>
                <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 8, background: `url(${g.images?.[0]}) center/cover`, position: 'relative', marginBottom: 6 }}>
                  <div style={{ position: 'absolute', top: 6, left: 6 }}>
                    <GradePill grade={g.grade} />
                  </div>
                  {g.status === 'sold' && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                      display: 'grid', placeItems: 'center', borderRadius: 8,
                      color: '#fff', fontSize: 13, fontWeight: 700,
                    }}>
                      판매완료
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-normal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {g.title}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 2 }}>{formatPrice(g.price)}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ padding: '32px 16px 96px', textAlign: 'center', color: 'var(--fg-alternative)', fontSize: 13 }}>
            판매 중인 장비가 없어요
          </div>
        )}
      </div>

      <div style={{
        padding: '10px 16px', borderTop: '1px solid var(--color-line)',
        background: '#fff', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0,
      }}>
        <button type="button" className="btn btn-md btn-outlined" style={{ flex: 1, height: 44 }}>팔로우</button>
        <button
          type="button"
          onClick={() => router.push(`/chats`)}
          className="btn btn-md btn-primary"
          style={{ flex: 1.5, height: 44 }}
        >
          채팅하기
        </button>
      </div>
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div style={{ flex: 1, padding: '10px 6px', background: 'var(--neutral-99)', borderRadius: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', fontVariantNumeric: 'tabular-nums' }}>{n}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 1 }}>{l}</div>
    </div>
  );
}
