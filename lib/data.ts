// MP4 — Mock data shared across screens

export type Grade = 'S' | 'A' | 'B' | 'C';
export type GearStatus = 'active' | 'reserved' | 'sold';
export type Frequency = '정기' | '단기' | '원타임';
export type Level = '입문환영' | '경력자';

export interface Gear {
  id: string;
  title: string;
  cat: string;
  grade: Grade;
  price: number;
  status?: GearStatus;
  brand?: string;
  model?: string;
  region?: string;
  seller?: string;
  dist?: string;
  images?: string[];
  desc?: string;
  views?: number;
  favs?: number;
  demoSec?: number;
  demoTitle?: string;
}

export interface User {
  id: string;
  name: string;
  position: string;
  region: string;
  genres: string[];
  level: string;
  bio: string;
  avatar: string;
  gears: Gear[];
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  positions: string[];
  freq: Frequency;
  region: string;
  genre: string[];
  level: Level;
  desc: string;
  when: string;
  applicants: string[];
}

export const USERS: User[] = [
  {
    id: 'u1',
    name: '김민수',
    position: '기타',
    region: '마포·서대문',
    genres: ['인디록', '얼터너티브'],
    level: '입문 6개월',
    bio: '주말 합주 위주, 디스코·시티팝도 좋아해요.',
    avatar: 'https://i.pravatar.cc/120?img=12',
    gears: [
      { id: 'g-u1-1', title: 'Squier Stratocaster', cat: '일렉기타', grade: 'A', price: 280000, status: 'sold' },
      { id: 'g-u1-2', title: 'Boss Katana 50', cat: '앰프', grade: 'A', price: 180000, status: 'active' },
    ],
  },
  {
    id: 'u2',
    name: '이지은',
    position: '보컬',
    region: '홍대·합정',
    genres: ['R&B', '시티팝'],
    level: '세션 7년차',
    bio: '단기 프로젝트·녹음 세션 위주로 활동합니다.',
    avatar: 'https://i.pravatar.cc/120?img=47',
    gears: [
      { id: 'g-u2-1', title: 'Shure SM58', cat: '음향장비', grade: 'S', price: 120000, status: 'active' },
      { id: 'g-u2-2', title: 'Focusrite Scarlett 2i2', cat: '음향장비', grade: 'A', price: 220000, status: 'reserved' },
    ],
  },
  {
    id: 'u3',
    name: '박준호',
    position: '드럼',
    region: '성남·분당',
    genres: ['하드록', '메탈'],
    level: '15년차',
    bio: '학원 강사 / 단기 세션 가능.',
    avatar: 'https://i.pravatar.cc/120?img=33',
    gears: [
      { id: 'g-u3-1', title: 'Yamaha Stage Custom', cat: '드럼', grade: 'A', price: 850000, status: 'active' },
      { id: 'g-u3-2', title: 'Roland TD-17 전자드럼', cat: '드럼', grade: 'S', price: 1200000, status: 'active' },
    ],
  },
  {
    id: 'u4',
    name: '정수아',
    position: '베이스',
    region: '신촌·서대문',
    genres: ['시티팝', '인디팝'],
    level: '입문 1년',
    bio: '학교 동아리 활동중. 외부 활동도 해보고 싶어요.',
    avatar: 'https://i.pravatar.cc/120?img=49',
    gears: [],
  },
];

