// 밴드할래? — 사이트에 노출되는 모든 문구·수치의 단일 출처.
// 공연이 늘어나면 SHOWS 배열에 항목만 추가하면 목록·상세·문의 폼이 함께 따라옵니다.

import type { IconId } from '@/components/site/BrandDefs';

/* ── 티켓 판매 상태 ──────────────────────────────────────────── */
export type TicketState = 'soon' | 'presale' | 'sold' | 'ended';

/** 상태별 티켓 버튼 문구. */
export const TICKET_LABEL: Record<TicketState, string> = {
  soon: 'COMING SOON',
  presale: '티켓 예매하기 →',
  sold: '전석 매진되었습니다',
  ended: '종료된 공연입니다',
};

/** 버튼 아래 보조 안내. 해당 상태에서만 노출됩니다. */
export const TICKET_NOTE: Partial<Record<TicketState, string>> = {
  soon: '예매 오픈 일정이 정해지면 알려드릴게요',
  ended: '공연 스냅과 정산 내역은 인스타그램에서 확인하세요',
};

/** 목록 카드에 붙는 짧은 상태 뱃지. */
export const TICKET_BADGE: Record<TicketState, string> = {
  soon: '예매 오픈 전',
  presale: '예매 중',
  sold: '매진',
  ended: '종료',
};

/** 개발 참고용 상태 전환 칩 목록. */
export const TICKET_STATE_CHIPS: { value: TicketState; label: string }[] = [
  { value: 'soon', label: '오픈 전' },
  { value: 'presale', label: '예매 중' },
  { value: 'sold', label: '매진' },
  { value: 'ended', label: '종료' },
];

/**
 * 디자인 시안에 있던 "버튼 상태 (개발 참고)" 칩을 노출할지 여부.
 * 실제 사용자에게 보이는 페이지이므로 꺼둡니다.
 * 상태를 바꾸려면 이 칩이 아니라 각 공연의 ticketState 값을 수정하세요.
 */
export const SHOW_TICKET_STATE_SWITCHER = false;

/* ── 라인업 ──────────────────────────────────────────────────── */

/**
 * 아직 팀이 확정되지 않은 자리의 표시 방식.
 * - 'tba'  섭외는 됐고 공개만 남은 자리 → COMING SOON
 * - 'open' 아직 팀을 찾는 자리 → 참여 문의 유도
 */
export type BandSlot = 'tba' | 'open';

export interface Band {
  /** 'TEAM 01' 같은 자리 번호. 팀이 정해지기 전에도 카드는 이 번호로 보여줍니다. */
  no: string;
  /** name 이 있으면 공개된 팀. 없으면 slot 값에 따라 자리 카드로 렌더링됩니다. */
  name?: string;
  slot?: BandSlot;
  tagline?: string;
  members?: string[];
  instagram?: string;
  youtube?: string;
  appleMusic?: string;
}

/* ── 공연 ────────────────────────────────────────────────────── */
export type ShowStatus = 'upcoming' | 'past';

export interface Show {
  /** URL 조각. /shows/<slug> */
  slug: string;
  volume: string;
  /** 목록·히어로에 쓰는 짧은 이름 */
  title: string;
  /** 오렌지 스탬프에 들어가는 날짜 */
  badge: string;
  badgeSub: string;
  date: string;
  time: string;
  timeNote: string;
  venue: string;
  venueNote: string;
  venueMapUrl?: string;
  ticketState: TicketState;
  ticketPrice: string;
  ticketPriceNote: string;
  status: ShowStatus;
  lineup: Band[];
  /** 라인업 아래 한 줄 안내 */
  lineupNote: string;
  /**
   * 공연 포스터. 아직 없으면 비워두면 COMING SOON 자리로 렌더링됩니다.
   * 이미지는 public/posters/ 에 넣고 '/posters/파일명.png' 로 지정하세요.
   */
  poster?: Poster;
}

