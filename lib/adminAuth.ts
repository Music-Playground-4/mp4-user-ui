// 운영진 페이지(/admin) 로그인 — 서버 전용.
// 비밀번호 하나(ADMIN_PASSWORD)로 들어가고, 맞으면 서명된 쿠키를 굽습니다.
// 비밀번호를 바꾸면 기존 로그인 쿠키는 전부 무효가 됩니다.

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'bh_admin';
const MAX_AGE = 60 * 60 * 24 * 30; // 공연 준비 기간 동안 다시 로그인하지 않도록 30일

// 개발 환경에서는 비밀번호 없이도 화면을 볼 수 있게 'admin' 을 씁니다.
const PASSWORD = process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV !== 'production' ? 'admin' : '');

export const isAdminConfigured = PASSWORD.length > 0;

const sessionValue = () => createHmac('sha256', PASSWORD).update('bandhallae-admin-v1').digest('hex');

/** 길이가 달라도 비교 시간이 같도록 해시끼리 비교합니다. */
function safeEqual(a: string, b: string) {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const checkPassword = (input: string) => isAdminConfigured && safeEqual(input, PASSWORD);

export async function isAdmin() {
  if (!isAdminConfigured) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(value) && safeEqual(value as string, sessionValue());
}

export async function signIn() {
  (await cookies()).set(COOKIE, sessionValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
}
