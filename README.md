# 밴드할래?

무대 경험이 없는 밴드들의 첫 공연을 기획·운영하는 팀의 공연 소개 사이트입니다.
Claude Design 시안(`밴드할래 웹사이트.dc.html`)을 Next.js 15 + App Router + TypeScript로 옮긴 반응형 원페이지입니다.

## 실행

```bash
npm install
npm run dev
```

http://localhost:3000

## 구성

한 페이지에 9개 섹션이 이어집니다.

| 섹션 | 내용 |
| --- | --- |
| 헤더 | 로고 · 인스타 · 문의하기 (sticky) |
| 히어로 | 공연 날짜 · 슬로건 · CTA 2개 |
| SHOW INFO | 일시 · 장소 · 티켓 + 상태별 예매 버튼 |
| LINE UP | 출연 팀 카드 |
| WHAT WE DO | 대행 항목 6가지 |
| WHERE IT GOES | 참가비 사용처 (예상 집행 ↔ 실제 정산 토글) |
| FAQ | 아코디언 |
| JOIN US | 밴드 참여 문의 폼 · 다음 공연 알림 신청 |
| 푸터 | 연락처 |

## 반응형

시안 기준 폭은 **560px**이며, 이 폭에서 시안과 픽셀 단위로 일치합니다.

- `~1023px` — 560px 단일 컬럼 (모바일 · 태블릿)
- `1024px~` — 컨테이너 1120px, LINE UP 2열 · WHAT WE DO 3열 · SHOW INFO와 JOIN US 좌우 분할
- `1440px~` — 컨테이너 1240px 상한

## 자주 하는 수정

문구·수치는 대부분 [lib/content.ts](lib/content.ts) 한 파일에 모여 있습니다.

```ts
TICKET_STATE              // 'soon' | 'presale' | 'sold' | 'ended'
SHOW                      // 날짜 · 장소 · 가격
LINEUP                    // 출연 팀
SETTLEMENT                // 참가비 내역 (합계는 자동 계산)
FAQS                      // 자주 묻는 질문
SHOW_TICKET_STATE_SWITCHER // 개발용 상태 칩 표시 여부
```

## 폼 전송

접수처가 아직 없어 [lib/api.ts](lib/api.ts)가 전송을 흉내만 냅니다(완료 화면까지 동작).
실제로 보내려면 `.env.local`에 주소를 넣고 `ENDPOINTS` 경로를 맞추면 됩니다.

```bash
NEXT_PUBLIC_API_BASE_URL="https://example.com/api"
```

## 기술 스택

- **Next.js 15.0.3** (App Router) · **React 18.3** · **TypeScript 5.5**
- 런타임 의존성 3개 (`next` · `react` · `react-dom`) — UI/상태/CSS 라이브러리 없음
- 상호작용이 있는 섹션만 클라이언트 컴포넌트, 나머지는 서버 컴포넌트
- 스타일은 `app/globals.css` 한 곳 + CSS 변수 토큰
- **Gaegu · Gothic A1 · Archivo Black** (Google Fonts)

개발 가이드는 [CLAUDE.md](CLAUDE.md)를 참고하세요.