export interface Poster {
  src: string;
  alt: string;
  /** 원본 비율. 세로 포스터 기본값은 A4 비율(1:1.414)입니다. */
  width: number;
  height: number;
  /** 인스타 등에 올린 게시물로 연결하고 싶을 때 */
  href?: string;
}

export const SHOWS: Show[] = [
  {
    slug: 'vol-01',
    volume: '01',
    title: '첫 번째 무대',
    badge: '11.14',
    badgeSub: '토요일 저녁 · 우리의 첫 공연',
    date: '2026년 11월 14일 (토)',
    time: '오후 6시',
    timeNote: '· 5시 30분 입장',
    venue: '홍대 백라인스테이지',
    venueNote: '서울 마포구',
    venueMapUrl: 'https://naver.me/x4lvTAV3',
    ticketState: 'soon',
    ticketPrice: '예매가 미정',
    ticketPriceNote: '정해지면 가장 먼저 공지할게요',
    status: 'upcoming',
    // 세 자리는 공개만 남았고, 마지막 한 자리는 아직 팀을 찾는 중입니다.
    lineup: [
      { no: 'TEAM 01', slot: 'tba' },
      { no: 'TEAM 02', slot: 'tba' },
      { no: 'TEAM 03', slot: 'tba' },
      { no: 'TEAM 04', slot: 'open' },
    ],
    lineupNote: '한 자리가 아직 비어 있어요. 참여 문의는 아래에서 →',
    // 포스터가 나오면 public/posters/ 에 넣고 아래 주석을 풀어주세요.
    // poster: { src: '/posters/vol-01.png', alt: '밴드할래? VOL.01 포스터', width: 1414, height: 2000 },
  },
];

/* ── 공연 조회 헬퍼 ──────────────────────────────────────────── */
export const getShow = (slug: string) => SHOWS.find((s) => s.slug === slug);

export const UPCOMING_SHOWS = SHOWS.filter((s) => s.status === 'upcoming');

export const PAST_SHOWS = SHOWS.filter((s) => s.status === 'past');

/** 히어로에서 가리키는 가장 가까운 공연. 없으면 undefined. */
export const NEXT_SHOW: Show | undefined = UPCOMING_SHOWS[0];

/* ── 브랜드 · 공통 ───────────────────────────────────────────── */
export const SLOGAN = { top: '무대만 서면 돼.', bottom: '나머진 우리가.' } as const;

const INSTAGRAM_HANDLE = '@bandgoofficial';

export const LINKS = {
  instagramHandle: INSTAGRAM_HANDLE,
  // 핸들 한 곳만 고치면 헤더·푸터 링크가 함께 따라옵니다.
  instagram: `https://instagram.com/${INSTAGRAM_HANDLE.replace(/^@/, '')}`,
  email: 'tt997768@gmail.com',
} as const;

/* ── 우리가 하는 것 ──────────────────────────────────────────── */
export interface Service {
  icon: IconId;
  title: string;
  desc: string;
}

export const SERVICES: Service[] = [
  { icon: 'ic-mic', title: '팀 모집', desc: '같은 밤에 설 팀을 함께 찾습니다.' },
  { icon: 'ic-venue', title: '공연장 예약', desc: '대관과 음향·백라인 협의까지.' },
  { icon: 'ic-promo', title: '공연 홍보', desc: '포스터·SNS 콘텐츠를 직접 만듭니다.' },
  { icon: 'ic-presale', title: '사전 티켓 예매', desc: '예매 창구 개설과 정산 관리.' },
  { icon: 'ic-onsite', title: '당일 티켓 관리', desc: '입장·검표는 운영진이 맡습니다.' },
  { icon: 'ic-media', title: '공연 스냅 · 영상', desc: '사진과 라이브 영상을 전달합니다.' },
];

/* ──────────────────────────────────────────────────────────────
   아래 두 블록은 현재 화면에 노출하지 않습니다.
   Settlement / Faq 컴포넌트와 함께 남겨두었으니, 다시 쓰려면
   해당 페이지에 컴포넌트를 추가하면 그대로 살아납니다.
   ────────────────────────────────────────────────────────────── */

