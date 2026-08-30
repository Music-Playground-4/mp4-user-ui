'use client';

// ⚠️ 현재 어느 페이지에도 붙어 있지 않습니다(요청으로 잠시 내림).
// 다시 쓰려면 원하는 페이지에서 <Faq /> 를 렌더하면 그대로 살아납니다.
// 문항은 lib/content.ts 의 FAQS 에 그대로 남아 있습니다.

import { useState } from 'react';
import { FAQS } from '@/lib/content';

export function Faq() {
  // 첫 항목은 열어둡니다. 열린 항목을 다시 누르면 전부 닫힙니다.
  const [open, setOpen] = useState(0);

  return (
    <section className="section section--alt">
      <div className="eyebrow">FAQ</div>
      <h2 className="h-display">자주 묻는 질문</h2>

      <div className="faq-list measure">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="faq-item">
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                {f.q}
                <span className="faq-sign" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <p className="faq-a" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-trigger-${i}`}>
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
