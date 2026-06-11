'use client';

import { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { GradePill } from '@/components/ui/Pills';
import { gearById, userById, formatPrice } from '@/lib/data';

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const g = gearById(id);
  const [fav, setFav] = useState(false);
  const [playing, setPlaying] = useState(false);

  if (!g) notFound();
  const seller = userById(g.seller ?? '') ?? null;

  return (
    <>
      <div style={{ position: 'absolute', top: 8, left: 8, right: 8, zIndex: 10, display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(0,0,0,0.4)', border: 0, color: '#fff', display: 'grid', placeItems: 'center', backdropFilter: 'blur(12px)', cursor: 'pointer' }}>
          <Icon name="chevL" size={20} />
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => setFav(!fav)}
            className="heart-btn"
            data-on={fav}
            style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(0,0,0,0.4)', border: 0, color: fav ? 'var(--color-negative)' : '#fff', display: 'grid', placeItems: 'center', backdropFilter: 'blur(12px)', cursor: 'pointer', transition: 'color var(--dur-fast) var(--ease-standard)' }}
          >
            <span className="heart-icon" style={{ display: 'grid', placeItems: 'center' }}>
              <Icon name={fav ? 'heartFill' : 'heart'} size={18} />
            </span>
          </button>
          <button type="button" style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(0,0,0,0.4)', border: 0, color: '#fff', display: 'grid', placeItems: 'center', backdropFilter: 'blur(12px)', cursor: 'pointer' }}>
            <Icon name="settings" size={18} />
          </button>
        </div>
      </div>

      <div className="scroll-region" style={{ paddingBottom: 80 }}>
        <div className="anim-fade" style={{ width: '100%', height: 300, background: `url(${g.images?.[0]}) center/cover`, position: 'relative' }}>
          <div style={{
            position: 'absolute', bottom: 12, right: 12, padding: '4px 10px',
            borderRadius: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, fontWeight: 600,
          }}>
            1 / {g.images?.length ?? 1}
          </div>
        </div>

        <div className="anim-fade-up" style={{
          margin: '12px 16px', padding: 14, borderRadius: 12,
          background: 'var(--cool-neutral-5)', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--blue-65)', border: 0, color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
          >
            <Icon name={playing ? 'pause' : 'play'} size={16} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>판매자 데모</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{g.demoTitle}</div>
          </div>
          <svg width="60" height="20" style={{ opacity: playing ? 1 : 0.5 }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <rect key={i} x={i * 3.4} y={10 - (Math.sin(i + (playing ? Date.now() / 200 : 0)) + 1) * 5} width="2" height={(Math.sin(i) + 1) * 10} fill="#fff" rx="1" />
            ))}
          </svg>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums' }}>
            0:{String(g.demoSec ?? 0).padStart(2, '0')}
          </div>
        </div>

        <div style={{ padding: '8px 16px 16px' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <GradePill grade={g.grade} size="lg" />
            <span className="badge badge-neutral" style={{ fontSize: 10 }}>{g.cat}</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.01em' }}>{g.title}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--fg-strong)', marginTop: 6, letterSpacing: '-0.02em' }}>{formatPrice(g.price)}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="pin" size={11} color="var(--fg-alternative)" strokeWidth={2} />
            {g.region} · {g.dist} · 조회 {g.views} · 찜 {g.favs}
          </div>

          {seller && (
            <>
              <div style={{ height: 1, background: 'var(--color-line-soft)', margin: '16px 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={seller.avatar} alt={seller.name} style={{ width: 44, height: 44, borderRadius: 22 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>{seller.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>{seller.position} · {seller.level} · 거래 12회</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>
                  4.9 ★
                </div>
              </div>
            </>
          )}

          <div style={{ height: 1, background: 'var(--color-line-soft)', margin: '16px 0' }} />

          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>설명</div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fg-normal)' }}>{g.desc}</div>

          <div style={{ marginTop: 14, padding: 12, background: 'var(--neutral-99)', borderRadius: 10, fontSize: 12, color: 'var(--fg-alternative)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 4 }}>장비 등급 안내</div>
            S — 미사용/신품급 · A — 생활기스, 정상작동 · B — 사용감 있음, 정상작동
          </div>
        </div>
      </div>

      <div style={{
        padding: '10px 16px', borderTop: '1px solid var(--color-line)',
        background: '#fff', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0,
      }}>
        <button
          type="button"
          onClick={() => setFav(!fav)}
          className="heart-btn"
          data-on={fav}
          style={{ width: 40, height: 44, border: '1px solid var(--color-line)', borderRadius: 8, background: '#fff', display: 'grid', placeItems: 'center', color: fav ? 'var(--color-negative)' : 'var(--fg-strong)', cursor: 'pointer' }}
        >
          <span className="heart-icon" style={{ display: 'grid', placeItems: 'center' }}>
            <Icon name={fav ? 'heartFill' : 'heart'} size={20} />
          </span>
        </button>
        <button type="button" className="btn btn-md btn-outlined" style={{ flex: 1, height: 44 }}>가격 제안</button>
        <button
          type="button"
          onClick={() => router.push(`/market/chat/${g.id}`)}
          className="btn btn-md btn-primary"
          style={{ flex: 1.5, height: 44 }}
        >
          채팅하기
        </button>
      </div>
    </>
  );
}
