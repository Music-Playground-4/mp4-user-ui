'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { BottomTabBar, TopBar } from '@/components/app/Nav';
import { SHOWS } from '@/lib/data';

const FILTERS = ['전체', '솔로 자동매칭', '팀 단위', '유료', '이번 주말'];

export default function PerfListPage() {
  const [tab, setTab] = useState<'find' | 'recruit'>('find');
  const [filter, setFilter] = useState('전체');

  return (
    <>
      <TopBar
        title="공연 매칭"
        showBack={false}
        right={
          <button type="button" className="topbar-action" aria-label="검색">
            <Icon name="search" size={20} />
          </button>
        }
      />

      <div style={{ padding: '8px 16px 12px', background: '#fff', borderBottom: '1px solid var(--color-line-soft)', flexShrink: 0 }}>
        <div style={{ display: 'flex', height: 40, padding: 3, background: 'var(--neutral-95)', borderRadius: 10 }}>
          <button
            type="button"
            onClick={() => setTab('find')}
            style={{
              flex: 1, borderRadius: 8, border: 0, cursor: 'pointer',
              background: tab === 'find' ? '#fff' : 'transparent',
              boxShadow: tab === 'find' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              fontSize: 13, fontWeight: tab === 'find' ? 600 : 500,
              color: tab === 'find' ? 'var(--fg-strong)' : 'var(--fg-alternative)',
            }}
          >
            공연 찾기
          </button>
          <button
            type="button"
            onClick={() => setTab('recruit')}
            style={{
              flex: 1, borderRadius: 8, border: 0, cursor: 'pointer',
              background: tab === 'recruit' ? '#fff' : 'transparent',
              boxShadow: tab === 'recruit' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              fontSize: 13, fontWeight: tab === 'recruit' ? 600 : 500,
              color: tab === 'recruit' ? 'var(--fg-strong)' : 'var(--fg-alternative)',
            }}
          >
            출연자 모집
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', marginRight: -16 }}>
          {FILTERS.map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'chip chip-active' : 'chip'}
              style={{ height: 30, fontSize: 12 }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-region" style={{ padding: '12px 16px 80px' }}>
        {tab === 'recruit' ? (
          <div key="recruit" className="anim-fade-up" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--fg-alternative)', fontSize: 13, lineHeight: 1.6 }}>
            출연자를 모집하는 공연 등록은<br />
            (mock) 곧 지원될 예정이에요
          </div>
        ) : <div key="find" className="stagger">{SHOWS.map((s) => (
          <Link key={s.id} href={`/perf/${s.id}`} className="pressable card-lift" style={{ display: 'block', marginBottom: 14, borderRadius: 12, border: '1px solid var(--color-line)', overflow: 'hidden', background: '#fff' }}>
            <div style={{ height: 140, background: `url(${s.img}) center/cover`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 10, left: 10, padding: '4px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 11, fontWeight: 600 }}>
                {s.date}
              </div>
              <div style={{
                position: 'absolute', top: 10, right: 10, padding: '4px 8px', borderRadius: 6,
                background: s.match >= 85 ? '#008C30' : s.match >= 70 ? 'var(--color-primary)' : '#555',
                color: '#fff', fontSize: 11, fontWeight: 700,
              }}>
                매칭 {s.match}%
              </div>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                {s.tags.map((t) => (
                  <span key={t} className="badge badge-accent" style={{ fontSize: 10 }}>{t}</span>
                ))}
                <span className="badge badge-neutral" style={{ fontSize: 10 }}>{s.pay}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-strong)', letterSpacing: '-0.01em', marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-alternative)' }}>{s.host} · {s.dist}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 10 }}>
                {s.need.map((n) => (
                  <span key={n} className="chip chip-soft" style={{ height: 22, padding: '0 8px', fontSize: 11 }}>모집 {n}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}</div>}
      </div>

      <BottomTabBar />
    </>
  );
}
