'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError, adminListTickets, adminSetStatus, adminSignIn, adminSignOut } from '@/lib/api';
import { formatWon } from '@/lib/content';
import { formatKst } from '@/lib/myTickets';
import { TICKET_STATUS_LABEL, type AdminTicket, type TicketStatus } from '@/lib/tickets';

type Filter = 'all' | TicketStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '입금 대기' },
  { value: 'paid', label: '입금 확인' },
  { value: 'entered', label: '입장 완료' },
  { value: 'canceled', label: '취소' },
];

// 현장에서 여러 명이 동시에 볼 수 있어서 주기적으로 새로 읽어 옵니다.
const REFRESH_MS = 30_000;

function SignIn({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await adminSignIn(password);
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '잠시 후 다시 시도해 주세요.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="apply-box adm-signin">
      <form className="apply-form" onSubmit={onSubmit}>
        <div className="apply-title">운영진 로그인</div>
        <div className="field">
          <label className="field-label" htmlFor="adm-pw">
            비밀번호
          </label>
          <input
            id="adm-pw"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="submit-btn" disabled={sending}>
          {sending ? '확인 중…' : '들어가기'}
        </button>
      </form>
    </div>
  );
}

/** 상태별로 눌러야 할 다음 동작 */
function actionsFor(status: TicketStatus): { to: TicketStatus; label: string; tone: 'main' | 'sub' | 'danger' }[] {
  switch (status) {
    case 'pending':
      return [
        { to: 'paid', label: '입금 확인', tone: 'main' },
        { to: 'canceled', label: '취소', tone: 'danger' },
      ];
    case 'paid':
      return [
        { to: 'entered', label: '입장 처리', tone: 'main' },
        { to: 'pending', label: '입금 취소', tone: 'sub' },
        { to: 'canceled', label: '취소', tone: 'danger' },
      ];
    case 'entered':
      return [{ to: 'paid', label: '입장 되돌리기', tone: 'sub' }];
    case 'canceled':
      return [{ to: 'pending', label: '복구', tone: 'sub' }];
  }
}

export function AdminConsole() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      setTickets(await adminListTickets());
      setAuthed(true);
      setError(null);
      setLoadedAt(new Date());
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setAuthed(false);
      else setError(err instanceof ApiError ? err.message : '잠시 후 다시 시도해 주세요.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => void load(), REFRESH_MS);
    return () => clearInterval(id);
  }, [authed, load]);

  const change = async (t: AdminTicket, to: TicketStatus) => {
    if (to === 'canceled' && !window.confirm(`${t.name}님(${t.code}) 예매를 취소할까요?`)) return;
    setBusy(t.code);
    try {
      const updated = await adminSetStatus(t.code, to);
      setTickets((list) => list.map((x) => (x.code === updated.code ? updated : x)));
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : '잠시 후 다시 시도해 주세요.');
    } finally {
      setBusy(null);
    }
  };

  const stats = useMemo(() => {
    const live = tickets.filter((t) => t.status !== 'canceled');
    const confirmed = live.filter((t) => t.status === 'paid' || t.status === 'entered');
    const sum = (list: AdminTicket[], key: 'qty' | 'amount') => list.reduce((acc, t) => acc + t[key], 0);
    const byTeam = new Map<string, number>();
    confirmed.forEach((t) => byTeam.set(t.team, (byTeam.get(t.team) ?? 0) + t.qty));
    return {
      orders: live.length,
      pendingQty: sum(
        live.filter((t) => t.status === 'pending'),
        'qty',
      ),
      confirmedQty: sum(confirmed, 'qty'),
      confirmedAmount: sum(confirmed, 'amount'),
      enteredQty: sum(
        live.filter((t) => t.status === 'entered'),
        'qty',
      ),
      byTeam: [...byTeam.entries()].sort((a, b) => b[1] - a[1]),
    };
  }, [tickets]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, '');
    return tickets.filter((t) => {
      if (filter !== 'all' && t.status !== filter) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.depositor.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        (qDigits.length >= 4 && t.phone.replace(/\D/g, '').includes(qDigits))
      );
    });
  }, [tickets, filter, query]);

  if (authed === null) return <p className="tv-loading">불러오는 중…</p>;
  if (!authed) return <SignIn onDone={() => void load()} />;

  return (
    <div className="adm">
      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-label">확정 매수</span>
          <span className="adm-stat-value">{stats.confirmedQty}</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-label">입금 대기</span>
          <span className="adm-stat-value adm-stat-value--warn">{stats.pendingQty}</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-label">입장</span>
          <span className="adm-stat-value">
            {stats.enteredQty}
            <small>/{stats.confirmedQty}</small>
          </span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-label">확정 금액</span>
          <span className="adm-stat-value adm-stat-value--sm">{formatWon(stats.confirmedAmount)}</span>
        </div>
      </div>

      {stats.byTeam.length > 0 && (
        <div className="adm-teams">
          {stats.byTeam.map(([team, qty]) => (
            <span key={team} className="member-tag">
              {team} {qty}
            </span>
          ))}
        </div>
      )}

      <div className="adm-tools">
        <input
          type="search"
          className="adm-search"
          placeholder="이름 · 입금자명 · 예매번호 · 연락처 끝자리"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="adm-filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className="adm-filter"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              <span>{f.value === 'all' ? tickets.length : tickets.filter((t) => t.status === f.value).length}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}

      <ul className="adm-list">
        {visible.map((t) => (
          <li key={t.code} className={`adm-item adm-item--${t.status}`}>
            <div className="adm-item-head">
              <span className="adm-code">{t.code}</span>
              <span className={`adm-badge adm-badge--${t.status}`}>{TICKET_STATUS_LABEL[t.status]}</span>
            </div>
            <div className="adm-name">
              {t.name} <span className="adm-qty">{t.qty}매</span>
              <span className="adm-amount">{formatWon(t.amount)}원</span>
            </div>
            <div className="adm-detail">
              입금자 <b>{t.depositor}</b> · {t.phone} · {t.team}
            </div>
            <div className="adm-detail adm-detail--dim">
              신청 {formatKst(t.createdAt)}
              {t.paidAt && ` · 입금 ${formatKst(t.paidAt)}`}
              {t.enteredAt && ` · 입장 ${formatKst(t.enteredAt)}`}
              {t.memo && ` · ${t.memo}`}
            </div>
            <div className="adm-actions">
              {actionsFor(t.status).map((a) => (
                <button
                  key={a.to}
                  type="button"
                  className={`adm-action adm-action--${a.tone}`}
                  disabled={busy === t.code}
                  onClick={() => void change(t, a.to)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </li>
        ))}
        {visible.length === 0 && <li className="adm-empty">해당하는 예매가 없어요.</li>}
      </ul>

      <div className="adm-foot">
        <span>{loadedAt ? `${loadedAt.toLocaleTimeString('ko-KR', { hour12: false })} 기준 · 30초마다 새로고침` : ''}</span>
        <button type="button" onClick={() => void load()}>
          지금 새로고침
        </button>
        <button
          type="button"
          onClick={async () => {
            await adminSignOut().catch(() => null);
            setAuthed(false);
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
