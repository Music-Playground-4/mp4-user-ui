# MP4 · Hi-Fi (Next.js)

음악인을 위한 매칭 플랫폼 MP4의 디자인 핸드오프를 Next.js 15 + App Router + TypeScript로 구현한 프로젝트입니다.

## 구조

총 26개의 모바일 하이파이 화면을 5개 섹션으로 구성했습니다.

```
A · 공통 / 인증   (5)  스플래시 · 로그인 · 회원가입 · 프로필셋업 · 홈
B · 악기 장터    (5)  리스트 · 상세 · 등록 · 필터 · 거래채팅
C · 세션 매칭   (5)  리스트 · 상세 · 지원 · 지원자 · 그룹챗
D · 공연 매칭   (6)  리스트 · 상세 · 자동팀빌딩 · 라인업 · 지원 · 팀챗
E · 마이페이지   (5)  프로필 · 활동 · 신뢰점수 · 설정 · 온보딩
```

## 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 열면 26개 화면이 섹션별 가로 스크롤 캔버스로 표시됩니다.

## 디렉토리 구조

```
mp4-app/
├── app/
│   ├── layout.tsx          # Pretendard·Wanted Sans 폰트 로드
│   ├── page.tsx            # 전체 26개 화면을 보여주는 캔버스
│   ├── globals.css         # 공통 컴포넌트 클래스(.btn .chip .badge .field, Phone shell)
│   └── tokens.css          # Wanted DS 디자인 토큰
├── components/
│   ├── ui/
│   │   ├── Icon.tsx        # 31종 라인 아이콘
│   │   ├── Pills.tsx       # GradePill · NewbieBadge
│   │   └── Shell.tsx       # Phone · PhoneFull · TopBar · TabBar
│   └── screens/
│       ├── auth/Auth.tsx
│       ├── market/Market.tsx
│       ├── sessions/Sessions.tsx
│       ├── perf/Perf.tsx
│       └── my/My.tsx
└── lib/
    └── data.ts             # 4명의 페르소나 + 6개 장비 + 5개 모집글 목업
```

## 기술 스택

- **Next.js 15.0.3** (App Router)
- **React 18.3** · **TypeScript 5.5**
- **Wanted DS 토큰** (CSS variables)
- **Pretendard · Wanted Sans** (jsdelivr CDN)
- 모든 스크린은 `'use client'` 컴포넌트
- 외부 UI 라이브러리 의존성 없음

## 디자인 시스템 노트

- Primary는 Wanted blue-50 (`rgb(0,102,255)`)
- 등급 배지 — S(파랑) / A(초록) / B(노랑) / C(빨강)
- 폰 프레임은 360×720 으로 고정 (모바일 first hi-fi 기준)
- 폰 내부 스크롤바는 `phone-body *` 셀렉터로 숨김 처리