export const GEARS: Gear[] = [
  {
    id: 'g1', title: 'Fender Player Telecaster MX', cat: '일렉기타', brand: 'Fender', model: 'Player Telecaster',
    grade: 'A', price: 720000, region: '서울 마포구', seller: 'u3', dist: '2.4km',
    images: [
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=900',
      'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=900',
    ],
    desc: '2년 사용, 생활기스 약간. 픽업 정상, 픽가드 새것으로 교체. 직거래 우선.',
    views: 412, favs: 34, demoSec: 18, demoTitle: '클린 코드 + 약간의 리버브',
  },
  {
    id: 'g2', title: 'Boss Katana 50 MkII', cat: '앰프', brand: 'Boss', model: 'Katana 50',
    grade: 'A', price: 220000, region: '서울 강남구', seller: 'u1', dist: '8.1km',
    images: ['https://images.unsplash.com/photo-1558098329-a11cff621064?w=900'],
    desc: '기능 정상, 외관 깨끗합니다. 리모트 미포함.',
    views: 233, favs: 21, demoSec: 12, demoTitle: '클린→크런치 톤 변화',
  },
  {
    id: 'g3', title: 'Strymon BigSky 리버브', cat: '이펙터', brand: 'Strymon', model: 'BigSky',
    grade: 'S', price: 580000, region: '경기 성남시', seller: 'u3', dist: '15km',
    images: ['https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=900'],
    desc: '미사용 신품급. 박스·어댑터 모두 보유.',
    views: 891, favs: 102, demoSec: 22, demoTitle: '홀 / 슈머 / 클라우드 프리셋',
  },
  {
    id: 'g4', title: 'Roland TD-17KVX 전자드럼', cat: '드럼', brand: 'Roland', model: 'TD-17KVX',
    grade: 'A', price: 1200000, region: '경기 성남시 분당구', seller: 'u3', dist: '15km',
    images: ['https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=900'],
    desc: '1년 사용. 메쉬 패드 컨디션 좋음. 분당 직거래 또는 화물 협의.',
    views: 1240, favs: 88, demoSec: 24, demoTitle: '팝/록 프리셋 연주 데모',
  },
  {
    id: 'g5', title: 'Fender Rumble 40 베이스앰프', cat: '앰프', brand: 'Fender', model: 'Rumble 40',
    grade: 'B', price: 95000, region: '서울 서대문구', seller: 'u1', dist: '1.2km',
    images: ['https://images.unsplash.com/photo-1571974599782-87624638275e?w=900'],
    desc: '학생 입문용으로 충분합니다. 사용감 있음, 소리 정상.',
    views: 156, favs: 19, demoSec: 14, demoTitle: '슬랩·핑거링 테스트',
  },
  {
    id: 'g6', title: 'Shure SM58 보컬마이크', cat: '음향장비', brand: 'Shure', model: 'SM58',
    grade: 'S', price: 110000, region: '서울 마포구', seller: 'u2', dist: '3.4km',
    images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900'],
    desc: '녹음 외 거의 미사용. 케이블 포함.',
    views: 322, favs: 28, demoSec: 9, demoTitle: '보컬 톤 샘플',
  },
];

export const POSTS: Post[] = [
  {
    id: 'p1', authorId: 'u2', title: '홍대 베이스 R&B 단기 프로젝트',
    positions: ['베이스', '드럼'], freq: '단기', region: '홍대·합정', genre: ['R&B'],
    level: '경력자', desc: '5월 말 라이브 1회. 사전 합주 2회 가능자만.', when: '2일 전',
    applicants: ['u1', 'u3'],
  },
  {
    id: 'p2', authorId: 'u4', title: '신촌 인디록 정기 멤버 모집',
    positions: ['기타', '드럼'], freq: '정기', region: '신촌·서대문', genre: ['인디록', '시티팝'],
    level: '입문환영', desc: '주 1회 합주. 대학생 / 직장인 모두 환영. 즐겁게 해요.', when: '5시간 전',
    applicants: ['u1'],
  },
  {
    id: 'p3', authorId: 'u1', title: '주말 취미 합주 멤버 (마포·서대문)',
    positions: ['보컬', '드럼'], freq: '정기', region: '마포·서대문', genre: ['인디록'],
    level: '입문환영', desc: '직장인 위주, 부담없이 즐기실 분.', when: '1일 전',
    applicants: [],
  },
  {
    id: 'p4', authorId: 'u3', title: '분당 메탈 카피 프로젝트',
    positions: ['보컬', '베이스'], freq: '정기', region: '성남·분당', genre: ['메탈'],
    level: '경력자', desc: '80~90년대 메탈 카피. 2년 이상 경력 우대.', when: '3일 전',
    applicants: ['u2'],
  },
  {
    id: 'p5', authorId: 'u4', title: '세션 1회 — 학교 축제 무대',
    positions: ['기타', '키보드'], freq: '원타임', region: '신촌·서대문', genre: ['시티팝'],
    level: '입문환영', desc: '5월 14일 1시간. 합주 1회 + 본방.', when: '7시간 전',
    applicants: [],
  },
];

