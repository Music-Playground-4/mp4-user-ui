'use client';

// ⚠️ 현재 어느 페이지에도 붙어 있지 않습니다(요청으로 잠시 내림).
// 다시 쓰려면 원하는 페이지에서 <Settlement /> 를 렌더하면 그대로 살아납니다.
// 금액은 lib/content.ts 의 SETTLEMENT 에 그대로 남아 있습니다.

import { useState } from 'react';
import { SETTLEMENT, SETTLE_LABEL, formatWon, sumRows, type SettleMode } from '@/lib/content';

const MODES: { value: SettleMode; label: string }[] = [
  { value: 'plan', label: '예상 집행' },
  { value: 'actual', label: '실제 정산' },
];

export function Settlement() {
  const [mode, setMode] = useState<SettleMode>('plan');
  const data = SETTLEMENT[mode];
  const total = sumRows(data.rows);

  return (
    <section className="section">
      <div className="eyebrow">WHERE IT GOES</div>
      <h2 className="h-display h-display--tight">참가비는 이렇게 씁니다</h2>
      <div className="settle-label">{SETTLE_LABEL[mode]}</div>

      <div className="settle-box measure">
        <div className="settle-head">
          <div className="settle-total-label">{data.totalLabel}</div>
          <div className="settle-total">
            {formatWon(total)}
            <span>원</span>
          </div>
        </div>

        {/* 항목별 비중 막대 */}
        <div className="settle-bar" role="img" aria-label={`${data.totalLabel} ${formatWon(total)}원의 항목별 비중`}>
          {data.rows.map((r) => (
            <div key={r.label} style={{ width: `${(r.amount / total) * 100}%`, background: r.color }} />
          ))}
        </div>

        <div className="settle-rows">
          {data.rows.map((r) => (
            <div key={r.label} className="settle-row">
              <div className="settle-swatch" style={{ background: r.color }} />
              <div className="settle-row-label">{r.label}</div>
              <div className="settle-row-value">{formatWon(r.amount)}원</div>
              <div className="settle-row-pct">{Math.round((r.amount / total) * 100)}%</div>
            </div>
          ))}
        </div>

        <div className="settle-notes">
          {data.notes.map((n) => (
            <p key={n} className="settle-note">
              {n}
            </p>
          ))}
        </div>

        <div className="settle-toggle">
          {MODES.map((m) => (
            <button key={m.value} type="button" aria-pressed={mode === m.value} onClick={() => setMode(m.value)}>
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
