import { Heart } from 'lucide-react';
import { resolveMediaUrl } from '../config/loadConfig';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';

interface SeeYouProps {
  config: WeddingConfig;
}

export function SeeYou({ config }: SeeYouProps) {
  const { pickText } = useLanguage();

  return (
    <section
      id="seeyou"
      className="section banner-section"
      aria-labelledby="seeyou-heading"
    >
      <img
        src={resolveMediaUrl(config.media.thankYouBanner)}
        alt=""
        aria-hidden="true"
        className="banner-section__bg"
        loading="lazy"
        decoding="async"
      />
      <div className="container banner-section__inner">
        <span className="thankyou__icon" aria-hidden="true">
          <Heart size={32} />
        </span>
        <h2 id="seeyou-heading" className="thankyou__message">
          {pickText(config.thankYou.message)}
        </h2>
        <p className="thankyou__date">{config.event.dateShort}</p>
      </div>
    </section>
  );
}
