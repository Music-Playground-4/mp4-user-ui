import { getAdminSession } from '@/lib/adminAuth';
import { setTicketStatus, TicketStoreError, withoutToken } from '@/lib/ticketStore';
import { TICKET_STATUS_LABEL, type TicketStatus } from '@/lib/tickets';
import { fail, ok, STORE_DOWN } from '@/lib/apiResponse';

/** 상태 변경 (입금 확인 · 입장 처리 · 취소 · 되돌리기) */
export async function PATCH(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const session = await getAdminSession();
  if (!session) return fail('로그인이 필요해요.', 401);
  const { code } = await params;
  const body = (await req.json().catch(() => null)) as { status?: string } | null;
  const status = body?.status as TicketStatus | undefined;
  if (!status || !(status in TICKET_STATUS_LABEL)) return fail('바꿀 상태를 확인해 주세요.');

  try {
    const t = await setTicketStatus(session, code, status);
    if (!t) return fail('예매를 찾을 수 없어요.', 404);
    return ok(withoutToken(t));
  } catch (err) {
    if (err instanceof TicketStoreError && err.message === 'unauthorized') return fail('다시 로그인해 주세요.', 401);
    return fail(STORE_DOWN, 502);
  }
}
