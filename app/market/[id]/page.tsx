'use client';

import { useState, use, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { GradePill } from '@/components/ui/Pills';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingState, ErrorState } from '@/components/ui/State';
import { useAuth } from '@/lib/auth';
import { useAsync } from '@/lib/useApi';
import { marketApi, normalizeImages, displayName, type MarketItem } from '@/lib/api';
import { categoryLabel, conditionLabel, statusLabel } from '@/lib/enums';
import { formatPrice } from '@/lib/data';

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { token, user } = useAuth();

  const detail = useAsync<MarketItem>(() => marketApi.detail(id, token), [id, token]);

  // 찜은 낙관적으로 먼저 반영하고, 실패하면 되돌린다
  const [fav, setFav] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [favBusy, setFavBusy] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (!detail.data) return;
    setFav(detail.data.isFavorited);
    setFavCount(detail.data.favCount);
  }, [detail.data]);

  const toggleFav = useCallback(async () => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (favBusy) return;

    const next = !fav;
    setFav(next);
    setFavCount((c) => Math.max(0, c + (next ? 1 : -1)));
    setFavBusy(true);
    try {
      await marketApi.favorite(token, id, next);
    } catch {
      setFav(!next);
      setFavCount((c) => Math.max(0, c + (next ? -1 : 1)));
    } finally {
      setFavBusy(false);
    }
  }, [token, fav, favBusy, id, router]);

  if (detail.loading) {
    return (
      <div className="scroll-region">
        <LoadingState rows={4} />
      </div>
    );
  }

  if (detail.error || !detail.data) {
    return (
      <div className="scroll-region">
        <ErrorState
          message={detail.status === 404 ? '삭제되었거나 없는 매물이에요' : (detail.error ?? '불러오지 못했어요')}
          onRetry={detail.status === 404 ? undefined : detail.reload}
        />
      </div>
    );
  }

  const g = detail.data;
  const images = normalizeImages(g.images);
  const seller = g.seller;
  const sellerName = displayName(seller);
  const isMine = user?.id === seller?.id;
  const soldLabel = statusLabel(g.status);

  return (
    <>
      <div style={{ position: 'absolute', top: 8, left: 8, right: 8, zIndex: 10, display: 'flex', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로"
          style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(0,0,0,0.4)', border: 0, color: '#fff', display: 'grid', placeItems: 'center', backdropFilter: 'blur(12px)', cursor: 'pointer' }}
        >
          <Icon name="chevL" size={20} />
        </button>
        <button
          type="button"
          onClick={toggleFav}
          aria-label={fav ? '찜 해제' : '찜하기'}
          aria-pressed={fav}
          className="heart-btn"
          data-on={fav}
          style={{
            width: 36, height: 36, borderRadius: 18, background: 'rgba(0,0,0,0.4)', border: 0,
            color: fav ? 'var(--color-negative)' : '#fff',
            display: 'grid', placeItems: 'center', backdropFilter: 'blur(12px)', cursor: 'pointer',
            transition: 'color var(--dur-fast) var(--ease-standard)',
          }}
        >
          <span className="heart-icon" style={{ display: 'grid', placeItems: 'center' }}>
            <Icon name={fav ? 'heartFill' : 'heart'} size={18} />
          </span>
        </button>
      </div>

      <div className="scroll-region" style={{ paddingBottom: 80 }}>
        <div
          className="anim-fade"
          style={{
            width: '100%', height: 300, position: 'relative',
            background: images[imgIndex] ? `url(${images[imgIndex]}) center/cover` : 'var(--neutral-95)',
          }}
        >
          {soldLabel && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 20, fontWeight: 700 }}>
              {soldLabel}
            </div>
          )}
          {images.length > 1 && (
            <>
              <div
                style={{
                  position: 'absolute', bottom: 12, right: 12, padding: '4px 10px',
                  borderRadius: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, fontWeight: 600,
                }}
              >
                {imgIndex + 1} / {images.length}
              </div>
              <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6 }}>
                {images.map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setImgIndex(i)}
                    aria-label={`${i + 1}번째 사진`}
                    style={{
                      width: 8, height: 8, borderRadius: 4, border: 0, cursor: 'pointer', padding: 0,
                      background: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.45)',
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {g.demoUrl && <DemoPlayer title={g.demoTitle} sec={g.demoSec} />}

        <div style={{ padding: '8px 16px 16px' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
            {g.grade && <GradePill grade={g.grade as 'S' | 'A' | 'B' | 'C'} size="lg" />}
            <span className="badge badge-neutral" style={{ fontSize: 10 }}>{categoryLabel(g.category)}</span>
            <span className="badge badge-neutral" style={{ fontSize: 10 }}>{conditionLabel(g.condition)}</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.01em' }}>{g.title}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--fg-strong)', marginTop: 6, letterSpacing: '-0.02em' }}>
            {formatPrice(g.price)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="pin" size={11} color="var(--fg-alternative)" strokeWidth={2} />
            {[g.location, `조회 ${g.viewCount}`, `찜 ${favCount}`].filter(Boolean).join(' · ')}
          </div>
          {(g.brand || g.model) && (
            <div style={{ fontSize: 12, color: 'var(--fg-alternative)', marginTop: 4 }}>
              {[g.brand, g.model].filter(Boolean).join(' ')}
            </div>
          )}

          {seller && (
            <>
              <div style={{ height: 1, background: 'var(--color-line-soft)', margin: '16px 0' }} />
              <button
                type="button"
                onClick={() => router.push(`/users/${seller.id}`)}
                className="pressable"
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  background: 'transparent', border: 0, padding: '4px 0', borderRadius: 8,
                  cursor: 'pointer', textAlign: 'left',
                }}
                aria-label={`${sellerName} 판매자 프로필 보기`}
              >
                <Avatar src={seller.avatar} name={sellerName} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>{sellerName}</div>
                  {seller.bio && (
                    <div style={{ fontSize: 11, color: 'var(--fg-alternative)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {seller.bio}
                    </div>
                  )}
                </div>
                <Icon name="chevR" size={16} color="var(--fg-assistive)" />
              </button>
            </>
          )}

          <div style={{ height: 1, background: 'var(--color-line-soft)', margin: '16px 0' }} />

          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 8 }}>설명</div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fg-normal)', whiteSpace: 'pre-wrap' }}>
            {g.description}
          </div>

          <div style={{ marginTop: 14, padding: 12, background: 'var(--neutral-99)', borderRadius: 10, fontSize: 12, color: 'var(--fg-alternative)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 4 }}>장비 등급 안내</div>
            S — 미사용/신품급 · A — 생활기스, 정상작동 · B — 사용감 있음, 정상작동
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '10px 16px', borderTop: '1px solid var(--color-line)',
          background: '#fff', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={toggleFav}
          aria-label={fav ? '찜 해제' : '찜하기'}
          aria-pressed={fav}
          className="heart-btn"
          data-on={fav}
          style={{
            width: 40, height: 44, border: '1px solid var(--color-line)', borderRadius: 8, background: '#fff',
            display: 'grid', placeItems: 'center',
            color: fav ? 'var(--color-negative)' : 'var(--fg-strong)', cursor: 'pointer',
          }}
        >
          <span className="heart-icon" style={{ display: 'grid', placeItems: 'center' }}>
            <Icon name={fav ? 'heartFill' : 'heart'} size={20} />
          </span>
        </button>

        {isMine ? (
          <button
            type="button"
            onClick={() => router.push(`/market/sell?edit=${g.id}`)}
            className="btn btn-md btn-outlined"
            style={{ flex: 1, height: 44 }}
          >
            내 매물 수정
          </button>
        ) : (
          <>
            <button type="button" className="btn btn-md btn-outlined" style={{ flex: 1, height: 44 }}>
              가격 제안
            </button>
            <button
              type="button"
              onClick={() => router.push(`/market/chat/${g.id}`)}
              className="btn btn-md btn-primary"
              style={{ flex: 1.5, height: 44 }}
              disabled={g.status === 'SOLD'}
            >
              {g.status === 'SOLD' ? '판매완료' : '채팅하기'}
            </button>
          </>
        )}
      </div>
    </>
  );
}

/** 판매자 데모 음원. 실제 재생 연결은 아직이고 UI만 유지한다. */
function DemoPlayer({ title, sec }: { title?: string | null; sec?: number | null }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className="anim-fade-up"
      style={{
        margin: '12px 16px', padding: 14, borderRadius: 12,
        background: 'var(--cool-neutral-5)', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? '일시정지' : '재생'}
        style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--blue-65)', border: 0, color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0 }}
      >
        <Icon name={playing ? 'pause' : 'play'} size={16} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>판매자 데모</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title ?? '연주 데모'}
        </div>
      </div>
      <svg width="60" height="20" style={{ opacity: playing ? 1 : 0.5, flexShrink: 0 }} aria-hidden>
        {Array.from({ length: 18 }).map((_, i) => (
          <rect key={i} x={i * 3.4} y={10 - (Math.sin(i) + 1) * 5} width="2" height={(Math.sin(i) + 1) * 10} fill="#fff" rx="1" />
        ))}
      </svg>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
        0:{String(sec ?? 0).padStart(2, '0')}
      </div>
    </div>
  );
}
