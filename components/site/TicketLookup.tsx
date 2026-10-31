'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiError, lookupTickets } from '@/lib/api';
import { getShow } from '@/lib/content';
import { loadMyTickets } from '@/lib/myTickets';
import { TICKET_STATUS_LABEL, ticketPath, type LookupResult, type TicketKey } from '@/lib/tickets';

type Status = 'idle' | 'sending' | 'done' | 'error';

/** 티켓 주소를 잃어버렸을 때: 이 기기 기록 + 이름·연락처 조회 */
export function TicketLookup() {
  const [mine, setMine] = useState<TicketKey[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [results, setResults] = useState<LookupResult[]>([]);

  useEffect(() => {
    setMine(loadMyTickets());
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length < 10) {
      setStatus('error');
      setErrorMsg('예매할 때 쓴 이름과 연락처를 입력해 주세요.');
      return;
    }
    setStatus('sending');
    setErrorMsg(null);
    try {
      setResults(await lookupTickets(name.trim(), phone));
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof ApiError ? err.message : '잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <div className="lookup">
      {mine.length > 0 && (
        <div className="book-card">
          <div className="book-card-label">이 기기에서 예매한 티켓</div>
          <ul className="lookup-list">
            {mine.map((t) => (
              <li key={t.code}>
                <Link href={ticketPath(t)} className="lookup-item">
                  <span className="lookup-code">{t.code}</span>
                  <span className="lookup-go">티켓 열기 →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="apply-box">
        <form className="apply-form" onSubmit={onSubmit} noValidate>
          <div className="apply-title">이름·연락처로 찾기</div>
          <p className="apply-sub">예매할 때 입력한 이름과 연락처가 모두 맞아야 보여요.</p>
          <div className="field">
            <label className="field-label" htmlFor="lookup-name">
              예매자 이름
            </label>
            <input
              id="lookup-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="lookup-phone">
              연락처
            </label>
            <input
              id="lookup-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          {errorMsg && (
            <p className="form-error" role="alert">
              {errorMsg}
            </p>
          )}
          <button type="submit" className="submit-btn" disabled={status === 'sending'}>
            {status === 'sending' ? '찾는 중…' : '예매 찾기'}
          </button>

          {status === 'done' &&
            (results.length === 0 ? (
              <p className="lookup-none">일치하는 예매가 없어요. 이름·연락처를 다시 확인해 주세요.</p>
            ) : (
              <ul className="lookup-list lookup-list--dark">
                {results.map((r) => (
                  <li key={r.code}>
                    <Link href={ticketPath(r)} className="lookup-item">
                      <span className="lookup-code">{r.code}</span>
                      <span className="lookup-meta">
                        {getShow(r.showSlug)?.badge} · {r.qty}매 · {TICKET_STATUS_LABEL[r.status]}
                      </span>
                      <span className="lookup-go">열기 →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
        </form>
      </div>
    </div>
  );
}
