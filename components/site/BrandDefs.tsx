// 로고 마크와 아이콘 세트를 <defs> 로 한 번만 정의하고, 각 화면에서는 <use> 로 참조합니다.
// 디자인 시안의 SVG 를 그대로 옮긴 것이라 내부 색상은 하드코딩된 브랜드 색을 유지합니다.
// (currentColor 를 쓰는 소셜 아이콘만 호출부에서 색을 정할 수 있습니다.)

export type IconId =
  | 'ic-mic'
  | 'ic-venue'
  | 'ic-promo'
  | 'ic-presale'
  | 'ic-onsite'
  | 'ic-media'
  | 'ic-insta'
  | 'ic-play'
  | 'ic-note';

export type SymbolId = IconId | 'mark' | 'ghost';

/** <use> 한 줄로 심볼을 그리는 헬퍼. 크기는 정사각형 기준입니다. */
export function Glyph({
  id,
  size,
  className,
  style,
}: {
  id: SymbolId;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg width={size} height={size} className={className} style={style} aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}

/** 페이지당 한 번만 렌더합니다. 화면에는 보이지 않고 심볼 정의만 제공합니다. */
export function BrandDefs() {
  return (
    <svg width={0} height={0} className="brand-defs" aria-hidden="true" focusable="false">
      <defs>
        {/* 손으로 그린 듯한 거친 질감 — 로고와 배경 고스트에 적용 */}
        <filter id="rgh" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <symbol id="mark" viewBox="0 0 120 120">
          <rect width="120" height="120" fill="#17140F" />
          <g filter="url(#rgh)" transform="translate(60 66) rotate(-8) scale(0.78) translate(-50 -50)">
            <rect x="40" y="-70" width="20" height="100" fill="#EFE7D6" />
            <path
              d="M40 -60h20M40 -46h20M40 -32h20M40 -18h20M40 -4h20M40 10h20M40 24h20"
              stroke="#17140F"
              strokeWidth="3"
            />
            <path
              d="M34 20C22 24 18 32 20 40 22 48 30 54 30 60 30 68 18 70 14 80 22 94 38 98 50 98 62 98 78 94 86 80 82 70 70 68 70 60 70 54 78 48 80 40 82 32 78 24 66 20 60 24 56 30 50 30 44 30 40 24 34 20Z"
              fill="#EFE7D6"
            />
            <circle cx="50" cy="76" r="10" fill="#17140F" />
            <rect x="36" y="52" width="28" height="9" rx="2" fill="#FF5A1F" />
          </g>
        </symbol>

        {/* 배경 장식용 실루엣 — 목 부분이 viewBox 위로 잘려 나가는 게 의도된 구성입니다. */}
        <symbol id="ghost" viewBox="0 0 100 100">
          <rect x="40" y="-70" width="20" height="100" fill="#17140F" />
          <path
            d="M34 20C22 24 18 32 20 40 22 48 30 54 30 60 30 68 18 70 14 80 22 94 38 98 50 98 62 98 78 94 86 80 82 70 70 68 70 60 70 54 78 48 80 40 82 32 78 24 66 20 60 24 56 30 50 30 44 30 40 24 34 20Z"
            fill="#17140F"
          />
          <circle cx="50" cy="76" r="10" fill="#EFE7D6" />
        </symbol>

        <symbol id="ic-mic" viewBox="0 0 100 100">
          <rect x="34" y="10" width="32" height="50" rx="16" fill="none" stroke="#17140F" strokeWidth="7" />
          <path d="M42 24h16M42 34h16M42 44h16" stroke="#17140F" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M50 60v22" stroke="#17140F" strokeWidth="7" strokeLinecap="round" />
          <path d="M32 88h36" stroke="#FF5A1F" strokeWidth="7" strokeLinecap="round" />
        </symbol>

        <symbol id="ic-venue" viewBox="0 0 100 100">
          <path d="M10 34h80" stroke="#17140F" strokeWidth="7" strokeLinecap="round" />
          <path d="M18 34v52M82 34v52" stroke="#17140F" strokeWidth="7" strokeLinecap="round" />
          <path d="M10 86h80" stroke="#17140F" strokeWidth="7" strokeLinecap="round" />
          <path d="M34 34v22h32V34" fill="none" stroke="#FF5A1F" strokeWidth="7" />
          <path d="M50 12v22" stroke="#17140F" strokeWidth="7" strokeLinecap="round" />
        </symbol>

        <symbol id="ic-promo" viewBox="0 0 100 100">
          <path
            d="M14 22h58a10 10 0 0 1 10 10v28a10 10 0 0 1-10 10H40L22 88V70h-8a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8Z"
            fill="none"
            stroke="#17140F"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          <path d="M26 40h34" stroke="#17140F" strokeWidth="6" strokeLinecap="round" />
          <path d="M26 54h20" stroke="#FF5A1F" strokeWidth="6" strokeLinecap="round" />
        </symbol>

        <symbol id="ic-presale" viewBox="0 0 100 100">
          <path
            d="M10 28h80v18a8 8 0 0 0 0 16v18H10V62a8 8 0 0 0 0-16Z"
            fill="none"
            stroke="#17140F"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          <path d="M56 34v40" stroke="#17140F" strokeWidth="5" strokeDasharray="7 7" />
          <path d="M24 46h20M24 60h14" stroke="#FF5A1F" strokeWidth="6" strokeLinecap="round" />
        </symbol>

        <symbol id="ic-onsite" viewBox="0 0 100 100">
          <circle cx="50" cy="42" r="26" fill="none" stroke="#17140F" strokeWidth="7" />
          <path
            d="M38 42l9 10 16-18"
            fill="none"
            stroke="#FF5A1F"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M22 80h56" stroke="#17140F" strokeWidth="7" strokeLinecap="round" />
          <path d="M32 90h36" stroke="#17140F" strokeWidth="6" strokeLinecap="round" />
        </symbol>

        <symbol id="ic-media" viewBox="0 0 100 100">
          <rect x="10" y="28" width="62" height="46" rx="8" fill="none" stroke="#17140F" strokeWidth="7" />
          <path d="M72 46l18-12v34L72 56Z" fill="none" stroke="#17140F" strokeWidth="7" strokeLinejoin="round" />
          <circle cx="34" cy="51" r="10" fill="none" stroke="#FF5A1F" strokeWidth="7" />
        </symbol>

        <symbol id="ic-insta" viewBox="0 0 100 100">
          <rect x="14" y="14" width="72" height="72" rx="20" fill="none" stroke="currentColor" strokeWidth="8" />
          <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="8" />
          <circle cx="70" cy="30" r="5" fill="currentColor" />
        </symbol>

        <symbol id="ic-play" viewBox="0 0 100 100">
          <rect x="8" y="22" width="84" height="56" rx="16" fill="none" stroke="currentColor" strokeWidth="8" />
          <path d="M42 38l22 12-22 12Z" fill="currentColor" />
        </symbol>

        <symbol id="ic-note" viewBox="0 0 100 100">
          <path d="M40 74V22l34-8v52" fill="none" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
          <circle cx="28" cy="76" r="13" fill="none" stroke="currentColor" strokeWidth="8" />
          <circle cx="62" cy="66" r="13" fill="none" stroke="currentColor" strokeWidth="8" />
        </symbol>
      </defs>
    </svg>
  );
}
