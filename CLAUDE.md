# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

**MP4** — 음악인을 위한 매칭 플랫폼. 악기 장터, 합주 세션, 공연 팀빌딩을 한곳에서 다룬다.
디자인 핸드오프를 **Next.js 15 App Router + React 18 + TypeScript**로 구현한 모바일 우선(mobile-first) 웹앱이며, 데스크톱에서는 사이드바 레이아웃으로 확장된다.

> **현재 단계**: 프론트엔드 UI 구현 + 목업 데이터 단계. 백엔드 API는 아직 미연결(`lib/api.ts` mock 폴백으로 동작). 자세한 화면 목록은 [README.md](README.md) 참고.

## Commands

```bash
npm run dev       # 개발 서버 (http://localhost:3000)
npm run build     # 프로덕션 빌드
npm run start     # 빌드 결과 실행
npm run lint      # next lint (ESLint)
```

> 테스트 러너는 아직 도입되지 않았다. `npm test` 스크립트는 없다.

## 기술 스택

| 영역 | 채택 |
| --- | --- |
| 프레임워크 | Next.js 15.0.3 (App Router) |
| 런타임/언어 | React 18.3 · TypeScript 5.5 (`strict: true`) |
| 상태 관리 | React 내장(`useState`/`useContext`) — 외부 상태 라이브러리 없음 |
| 인증 | 자체 Context (`lib/auth.tsx`) + `localStorage` 토큰 |
| 서버 통신 | 자체 `fetch` 래퍼 (`lib/api.ts`) — axios 미사용 |
| 스타일링 | CSS 변수 디자인 토큰(Wanted DS) + 전역 컴포넌트 클래스 + 인라인 스타일 |
| 폰트 | Pretendard · Wanted Sans (jsdelivr CDN, `app/layout.tsx`에서 로드) |
| 아이콘 | 자체 인라인 SVG 아이콘 셋 (`components/ui/Icon.tsx`) |

**의존성 원칙**: 외부 UI 컴포넌트/유틸 라이브러리(shadcn, MUI, Tailwind, 상태 라이브러리 등) **없이** 순수 React로 구성한다. 새 의존성 추가는 지양하고, 필요하면 먼저 상의한다.

## 아키텍처

### 디렉토리 구조

```
app/                    # App Router 페이지 (모든 페이지는 'use client')
  layout.tsx            # 폰트 로드 · AuthProvider · AppFrame 연결
  page.tsx              # 홈
  globals.css           # 전역 컴포넌트 클래스 (.btn .chip .badge .field · 레이아웃 셸)
  tokens.css            # Wanted DS 디자인 토큰 (색상 · 모션 · 폰트 변수)
  <섹션>/[id]/...       # 동적 라우트 (market · sessions · perf · my · users 등)
components/
  app/                  # 앱 골격 (AppFrame · Nav[SideNav/BottomTabBar/TopBar] · PullToRefresh)
  ui/                   # 재사용 UI (Icon · Pills[GradePill/NewbieBadge] · AuthForm[Field/Spinner/StepBar])
lib/
  api.ts                # fetch 클라이언트 + authApi + mock 폴백
  auth.tsx              # AuthProvider · useAuth
  data.ts              # 목업 데이터(USERS/GEARS/POSTS/SHOWS/CHAT_ROOMS) + 헬퍼(formatPrice, userById 등)
```

### 앱 셸 & 반응형

`AppFrame`이 최상위 레이아웃을 담당한다 ([components/app/AppFrame.tsx](components/app/AppFrame.tsx)):

- **데스크톱**: `SideNav`(좌측 사이드바) + `app-main` 콘텐츠
- **모바일**: 각 페이지 하단에 `BottomTabBar`를 직접 배치
- 네비게이션 항목은 `Nav.tsx`의 단일 `ENTRIES` 배열에서 관리 — `mobile`/`desktop` 플래그로 노출 위치를 제어하고, `activeId()`가 최장 prefix 매칭으로 활성 탭을 계산한다.
- `UNFRAMED_PATHS`(예: `/gallery`)는 셸 없이 전체 화면으로 렌더한다.
- 라우트 전환 시 `route-enter` 클래스로 진입 애니메이션을 준다.

### 인증

- `AuthProvider`가 `useAuth()`로 `user`/`status`(`loading|authenticated|guest`)와 `login`/`signup`/`logout`을 제공한다.
- 토큰은 `localStorage`(`mp4_token`)에 저장하고, 마운트 시 `authApi.me()`로 세션을 복원한다.
- `window` 접근 전 항상 `typeof window === 'undefined'` 가드 (SSR 안전).

### API 레이어 (`lib/api.ts`)

