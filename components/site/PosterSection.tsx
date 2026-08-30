import Image from 'next/image';
import type { Show } from '@/lib/content';

/**
 * 공연 포스터. 아직 안 나왔으면 COMING SOON 자리로 보여주고,
 * show.poster 를 채우면 그대로 게시됩니다.
 */
export function PosterSection({ show }: { show: Show }) {
  const poster = show.poster;

  return (
    <section id="poster" className="section section--alt">
      <div className="eyebrow">POSTER</div>
      <h2 className="h-display">공연 포스터</h2>

      <div className="poster-wrap">
        {poster ? (
          <figure className="poster-frame">
            <Image
              src={poster.src}
              alt={poster.alt}
              width={poster.width}
              height={poster.height}
              className="poster-img"
              sizes="(min-width: 1024px) 480px, 100vw"
              priority={false}
            />
            {poster.href && (
              <figcaption className="poster-caption">
                <a href={poster.href} target="_blank" rel="noreferrer noopener">
                  인스타그램에서 보기 →
                </a>
              </figcaption>
            )}
          </figure>
        ) : (
          <div className="poster-frame poster-frame--empty">
            <svg width="180" height="180" viewBox="0 0 100 100" className="poster-ghost" aria-hidden="true">
              <g filter="url(#rgh)">
                <use href="#ghost" />
              </g>
            </svg>
            <div className="poster-empty-label">COMING SOON</div>
            <p className="poster-empty-text">포스터를 만들고 있어요. 완성되면 여기에 올릴게요.</p>
          </div>
        )}
      </div>
    </section>
  );
}
