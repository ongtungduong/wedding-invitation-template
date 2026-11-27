import { CalendarPlus, Clock, Download, MapPin } from 'lucide-react';
import { resolveMediaUrl } from '../config/loadConfig';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';
import { buildGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { Reveal } from './Reveal';

interface WhereProps {
  config: WeddingConfig;
}

export function Where({ config }: WhereProps) {
  const { t, pickText } = useLanguage();

  return (
    <section
      id="whenwhere"
      className="section section--blush"
      aria-labelledby="where-heading"
    >
      <div className="container">
        <Reveal>
          <div className="section-heading section-heading--center">
            <span className="section-eyebrow">{t.locations.eyebrow}</span>
            <h2 id="where-heading" className="section-title">
              {t.locations.title}
            </h2>
          </div>
        </Reveal>

        <div className="where-grid">
          {config.locations.map((loc, idx) => {
            const title = pickText(loc.title);
            const calendarEvent = {
              title: `${pickText(config.event.calendarTitle)} — ${title}`,
              startIso: loc.startIso ?? config.event.weddingDateIso,
              endIso: loc.endIso ?? config.event.weddingEndIso,
              location: loc.address,
              description: pickText(config.event.calendarDescription),
            };

            return (
              <Reveal key={loc.id} delay={((idx % 3) + 1) as 1 | 2 | 3}>
                <article className="where-card">
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="where-card__media"
                    aria-label={`${t.locations.openMap}: ${title}`}
                  >
                    <img
                      src={resolveMediaUrl(loc.image)}
                      alt={title}
                      width={loc.width}
                      height={loc.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>

                  <div className="where-card__body">
                    <h3 className="where-card__title">{title}</h3>

                    {loc.time && (
                      <p className="where-card__meta">
                        <Clock
                          size={16}
                          className="where-card__icon"
                          aria-hidden="true"
                        />
                        <span>{loc.time}</span>
                      </p>
                    )}

                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="where-card__link"
                    >
                      <MapPin size={18} className="where-card__icon" aria-hidden="true" />
                      <span>{loc.address}</span>
                    </a>

                    {config.features.showCalendar && (
                      <div className="where-card__actions">
                        <a
                          href={buildGoogleCalendarUrl(calendarEvent)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline"
                        >
                          <CalendarPlus size={15} aria-hidden="true" />
                          <span>{t.locations.addGoogleCalendar}</span>
                        </a>

                        <button
                          type="button"
                          className="btn-outline"
                          onClick={() => downloadIcsFile(calendarEvent, `${loc.id}.ics`)}
                        >
                          <Download size={15} aria-hidden="true" />
                          <span>{t.locations.downloadIcs}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