- 모든 서버 통신은 이 파일을 경유한다. 화면 코드는 API 세부를 몰라도 되게 한다.
- `NEXT_PUBLIC_API_BASE_URL`이 **비어 있으면 mock 모드**, 설정되면 실제 API로 동작 (`isApiConfigured` 플래그).
- 백엔드 스펙 확정 시: ① `.env.local`에 `NEXT_PUBLIC_API_BASE_URL` 설정 → ② `ENDPOINTS` 경로/매핑만 수정. 화면 코드는 손대지 않는다.
- 에러는 `ApiError`(status/message/data)로 던지고, 사용자 노출 메시지는 한국어 존댓말로 통일한다.
- mock 블록은 실제 API 연결 후 삭제 가능하도록 파일 하단에 격리돼 있다.

## 스타일링 컨벤션

3계층으로 나뉜다. 새 스타일은 **가장 낮은 계층부터** 재사용을 고려한다.

1. **디자인 토큰** (`app/tokens.css`) — 색상/모션/폰트는 반드시 CSS 변수로 참조한다. 하드코딩 색상 금지.
   - 색상: `var(--color-primary)`, `var(--fg-strong)`, `var(--fg-normal)`, `var(--fg-alternative)`, `var(--color-line)` 등
   - 모션: `var(--ease-out)`, `var(--dur-base)` 등 — 커스텀 easing/duration 새로 만들지 말고 토큰 사용
   - Primary는 Wanted blue-50 `rgb(0,102,255)`
2. **전역 컴포넌트 클래스** (`app/globals.css`) — 반복되는 UI는 클래스로: `.btn`(+`-sm/-md/-lg`, `-primary/-outlined/-text/...`), `.field`, `.chip`, `.badge`, `.topbar`, `.tabbar`, `.fab` 등. 여기 있는 패턴은 인라인으로 다시 쓰지 말 것.
3. **인라인 스타일** — 페이지 고유의 일회성 레이아웃(간격/정렬/flex)에 한해 `style={{ ... }}` 사용. 이 저장소는 인라인 스타일 비중이 높은 편이니 주변 코드 스타일에 맞춘다.

- 등급 배지(Grade): S(파랑) / A(초록) / B(노랑) / C(빨강) — `GradePill` 사용.
- 스크롤바는 전역에서 숨김 처리(스크롤 기능은 유지)돼 있다.
- 접근성: 인터랙티브 요소에 `aria-label`, 버튼은 `type="button"` 명시.

## 코드 컨벤션

- **폴더명**: `app`/`components` 내부는 kebab-case, 그 외 CamelCase.
- **파일명**: React 컴포넌트 파일은 PascalCase(`AuthForm.tsx`), 유틸/훅은 camelCase(`api.ts`, `auth.tsx`).
- **경로 alias**: `@/*` → 프로젝트 루트. 상대경로(`../../`) 대신 `@/lib/...`, `@/components/...` 사용.
- **클라이언트 컴포넌트**: 상호작용/브라우저 API를 쓰는 컴포넌트는 파일 첫 줄에 `'use client'`. (현재 `app/` 페이지는 대부분 클라이언트 컴포넌트다.)
- **타입**: `strict` 모드. `any` 지양, props는 `interface` 또는 인라인 타입으로 명시. 공용 도메인 타입은 `lib/data.ts`에 정의된 것(`Gear`/`User`/`Post`/`Grade` 등)을 재사용.
- **데이터 접근**: 목업은 `lib/data.ts`의 export 상수/헬퍼(`userById`, `gearById`, `formatPrice` 등) 사용. 컴포넌트에서 배열 하드코딩 금지.
- **네비게이션**: `next/link`의 `<Link>`(선언적 이동) 우선, 로직 후 이동은 `useRouter()`. 탭 목록 변경은 `Nav.tsx`의 `ENTRIES` 한 곳만 수정.
- **문구**: 사용자 노출 텍스트는 한국어 존댓말("~해 주세요", "~했어요")로 일관.
- **주석**: 왜(why)를 설명하는 한국어 주석. `lib/*`처럼 향후 백엔드 연결 지점은 주석으로 안내를 남긴다.

## 작업 원칙

- **최소 변경 원칙**: 요청된 부분만 수정하고, 관련 없는 파일은 건드리지 않는다.
- 새 화면/컴포넌트는 기존 섹션(`market`/`sessions`/`perf`/`my`)의 구조·스타일 패턴을 먼저 참고해 맞춘다.
- 색상·간격·모션은 토큰/클래스를 재사용하고, 새 값이 정말 필요할 때만 추가한다.
- 백엔드 연동이 필요한 로직은 `lib/api.ts`에 엔드포인트를 추가하고 화면은 그 API만 호출하도록 유지한다.
