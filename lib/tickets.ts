// 밴드할래? — 관객 예매에서 브라우저와 서버가 함께 쓰는 타입·문구.
// 저장소(예매 시트)를 다루는 코드는 서버 전용인 lib/ticketStore.ts 에 있습니다.

export type TicketStatus = 'pending' | 'paid' | 'entered' | 'canceled';

/** 화면에 보이는 상태 이름 */
export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  pending: '입금 대기',
  paid: '입금 확인',
  entered: '입장 완료',
  canceled: '취소',
};

/** '보러 온 팀'을 고르지 않은 경우의 값 */
export const ANY_TEAM = '모든 팀';

/** 예매번호 + 본인 확인용 토큰. 티켓 페이지 주소가 됩니다. */
export interface TicketKey {
  code: string;
  token: string;
}

/** 예매자 본인에게 보여주는 티켓 정보. 연락처는 가려서 내려갑니다. */
export interface PublicTicket {
  code: string;
  showSlug: string;
  name: string;
  phoneMasked: string;
  qty: number;
  amount: number;
  depositor: string;
  team: string;
  status: TicketStatus;
  createdAt: string;
  paidAt?: string;
  enteredAt?: string;
}

/** 운영진 화면에서 쓰는 전체 정보 */
export interface AdminTicket extends Omit<PublicTicket, 'phoneMasked'> {
  phone: string;
  memo: string;
}

/** 예매 조회 결과 한 줄 */
export interface LookupResult extends TicketKey {
  showSlug: string;
  qty: number;
  status: TicketStatus;
}

/** 예매 신청 폼에서 보내는 값 */
export interface ReserveInput {
  showSlug: string;
  name: string;
  phone: string;
  qty: number;
  depositor: string;
  team: string;
  agree: boolean;
  /** 스팸 봇 걸러내기용 숨은 칸. 사람은 비워 둡니다. */
  website?: string;
}

export const ticketPath = ({ code, token }: TicketKey) => `/ticket/${code}?k=${token}`;

/** 010-1234-5678 형태로 맞춥니다. 숫자가 아니면 그대로 돌려줍니다. */
export function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, '');
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return raw;
}
