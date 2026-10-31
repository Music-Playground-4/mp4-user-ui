import { isAdmin } from '@/lib/adminAuth';
import { listTickets, withoutToken } from '@/lib/ticketStore';
import type { AdminTicket } from '@/lib/tickets';
import { fail, ok, STORE_DOWN } from '@/lib/apiResponse';

/** 전체 예매 목록 (최신순) */
export async function GET() {
  if (!(await isAdmin())) return fail('로그인이 필요해요.', 401);
  try {
    const rows = await listTickets();
    const tickets: AdminTicket[] = rows
      .map(withoutToken)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return ok(tickets);
  } catch {
    return fail(STORE_DOWN, 502);
  }
}
