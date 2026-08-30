'use client';

import { useState } from 'react';
import { ApiError, submitApply, subscribeNotify, type ApplyFields } from '@/lib/api';
import { UPCOMING_SHOWS } from '@/lib/content';

type Status = 'idle' | 'error' | 'sending' | 'sent';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FIELDS: ApplyFields = { team: '', person: '', phone: '', insta: '', size: '', note: '' };

/** 공연을 아직 못 정한 경우에 쓰는 값. */
const ANY_SHOW = 'any';
const ANY_SHOW_LABEL = '아직 정하지 않았어요';

interface FieldSpec {
  key: keyof ApplyFields;
  label: string;
  placeholder: string;
  required?: boolean;
  area?: boolean;
}

const FIELDS: FieldSpec[] = [
  { key: 'team', label: '팀명', placeholder: '예) 새벽 네시', required: true },
  { key: 'person', label: '담당자명', placeholder: '연락 받을 분', required: true },
  { key: 'phone', label: '연락처', placeholder: '010-0000-0000', required: true },
  { key: 'insta', label: '인스타그램', placeholder: '@team_account' },
  { key: 'size', label: '인원 · 세션', placeholder: '예) 4인 / 보컬·기타·베이스·드럼' },
  { key: 'note', label: '하고 싶은 말', placeholder: '합주 경력, 하고 싶은 곡, 궁금한 점 등', area: true },
];

const showLabelOf = (slug: string) => {
  const show = UPCOMING_SHOWS.find((s) => s.slug === slug);
  return show ? `${show.badge} ${show.title}` : ANY_SHOW_LABEL;
};

/* ── 밴드 참여 문의 ──────────────────────────────────────────── */
function ApplyForm({ defaultShowSlug }: { defaultShowSlug?: string }) {
  const [showSlug, setShowSlug] = useState(defaultShowSlug ?? UPCOMING_SHOWS[0]?.slug ?? ANY_SHOW);
  const [fields, setFields] = useState<ApplyFields>(EMPTY_FIELDS);
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 인라인 오류는 한 번 제출을 시도한 뒤에만 보여줍니다.
  const showErrors = status === 'error';
  const setField = (key: keyof ApplyFields, value: string) => setFields((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setFields(EMPTY_FIELDS);
    setAgree(false);
    setStatus('idle');
    setErrorMsg(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasRequired = FIELDS.filter((f) => f.required).every((f) => fields[f.key].trim().length > 0);
    if (!hasRequired || !agree) {
      setStatus('error');
      setErrorMsg('필수 항목과 동의를 확인해주세요.');
      return;
    }

    setStatus('sending');
    setErrorMsg(null);
    try {
      await submitApply({ ...fields, showSlug, showLabel: showLabelOf(showSlug) });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof ApiError ? err.message : '잠시 후 다시 시도해 주세요.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="sent">
        <div className="sent-title">접수됐어요!</div>
        <p className="sent-text">2~3일 안에 남겨주신 연락처로 연락드릴게요. 급하면 인스타 DM도 열려 있어요.</p>
        <button type="button" className="sent-reset" onClick={reset}>
          다른 팀으로 또 신청하기
        </button>
      </div>
    );
  }

  return (
    <form className="apply-form" onSubmit={onSubmit} noValidate>
      {/* 공연이 여러 개가 되면 어느 무대에 서고 싶은지 먼저 고릅니다. */}
      <div className="field">
        <label className="field-label" htmlFor="apply-show">
          참여하고 싶은 공연
        </label>
        <div className="select-wrap">
          <select id="apply-show" value={showSlug} onChange={(e) => setShowSlug(e.target.value)}>
            {UPCOMING_SHOWS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.badge} · {s.title}
              </option>
            ))}
            <option value={ANY_SHOW}>{ANY_SHOW_LABEL}</option>
          </select>
        </div>
      </div>

      {FIELDS.map((f) => {
        const missing = showErrors && Boolean(f.required) && fields[f.key].trim().length === 0;
        const inputProps = {
          id: `apply-${f.key}`,
          value: fields[f.key],
          placeholder: f.placeholder,
          'aria-invalid': missing,
          'aria-required': Boolean(f.required),
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(f.key, e.target.value),
        };
        return (
          <div key={f.key} className="field">
            <label className={`field-label${missing ? ' field-label--missing' : ''}`} htmlFor={`apply-${f.key}`}>
              {f.label}
              {f.required && <span className="field-required"> *</span>}
            </label>
            {f.area ? <textarea rows={3} {...inputProps} /> : <input type="text" {...inputProps} />}
          </div>
        );
      })}

      <button
        type="button"
        role="checkbox"
        aria-checked={agree}
        data-error={showErrors && !agree}
        className="agree"
        onClick={() => setAgree((v) => !v)}
      >
        <span className="agree-box" aria-hidden="true">
          {agree ? '✓' : ''}
        </span>
        <span className="agree-text">
          공연 진행을 위한 개인정보 수집·이용에 동의합니다. 수집한 정보는 이번 공연 연락 목적으로만 쓰고, 공연 종료
          3개월 후 파기합니다.
        </span>
      </button>

      {errorMsg && (
        <p className="form-error" role="alert">
          {errorMsg}
        </p>
      )}

      <button type="submit" className="submit-btn" disabled={status === 'sending'}>
        {status === 'sending' ? '보내는 중…' : '참여 문의 보내기'}
      </button>
    </form>
  );
}

/* ── 다음 공연 알림 ──────────────────────────────────────────── */
function NotifyForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error');
      setErrorMsg('이메일 형식을 확인해주세요.');
      return;
    }

    setStatus('sending');
    setErrorMsg(null);
    try {
      await subscribeNotify(email.trim());
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof ApiError ? err.message : '잠시 후 다시 시도해 주세요.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="notify-sent">
        <div className="notify-sent-title">등록 완료!</div>
        <div className="notify-sent-text">다음 공연 소식 가장 먼저 보내드릴게요.</div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="notify-row">
        <input
          type="email"
          value={email}
          placeholder="your@email.com"
          aria-label="이메일 주소"
          aria-invalid={status === 'error'}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus('idle');
            setErrorMsg(null);
          }}
        />
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? '…' : '받기'}
        </button>
      </div>
      {errorMsg && (
        <p className="notify-error" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}

/** 공연 상세에서 쓸 때는 defaultShowSlug 로 해당 공연을 미리 선택해 둡니다. */
export function Join({ defaultShowSlug }: { defaultShowSlug?: string }) {
  return (
    <section id="apply" className="section">
      <div className="eyebrow">JOIN US</div>
      <h2 className="h-display h-display--loose">같이 할 팀을 찾아요</h2>

      <div className="join-layout">
        <div className="apply-box">
          <div className="apply-title">밴드 참여 문의</div>
          <p className="apply-sub">확인 후 2~3일 안에 연락드려요.</p>
          <ApplyForm defaultShowSlug={defaultShowSlug} />
        </div>

        <div className="notify-box">
          <div className="notify-title">다음 공연 알림 받기</div>
          <p className="notify-desc">새 공연이 열리면 가장 먼저 알려드릴게요. 이메일만 남겨주세요.</p>
          <NotifyForm />
        </div>
      </div>
    </section>
  );
}
