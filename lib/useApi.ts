'use client';

// MP4 — API 호출 공통 훅
// ────────────────────────────────────────────────────────────────
// 외부 상태/쿼리 라이브러리 없이 화면에서 반복되는
// "로딩 / 에러 / 데이터 / 재조회" 패턴만 얇게 감쌉니다.
// 화면 코드는 lib/api.ts 의 *Api 객체만 호출하고 이 훅으로 상태를 받습니다.
// ────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';

export interface AsyncState<T> {
  data: T | null;
  /** 첫 로딩 중(데이터가 아직 없음) */
  loading: boolean;
  /** 사용자에게 보여줄 한국어 에러 문구. 없으면 null */
  error: string | null;
  /** HTTP 상태코드 — 401/403 분기 등에 사용 */
  status: number | null;
  /** 수동 재조회 */
  reload: () => void;
}

/** 에러를 사용자 노출 문구로 변환. ApiError 가 아니면 일반 문구로 대체합니다. */
export function errorText(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  return '요청을 처리하지 못했어요';
}

/**
 * 비동기 조회를 실행하고 상태를 반환합니다.
 *
 * `fetcher` 가 null 이면 호출을 보류합니다(예: 토큰이 아직 없을 때).
 * 보류 중에는 loading 을 유지해 화면이 "빈 상태"로 깜빡이지 않게 합니다.
 *
 * `deps` 가 바뀌면 다시 조회합니다. fetcher 는 매 렌더 새로 만들어지는 경우가
 * 많아 의존성에서 제외하고, 대신 deps 를 명시적으로 받습니다.
 */
export function useAsync<T>(
  fetcher: (() => Promise<T>) | null,
  deps: React.DependencyList = [],
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  // 언마운트 후 setState 를 막고, 늦게 도착한 이전 요청이 최신 결과를 덮어쓰지 않게 한다
  const latest = useRef(0);

  const reload = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (!fetcher) {
      setLoading(true);
      return;
    }
    const seq = ++latest.current;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (seq !== latest.current) return;
        setData(result);
        setStatus(null);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (seq !== latest.current) return;
        setError(errorText(e));
        setStatus(e instanceof ApiError ? e.status : null);
        setLoading(false);
      });

    return () => {
      // 이 이펙트의 결과는 더 이상 반영하지 않는다
      if (seq === latest.current) latest.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, loading, error, status, reload };
}
