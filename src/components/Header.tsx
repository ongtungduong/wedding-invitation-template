import { Heart } from 'lucide-react';
import { resolveMediaUrl } from '../config/loadConfig';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';

interface HeaderProps {
  config: WeddingConfig;
  guestName: string | null;
}

export function Header({ config, guestName }: HeaderProps) {
  const { t, pickText } = useLanguage();
  const nextSectionId =
    config.features.showInvitationCard && config.families ? 'invitation' : 'couple';

  return (
    <section id="home" className="hero" aria-label={t.hero.eyebrow}>
      <img
        src={resolveMediaUrl(config.media.hero)}
        alt={`${config.couple.brideFull} & ${config.couple.groomFull}`}
        width={1200}
        height={800}
        className="hero__bg"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__content">
        <span className="hero__eyebrow">{t.hero.eyebrow}</span>

        {guestName && (
          <p className="hero__guest">
            <span className="hero__guest-prefix">{t.hero.guestPrefix}</span>
            <strong className="hero__guest-name">{guestName}</strong>
          </p>
        )}

        <h1 className="hero__title">
          <span className="hero__name">{config.couple.brideShort}</span>{' '}
          <span className="hero__amp">&amp;</span>{' '}
          <span className="hero__name">{config.couple.groomShort}</span>
        </h1>

        <div className="hero__ornament" aria-hidden="true">
          <span />
          <Heart size={14} />
          <span />
        </div>

        <p className="hero__subtitle">
          {pickText(config.event.dateDisplay)} &mdash; {pickText(config.event.city)}
        </p>
      </div>

      <a
        href={`#${nextSectionId}`}
        className="hero__scroll"
        aria-label={t.hero.scrollDown}
      >
        <Heart size={18} aria-hidden="true" />
      </a>
    </section>
  );
}
