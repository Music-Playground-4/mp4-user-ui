// API 라우트 공통 응답. lib/api.ts 의 봉투 형식({ success, data, error })과 맞춥니다.
// 사용자에게 보이는 error 문구는 한국어 존댓말로 씁니다.

import { NextResponse } from 'next/server';

export const ok = <T>(data: T, status = 200) => NextResponse.json({ success: true, data }, { status });

export const fail = (error: string, status = 400) => NextResponse.json({ success: false, error }, { status });

export const STORE_DOWN = '예매 서버와 연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.';
