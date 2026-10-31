import { findTickets } from '@/lib/ticketStore';
import type { LookupResult } from '@/lib/tickets';
import { fail, ok, STORE_DOWN } from '@/lib/apiResponse';

/** 티켓 주소를 잃어버린 분을 위한 이름 + 연락처 조회 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { name?: string; phone?: string } | null;
  const name = String(body?.name ?? '').trim();
  const phone = String(body?.phone ?? '').replace(/\D/g, '');
  if (!name || phone.length < 10) return fail('예매할 때 쓴 이름과 연락처를 입력해 주세요.');

  try {
    const found = await findTickets(name, phone);
    const result: LookupResult[] = found
      .filter((t) => t.status !== 'canceled')
      .map((t) => ({ code: t.code, token: t.token, showSlug: t.showSlug, qty: t.qty, status: t.status }));
    return ok(result);
  } catch {
    return fail(STORE_DOWN, 502);
  }
}
