import { getShow } from '@/lib/content';
import { createReservation, effectiveTicketState } from '@/lib/ticketStore';
import { ANY_TEAM, formatPhone, type ReserveInput } from '@/lib/tickets';
import { fail, ok, STORE_DOWN } from '@/lib/apiResponse';

/** 예매 신청 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<ReserveInput> | null;
  if (!body) return fail('잘못된 요청이에요.');

  // 봇이 채우는 숨은 칸
  if (body.website) return fail('잘못된 요청이에요.');

  const show = body.showSlug ? getShow(body.showSlug) : undefined;
  const ticketing = show?.ticketing;
  if (!show || !ticketing || effectiveTicketState(show) !== 'presale') {
    return fail('지금은 예매를 받지 않는 공연이에요.', 404);
  }
  if (Date.now() > new Date(ticketing.closesAt).getTime()) {
    return fail('온라인 예매가 마감됐어요. 현장에서 구매해 주세요.', 409);
  }

  const name = String(body.name ?? '').trim();
  const phoneDigits = String(body.phone ?? '').replace(/\D/g, '');
  const depositor = String(body.depositor ?? '').trim() || name;
  const qty = Number(body.qty);
  const teams = show.lineup.flatMap((b) => (b.name ? [b.name] : []));
  const team = teams.includes(String(body.team)) ? String(body.team) : ANY_TEAM;

  if (name.length < 1 || name.length > 20) return fail('이름을 확인해 주세요.');
  if (!/^01\d{8,9}$/.test(phoneDigits)) return fail('연락처를 010-0000-0000 형식으로 입력해 주세요.');
  if (!Number.isInteger(qty) || qty < 1 || qty > ticketing.maxPerOrder) {
    return fail(`매수는 1~${ticketing.maxPerOrder}매 사이로 골라 주세요.`);
  }
  if (depositor.length > 20) return fail('입금자명을 확인해 주세요.');
  if (body.agree !== true) return fail('환불 규정과 개인정보 수집에 동의해 주세요.');

  try {
    const key = await createReservation({
      showSlug: show.slug,
      name,
      phone: formatPhone(phoneDigits),
      qty,
      amount: qty * ticketing.price,
      depositor,
      team,
    });
    return ok(key, 201);
  } catch {
    return fail(STORE_DOWN, 502);
  }
}
