// MP4 — API layer
// ────────────────────────────────────────────────────────────────
// 모든 서버 통신은 이 파일을 통합니다. 백엔드 스펙이 나오면
//   1) NEXT_PUBLIC_API_BASE_URL 환경변수 설정 (.env.local)
//   2) 아래 ENDPOINTS 경로 / 요청·응답 매핑만 수정
// 하면 화면 코드는 손대지 않고 바로 실제 API로 동작합니다.
//
// BASE_URL 이 비어 있으면 아래 mock 구현으로 동작하므로 지금도 테스트 가능합니다.
// ────────────────────────────────────────────────────────────────

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

/** 실제 API 연결 여부. false 면 mock 모드로 동작. */
export const isApiConfigured = BASE_URL.length > 0;

/** 백엔드 스펙 확정 시 경로만 바꾸면 됩니다. BASE_URL 은 오리진까지만, 경로에 /api 를 포함합니다. */
const ENDPOINTS = {
  login: '/api/auth/login',
  signup: '/api/auth/signup',
  logout: '/api/auth/logout',
  me: '/api/auth/me',
  myProfile: '/api/users',
  userProfile: (id: string) => `/api/users/${id}`,
  userReviews: (id: string) => `/api/users/${id}/reviews`,
  userTrust: (id: string) => `/api/users/${id}/trust`,
} as const;

/* ── 타입 ─────────────────────────────────────────────────────── */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  /** 백엔드는 아바타 미설정 시 null 을 내려줍니다. */
  avatar?: string | null;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

/* ── 유저 / 프로필 ────────────────────────────────────────────── */

/** 목록 응답 공통 형태. 채팅 메시지만 cursor 방식이라 이 타입을 쓰지 않습니다. */
export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 프로필. 주의: 가입 시 받은 `name` 과 프로필의 `nickname` 은 서로 다른 필드이고,
 * /api/users 응답에는 `name` 이 포함되지 않습니다. 표시 이름은 displayName() 으로 구하세요.
 */
export interface UserProfile {
  id: string;
  email?: string;
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
  phone?: string | null;
  position: string | null;
  region: string | null;
  genres: string[];
  level: string | null;
  activityTypes?: string[];
  phoneVerified?: boolean;
  role?: string;
  createdAt?: string;
  /** 공개 프로필에만 포함 */
  items?: unknown[];
  reviewsReceived?: unknown[];
  _count?: Record<string, number>;
}

export interface ProfilePayload {
  nickname?: string;
  bio?: string;
  phone?: string;
  avatar?: string;
  position?: string;
  region?: string;
  genres?: string[];
  level?: string;
  activityTypes?: string[];
}

export interface TrustItem {
  key: string;
  label: string;
  points: number;
  earned: boolean;
}

export interface TrustScore {
  score: number;
  level: 'S' | 'A' | 'B' | 'C';
  items: TrustItem[];
}

export interface Review {
  id: string;
  rating: number;
  content: string | null;
  createdAt: string;
  reviewer?: { id: string; nickname: string | null; avatar: string | null };
}

export type ReviewList = Paged<Review> & { avgRating: number };

/** 화면에 보여줄 이름. nickname 이 비면 세션의 name, 그것도 없으면 안내 문구. */
export function displayName(
  profile: Pick<UserProfile, 'nickname'> | null,
  fallback?: string | null,
): string {
  return profile?.nickname?.trim() || fallback?.trim() || '이름 미설정';
}

export const usersApi = {
  /** 내 프로필 (email·activityTypes·_count 포함) */
  me(token: string): Promise<UserProfile> {
    return request<UserProfile>(ENDPOINTS.myProfile, { token });
  },

  /** 프로필·온보딩 수정 */
  update(token: string, payload: ProfilePayload): Promise<UserProfile> {
    return request<UserProfile>(ENDPOINTS.myProfile, { method: 'PATCH', body: payload, token });
  },

  /** 공개 프로필 (보유 매물 items·받은 후기 포함). 비로그인도 조회 가능 */
  byId(id: string, token?: string | null): Promise<UserProfile> {
    return request<UserProfile>(ENDPOINTS.userProfile(id), { token });
  },

  reviews(id: string): Promise<ReviewList> {
    return request<ReviewList>(ENDPOINTS.userReviews(id));
  },

  trust(id: string): Promise<TrustScore> {
    return request<TrustScore>(ENDPOINTS.userTrust(id));
  },
};

