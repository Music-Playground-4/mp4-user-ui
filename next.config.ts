import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // dev 서버가 떠 있는 상태에서 검증용 빌드를 돌리면 .next 를 덮어써
  // 실행 중인 dev 서버가 죽는다(Cannot find module './xxx.js').
  // 그럴 때는 빌드 산출물을 다른 폴더로 보낸다.
  //   NEXT_DIST_DIR=.next-verify npm run build
  distDir: process.env.NEXT_DIST_DIR || '.next',

  // 브랜드 에셋은 public/brand 에 함께 두므로 원격 이미지 허용 목록이 필요 없습니다.
  // 외부 이미지(팀 사진 등)를 붙일 때 images.remotePatterns 를 여기에 추가하세요.
};

export default nextConfig;
