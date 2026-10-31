import { checkPassword, isAdminConfigured, signIn, signOut } from '@/lib/adminAuth';
import { fail, ok } from '@/lib/apiResponse';

/** 운영진 로그인 */
export async function POST(req: Request) {
  if (!isAdminConfigured) return fail('운영진 비밀번호가 아직 설정되지 않았어요.', 503);
  const body = (await req.json().catch(() => null)) as { password?: string } | null;
  if (!checkPassword(String(body?.password ?? ''))) return fail('비밀번호가 맞지 않아요.', 401);
  await signIn();
  return ok(null);
}

/** 로그아웃 */
export async function DELETE() {
  await signOut();
  return ok(null);
}
