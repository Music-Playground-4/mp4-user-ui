// 밴드할래? — 서버 통신 레이어
// ────────────────────────────────────────────────────────────────
// 폼 전송은 전부 이 파일을 거칩니다. 화면 컴포넌트는 엔드포인트를 모릅니다.
//
// 접수처는 mp4-backend 의 공개 API 입니다(비로그인, CORS 허용 오리진만).
//   POST /api/public/band-inquiries    참여 문의
//   POST /api/public/show-subscribers  알림 신청
//
// .env.local 의 NEXT_PUBLIC_API_BASE_URL 이 비어 있으면 전송을 흉내만 냅니다.
// 백엔드 쪽에서는 PUBLIC_SITE_ORIGINS 에 이 사이트 주소를 넣어줘야 합니다.
// ────────────────────────────────────────────────────────────────

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
