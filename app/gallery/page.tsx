import Link from 'next/link';

interface Page { code: string; name: string; href: string; sub?: string; }

const SECTIONS: { title: string; sub: string; pages: Page[] }[] = [
  {
    title: 'A · 공통 / 인증',
    sub: '스플래시부터 홈 피드까지',
    pages: [
      { code: 'A-01', name: '스플래시', href: '/splash' },
      { code: 'A-02', name: '로그인', href: '/login' },
      { code: 'A-03', name: '회원가입', href: '/signup' },
      { code: 'A-04', name: '프로필 셋업', href: '/profile-setup' },
      { code: 'A-05', name: '홈 피드', href: '/' },
    ],
  },
  {
    title: 'B · 악기 장터',
    sub: '데모 사운드와 등급제로 신뢰를 더한 거래',
    pages: [
      { code: 'B-01', name: '장터 리스트', href: '/market' },
      { code: 'B-02', name: '상품 상세', href: '/market/g1', sub: 'Telecaster 예시' },
      { code: 'B-03', name: '장비 등록', href: '/market/sell' },
      { code: 'B-04', name: '필터 시트', href: '/market/filter' },
      { code: 'B-05', name: '거래 채팅', href: '/market/chat/g6', sub: 'SM58 예시' },
    ],
  },
  {
    title: 'C · 세션 매칭',
    sub: '합주 멤버 모집부터 그룹 채팅까지',
    pages: [
      { code: 'C-01', name: '매칭 리스트', href: '/sessions' },
      { code: 'C-02', name: '모집글 상세', href: '/sessions/p2', sub: '신촌 인디록 예시' },
      { code: 'C-03', name: '지원하기', href: '/sessions/p2/apply' },
      { code: 'C-04', name: '지원자 관리', href: '/sessions/p2/applicants' },
      { code: 'C-05', name: '합주 그룹챗', href: '/sessions/p2/chat' },
    ],
  },
  {
    title: 'D · 공연 매칭',
    sub: '자동 팀빌딩으로 솔로도 무대에 설 수 있게',
    pages: [
      { code: 'D-01', name: '공연 리스트', href: '/perf' },
      { code: 'D-02', name: '공연 상세', href: '/perf/s1', sub: '베이스먼트 예시' },
      { code: 'D-03', name: '자동 팀빌딩', href: '/perf/s1/auto-team' },
      { code: 'D-04', name: '라인업 보드', href: '/perf/s1/lineup' },
      { code: 'D-05', name: '공연 지원', href: '/perf/s1/apply' },
      { code: 'D-06', name: '공연 팀챗', href: '/perf/s1/chat' },
    ],
  },
  {
    title: 'E · 마이페이지',
    sub: '신뢰 점수와 활동 기록 중심',
    pages: [
      { code: 'E-01', name: '프로필', href: '/my' },
      { code: 'E-02', name: '활동 타임라인', href: '/my/activity' },
      { code: 'E-03', name: '신뢰점수', href: '/my/trust' },
      { code: 'E-04', name: '설정', href: '/my/settings' },
      { code: 'E-05', name: '온보딩 (재진입)', href: '/my/onboarding' },
    ],
  },
];

export default function GalleryPage() {
  return (
    <main className="canvas">
      <h1>MP<span style={{ color: 'var(--color-primary)' }}>4</span> · 전체 화면</h1>
      <p className="lead">26개 화면을 라우트별로 분리한 실제 동작 앱입니다. 카드를 누르면 해당 페이지로 이동해요.</p>

      {SECTIONS.map((s) => (
        <div key={s.title}>
          <div className="section-title">{s.title}</div>
          <p className="lead" style={{ marginTop: 0, marginBottom: 16 }}>{s.sub}</p>
          <div className="gallery-grid">
            {s.pages.map((p) => (
              <Link key={p.code} href={p.href} className="gallery-card">
                <div className="code">{p.code}</div>
                <div className="name">{p.name}</div>
                {p.sub && <div className="sub">{p.sub}</div>}
                <div className="sub" style={{ marginTop: 10, color: 'var(--color-primary)', fontWeight: 600 }}>{p.href} →</div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(0,0,0,0.08)', fontSize: 12, color: 'var(--fg-alternative)' }}>
        실제 앱은 모바일(폴리·풀스크린)과 데스크탑(센터 폰 프레임) 모두 지원합니다.
        하단 탭바·뒤로가기·각 화면의 입력/토글이 모두 실시간 동작해요.
      </div>
    </main>
  );
}
