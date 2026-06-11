'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { postById, USERS } from '@/lib/data';

type Status = 'pending' | 'accepted' | 'rejected';

interface Applicant {
  uid: string;
  match: number;
  gear: number;
  level: string;
  position: string;
  tags: string[];
  dist: string;
  when: string;
  highlights: string[];
}

const APPLICANTS: Applicant[] = [
  { uid: 'u1', match: 92, gear: 2, level: '입문 6개월', position: '기타', tags: ['인디록', '얼터너티브'], dist: '1.8km', when: '5분 전', highlights: ['보유 장비 검증', '거주지 가까움'] },
  { uid: 'u3', match: 78, gear: 5, level: '15년차', position: '드럼', tags: ['하드록', '메탈'], dist: '14km', when: '2시간 전', highlights: ['장르 약간 차이', '경력 풍부'] },
  { uid: 'u4', match: 64, gear: 0, level: '입문 1년', position: '기타', tags: ['시티팝', '인디팝'], dist: '4.2km', when: '어제', highlights: ['장비 미등록'] },
];

export default function SessionApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const p = postById(id);
  if (!p) notFound();

  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const setStatus = (uid: string, s: Status) => setStatuses({ ...statuses, [uid]: s });

  return (
    <>
      <TopBar
        title={`지원자 (${APPLICANTS.length})`}
        right={
          <button type="button" style={{
            padding: '0 12px', height: 32, border: 0, background: 'transparent',
            fontSize: 13, color: 'var(--fg-alternative)',
            display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
          }}>
            매칭순<Icon name="chevD" size={14} />
          </button>
        }
      />

      <div style={{ padding: '10px 16px', background: 'var(--blue-99)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Icon name="spark" size={14} color="var(--color-primary)" strokeWidth={2.2} />
        <div style={{ fontSize: 12, color: 'var(--fg-normal)' }}>
          모집 포지션 <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{p.positions.join('·')}</span> 매칭률 순으로 정렬됩니다
        </div>
      </div>

      <div className="scroll-region stagger">
        {APPLICANTS.map((a) => {
          const u = USERS.find((x) => x.id === a.uid);
          if (!u) return null;
          const matchBg = a.match >= 85 ? 'var(--green-99)' : a.match >= 70 ? 'var(--blue-99)' : 'var(--neutral-95)';
          const matchFg = a.match >= 85 ? '#008C30' : a.match >= 70 ? 'var(--color-primary)' : 'var(--fg-alternative)';
          const status = statuses[a.uid];

          return (
            <div key={a.uid} style={{ padding: '16px', borderBottom: '1px solid var(--color-line-soft)', display: 'flex', gap: 12, opacity: status === 'rejected' ? 0.5 : 1, transition: 'opacity var(--dur-base) var(--ease-out)' }}>
              <img src={u.avatar} alt={u.name} style={{ width: 44, height: 44, borderRadius: 22, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>{u.name}</div>
                  <div style={{
                    height: 18, padding: '0 6px', background: matchBg, color: matchFg,
                    borderRadius: 9, fontSize: 10, fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center',
                  }}>
                    매칭 {a.match}%
                  </div>
                  {status === 'accepted' && <span className="badge badge-positive" style={{ fontSize: 10 }}>수락</span>}
                  {status === 'rejected' && <span className="badge badge-neutral" style={{ fontSize: 10 }}>거절</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginBottom: 6 }}>
                  {a.position} · {a.level} · {a.dist} · {a.when}
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                  {a.tags.map((t) => (
                    <span key={t} className="chip" style={{ height: 20, padding: '0 6px', fontSize: 10 }}>{t}</span>
                  ))}
                  <span style={{
                    height: 20, padding: '0 6px', borderRadius: 10, fontSize: 10,
                    background: 'var(--blue-99)', color: 'var(--color-primary)',
                    display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 600,
                  }}>
                    <Icon name="speaker" size={9} strokeWidth={2.2} /> 장비 {a.gear}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {a.highlights.map((h) => (
                    <span key={h} style={{ fontSize: 10.5, color: 'var(--fg-alternative)' }}>· {h}</span>
                  ))}
                </div>
                {!status && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button type="button" style={{ height: 32, padding: '0 12px', borderRadius: 6, border: '1px solid var(--color-line)', background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--fg-normal)', cursor: 'pointer' }}>
                      프로필 보기
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(a.uid, 'accepted')}
                      style={{ height: 32, padding: '0 12px', borderRadius: 6, border: 0, background: 'var(--color-primary)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      수락
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(a.uid, 'rejected')}
                      style={{ height: 32, padding: '0 12px', borderRadius: 6, border: '1px solid var(--color-line)', background: '#fff', fontSize: 12, color: 'var(--fg-alternative)', cursor: 'pointer' }}
                    >
                      거절
                    </button>
                  </div>
                )}
                {status === 'accepted' && (
                  <Link href={`/sessions/${p.id}/chat`} style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}>
                    채팅방으로 이동 →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
