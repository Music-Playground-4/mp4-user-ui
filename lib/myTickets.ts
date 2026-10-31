// 이 기기에서 예매한 티켓 기억하기 (브라우저 전용).
// 티켓 주소를 잃어버려도 예매 조회 화면에서 바로 다시 열 수 있게 하는 편의 기능입니다.
// 저장이 막힌 브라우저(사생활 보호 모드 등)에서도 예매 자체는 문제없이 동작해야 하므로 실패는 조용히 넘깁니다.

import type { TicketKey } from '@/lib/tickets';

const KEY = 'bh_my_tickets';

export function loadMyTickets(): TicketKey[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]') as unknown;
    return Array.isArray(parsed) ? (parsed as TicketKey[]).filter((t) => t?.code && t?.token) : [];
  } catch {
    return [];
  }
}

export function saveMyTicket(key: TicketKey) {
  try {
    const rest = loadMyTickets().filter((t) => t.code !== key.code);
    localStorage.setItem(KEY, JSON.stringify([key, ...rest].slice(0, 20)));
  } catch {
    /* 저장 실패는 무시 */
  }
}

/** 신청 시각·입금 시각을 '11.14 18:30' 꼴로 */
export function formatKst(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('month')}.${get('day')} ${get('hour')}:${get('minute')}`;
}
