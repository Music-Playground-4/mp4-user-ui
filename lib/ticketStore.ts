// 밴드할래? — 관객 예매 저장소 (서버 전용, 브라우저 코드에서 import 하지 마세요)
// ────────────────────────────────────────────────────────────────
// 예매는 구글 시트 한 장에 쌓습니다. 시트에 붙인 Apps Script 웹 앱
// (scripts/tickets.gs)이 읽기·쓰기를 맡고, 이 파일은 그 웹 앱을 부르기만 합니다.
//
// 시트를 DB로 쓰는 이유: 운영진이 폰에서 바로 명단을 볼 수 있고,
// 입금 확인을 Claude 가 구글 시트 연동으로 직접 표시할 수 있어서입니다.
//
// 웹 앱 주소는 공개돼도 괜찮게 만들었습니다. 티켓은 예매번호+토큰, 조회는 이름+연락처,
// 목록·상태 변경은 운영진 로그인 세션이 있어야 열립니다. 운영진 비밀번호는 저장소가
// 공개라서 여기가 아니라 Apps Script 안에만 있습니다.
//
// SCRIPT_URL 이 비어 있으면 개발 환경에서만 메모리 저장소로 동작합니다.
// 프로덕션에서도 화면 확인용으로 메모리 저장소를 쓰려면 TICKETS_MOCK=1.
// ────────────────────────────────────────────────────────────────

import type { AdminTicket, TicketKey, TicketStatus } from '@/lib/tickets';
import { formatPhone } from '@/lib/tickets';
import type { Show, TicketState } from '@/lib/content';

/** Apps Script 웹 앱 주소(…/exec). 환경변수가 있으면 그쪽이 우선합니다. */
const DEFAULT_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwXL70hjSzNxFM33vvTTgxkr7-VnamGcof_ojKeHN6-GUB6rRlsbsBGaCBIkbZhFVx_/exec';
const SCRIPT_URL = process.env.TICKETS_SCRIPT_URL || DEFAULT_SCRIPT_URL;

const USE_SCRIPT = SCRIPT_URL.length > 0;
const USE_MOCK = !USE_SCRIPT && (process.env.NODE_ENV !== 'production' || process.env.TICKETS_MOCK === '1');

/** 예매를 실제로 받을 수 있는 상태인지 */
export const isTicketingReady = USE_SCRIPT || USE_MOCK;

/**
 * 예매 저장소가 연결되지 않은 배포에서는 '예매 중'이어도 '오픈 전'으로 보여줍니다.
 * 버튼만 열려 있고 신청이 안 되는 상황을 막기 위해서입니다.
 */
export function effectiveTicketState(show: Show): TicketState {
  if (show.ticketState !== 'presale') return show.ticketState;
  return show.ticketing && isTicketingReady ? 'presale' : 'soon';
}

/** 시트의 '상태' 칸에 적히는 값. 운영진이 시트에서 직접 고칠 때도 이 네 가지만 씁니다. */
const SHEET_STATUS: Record<TicketStatus, string> = {
  pending: '입금대기',
  paid: '입금확인',
  entered: '입장완료',
  canceled: '취소',
};

const statusFromSheet = (value: string): TicketStatus => {
  const v = value.replace(/\s/g, '');
  const found = (Object.keys(SHEET_STATUS) as TicketStatus[]).find((k) => SHEET_STATUS[k] === v);
  return found ?? 'pending';
};

export class TicketStoreError extends Error {}

/** Apps Script 가 돌려주는 시트 한 줄 */
interface SheetRow {
  code: string;
  token: string;
  createdAt: string;
  show: string;
  name: string;
  phone: string;
  qty: number;
  amount: number;
  depositor: string;
  team: string;
  status: string;
  paidAt: string;
  enteredAt: string;
  memo: string;
}

export interface NewReservation {
  showSlug: string;
  name: string;
  phone: string;
  qty: number;
  amount: number;
  depositor: string;
  team: string;
}

export interface StoredTicket extends AdminTicket {
  token: string;
}

const toTicket = (r: SheetRow): StoredTicket => ({
  code: String(r.code),
  token: String(r.token),
  showSlug: String(r.show),
  name: String(r.name),
  phone: formatPhone(String(r.phone)),
  qty: Number(r.qty) || 0,
  amount: Number(r.amount) || 0,
  depositor: String(r.depositor),
  team: String(r.team),
  status: statusFromSheet(String(r.status)),
  createdAt: String(r.createdAt),
  paidAt: r.paidAt ? String(r.paidAt) : undefined,
  enteredAt: r.enteredAt ? String(r.enteredAt) : undefined,
  memo: String(r.memo ?? ''),
});

const digits = (s: string) => s.replace(/\D/g, '');

/* ── Apps Script 호출 ────────────────────────────────────────── */
async function callScript<T>(action: string, params: Record<string, unknown> = {}): Promise<T> {
  let res: Response;
  try {
    // Apps Script 는 POST 를 처리한 뒤 결과 주소로 302 리다이렉트합니다. fetch 가 GET 으로 따라가면 됩니다.
    res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...params, action }),
      cache: 'no-store',
      redirect: 'follow',
    });
  } catch {
    throw new TicketStoreError('script_unreachable');
  }
  const data = (await res.json().catch(() => null)) as ({ ok: boolean; error?: string } & T) | null;
  if (!res.ok || !data?.ok) throw new TicketStoreError(data?.error ?? `script_${res.status}`);
  return data;
}

