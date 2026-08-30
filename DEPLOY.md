# 배포 체크리스트

프론트(이 저장소) → Vercel, 백엔드(`mp4-backend-clean`) → Vercel(이미 배포됨), 도메인 → 가비아.

> **지금 막혀 있는 것**: Supabase 프로젝트(`ljjtkpenisvzywlrrnvh`)가 삭제되어 DB에 붙을 수 없습니다.
> 이게 해결되기 전까지 문의 접수·알림 신청이 동작하지 않습니다. **0단계가 최우선입니다.**

---

## 0. DB 복구 — 가장 먼저 (직접)

1. [supabase.com/dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트가 **Paused** 상태면 → `Restore` (몇 분 소요)
3. 없으면 → **New project** 생성 (region: `ap-northeast-2` 서울 권장)
4. `Project Settings → Database → Connection string` 에서 두 개 복사
5. `mp4-backend-clean/.env` 의 값 교체

```bash
DATABASE_URL="...pooler...:6543/postgres?pgbouncer=true"   # 앱 런타임
DIRECT_URL="...pooler...:5432/postgres"                     # 마이그레이션
```

6. 스키마 반영

```bash
cd ~/MP4Project/mp4-backend-clean && npm run db:push
```

7. 본인 계정을 운영자로 승격 (운영 콘솔 접근용). 한 번 로그인해서 User 행을 만든 뒤 Supabase SQL Editor에서:

```sql
update users set role = 'ADMIN' where email = 'tt997768@gmail.com';
```

---

## 1. 메일 발송 준비 (직접)

문의가 오면 `tt997768@gmail.com` 으로 알림이 갑니다.

1. [resend.com](https://resend.com) 가입 → **API Keys** 에서 키 발급
2. 도메인 인증 전에는 발신 주소로 `onboarding@resend.dev` 를 쓸 수 있습니다 (본인 메일로만 수신 가능)
3. 도메인을 붙이려면 `Domains → Add` 후 안내되는 DNS 레코드를 **가비아에 등록**

> 키가 없어도 접수 자체는 정상 동작합니다. 메일만 건너뜁니다.

---

## 2. 백엔드 환경변수 추가 (Vercel 대시보드에서 직접)

`mp4-backend` 프로젝트 → Settings → Environment Variables

| 키 | 값 | 비고 |
| --- | --- | --- |
| `PUBLIC_SITE_ORIGINS` | `https://<도메인>,https://<vercel-앱>.vercel.app` | **없으면 프로덕션에서 CORS 전부 차단** |
| `RESEND_API_KEY` | Resend 키 | 없으면 메일만 생략 |
| `MAIL_FROM` | `밴드할래? <onboarding@resend.dev>` | 도메인 인증 후 교체 |
| `INQUIRY_NOTIFY_TO` | `tt997768@gmail.com` | 쉼표로 여러 명 |
| `NEXT_PUBLIC_APP_URL` | 백엔드 배포 URL | 메일 속 운영 콘솔 링크에 사용 |
| `DATABASE_URL` / `DIRECT_URL` | 새 Supabase 값 | 0단계에서 바꾼 값 |

바꾼 뒤 **Redeploy** 해야 반영됩니다.

---

## 3. 프론트 배포 (직접)

1. GitHub 저장소 생성 후 푸시 (아직 커밋 전이면 먼저 커밋)

```bash
git add -A && git commit -m "feat: 밴드할래 랜딩 사이트"
git remote add origin https://github.com/<계정>/bandhallae-web.git
git push -u origin main
```

2. [vercel.com/new](https://vercel.com/new) → 저장소 import
3. Framework은 **Next.js** 자동 인식, 빌드 설정 그대로 두면 됩니다
4. Environment Variables 입력

| 키 | 값 |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 배포 URL (예: `https://mp4-backend.vercel.app`) |
| `NEXT_PUBLIC_SITE_URL` | 프론트 도메인 (예: `https://bandhallae.kr`) — OG 이미지 절대경로용 |

5. Deploy

---

## 4. 가비아 도메인 연결 (직접)

Vercel 프로젝트 → **Settings → Domains** 에서 도메인 추가하면 등록할 레코드를 알려줍니다.
가비아 **My가비아 → DNS 관리 → 레코드 수정** 에서 입력하세요.

| 호스트 | 타입 | 값 |
| --- | --- | --- |
| `@` | A | `76.76.21.21` |
| `www` | CNAME | `cname.vercel-dns.com.` |

- 가비아는 CNAME 값 끝에 **점(`.`)** 을 붙여야 하는 경우가 있습니다
- 반영까지 보통 10분~1시간 (최대 24시간)
- Vercel이 HTTPS 인증서를 자동 발급하므로 별도 설정 불필요
- **네임서버를 Vercel로 넘기지 말고** 가비아 DNS에 레코드만 추가하는 쪽이 간단합니다

---

## 5. 연결 후 확인 (같이)

도메인이 붙으면 **백엔드 `PUBLIC_SITE_ORIGINS` 에 실제 도메인을 반드시 추가**하세요. 빠뜨리면 폼 전송이 CORS로 막힙니다.

확인할 것:

- [ ] `https://<도메인>` 접속
- [ ] `/shows/vol-01` 접속
- [ ] 참여 문의 폼 전송 → "접수됐어요!"
- [ ] `tt997768@gmail.com` 으로 알림 메일 도착
- [ ] `<백엔드>/admin/inquiries` 에서 문의 확인 (ADMIN 계정으로 로그인)
- [ ] 알림 신청 → `<백엔드>/admin/subscribers` 에 표시

---

## 오픈 전에 정리할 것

- [ ] `lib/content.ts` 의 `SHOW_TICKET_STATE_SWITCHER = false` — 개발용 티켓 상태 칩 숨기기
- [ ] `LINKS.instagram` 을 실제 계정 주소로 (지금은 `https://instagram.com`)
- [ ] `SHOW.venueMapUrl` 을 백라인스테이지 실제 지도 링크로 (지금은 네이버 지도 메인)
- [ ] 포스터 완성되면 `public/posters/` 에 넣고 `poster` 필드 채우기
