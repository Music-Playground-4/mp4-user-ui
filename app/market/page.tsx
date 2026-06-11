'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { GradePill } from '@/components/ui/Pills';
import { BottomTabBar, TopBar } from '@/components/app/Nav';
import { GEARS, formatPrice } from '@/lib/data';

const CATS = ['전체', '일렉기타', '베이스', '어쿠스틱', '이펙터', '앰프', '드럼', '음향장비'];

export default function MarketListPage() {
  const router = useRouter();
  const [cat, setCat] = useState('전체');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return GEARS.filter((g) => {
      if (cat !== '전체' && g.cat !== cat) return false;
      if (query && !`${g.title} ${g.brand ?? ''} ${g.model ?? ''}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [cat, query]);

  return (
    <>
      <TopBar title="" showBack={false} />
      <div style={{
        padding: '0 16px', background: '#fff',
        borderBottom: '1px solid var(--color-line-soft)',
        flexShrink: 0,
      }}>
        <div style={{ height: 48, display: 'flex', alignItems: 'center', gap: 8, marginTop: -48 }}>
          <div style={{ flex: 1, height: 40, padding: '0 12px', background: 'var(--neutral-95)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="search" size={16} color="var(--fg-alternative)" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="장비, 브랜드 검색"
              style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--fg-strong)' }}
            />
          </div>
          <Link href="/chats" className="topbar-action" aria-label="알림">
            <Icon name="bell" size={20} />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: '8px 0 12px', overflowX: 'auto', marginRight: -16 }}>
          {CATS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCat(c)}
              className={c === cat ? 'chip chip-active' : 'chip'}
              style={{ flexShrink: 0, height: 32, fontSize: 12 }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-region">
        <div style={{ padding: '12px 16px', display: 'flex', gap: 6, alignItems: 'center', borderBottom: '1px solid var(--color-line-soft)' }}>
          <Link href="/market/filter" className="chip" style={{ height: 30, fontSize: 12, gap: 4 }}>
            <Icon name="filter" size={12} strokeWidth={2} /> 필터
          </Link>
          <div className="chip" style={{ height: 30, fontSize: 12 }}>S·A급</div>
          <div className="chip" style={{ height: 30, fontSize: 12 }}>3km 이내</div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: 'var(--fg-alternative)', display: 'flex', alignItems: 'center', gap: 2 }}>
            최신순 <Icon name="chevD" size={12} />
          </span>
        </div>

        <div style={{
          margin: '12px 16px 8px', borderRadius: 12, padding: '14px 16px',
          background: 'linear-gradient(135deg, var(--cool-neutral-5), var(--blue-30))',
          color: '#fff',
        }}>
          <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 4 }}>BEGINNER PICK</div>
          <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>입문자 추천 5만원대 장비 모음</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>오늘 등록된 36개 장비 →</div>
        </div>

        <div className="stagger" style={{ padding: '4px 16px 80px' }}>
          {filtered.length === 0 ? (
            <div className="anim-fade" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--fg-alternative)', fontSize: 13 }}>
              조건에 맞는 장비가 없어요
            </div>
          ) : filtered.map((g) => (
            <Link key={g.id} href={`/market/${g.id}`} className="pressable" style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--color-line-soft)' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 96, height: 96, borderRadius: 8, background: `url(${g.images?.[0]}) center/cover` }} />
                <div style={{ position: 'absolute', top: 6, left: 6 }}>
                  <GradePill grade={g.grade} size="sm" />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {g.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginTop: 2 }}>{g.region} · {g.dist}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    <span className="chip" style={{ height: 20, padding: '0 6px', fontSize: 10, gap: 2 }}>
                      <Icon name="play" size={9} strokeWidth={2} /> 데모 {g.demoSec}초
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>{formatPrice(g.price)}</div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--fg-alternative)' }}>
                    <span style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Icon name="heart" size={12} /> {g.favs}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push('/market/sell')}
        className="fab fab-dark anim-pop-in"
        aria-label="장비 등록"
      >
        <Icon name="plus" size={22} strokeWidth={2.2} />
      </button>

      <BottomTabBar />
    </>
  );
}
