# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

**밴드할래?** — 무대 경험이 없는 밴드들의 첫 공연을 기획·운영하는 팀의 **공연 소개 원페이지 사이트**.
팀 모집부터 대관·음향·홍보·티켓·촬영까지 대행하고, 참가비 사용처를 전액 공개하는 것이 핵심 메시지다.

한 페이지에 9개 섹션이 세로로 이어진다:

```
헤더(sticky) → 히어로 → SHOW INFO → LINE UP → WHAT WE DO
→ WHERE IT GOES(정산) → FAQ → JOIN US(문의·알림) → 푸터
```

> **디자인 원본**: Claude Design 핸드오프 번들의 `밴드할래 웹사이트.dc.html`.
> 시안은 **폭 560px 고정** 프로토타입이며, 이 저장소는 그 시안을 반응형으로 옮긴 구현이다.
> 시안과 다르게 판단한 부분은 아래 "시안에서 확장한 것"에 정리해 두었다.

## Commands

```bash
npm run dev       # 개발 서버 (http://localhost:3000)
npm run build     # 프로덕션 빌드 — 타입 체크까지 함께 수행
npm run start     # 빌드 결과 실행
npm run lint      # eslint . (ESLint 9 flat config)
```

> 테스트 러너는 없다. 검증 수단은 `npm run build`(타입 체크 포함) + `npm run lint` + 브라우저 확인이다.
> 코드 변경 후에는 최소한 이 둘을 통과시킬 것.
>
> lint 스크립트는 `next lint`가 아니라 **`eslint .`** 다. `next lint`는 Next 16에서 제거되므로 되돌리지 말 것.

## 기술 스택

| 영역 | 채택 |
| --- | --- |
| 프레임워크 | Next.js 15.5.24 (App Router) |
| 런타임/언어 | React 18.3 · TypeScript 5.5 (`strict: true`) |
| 상태 관리 | React 내장 `useState` — 전역 상태 없음 |
| 서버 통신 | 자체 `fetch` 래퍼 (`lib/api.ts`) |
| 스타일링 | 단일 `globals.css` + CSS 변수 토큰 |
| 폰트 | Gaegu · Gothic A1 · Archivo Black (Google Fonts CSS2 링크) |
| 아이콘 | 인라인 SVG `<symbol>` 세트 (`components/site/BrandDefs.tsx`) |
| 린트 | ESLint 9 flat config (`eslint.config.mjs`) + `next/core-web-vitals` · `next/typescript` |

**의존성 원칙**: 런타임 의존성은 `next`/`react`/`react-dom` **3개뿐**이다.
UI 라이브러리·상태 라이브러리·CSS 프레임워크·아이콘 패키지를 새로 추가하지 않는다.
정말 필요하면 먼저 상의한다.

## 아키텍처

### 디렉토리 구조

```
app/
  layout.tsx        # 폰트 로드 · metadata · viewport
  page.tsx          # 섹션을 순서대로 조립하는 유일한 라우트
  globals.css       # 토큰 + 전 섹션 스타일 (스타일은 여기 한 곳에만)
  icon.svg          # 파비콘 (App Router가 자동 인식)
components/site/
  BrandDefs.tsx     # <defs> 심볼 정의 + <Glyph> 헬퍼
  Header.tsx        # ─┐
  Hero.tsx          #  │ 서버 컴포넌트 (상태 없음)
  Lineup.tsx        #  │
  WhatWeDo.tsx      #  │
  SiteFooter.tsx    # ─┘
  ShowInfo.tsx      # ─┐
  Settlement.tsx    #  │ 클라이언트 컴포넌트 ('use client')
  Faq.tsx           #  │
  Join.tsx          # ─┘
lib/
  content.ts        # 사이트에 노출되는 모든 문구·수치
  api.ts            # 폼 전송 (엔드포인트 미정 시 전송 흉내)
public/brand/       # 로고·포스터 PNG (OG 이미지 등)
```

### 서버/클라이언트 경계

**기본은 서버 컴포넌트**다. `'use client'`는 실제로 상태나 이벤트가 필요한 섹션에만 붙인다.

