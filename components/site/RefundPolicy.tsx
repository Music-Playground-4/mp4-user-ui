import type { Show } from '@/lib/content';

/**
 * 참가팀 대상 참가비 환불 규정. 관객 티켓 환불이 아니라는 점이
 * 제목에서 바로 보이도록 "참가비"를 명시합니다.
 * show.refundPolicy 가 없는 공연은 섹션 자체를 그리지 않습니다.
 */
export function RefundPolicy({ show }: { show: Show }) {
  const policy = show.refundPolicy;
  if (!policy) return null;

  return (
    <section id="refund" className="section">
      <div className="eyebrow">REFUND</div>
      <h2 className="h-display">참가비 환불 규정</h2>

      <div className="refund-box measure">
        <div className="refund-group-label">참가팀이 취소하는 경우</div>
        <ul className="refund-tiers">
          {policy.tiers.map((t) => (
            <li key={t.period} className="refund-tier">
              <span className="refund-period">{t.period}</span>
              <span className={`refund-amount refund-amount--${t.tone}`}>{t.refund}</span>
            </li>
          ))}
        </ul>

        <div className="refund-group-label">그 밖의 경우</div>
        <ul className="refund-exceptions">
          {policy.exceptions.map((e) => (
            <li key={e.case} className="refund-exception">
              <span className="refund-case">{e.case}</span>
              <span className="refund-rule">{e.rule}</span>
            </li>
          ))}
        </ul>

        <p className="refund-reason">{policy.reason}</p>
      </div>
    </section>
  );
}
