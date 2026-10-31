import { getAdminSession } from '@/lib/adminAuth';
import { listTickets, TicketStoreError, withoutToken } from '@/lib/ticketStore';
import type { AdminTicket } from '@/lib/tickets';
import { fail, ok, STORE_DOWN } from '@/lib/apiResponse';

/** 전체 예매 목록 (최신순) */
export async function GET() {
  const session = await getAdminSession();
  if (!session) return fail('로그인이 필요해요.', 401);
  try {
    const tickets: AdminTicket[] = (await listTickets(session))
      .map(withoutToken)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return ok(tickets);
  } catch (err) {
    if (err instanceof TicketStoreError && err.message === 'unauthorized') return fail('다시 로그인해 주세요.', 401);
    return fail(STORE_DOWN, 502);
  }
}
