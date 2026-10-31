import { signIn, signOut } from '@/lib/adminAuth';
import { adminLogin, TicketStoreError } from '@/lib/ticketStore';
import { fail, ok, STORE_DOWN } from '@/lib/apiResponse';

/** 운영진 로그인 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: string; password?: string } | null;
  try {
    await signIn(await adminLogin(String(body?.id ?? '').trim(), String(body?.password ?? '')));
    return ok(null);
  } catch (err) {
    const code = err instanceof TicketStoreError ? err.message : '';
    if (code === 'wrong_password') return fail('아이디 또는 비밀번호가 맞지 않아요.', 401);
    if (code === 'locked') return fail('비밀번호를 여러 번 틀려서 30분 동안 로그인이 막혔어요.', 429);
    return fail(STORE_DOWN, 502);
  }
}

/** 로그아웃 */
export async function DELETE() {
  await signOut();
  return ok(null);
}
