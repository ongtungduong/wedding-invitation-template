import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent,
} from 'react';
import { resolveMediaUrl } from '../config/loadConfig';
import type { GalleryCategory, WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';
import { Reveal } from './Reveal';

interface GalleryProps {
  config: WeddingConfig;
}

const SWIPE_THRESHOLD_PX = 45;

export function Gallery({ config }: GalleryProps) {
  const { t, pickText } = useLanguage();
  const [category, setCategory] = useState<GalleryCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const filters: { value: GalleryCategory; label: string }[] = [
    { value: 'all', label: t.gallery.all },
    { value: 'ceremony', label: t.gallery.ceremony },
    { value: 'party', label: t.gallery.party },
  ];

  const photos = useMemo(
    () =>
      category === 'all'
        ? config.gallery
        : config.gallery.filter((photo) => photo.category === category),
    [category, config.gallery],
  );

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + photos.length) % photos.length,
    );
  }, [photos.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'ArrowRight') showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, closeLightbox, showPrev, showNext]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX;
    if (endX === undefined) return;

    const deltaX = endX - touchStartX.current;
    touchStartX.current = null;

    if (deltaX > SWIPE_THRESHOLD_PX) {
      showPrev();
    } else if (deltaX < -SWIPE_THRESHOLD_PX) {
      showNext();
    }
  };

  const activePhoto = selectedIndex !== null ? photos[selectedIndex] : null;
  const useMosaic = category === 'all' && photos.length === 6;

  return (
    <section id="gallery" className="section" aria-labelledby="gallery-heading">
      <div className="container">
        <Reveal>
          <div className="section-heading section-heading--center">
            <span className="section-eyebrow">{t.gallery.eyebrow}</span>
            <h2 id="gallery-heading" className="section-title">
              {t.gallery.title}
            </h2>
          </div>

          <div
            className="gallery-filters gallery-filters--center"
            role="group"
            aria-label={t.gallery.filterLabel}
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`gallery-filter-btn${
                  category === filter.value ? ' gallery-filter-btn--active' : ''
                }`}
                aria-pressed={category === filter.value}
                onClick={() => {
                  setCategory(filter.value);
                  setSelectedIndex(null);
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className={`gallery-grid${useMosaic ? ' gallery-grid--mosaic' : ''}`}>
          {photos.map((photo, index) => {
            const caption = pickText(photo.caption);
            const slotClass = useMosaic ? ` gallery-card--slot-${index + 1}` : '';

            return (
              <button
                key={photo.id}
                type="button"
                className={`gallery-card${slotClass}`}
                onClick={() => setSelectedIndex(index)}
                aria-label={`${t.gallery.viewPhoto}: ${caption}`}
              >
                <img
                  src={resolveMediaUrl(photo.src)}
                  alt={caption}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                />
                <span className="gallery-card__overlay" aria-hidden="true">
                  <ZoomIn size={24} />
                  <span className="gallery-card__caption">{caption}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activePhoto && selectedIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={pickText(activePhoto.caption)}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className="lightbox__btn lightbox__btn--close"
            aria-label={t.gallery.closeLightbox}
            onClick={closeLightbox}
          >
            <X size={22} aria-hidden="true" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox__btn lightbox__btn--prev"
                aria-label={t.gallery.prevPhoto}
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
              >
                <ChevronLeft size={24} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="lightbox__btn lightbox__btn--next"
                aria-label={t.gallery.nextPhoto}
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
              >
                <ChevronRight size={24} aria-hidden="true" />
              </button>
            </>
          )}

          <figure
            className="lightbox__figure"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={resolveMediaUrl(activePhoto.src)}
              alt={pickText(activePhoto.caption)}
              width={activePhoto.width}
              height={activePhoto.height}
              className="lightbox__img"
            />
            <figcaption className="lightbox__caption">
              {pickText(activePhoto.caption)}
              <span className="lightbox__counter">
                {selectedIndex + 1} / {photos.length}
              </span>
              <span className="lightbox__swipe-hint">{t.gallery.swipeHint}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
