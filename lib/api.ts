// 밴드할래? — 서버 통신 레이어
// ────────────────────────────────────────────────────────────────
// 폼 전송은 전부 이 파일을 거칩니다. 화면 컴포넌트는 엔드포인트를 모릅니다.
//
// 접수처는 mp4-backend 의 공개 API 입니다(비로그인, CORS 허용 오리진만).
//   POST /api/public/band-inquiries    참여 문의
//   POST /api/public/show-subscribers  알림 신청
//
// 관객 예매는 백엔드가 아니라 이 사이트의 /api 라우트로 보냅니다(파일 아래쪽).
//
// .env.local 의 NEXT_PUBLIC_API_BASE_URL 이 비어 있으면 전송을 흉내만 냅니다.
// 백엔드 쪽에서는 PUBLIC_SITE_ORIGINS 에 이 사이트 주소를 넣어줘야 합니다.
// ────────────────────────────────────────────────────────────────

import type { AdminTicket, LookupResult, PublicTicket, ReserveInput, TicketKey, TicketStatus } from '@/lib/tickets';

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

/** 실제 API 연결 여부. false 면 전송을 흉내만 냅니다. */
export const isApiConfigured = BASE_URL.length > 0;

const ENDPOINTS = {
  apply: '/api/public/band-inquiries',
  notify: '/api/public/show-subscribers',
} as const;

/** 참여 문의 폼에서 자유 입력하는 텍스트 항목. */
export interface ApplyFields {
  /** 팀명 (필수) */
  team: string;
  /** 담당자명 (필수) */
  person: string;
  /** 연락처 (필수) */
  phone: string;
  insta: string;
  size: string;
  note: string;
}

export interface ApplyPayload extends ApplyFields {
  /** 지원하는 공연의 slug. 정하지 않았으면 'any'. */
  showSlug: string;
  /** 접수 담당자가 바로 알아볼 수 있게 사람이 읽는 공연 이름도 함께 보냅니다. */
  showLabel: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** 백엔드 공통 응답 봉투. 실패 시 error 에 사용자에게 보여줄 한국어 메시지가 들어옵니다. */
interface Envelope {
  success: boolean;
  error?: string;
  message?: string;
}

async function post(path: string, body: unknown): Promise<void> {
  // 아직 접수처가 없을 때는 전송된 것처럼 잠깐 기다립니다.
  if (!isApiConfigured) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, '네트워크 연결을 확인해 주세요.');
  }

  const data: Envelope | null = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    // 서버가 내려준 한국어 메시지를 그대로 보여줍니다(중복 접수 안내 등).
    throw new ApiError(res.status, data?.error ?? '잠시 후 다시 시도해 주세요.');
  }
}

/** 밴드 참여 문의 접수 */
export function submitApply(payload: ApplyPayload): Promise<void> {
  return post(ENDPOINTS.apply, payload);
}

/** 다음 공연 알림 신청 */
export function subscribeNotify(email: string): Promise<void> {
  return post(ENDPOINTS.notify, { email });
}

/* ── 관객 예매 ───────────────────────────────────────────────────
   이 사이트 자체의 /api 라우트로 보냅니다(같은 오리진). 저장소는 서버가 압니다. */

interface DataEnvelope<T> extends Envelope {
  data?: T;
}

async function request<T>(path: string, init?: { method: string; body?: unknown }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: init?.method ?? 'GET',
      headers: init?.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(0, '네트워크 연결을 확인해 주세요.');
  }

  const data: DataEnvelope<T> | null = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new ApiError(res.status, data?.error ?? '잠시 후 다시 시도해 주세요.');
  }
  return data.data as T;
}

/** 예매 신청 → 예매번호와 티켓 주소용 토큰 */
export function reserveTicket(input: ReserveInput): Promise<TicketKey> {
  return request('/api/tickets', { method: 'POST', body: input });
}

/** 내 티켓 상태 */
export function fetchTicket({ code, token }: TicketKey): Promise<PublicTicket> {
  return request(`/api/tickets/${encodeURIComponent(code)}?k=${encodeURIComponent(token)}`);
}

/** 이름 + 연락처로 예매 찾기 */
export function lookupTickets(name: string, phone: string): Promise<LookupResult[]> {
  return request('/api/tickets/lookup', { method: 'POST', body: { name, phone } });
}

/* ── 운영진 ──────────────────────────────────────────────────── */
export function adminSignIn(id: string, password: string): Promise<null> {
  return request('/api/admin/session', { method: 'POST', body: { id, password } });
}

export function adminSignOut(): Promise<null> {
  return request('/api/admin/session', { method: 'DELETE' });
}

/** 401 이면 로그인 화면으로 돌아갑니다. */
export function adminListTickets(): Promise<AdminTicket[]> {
  return request('/api/admin/tickets');
}

export function adminSetStatus(code: string, status: TicketStatus): Promise<AdminTicket> {
  return request(`/api/admin/tickets/${encodeURIComponent(code)}`, { method: 'PATCH', body: { status } });
}