export const GENRES = ['인디록', '얼터너티브', '시티팝', 'R&B', '재즈', '메탈', '일렉트로니카', '포크', '펑크', '힙합'];
export const POSITIONS = ['보컬', '기타', '베이스', '드럼', '키보드', '색소폰', '퍼커션'];
export const REGIONS = ['서울 마포구', '서울 서대문구', '서울 강남구', '서울 성동구', '경기 성남시', '경기 고양시'];
export const CATEGORIES = ['일렉기타', '베이스', '어쿠스틱', '이펙터', '앰프', '건반', '드럼', '음향장비'];

export interface Show {
  id: string;
  title: string;
  host: string;
  date: string;
  need: string[];
  pay: string;
  tags: string[];
  match: number;
  dist: string;
  img: string;
  venue?: string;
  intro?: string;
  preferGenres?: string[];
}

export const SHOWS: Show[] = [
  {
    id: 's1',
    title: '홍대 베이스먼트 5월 셋째주 라이브',
    host: '베이스먼트 라이브하우스',
    date: '5/18 (토) 19:00',
    need: ['보컬', '드럼', '베이스'],
    pay: '1팀 30만',
    tags: ['단체'],
    match: 88,
    dist: '2.3km',
    img: 'https://images.unsplash.com/photo-1508215302842-7c4ed2459b51?w=600',
    venue: '홍대 베이스먼트 (서울 마포구 와우산로)',
    intro: '인디·얼터너티브 위주 4팀 라인업. 사운드체크 60분 제공.',
    preferGenres: ['인디록', '얼터너티브', '시티팝', 'R&B'],
  },
  {
    id: 's2',
    title: '대학로 봄 페스타 솔로 라인업',
    host: '대학로 문화원',
    date: '5/24 (금) 18:30',
    need: ['솔로'],
    pay: '1인 5만',
    tags: ['솔로 OK'],
    match: 74,
    dist: '5.1km',
    img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600',
    venue: '대학로 야외 마당 (서울 종로구)',
    intro: '솔로 자동매칭 환영. 어쿠스틱·발라드 위주.',
    preferGenres: ['어쿠스틱', '발라드', '포크'],
  },
  {
    id: 's3',
    title: '성수동 라이브 카페 - 어쿠스틱 듀오',
    host: '카페 SOND',
    date: '5/22 (수) 20:00',
    need: ['보컬', '기타'],
    pay: '2인 18만',
    tags: ['듀오'],
    match: 65,
    dist: '8.4km',
    img: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=600',
    venue: '카페 SOND (서울 성동구)',
    intro: '편안한 어쿠스틱 듀오 무대. 자작·카피 모두 환영.',
    preferGenres: ['어쿠스틱', '시티팝', '포크'],
  },
];

export interface ChatRoom {
  id: string;
  kind: 'market' | 'group' | 'perf';
  title: string;
  preview: string;
  when: string;
  unread: number;
  href: string;
  thumb?: string;
}

export const CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'c1', kind: 'market', title: '이지은',
    preview: '11만원이면 케이블도 같이 드릴게요',
    when: '14:35', unread: 1, href: '/market/chat/g6',
    thumb: 'https://i.pravatar.cc/120?img=47',
  },
  {
    id: 'c2', kind: 'group', title: '신촌 인디록 정기 합주',
    preview: '다들 토요일 시간 괜찮으신가요?',
    when: '11:22', unread: 0, href: '/sessions/p2/chat',
  },
  {
    id: 'c3', kind: 'perf', title: '5/18 베이스먼트 솔로팀',
    preview: '저도 9시 좋아요',
    when: '13:05', unread: 3, href: '/perf/s1/chat',
  },
];

export const formatPrice = (n: number) => n.toLocaleString('ko-KR') + '원';
export const userById = (id: string) => USERS.find((u) => u.id === id);
export const gearById = (id: string) => GEARS.find((g) => g.id === id);
export const postById = (id: string) => POSTS.find((p) => p.id === id);
export const showById = (id: string) => SHOWS.find((s) => s.id === id);
