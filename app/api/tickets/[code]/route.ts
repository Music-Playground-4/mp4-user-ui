import { getTicket } from '@/lib/ticketStore';
import type { PublicTicket } from '@/lib/tickets';
import { fail, ok, STORE_DOWN } from '@/lib/apiResponse';

/** 티켓 한 장 조회. 예매번호와 토큰이 둘 다 맞아야 보여줍니다. */
export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const token = new URL(req.url).searchParams.get('k') ?? '';
  if (!token) return fail('티켓을 찾을 수 없어요.', 404);

  try {
    const t = await getTicket(code.toUpperCase(), token);
    if (!t) return fail('티켓을 찾을 수 없어요. 주소를 다시 확인해 주세요.', 404);

    const view: PublicTicket = {
      code: t.code,
      showSlug: t.showSlug,
      name: t.name,
      // 화면을 다른 사람에게 보여줄 일이 있어서 연락처는 가운데를 가립니다.
      phoneMasked: t.phone.replace(/^(\d{3})-?\d{3,4}-?(\d{4})$/, '$1-****-$2'),
      qty: t.qty,
      amount: t.amount,
      depositor: t.depositor,
      team: t.team,
      status: t.status,
      createdAt: t.createdAt,
      paidAt: t.paidAt,
      enteredAt: t.enteredAt,
    };
    return ok(view);
  } catch {
    return fail(STORE_DOWN, 502);
  }
}
