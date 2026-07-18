'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { TopBar } from '@/components/app/Nav';
import { Spinner } from '@/components/ui/AuthForm';
import { LoginRequired } from '@/components/ui/State';
import { useAuth } from '@/lib/auth';
import { errorText } from '@/lib/useApi';
import { marketApi, uploadsApi } from '@/lib/api';
import { CATEGORIES, CONDITIONS, GRADES, type ItemCategory, type ItemCondition, type Grade } from '@/lib/enums';

const MAX_IMAGES = 10;

export default function MarketSellPage() {
  const router = useRouter();
  const { token, status } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('STRINGS');
  const [condition, setCondition] = useState<ItemCondition>('GOOD');
  const [grade, setGrade] = useState<Grade>('A');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceNum = Number(price.replace(/[^\d]/g, ''));
  const canSubmit =
    title.trim().length > 0 &&
    desc.trim().length > 0 &&
    priceNum > 0 &&
    images.length > 0 &&
    !submitting &&
    !uploading;

  const onPickFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || !token) return;
      const room = MAX_IMAGES - images.length;
      if (room <= 0) return;

      setUploading(true);
      setError(null);
      try {
        const picked = Array.from(files).slice(0, room);
        const urls = await Promise.all(picked.map((f) => uploadsApi.upload(token, f, 'items')));
        setImages((prev) => [...prev, ...urls]);
      } catch (e) {
        setError(errorText(e));
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [token, images.length],
  );

  const onSubmit = async () => {
    if (!token || !canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await marketApi.create(token, {
        title: title.trim(),
        description: desc.trim(),
        price: priceNum,
        category,
        condition,
        grade,
        imageUrls: images,
        ...(brand.trim() ? { brand: brand.trim() } : {}),
        ...(model.trim() ? { model: model.trim() } : {}),
        ...(location.trim() ? { location: location.trim() } : {}),
      });
      router.push(`/market/${created.id}`);
    } catch (e) {
      setError(errorText(e));
      setSubmitting(false);
    }
  };

  if (status === 'guest') {
    return (
      <>
        <TopBar title="장비 등록" />
        <div className="scroll-region">
          <LoginRequired message="로그인 후 장비를 등록할 수 있어요" />
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="장비 등록" />

      <div className="scroll-region" style={{ padding: '16px 16px 20px' }}>
        {/* 이미지 — 백엔드가 imageUrls 를 필수로 요구하므로 최소 1장 */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onPickFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, overflowX: 'auto' }}>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || images.length >= MAX_IMAGES}
            style={{
              width: 80, height: 80, border: '1.5px dashed var(--color-line-strong)', borderRadius: 8,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 4, color: 'var(--fg-alternative)', flexShrink: 0, background: '#fff',
              cursor: uploading ? 'default' : 'pointer',
            }}
          >
            {uploading ? <Spinner /> : <Icon name="plus" size={18} strokeWidth={1.8} />}
            <span style={{ fontSize: 11 }}>{images.length}/{MAX_IMAGES}</span>
          </button>

          {images.map((url, i) => (
            <div
              key={url}
              style={{
                width: 80, height: 80, borderRadius: 8, position: 'relative', flexShrink: 0,
                background: `url(${url}) center/cover`,
              }}
            >
              {i === 0 && (
                <div style={{ position: 'absolute', top: 4, left: 4, padding: '2px 6px', borderRadius: 4, background: 'var(--color-primary)', color: '#fff', fontSize: 9, fontWeight: 700 }}>
                  대표
                </div>
              )}
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                aria-label="사진 삭제"
                style={{
                  position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: 11,
                  background: 'var(--fg-strong)', color: '#fff', border: '2px solid #fff',
                  display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0,
                }}
              >
                <Icon name="close" size={11} strokeWidth={2.6} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-alternative)', marginBottom: 20 }}>
          첫 번째 사진이 대표 이미지가 돼요. 최소 1장 필요합니다.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="제목">
            <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예) Boss Katana 50 MkII" />
          </Field>

          <Field label="카테고리">
            <select
              className="field"
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              style={{ appearance: 'none', background: '#fff' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label} — {c.hint}
                </option>
              ))}
            </select>
          </Field>

          <Field label="상태">
            <select
              className="field"
              value={condition}
              onChange={(e) => setCondition(e.target.value as ItemCondition)}
              style={{ appearance: 'none', background: '#fff' }}
            >
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-alternative)', marginBottom: 8 }}>거래 등급</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {GRADES.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade(g)}
                  style={{
                    flex: 1, height: 44, borderRadius: 8,
                    border: g === grade ? '1.5px solid var(--color-primary)' : '1px solid var(--color-line)',
                    background: g === grade ? 'rgba(0,102,255,0.04)' : '#fff',
                    color: g === grade ? 'var(--color-primary)' : 'var(--fg-strong)',
                    display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {g}급
                </button>
              ))}
            </div>
          </div>

          <Field label="가격">
            <input
              type="number"
              inputMode="numeric"
              className="field"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="원 단위"
            />
          </Field>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Field label="브랜드 (선택)">
                <input className="field" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Fender" />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="모델 (선택)">
                <input className="field" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Stratocaster" />
              </Field>
            </div>
          </div>

          <Field label="거래 지역 (선택)">
            <input className="field" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="서울 마포구" />
          </Field>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-alternative)', marginBottom: 8 }}>설명</div>
            <textarea
              className="field"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={1000}
              placeholder="구매 시기, 사용감, 포함되는 구성품 등을 적어 주세요."
              style={{ minHeight: 96, lineHeight: 1.6 }}
            />
            <div style={{ fontSize: 11, color: 'var(--fg-alternative)', textAlign: 'right', marginTop: 4 }}>
              {desc.length} / 1000
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" style={{ marginTop: 16, fontSize: 13, color: 'var(--color-negative)' }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-line)', background: '#fff', flexShrink: 0 }}>
        <button type="button" onClick={onSubmit} disabled={!canSubmit} className="btn btn-lg btn-primary" style={{ width: '100%' }}>
          {submitting ? <Spinner /> : '등록하기'}
        </button>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-alternative)', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