| 컴포넌트 | 클라이언트인 이유 |
| --- | --- |
| `ShowInfo` | 티켓 판매 상태 전환 |
| `Settlement` | 예상 집행 ↔ 실제 정산 토글 |
| `Faq` | 아코디언 열림/닫힘 |
| `Join` | 두 개의 폼 입력·검증·전송 |

새 섹션을 만들 때 상호작용이 없다면 `'use client'`를 **붙이지 않는다**.

### 콘텐츠 레이어 (`lib/content.ts`)

화면에 보이는 문구·수치·목록은 **전부 여기 있다**. 컴포넌트 안에 데이터를 하드코딩하지 않는다.
(단, 한 번만 쓰이는 긴 산문 — 히어로 리드 문구, 폼 안내문 — 은 해당 컴포넌트에 둔다.)

자주 하는 변경은 대부분 이 파일 한 곳만 고치면 된다:

| 하고 싶은 일 | 고칠 곳 |
| --- | --- |
| 공연 날짜·장소·가격 변경 | `SHOW` |
| 티켓 상태 전환 (오픈전/예매중/매진/종료) | `TICKET_STATE` |
| 잔여 좌석·마감일 문구 | `TICKET_NOTE` |
| 라인업 팀 추가·수정 | `LINEUP` |
| 대행 항목 6개 | `SERVICES` |
| 참가비 내역·정산 공개 | `SETTLEMENT` |
| FAQ 추가 | `FAQS` |
| 인스타·이메일 | `LINKS` |
| 개발용 상태 칩 숨기기 | `SHOW_TICKET_STATE_SWITCHER = false` |

정산 합계(`120,000원`)는 상수가 아니라 `sumRows()`로 **항목에서 계산**한다. 항목만 고치면 합계·퍼센트·막대 그래프가 함께 따라온다.

### API 레이어 (`lib/api.ts`)

- 폼 전송은 전부 이 파일을 거친다. 컴포넌트는 엔드포인트를 모른다.
- `NEXT_PUBLIC_API_BASE_URL`이 **비어 있으면 전송을 흉내만 낸다** (600ms 후 성공 — 완료 화면까지 그대로 동작).
- 접수처가 정해지면 ① `.env.local`에 URL 설정 → ② `ENDPOINTS` 경로만 수정. 화면 코드는 손대지 않는다.
- 에러는 `ApiError`로 던지고, 사용자 노출 메시지는 한국어 존댓말로 통일한다.

## 디자인 시스템 & 스타일링

### 스타일은 `app/globals.css` 한 곳

CSS Modules도, 인라인 스타일 덩어리도 쓰지 않는다. 컴포넌트는 `className`만 얹고 스타일은 전부 globals.css에 둔다.
파일은 섹션 순서대로 정렬돼 있으니 새 스타일도 해당 섹션 블록에 넣는다.

**인라인 `style`은 값이 런타임에 계산될 때만 쓴다** — 정산 막대의 `width: %`, 항목 스와치 `background` 같은 경우. 정적인 값은 예외 없이 클래스로.

### 토큰

색·폰트·모션은 `:root` CSS 변수로만 참조한다. **하드코딩 색상 금지.**

| 용도 | 변수 |
| --- | --- |
| 배경 | `--cream` `--cream-alt` `--cream-card` `--cream-outer` |
| 먹색 / 강조 | `--ink` `--orange` |
| 본문 텍스트 | `--muted` `--muted-2` `--muted-3` |
| 어두운 배경 위 | `--on-dark` `--on-dark-dim` `--dark-line` |
| 폼 필드(다크) | `--field-bg` `--field-line` |
| 폰트 | `--font-body` `--font-hand` `--font-stamp` |

예외는 `BrandDefs.tsx` 하나뿐이다. 로고·아이콘 SVG 내부는 시안의 hex를 그대로 유지한다(테마 대상이 아님).

### 폰트 3종의 역할

| 변수 | 폰트 | 쓰는 곳 |
| --- | --- | --- |
| `--font-hand` | Gaegu | 로고 워드마크, 대제목, "접수됐어요!" 같은 감탄 |
| `--font-body` | Gothic A1 | 본문·버튼·폼 전부 |
| `--font-stamp` | Archivo Black | `SHOW INFO` 류 영문 라벨, 날짜 스탬프, 금액 |