/* ── 개발용 메모리 저장소 ────────────────────────────────────── */
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const mockRows: SheetRow[] = ((globalThis as { __bhTickets?: SheetRow[] }).__bhTickets ??= []);

function randomString(chars: string, length: number) {
  let out = '';
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function mockCreate(input: NewReservation): TicketKey {
  let code = '';
  do code = `BH-${randomString(CODE_CHARS, 4)}`;
  while (mockRows.some((r) => r.code === code));
  const token = randomString('abcdefghijkmnopqrstuvwxyz23456789', 20);
  mockRows.push({
    code,
    token,
    createdAt: new Date().toISOString(),
    show: input.showSlug,
    name: input.name,
    phone: input.phone,
    qty: input.qty,
    amount: input.amount,
    depositor: input.depositor,
    team: input.team,
    status: SHEET_STATUS.pending,
    paidAt: '',
    enteredAt: '',
    memo: '',
  });
  return { code, token };
}

function mockUpdate(code: string, status: TicketStatus): SheetRow | null {
  const row = mockRows.find((r) => r.code === code);
  if (!row) return null;
  row.status = SHEET_STATUS[status];
  const now = new Date().toISOString();
  if (status === 'paid' && !row.paidAt) row.paidAt = now;
  if (status === 'entered') {
    row.enteredAt = now;
    if (!row.paidAt) row.paidAt = now;
  }
  // 입장 처리를 되돌리면 입장시각도 비웁니다(시트 스크립트와 같은 동작).
  if (status === 'paid' || status === 'pending') row.enteredAt = '';
  return row;
}

/* ── 공개 함수 ───────────────────────────────────────────────── */
function assertReady() {
  if (!isTicketingReady) throw new TicketStoreError('not_configured');
}

// 메모리 저장소의 운영진 계정. 실제 계정은 Apps Script 안에 있습니다.
const MOCK_ADMIN = { id: 'admin', password: process.env.ADMIN_PASSWORD || 'admin', session: 'mock-session' };

export async function createReservation(input: NewReservation): Promise<TicketKey> {
  assertReady();
  if (USE_MOCK) return mockCreate(input);
  const res = await callScript<TicketKey>('create', { data: input });
  return { code: res.code, token: res.token };
}

export async function getTicket(code: string, token: string): Promise<StoredTicket | null> {
  assertReady();
  // 시트에서 사람이 고친 값도 바로 반영되도록 매번 새로 읽습니다.
  const rows = USE_MOCK
    ? mockRows.filter((r) => r.code === code && r.token === token)
    : (await callScript<{ rows: SheetRow[] }>('get', { code, token })).rows;
  return rows[0] ? toTicket(rows[0]) : null;
}

export async function findTickets(name: string, phone: string): Promise<StoredTicket[]> {
  assertReady();
  const want = digits(phone);
  const rows = USE_MOCK
    ? mockRows.filter((r) => r.name.trim() === name.trim() && digits(r.phone) === want)
    : (await callScript<{ rows: SheetRow[] }>('lookup', { name, phone: want })).rows;
  return rows.map(toTicket);
}

/** 운영진 로그인. 맞으면 세션 문자열, 틀리면 TicketStoreError('wrong_password' | 'locked'). */
export async function adminLogin(id: string, password: string): Promise<string> {
  assertReady();
  if (USE_MOCK) {
    if (id !== MOCK_ADMIN.id || password !== MOCK_ADMIN.password) throw new TicketStoreError('wrong_password');
    return MOCK_ADMIN.session;
  }
  return (await callScript<{ session: string }>('login', { id, password })).session;
}

function assertMockSession(session: string) {
  if (session !== MOCK_ADMIN.session) throw new TicketStoreError('unauthorized');
}

export async function listTickets(session: string): Promise<StoredTicket[]> {
  assertReady();
  if (USE_MOCK) assertMockSession(session);
  const rows = USE_MOCK ? mockRows : (await callScript<{ rows: SheetRow[] }>('list', { session })).rows;
  return rows.filter((r) => r.code).map(toTicket);
}

export async function setTicketStatus(session: string, code: string, status: TicketStatus): Promise<StoredTicket | null> {
  assertReady();
  if (USE_MOCK) {
    assertMockSession(session);
    const row = mockUpdate(code, status);
    return row ? toTicket(row) : null;
  }
  const res = await callScript<{ row: SheetRow | null }>('update', { session, code, status: SHEET_STATUS[status] });
  return res.row ? toTicket(res.row) : null;
}

/** 토큰은 운영진 화면에도 필요 없어서 빼고 내려줍니다. */
export function withoutToken(t: StoredTicket): AdminTicket {
  const copy: Partial<StoredTicket> = { ...t };
  delete copy.token;
  return copy as AdminTicket;
}
