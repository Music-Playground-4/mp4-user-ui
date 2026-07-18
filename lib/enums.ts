// MP4 — 화면 라벨 ↔ 백엔드 enum 매핑
// ────────────────────────────────────────────────────────────────
// 백엔드는 영문 enum, 화면은 한국어 라벨을 쓴다.
// 변환 규칙을 이 파일 한 곳에만 두어 화면 코드가 enum 값을 몰라도 되게 한다.
//
// ⚠️ 카테고리는 1:1이 아니다. 초기 디자인은 악기별(일렉기타·베이스·어쿠스틱…)로
//    잡혀 있었지만 백엔드는 악기군 7종으로 정의돼 있다.
//    필터가 정확히 동작하도록 화면도 백엔드 기준(악기군)을 따른다.
// ────────────────────────────────────────────────────────────────

export type ItemCategory =
  | 'STRINGS' | 'WIND' | 'KEYBOARD' | 'PERCUSSION'
  | 'ELECTRONIC' | 'ACCESSORIES' | 'OTHER';

export type ItemCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
export type ItemStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'HIDDEN';
export type Grade = 'S' | 'A' | 'B' | 'C';
export type ItemSort = 'latest' | 'price_asc' | 'price_desc';

/** 목록 필터 칩·등록 폼에서 공유하는 카테고리 정의 */
export const CATEGORIES: { value: ItemCategory; label: string; hint: string }[] = [
  { value: 'STRINGS', label: '현악기', hint: '기타 · 베이스 · 바이올린' },
  { value: 'KEYBOARD', label: '건반', hint: '피아노 · 신디사이저' },
  { value: 'PERCUSSION', label: '타악기', hint: '드럼 · 퍼커션' },
  { value: 'ELECTRONIC', label: '전자장비', hint: '이펙터 · 앰프' },
  { value: 'WIND', label: '관악기', hint: '색소폰 · 트럼펫' },
  { value: 'ACCESSORIES', label: '액세서리', hint: '케이스 · 줄 · 마이크' },
  { value: 'OTHER', label: '기타', hint: '그 외' },
];

export const CONDITIONS: { value: ItemCondition; label: string }[] = [
  { value: 'NEW', label: '새상품' },
  { value: 'LIKE_NEW', label: '거의 새것' },
  { value: 'GOOD', label: '상태 좋음' },
  { value: 'FAIR', label: '사용감 있음' },
  { value: 'POOR', label: '하자 있음' },
];

export const SORTS: { value: ItemSort; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'price_asc', label: '낮은 가격순' },
  { value: 'price_desc', label: '높은 가격순' },
];

export const GRADES: Grade[] = ['S', 'A', 'B', 'C'];

const CATEGORY_LABEL = new Map(CATEGORIES.map((c) => [c.value, c.label]));
const CONDITION_LABEL = new Map(CONDITIONS.map((c) => [c.value, c.label]));

export function categoryLabel(v?: string | null): string {
  return (v && CATEGORY_LABEL.get(v as ItemCategory)) || '기타';
}
export function conditionLabel(v?: string | null): string {
  return (v && CONDITION_LABEL.get(v as ItemCondition)) || '-';
}

/** 판매 상태 — 목록/상세 배지에 함께 쓴다 */
export function statusLabel(v?: string | null): string | null {
  if (v === 'SOLD') return '판매완료';
  if (v === 'RESERVED') return '예약중';
  return null;
}

/* ── 세션·공연 모집 enum ─────────────────────────────────────── */

export type Frequency = 'REGULAR' | 'SHORT_TERM' | 'ONE_TIME';
export type RecruitLevel = 'BEGINNER_WELCOME' | 'EXPERIENCED';

export const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'REGULAR', label: '정기' },
  { value: 'SHORT_TERM', label: '단기' },
  { value: 'ONE_TIME', label: '원타임' },
];

export const RECRUIT_LEVELS: { value: RecruitLevel; label: string }[] = [
  { value: 'BEGINNER_WELCOME', label: '입문환영' },
  { value: 'EXPERIENCED', label: '경력자' },
];

const FREQ_LABEL = new Map(FREQUENCIES.map((f) => [f.value, f.label]));
const LEVEL_LABEL = new Map(RECRUIT_LEVELS.map((l) => [l.value, l.label]));

export function freqLabel(v?: string | null): string | null {
  return (v && FREQ_LABEL.get(v as Frequency)) || null;
}
export function recruitLevelLabel(v?: string | null): string | null {
  return (v && LEVEL_LABEL.get(v as RecruitLevel)) || null;
}
