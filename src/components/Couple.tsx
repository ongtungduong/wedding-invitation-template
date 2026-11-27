import { Heart } from 'lucide-react';
import { resolveMediaUrl } from '../config/loadConfig';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';
import { calculateWeddingTime } from '../utils/time';
import { Reveal } from './Reveal';

interface CoupleProps {
  config: WeddingConfig;
}

export function Couple({ config }: CoupleProps) {
  const { t, pickText } = useLanguage();
  const { mode } = calculateWeddingTime(config.event.weddingDateIso);
  const tagline =
    mode === 'anniversary' ? t.couple.anniversaryTagline : t.couple.countdownTagline;

  const profiles = [
    {
      id: 'bride',
      name: config.couple.brideFull,
      role: t.couple.brideRole,
      bio: pickText(config.couple.brideBio),
      image: resolveMediaUrl(config.media.bride),
      alignRight: true,
    },
    {
      id: 'groom',
      name: config.couple.groomFull,
      role: t.couple.groomRole,
      bio: pickText(config.couple.groomBio),
      image: resolveMediaUrl(config.media.groom),
      alignRight: false,
    },
  ];

  return (
    <section
      id="couple"
      className="section section--blush"
      aria-labelledby="couple-section-heading"
    >
      <div className="container">
        <Reveal>
          <div className="section-heading section-heading--center">
            <span className="section-eyebrow">{t.couple.eyebrow}</span>
            <h2 id="couple-section-heading" className="section-title">
              {t.couple.sectionLabel}
            </h2>
          </div>
        </Reveal>

        <div className="couple-grid">
          {profiles.map((person, index) => (
            <Reveal key={person.id} delay={(index + 1) as 1 | 2}>
              <article
                className={`couple-card${person.alignRight ? ' couple-card--reverse' : ''}`}
              >
                <div className="couple-card__avatar">
                  <img
                    src={person.image}
                    alt={person.name}
                    width={320}
                    height={320}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="couple-card__body">
                  <h3 className="couple-card__name">
                    <span>{person.name}</span>
                    <Heart size={18} className="couple-card__heart" aria-hidden="true" />
                  </h3>
                  <span className="couple-card__role">{person.role}</span>
                  <p>{person.bio}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2}>
          <div className="couple-banner">
            <p className="couple-banner__heading">{tagline}</p>
            <p className="couple-banner__date">
              {pickText(config.event.dateDisplay)} &mdash; {pickText(config.event.city)}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
