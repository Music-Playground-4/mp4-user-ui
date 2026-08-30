# 공연 포스터

여기에 포스터 이미지를 넣고 `lib/content.ts` 의 해당 공연에 `poster` 를 채우면
공연 상세 페이지의 POSTER 섹션에 바로 게시됩니다.

```ts
poster: {
  src: '/posters/vol-01.png',
  alt: '밴드할래? VOL.01 포스터',
  width: 1414,          // 원본 픽셀 크기 (비율 계산용)
  height: 2000,
  href: 'https://instagram.com/p/...',  // 선택 — 인스타 게시물 링크
},
```

`poster` 가 없으면 COMING SOON 자리로 보입니다.
권장 비율은 A4 세로(1:1.414), 가로폭 1400px 이상이면 충분합니다.
