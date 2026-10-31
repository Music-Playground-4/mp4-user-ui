// 운영진 페이지(/admin) 로그인 — 서버 전용.
// 아이디·비밀번호 확인은 예매 시트의 Apps Script 가 하고(저장소가 공개라 비밀번호를 코드에 두지 않음),
// 여기서는 거기서 받은 세션 문자열을 httpOnly 쿠키로 들고 다니기만 합니다.
// 세션은 Apps Script 쪽에서 6시간 뒤 만료됩니다.

import { cookies } from 'next/headers';

const COOKIE = 'bh_admin';
const MAX_AGE = 6 * 60 * 60;

export async function getAdminSession() {
  return (await cookies()).get(COOKIE)?.value ?? '';
}

export async function signIn(session: string) {
  (await cookies()).set(COOKIE, session, {
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
