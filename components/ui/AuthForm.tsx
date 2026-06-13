// MP4 — 인증 화면 공용 컴포넌트
// (Next.js page.tsx 는 default 컴포넌트 외 export 를 허용하지 않으므로 여기 모음)

/* ── 입력 필드 ────────────────────────────────────────────────── */
export function Field({
  label, type, value, onChange, onBlur, placeholder, autoComplete, error,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string | null;
}) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-alternative)', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        className="field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={error ? { borderColor: 'var(--color-negative)' } : undefined}
      />
      {error && (
        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--color-negative)' }}>{error}</div>
      )}
    </div>
  );
}

/* ── 로딩 스피너 ──────────────────────────────────────────────── */
export function Spinner() {
  return (
    <span
      className="anim-spin"
      style={{
        width: 18, height: 18, borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
        display: 'inline-block',
      }}
    />
  );
}

/* ── 회원가입 단계 표시 (1·2·3) ───────────────────────────────── */
export function StepBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? 'var(--color-primary)' : 'var(--color-line)',
          }}
        />
      ))}
    </div>
  );
}
