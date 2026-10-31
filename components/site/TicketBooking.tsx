'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, reserveTicket } from '@/lib/api';
import { formatWon, TICKET_ACCOUNT, type Show, type ShowTicketing } from '@/lib/content';
import { saveMyTicket } from '@/lib/myTickets';
import { ANY_TEAM, ticketPath } from '@/lib/tickets';

type Status = 'idle' | 'error' | 'sending';

interface Props {
  show: Show;
  ticketing: ShowTicketing;
  /** 서버에서 예매 저장소가 연결돼 있는지 확인한 값 */
  ready: boolean;
}

const STEPS = [
  { no: '01', title: '예매 신청', desc: '아래 양식을 보내면 예매번호가 나와요.' },
  { no: '02', title: '계좌 입금', desc: `${TICKET_ACCOUNT.bank} 계좌로 금액을 보내 주세요.` },
  { no: '03', title: '모바일 티켓', desc: '입금이 확인되면 티켓 화면이 열려요.' },
];

export function TicketBooking({ show, ticketing, ready }: Props) {
  const router = useRouter();
  const teams = show.lineup.flatMap((b) => (b.name ? [b.name] : []));

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [qty, setQty] = useState(1);
  const [depositor, setDepositor] = useState('');
  const [team, setTeam] = useState(ANY_TEAM);
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 마감 여부는 보는 시점 기준이라 브라우저에서 판단합니다(정적 페이지라 빌드 시각과 다를 수 있음).
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    setClosed(Date.now() > new Date(ticketing.closesAt).getTime());
  }, [ticketing.closesAt]);

  const showErrors = status === 'error';
  const nameMissing = showErrors && name.trim().length === 0;
  const phoneBad = showErrors && phone.replace(/\D/g, '').length < 10;
  const total = qty * ticketing.price;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length < 10 || !agree) {
      setStatus('error');
      setErrorMsg('이름·연락처와 동의 항목을 확인해 주세요.');
      return;
    }

    setStatus('sending');
    setErrorMsg(null);
    try {
      const key = await reserveTicket({
        showSlug: show.slug,
        name: name.trim(),
        phone,
        qty,
        depositor: depositor.trim() || name.trim(),
        team,
        agree,
        website,
      });
      saveMyTicket(key);
      router.push(`${ticketPath(key)}&new=1`);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof ApiError ? err.message : '잠시 후 다시 시도해 주세요.');
    }
  };

  const unavailable = !ready || closed;

  return (
    <section className="section book">
      <ol className="book-steps">
        {STEPS.map((s) => (
          <li key={s.no} className="book-step">
            <span className="book-step-no">{s.no}</span>
            <span className="book-step-title">{s.title}</span>
            <span className="book-step-desc">{s.desc}</span>
          </li>
        ))}
      </ol>

      <div className="book-layout">
        <div className="apply-box book-box">
          {unavailable ? (
            <div className="sent">
              <div className="sent-title">{closed ? '온라인 예매 마감' : '예매 준비 중'}</div>
              <p className="sent-text">
                {closed
                  ? '온라인 예매는 마감됐어요. 남은 자리는 공연 당일 현장에서 같은 가격으로 판매해요.'
                  : '예매 창구를 여는 중이에요. 조금만 기다려 주세요.'}
              </p>
            </div>
          ) : (
            <form className="apply-form" onSubmit={onSubmit} noValidate>
              <div className="apply-title">예매 신청</div>
              <p className="apply-sub">
                {ticketing.closesLabel}까지 온라인으로 받아요. 남은 자리는 당일 현장에서도 같은 가격이에요.
              </p>

              <div className="field">
                <label className={`field-label${nameMissing ? ' field-label--missing' : ''}`} htmlFor="book-name">
                  예매자 이름<span className="field-required"> *</span>
                </label>
                <input
                  id="book-name"
                  type="text"
                  autoComplete="name"
                  placeholder="입장할 때 확인할 이름"
                  value={name}
                  maxLength={20}
                  aria-invalid={nameMissing}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field">
                <label className={`field-label${phoneBad ? ' field-label--missing' : ''}`} htmlFor="book-phone">
                  연락처<span className="field-required"> *</span>
                </label>
                <input
                  id="book-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="010-0000-0000"
                  value={phone}
                  aria-invalid={phoneBad}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="field">
                <span className="field-label" id="book-qty-label">
                  매수
                </span>
                <div className="qty" role="group" aria-labelledby="book-qty-label">
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="한 장 빼기"
                    disabled={qty <= 1}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <output className="qty-value" aria-live="polite">
                    {qty}
                    <span>매</span>
                  </output>
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="한 장 더하기"
                    disabled={qty >= ticketing.maxPerOrder}
                    onClick={() => setQty((q) => Math.min(ticketing.maxPerOrder, q + 1))}
                  >
                    +
                  </button>
                  <span className="qty-unit">× {formatWon(ticketing.price)}원</span>
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="book-depositor">
                  입금자명
                </label>
                <input
                  id="book-depositor"
                  type="text"
                  placeholder={name.trim() ? `${name.trim()} (예매자 이름과 같으면 비워 두세요)` : '예매자 이름과 다를 때만'}
                  value={depositor}
                  maxLength={20}
                  onChange={(e) => setDepositor(e.target.value)}
                />
              </div>

              {teams.length > 0 && (
                <div className="field">
                  <span className="field-label" id="book-team-label">
                    보러 오는 팀
                  </span>
                  <div className="team-chips" role="radiogroup" aria-labelledby="book-team-label">
                    {[...teams, ANY_TEAM].map((t) => (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={team === t}
                        className="chip team-chip"
                        onClick={() => setTeam(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 사람에게는 보이지 않는 칸. 봇이 채우면 서버가 걸러냅니다. */}
              <input
                type="text"
                name="website"
                className="hp-field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />

              <div className="book-total">
                <span className="book-total-label">입금할 금액</span>
                <span className="book-total-value">
                  {formatWon(total)}
                  <span>원</span>
                </span>
              </div>

              <button
                type="button"
                role="checkbox"
                aria-checked={agree}
                data-error={showErrors && !agree}
                className="agree"
                onClick={() => setAgree((v) => !v)}
              >
                <span className="agree-box" aria-hidden="true">
                  {agree ? '✓' : ''}
                </span>
                <span className="agree-text">
                  관객 환불 규정을 확인했고, 예매 확인·입장을 위한 개인정보(이름·연락처) 수집·이용에 동의합니다. 공연
                  종료 3개월 후 파기합니다.
                </span>
              </button>

              {errorMsg && (
                <p className="form-error" role="alert">
                  {errorMsg}
                </p>
              )}

              <button type="submit" className="submit-btn" disabled={status === 'sending'}>
                {status === 'sending' ? '신청하는 중…' : `${formatWon(total)}원 예매 신청하기`}
              </button>
            </form>
          )}
        </div>

        <aside className="book-aside">
          <div className="book-card">
            <div className="book-card-label">입금 계좌</div>
            <div className="book-account">
              <span className="book-account-bank">{TICKET_ACCOUNT.bank}</span>
              <span className="book-account-no">{TICKET_ACCOUNT.number}</span>
              <span className="book-account-holder">예금주 {TICKET_ACCOUNT.holder}</span>
            </div>
            <p className="book-card-note">{ticketing.depositNote}</p>
          </div>

          <div className="book-card">
            <div className="book-card-label">관객 환불 규정</div>
            <ul className="book-rules">
              {ticketing.refund.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