/* ── 에러 ─────────────────────────────────────────────────────── */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/* ── fetch 래퍼 ───────────────────────────────────────────────── */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, signal } = opts;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    // 네트워크 단절 / CORS 등
    throw new ApiError(0, '네트워크 연결을 확인해 주세요');
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, errorMessageOf(json) ?? defaultErrorMessage(res.status), json);
  }

  return unwrapData<T>(json);
}

/**
 * 실패 응답에서 사람이 읽는 메시지를 꺼냅니다.
 * 백엔드 표준은 `{ success: false, error, code }` 이므로 `error` 를 먼저 봅니다.
 * (`message` 는 표준을 벗어난 응답에 대한 대비)
 */
function errorMessageOf(json: unknown): string | null {
  if (!json || typeof json !== 'object') return null;
  const body = json as Record<string, unknown>;
  for (const key of ['error', 'message'] as const) {
    const value = body[key];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return null;
}

/**
 * 성공 응답은 항상 `{ success, data, message }` 로 감싸여 오므로 `data` 만 반환합니다.
 * 래퍼가 없는 응답(예: 204 후 null)은 그대로 흘려보냅니다.
 */
function unwrapData<T>(json: unknown): T {
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return (json as { data: T }).data;
  }
  return json as T;
}

function defaultErrorMessage(status: number): string {
  if (status === 401) return '이메일 또는 비밀번호가 올바르지 않아요';
  if (status === 409) return '이미 가입된 이메일이에요';
  if (status >= 500) return '잠시 후 다시 시도해 주세요';
  return '요청을 처리하지 못했어요';
}

/* ── Auth API ─────────────────────────────────────────────────── */
export const authApi = {
  login(payload: LoginPayload): Promise<AuthResult> {
    if (!isApiConfigured) return mockLogin(payload);
    return request<AuthResult>(ENDPOINTS.login, { method: 'POST', body: payload });
  },

  signup(payload: SignupPayload): Promise<AuthResult> {
    if (!isApiConfigured) return mockSignup(payload);
    return request<AuthResult>(ENDPOINTS.signup, { method: 'POST', body: payload });
  },

  me(token: string): Promise<AuthUser> {
    if (!isApiConfigured) return mockMe(token);
    return request<AuthUser>(ENDPOINTS.me, { token });
  },

  logout(token: string | null): Promise<void> {
    if (!isApiConfigured) return Promise.resolve();
    return request<void>(ENDPOINTS.logout, { method: 'POST', token }).catch(() => {
      // 서버 로그아웃 실패해도 클라이언트 세션은 비웁니다.
    });
  },
};

/* ──────────────────────────────────────────────────────────────
   MOCK 구현 — NEXT_PUBLIC_API_BASE_URL 설정 전까지만 사용됩니다.
   실제 API 연결 후에는 이 블록을 지워도 됩니다.
   ────────────────────────────────────────────────────────────── */
const MOCK_DELAY = 600;
const MOCK_TOKEN_PREFIX = 'mock-token.';

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY));
}

function fail(status: number, message: string): never {
  throw new ApiError(status, message);
}

function mockUser(name: string, email: string): AuthUser {
  return {
    id: 'u-' + email.split('@')[0],
    name,
    email,
    avatar: 'https://i.pravatar.cc/120?img=12',
  };
}

function encodeMockToken(user: AuthUser): string {
  // 토큰 안에 유저 정보를 넣어 me() 에서 복원 (mock 전용)
  if (typeof window === 'undefined') return MOCK_TOKEN_PREFIX;
  return MOCK_TOKEN_PREFIX + window.btoa(encodeURIComponent(JSON.stringify(user)));
}

async function mockLogin({ email, password }: LoginPayload): Promise<AuthResult> {
  await delay(null);
  if (password.length < 8) fail(401, '이메일 또는 비밀번호가 올바르지 않아요');
  const user = mockUser(email.split('@')[0] || '사용자', email);
  return { token: encodeMockToken(user), user };
}

async function mockSignup({ name, email, password }: SignupPayload): Promise<AuthResult> {
  await delay(null);
  if (password.length < 8) fail(400, '비밀번호는 8자 이상이어야 해요');
  const user = mockUser(name, email);
  return { token: encodeMockToken(user), user };
}

async function mockMe(token: string): Promise<AuthUser> {
  await delay(null);
  if (!token.startsWith(MOCK_TOKEN_PREFIX)) fail(401, '세션이 만료되었어요');
  try {
    const raw = token.slice(MOCK_TOKEN_PREFIX.length);
    return JSON.parse(decodeURIComponent(window.atob(raw))) as AuthUser;
  } catch {
    return fail(401, '세션이 만료되었어요');
  }
}
