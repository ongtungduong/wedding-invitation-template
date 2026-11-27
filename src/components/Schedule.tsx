import { Clock, Sparkles } from 'lucide-react';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';
import { Reveal } from './Reveal';

interface ScheduleProps {
  config: WeddingConfig;
}

export function Schedule({ config }: ScheduleProps) {
  const { t, pickText } = useLanguage();
  const schedule = config.schedule;

  if (!schedule || schedule.items.length === 0) return null;

  return (
    <section
      id="schedule"
      className="section section--blush"
      aria-labelledby="schedule-heading"
    >
      <div className="container">
        <Reveal>
          <div className="section-heading section-heading--center">
            <span className="section-eyebrow">{t.schedule.eyebrow}</span>
            <h2 id="schedule-heading" className="section-title">
              {t.schedule.title}
            </h2>
          </div>
        </Reveal>

        <div className="timeline">
          {schedule.items.map((item, idx) => (
            <Reveal
              key={`${item.time}-${idx}`}
              delay={((idx % 4) + 1) as 1 | 2 | 3 | 4}
              className="timeline-item"
            >
              <div className="timeline-item__time">
                <Clock size={15} aria-hidden="true" />
                <span>{item.time}</span>
              </div>
              <div className="timeline-item__dot" aria-hidden="true" />
              <div className="timeline-item__card">
                <h3 className="timeline-item__title">{pickText(item.title)}</h3>
                <p className="timeline-item__desc">{pickText(item.description)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {schedule.dressCode && schedule.dressCode.colors.length > 0 && (
          <Reveal delay={2}>
            <div className="dresscode-box">
              <div className="dresscode-box__header">
                <Sparkles size={18} className="dresscode-box__icon" aria-hidden="true" />
                <h3 className="dresscode-box__title">{t.schedule.dressCodeTitle}</h3>
              </div>
              <p className="dresscode-box__note">{pickText(schedule.dressCode.note)}</p>

              <ul className="dresscode-swatches">
                {schedule.dressCode.colors.map((swatch) => (
                  <li key={swatch.hex} className="dresscode-swatch">
                    <span
                      className="dresscode-swatch__dot"
                      style={{ backgroundColor: swatch.hex }}
                      aria-hidden="true"
                    />
                    <span className="dresscode-swatch__name">
                      {pickText(swatch.name)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
