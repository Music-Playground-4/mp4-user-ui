'use client';

// 위로 당겨서 새로고침 (pull-to-refresh)
// 스크롤 컨테이너(.scroll-region)를 대신 렌더링하며, 최상단에서 아래로
// 당기면 인디케이터를 보여주고 임계치를 넘기면 onRefresh 를 호출합니다.

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

const THRESHOLD = 70;   // 새로고침이 발동되는 당김 거리(px)
const MAX_PULL = 120;   // 최대 당김 거리
const RESIST = 0.5;     // 당김 저항(손가락 이동 대비 실제 이동 비율)

export function PullToRefresh({
  onRefresh,
  children,
  className = 'scroll-region',
  style,
}: {
  onRefresh: () => void | Promise<void>;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const pulling = useRef(false);
  const pullRef = useRef(0);
  const refreshingRef = useRef(false);

  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      if (refreshingRef.current) return;
      if (el.scrollTop > 0) {
        pulling.current = false;
        return;
      }
      startY.current = e.touches[0].clientY;
      pulling.current = true;
      setAnimate(false);
    };

    const onMove = (e: TouchEvent) => {
      if (!pulling.current || startY.current === null || refreshingRef.current) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta <= 0) {
        if (pullRef.current !== 0) {
          pullRef.current = 0;
          setPull(0);
        }
        return;
      }
      // 최상단에서 아래로 당기는 중 → 기본 스크롤 막고 인디케이터 노출
      e.preventDefault();
      const p = Math.min(delta * RESIST, MAX_PULL);
      pullRef.current = p;
      setPull(p);
    };

    const onEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      startY.current = null;
      setAnimate(true);

      if (pullRef.current >= THRESHOLD && !refreshingRef.current) {
        refreshingRef.current = true;
        setRefreshing(true);
        pullRef.current = 0;
        setPull(0);
        Promise.resolve(onRefresh()).finally(() => {
          refreshingRef.current = false;
          setRefreshing(false);
        });
      } else {
        pullRef.current = 0;
        setPull(0);
      }
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });
    el.addEventListener('touchcancel', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, [onRefresh]);

  const indicatorH = refreshing ? 44 : pull;
  const progress = Math.min(pull / THRESHOLD, 1);

  return (
    <div ref={scrollRef} className={className} style={style}>
      <div
        style={{
          height: indicatorH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: animate ? 'height var(--dur-base) var(--ease-out)' : 'none',
        }}
      >
        <span
          className={refreshing ? 'anim-spin' : undefined}
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: '2px solid var(--color-line)',
            borderTopColor: 'var(--color-primary)',
            opacity: refreshing ? 1 : progress,
            transform: refreshing ? undefined : `rotate(${progress * 270}deg)`,
            transition: animate ? 'opacity var(--dur-fast) var(--ease-out)' : 'none',
          }}
        />
      </div>
      {children}
    </div>
  );
}
