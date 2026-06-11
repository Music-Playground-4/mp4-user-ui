'use client';

import { useState, useMemo } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { USERS } from '@/lib/data';

type Category = '전체' | '거래' | '합주' | '공연' | '후기';
type ItemType = 'perf' | 'sale' | 'session' | 'review' | 'fav' | 'perf2';

interface ActivityItem {
  type: ItemType;
  category: Category;
  title: string;
  when: string;
  sub: string;
  icon: IconName;
  color: string;
}

const ITEMS: ActivityItem[] = [
  { type: 'perf', category: '공연', title: '베이스먼트 5월 셋째주 라이브', when: '2일 전', sub: '공연 완료 · 정산 75,000원', icon: 'mic', color: 'var(--color-primary)' },
  { type: 'sale', category: '거래', title: 'Boss Katana 50 거래 완료', when: '1주 전', sub: '구매자 · 정수아님', icon: 'speaker', color: 'var(--color-positive)' },
  { type: 'session', category: '합주', title: '신촌 인디록 정기 합주', when: '1주 전', sub: '주 1회 합주 5회차 참여', icon: 'music', color: 'var(--color-primary)' },
  { type: 'review', category: '후기', title: '후기를 받았어요', when: '2주 전', sub: '"꼼꼼한 분이세요. 거래 깔끔" · ⭐ 5.0', icon: 'star', color: 'var(--color-accent)' },
  { type: 'fav', category: '거래', title: 'Strymon BigSky 리버브를 찜했어요', when: '3주 전', sub: '580,000원 · 경기 성남시', icon: 'heart', color: 'var(--cool-neutral-30)' },
  { type: 'perf2', category: '공연', title: '대학로 봄 페스타 자동매칭 완료', when: '4주 전', sub: '솔로 매칭 · 4인팀 결성', icon: 'spark', color: 'var(--color-primary)' },
];

const CATS: Category[] = ['전체', '거래', '합주', '공연', '후기'];

export default function ActivityPage() {
  const [cat, setCat] = useState<Category>('전체');
  const list = useMemo(() => cat === '전체' ? ITEMS : ITEMS.filter((i) => i.category === cat), [cat]);

  return (
    <>
      <TopBar title="활동" />
      <div style={{ padding: '10px 16px', background: '#fff', borderBottom: '1px solid var(--color-line-soft)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginRight: -16 }}>
          {CATS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCat(c)}
              className={cat === c ? 'chip chip-active' : 'chip'}
              style={{ height: 30, fontSize: 12 }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div key={cat} className="scroll-region stagger" style={{ padding: '8px 16px 20px' }}>
        {list.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--fg-alternative)', fontSize: 13 }}>
            활동 내역이 없어요
          </div>
        ) : list.map((it, i) => {
          const bg =
            it.color === 'var(--color-positive)' ? 'rgba(0,140,48,0.10)'
            : it.color === 'var(--color-accent)' ? 'rgba(151,71,255,0.10)'
            : it.color === 'var(--cool-neutral-30)' ? 'rgba(0,0,0,0.05)'
            : 'rgba(0,102,255,0.10)';
          return (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', position: 'relative' }}>
              {i < list.length - 1 && (
                <div style={{ position: 'absolute', left: 19, top: 50, bottom: -12, width: 1, background: 'var(--color-line-soft)' }} />
              )}
              <div style={{ width: 40, height: 40, borderRadius: 20, background: bg, color: it.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name={it.icon} size={18} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--fg-assistive)', flexShrink: 0 }}>{it.when}</div>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-alternative)', marginTop: 2, lineHeight: 1.5 }}>{it.sub}</div>
                {it.type === 'sale' && (
                  <button type="button" style={{
                    marginTop: 8, height: 28, padding: '0 12px', borderRadius: 6,
                    border: '1px solid var(--color-line)', background: '#fff',
                    fontSize: 11, fontWeight: 600, color: 'var(--fg-strong)', cursor: 'pointer',
                  }}>
                    후기 작성
                  </button>
                )}
                {it.type === 'review' && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--neutral-99)', borderRadius: 6, fontSize: 11, color: 'var(--fg-normal)' }}>
                    <img src={USERS[2].avatar} alt="" style={{ width: 18, height: 18, borderRadius: 9 }} />
                    <span style={{ fontWeight: 600 }}>박준호</span>님이 작성
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
