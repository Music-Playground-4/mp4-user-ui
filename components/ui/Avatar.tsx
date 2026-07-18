'use client';

// 백엔드는 아바타 미설정 시 avatar: null 을 내려준다.
// 깨진 이미지 대신 이름 첫 글자를 보여준다.

export function Avatar({
  src,
  name,
  size = 64,
}: {
  src?: string | null;
  name: string;
  size?: number;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, borderRadius: size / 2, objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }
  return (
    <div
      aria-hidden
      style={{
        width: size, height: size, borderRadius: size / 2, flexShrink: 0,
        background: 'var(--neutral-95)', color: 'var(--fg-alternative)',
        display: 'grid', placeItems: 'center',
        fontSize: size * 0.36, fontWeight: 700, lineHeight: 1,
      }}
    >
      {name.slice(0, 1)}
    </div>
  );
}