/* ── (미노출) 참가비 사용처 ──────────────────────────────────── */
export type SettleMode = 'plan' | 'actual';

export interface SettleRow {
  label: string;
  amount: number;
  color: string;
}

export interface SettleData {
  totalLabel: string;
  rows: SettleRow[];
  notes: string[];
}

export const SETTLEMENT: Record<SettleMode, SettleData> = {
  plan: {
    totalLabel: '팀당 참가비',
    rows: [
      { label: '공연장 대관', amount: 54000, color: 'var(--ink)' },
      { label: '음향 · 엔지니어', amount: 30000, color: 'var(--orange)' },
      { label: '사진 · 영상 촬영', amount: 24000, color: 'var(--muted-3)' },
      { label: '홍보물 제작', amount: 12000, color: 'var(--line-4)' },
    ],
    notes: [
      '티켓 판매 의무는 없습니다. 못 팔아도 무대는 그대로예요.',
      '공연이 끝나면 실제 정산 내역을 전체 공개합니다.',
    ],
  },
  actual: {
    totalLabel: '팀당 실제 집행',
    rows: [
      { label: '공연장 대관', amount: 54000, color: 'var(--ink)' },
      { label: '음향 · 엔지니어', amount: 32000, color: 'var(--orange)' },
      { label: '사진 · 영상 촬영', amount: 24000, color: 'var(--muted-3)' },
      { label: '홍보물 제작', amount: 9000, color: 'var(--line-4)' },
    ],
    notes: [
      '남은 1,000원은 팀별로 전액 반환했습니다.',
      '영수증 원본은 인스타그램 하이라이트에 전부 올려두었습니다.',
    ],
  },
};

export const SETTLE_LABEL: Record<SettleMode, string> = {
  plan: '공연 전 · 예상 집행 내역',
  actual: '공연 후 · 실제 정산 내역',
};

/* ── (미노출) FAQ ────────────────────────────────────────────── */
export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    q: '참가비에 뭐가 포함되나요?',
    a: '공연장 대관, 음향·엔지니어, 사진·영상 촬영, 포스터와 SNS 홍보물 제작이 모두 포함됩니다. 팀당 120,000원 외에 추가로 받는 비용은 없습니다.',
  },
  {
    q: '티켓을 꼭 팔아야 하나요?',
    a: '아니요. 판매 의무나 최소 수량이 없습니다. 지인이 한 명도 못 와도 무대는 그대로 진행됩니다.',
  },
  {
    q: '환불은 어떻게 되나요?',
    a: '공연 3주 전까지는 전액, 2주 전까지는 50% 환불됩니다. 그 이후에는 대관과 음향 계약이 확정되어 환불이 어렵습니다.',
  },
  {
    q: '백라인은 뭐가 제공되나요?',
    a: '드럼 풀세트(심벌 제외), 기타·베이스 앰프, 보컬 마이크 3대, 모니터 스피커가 준비됩니다. 스네어·심벌·페달·기타는 각 팀이 가져오시면 됩니다.',
  },
  {
    q: '촬영본은 언제 받나요?',
    a: '스냅 사진은 공연 후 1주 이내, 라이브 영상은 3주 이내에 원본 파일로 전달합니다. 편집 없이 그대로 드리고, 사용에 제약도 없습니다.',
  },
  {
    q: '어떤 팀도 지원할 수 있나요?',
    a: '장르와 경력 무관, 무대 경험이 아예 없어도 괜찮습니다. 자작곡이든 커버든 상관없고, 30분 분량(4~5곡)을 준비할 수 있으면 충분합니다.',
  },
];

/* ── 유틸 ────────────────────────────────────────────────────── */
export const formatWon = (n: number) => n.toLocaleString('ko-KR');

export const sumRows = (rows: SettleRow[]) => rows.reduce((acc, r) => acc + r.amount, 0);