> 폰트는 `next/font`가 아니라 **Google Fonts CSS2 `<link>`** 로 불러온다.
> `next/font`가 Gaegu·Gothic A1의 `korean` 서브셋을 제공하지 않아(latin 전용) 한글이 시스템 폰트로 폴백되기 때문이다.
> 이 방식은 `unicode-range`로 필요한 글리프만 내려받는다. **`next/font`로 되돌리지 말 것.**

### 반응형

시안의 **560px가 기준선**이다. 이 폭에서 시안과 픽셀 단위로 일치한다(히어로 70px, 제목 46px, 여백 30px).

| 폭 | 동작 |
| --- | --- |
| ~340px | 히어로 CTA 세로 배치 |
| ~400px | 좌우 여백 30 → 20px |
| ~1023px | 560px 단일 컬럼 (모바일·태블릿) |
| 1024px~ | 컨테이너 1120px, 여백 64px, 다단 배치 |
| 1440px~ | 컨테이너 1240px 상한 |

큰 글자는 `clamp(최소, vw, 시안값)`으로 잡아서 560px에서 정확히 시안 값이 나오도록 계수를 맞췄다
(`70px = 12.5vw`, `46px = 8.21vw`). 이 계수를 바꿀 때는 560px에서의 결과를 다시 확인할 것.

### 시안에서 확장한 것

시안은 560px 프로토타입이라 아래는 구현하며 판단한 부분이다. 다르게 가고 싶으면 이 목록부터 보면 된다.

- **데스크톱 다단** — LINE UP 2열, WHAT WE DO 3열, SHOW INFO(정보/티켓) 2열, JOIN US(문의/알림) 2열
- **hover·focus 상태** — 시안에 없어 브랜드 색 기준으로 추가 (`:focus-visible` 아웃라인 포함)
- **전송 중 상태** — 시안에는 없던 `보내는 중…` 표시와 버튼 비활성화
- **모집 중 팀의 소셜 링크 생략** — 시안은 모든 카드에 3개 링크를 고정 노출하지만, 채널이 없는 팀은 링크 줄을 숨긴다
- **접근성** — 아코디언 `aria-expanded`, 토글 `aria-pressed`, 동의 체크박스 `role="checkbox"`, 폼 `aria-invalid`

## 코드 컨벤션

- **경로 alias**: `@/*` → 프로젝트 루트. 상대경로(`../../`) 대신 `@/lib/...`, `@/components/...`.
- **파일명**: 컴포넌트는 PascalCase(`ShowInfo.tsx`), 유틸은 camelCase(`content.ts`).
- **export**: `export function Xxx()` 이름 있는 export를 쓴다. `export default`는 `app/`의 page/layout에만.
- **타입**: `strict`. `any` 금지. props는 인라인 타입 또는 `interface`. 도메인 타입(`Band`/`Service`/`SettleRow`/`TicketState` 등)은 `lib/content.ts`의 것을 재사용한다.
- **아이콘**: `<Glyph id="ic-mic" size={44} />`. 새 아이콘은 `BrandDefs.tsx`에 `<symbol>`을 추가하고 `IconId`에 이름을 넣는다.
- **문구**: 사용자 노출 텍스트는 한국어 존댓말("~해 주세요", "~했어요"). 브랜드 톤은 반말 슬로건("무대만 서면 돼.")과 존댓말 안내가 섞이는 구조이니 시안 문구를 임의로 바꾸지 않는다.
- **주석**: 무엇이 아니라 **왜**를 한국어로. 특히 시안과 다르게 구현한 지점, 나중에 바꿔야 할 지점에 남긴다.

## 작업 원칙

- **최소 변경**: 요청된 부분만 수정한다. 관련 없는 파일은 건드리지 않는다.
- **시안이 기준**: 스타일을 고치기 전에 원본 `.dc.html`의 값을 먼저 확인한다. 임의로 여백·크기를 "개선"하지 않는다.
- **560px에서 확인**: 레이아웃을 건드렸으면 560px과 1440px 양쪽을 모두 본다.
- **데이터는 `content.ts`, 스타일은 `globals.css`, 전송은 `api.ts`** — 이 세 경계를 넘지 않는다.
