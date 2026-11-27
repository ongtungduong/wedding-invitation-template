import { resolveMediaUrl } from '../config/loadConfig';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';
import { Reveal } from './Reveal';

interface OrganizationProps {
  config: WeddingConfig;
}

export function Organization({ config }: OrganizationProps) {
  const { t, pickText } = useLanguage();

  return (
    <section id="organization" className="section" aria-labelledby="organization-heading">
      <div className="container">
        <Reveal>
          <div className="section-heading section-heading--center">
            <span className="section-eyebrow">{t.milestones.eyebrow}</span>
            <h2 id="organization-heading" className="section-title">
              {t.milestones.title}
            </h2>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="milestones-wrap">
            <img
              src={resolveMediaUrl(config.media.hero)}
              alt=""
              aria-hidden="true"
              className="milestones-wrap__bg"
              loading="lazy"
              decoding="async"
            />
            <div className="milestones-grid">
              {config.milestones.map((item) => (
                <article key={item.step} className="milestone-card">
                  <span className="milestone-card__step" aria-hidden="true">
                    {item.step}
                  </span>
                  <h3 className="milestone-card__title">{pickText(item.title)}</h3>
                  <p className="milestone-card__date">{item.date}</p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
