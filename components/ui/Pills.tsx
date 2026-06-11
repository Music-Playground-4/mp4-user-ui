import { Icon } from './Icon';
import type { Grade } from '@/lib/data';

const GRADE_COLORS: Record<Grade, { bg: string; fg: string }> = {
  S: { bg: '#0066FF', fg: '#fff' },
  A: { bg: '#00BF40', fg: '#fff' },
  B: { bg: '#F0B400', fg: '#fff' },
  C: { bg: '#FF4242', fg: '#fff' },
};

export function GradePill({ grade, size = 'sm' }: { grade: Grade; size?: 'sm' | 'lg' }) {
  const c = GRADE_COLORS[grade] ?? GRADE_COLORS.B;
  const s = size === 'lg' ? { h: 24, fs: 12, p: '0 8px' } : { h: 20, fs: 11, p: '0 6px' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      height: s.h, padding: s.p, borderRadius: 4,
      background: c.bg, color: c.fg, fontWeight: 700, fontSize: s.fs, letterSpacing: '0.04em',
    }}>
      {grade}급
    </span>
  );
}

export function NewbieBadge({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      height: size === 'lg' ? 24 : 20,
      padding: size === 'lg' ? '0 8px' : '0 6px',
      borderRadius: 4,
      background: 'rgba(0,102,255,0.10)', color: 'var(--color-primary)',
      fontWeight: 700, fontSize: size === 'lg' ? 12 : 11, letterSpacing: '0.02em',
    }}>
      <Icon name="spark" size={size === 'lg' ? 12 : 10} strokeWidth={2} />
      입문환영
    </span>
  );
}
