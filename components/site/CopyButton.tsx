'use client';

import { useState } from 'react';

/** 계좌번호·티켓 주소 복사. 복사되면 잠깐 '복사됨'으로 바뀝니다. */
export function CopyButton({ text, label = '복사', className = '' }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // 클립보드 권한이 없는 브라우저에서는 직접 길게 눌러 복사하도록 둡니다.
      window.prompt('아래 내용을 복사해 주세요', text);
    }
  };

  return (
    <button type="button" className={`copy-btn ${className}`} onClick={onClick} aria-live="polite">
      {copied ? '복사됨 ✓' : label}
    </button>
  );
}
