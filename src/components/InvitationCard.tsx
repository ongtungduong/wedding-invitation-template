import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';
import { Reveal } from './Reveal';

interface InvitationCardProps {
  config: WeddingConfig;
}

export function InvitationCard({ config }: InvitationCardProps) {
  const { t, pickText } = useLanguage();
  const { families, couple, event } = config;

  if (!families) return null;

  return (
    <section
      id="invitation"
      className="section section--stationery"
      aria-labelledby="invitation-heading"
    >
      <div className="container">
        <Reveal>
          <div className="stationery-card">
            <div className="stationery-card__inner">
              <span className="section-eyebrow">{t.invitation.eyebrow}</span>
              <h2 id="invitation-heading" className="stationery-card__title">
                {t.invitation.title}
              </h2>

              <div className="families-grid">
                <div className="family-block">
                  <span className="family-block__label">
                    {pickText(families.brideSide.label)}
                  </span>
                  <p className="family-block__parents">
                    {families.brideSide.father}
                    <br />
                    {families.brideSide.mother}
                  </p>
                  <p className="family-block__address">{families.brideSide.address}</p>
                </div>

                <div className="families-divider" aria-hidden="true" />

                <div className="family-block">
                  <span className="family-block__label">
                    {pickText(families.groomSide.label)}
                  </span>
                  <p className="family-block__parents">
                    {families.groomSide.father}
                    <br />
                    {families.groomSide.mother}
                  </p>
                  <p className="family-block__address">{families.groomSide.address}</p>
                </div>
              </div>

              <p className="stationery-card__announcement">
                {pickText(families.announcement)}
              </p>

              <p className="stationery-card__couple">
                <span>{couple.brideFull}</span>
                <span className="stationery-card__amp">&amp;</span>
                <span>{couple.groomFull}</span>
              </p>

              <div className="stationery-date-box">
                <span className="stationery-date-box__kicker">
                  {t.invitation.saveTheDate}
                </span>
                <p className="stationery-date-box__solar">
                  {event.dayOfWeek ? `${pickText(event.dayOfWeek)}, ` : ''}
                  {pickText(event.dateDisplay)}
                </p>
                {event.lunarDate && (
                  <p className="stationery-date-box__lunar">
                    ({pickText(event.lunarDate)})
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
