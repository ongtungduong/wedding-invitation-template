import { useEffect, useState } from 'react';
import { resolveMediaUrl } from '../config/loadConfig';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';
import { calculateWeddingTime, padTwoDigits, type TimeBreakdown } from '../utils/time';

interface AnniversaryProps {
  config: WeddingConfig;
}

export function Anniversary({ config }: AnniversaryProps) {
  const { lang, t, pickText } = useLanguage();
  const [time, setTime] = useState<TimeBreakdown>(() =>
    calculateWeddingTime(config.event.weddingDateIso),
  );

  useEffect(() => {
    setTime(calculateWeddingTime(config.event.weddingDateIso));
    const intervalId = window.setInterval(() => {
      setTime(calculateWeddingTime(config.event.weddingDateIso));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [config.event.weddingDateIso]);

  const heading =
    time.mode === 'anniversary' ? t.timer.anniversaryHeading : t.timer.countdownHeading;

  const units = [
    ...(time.mode === 'anniversary' && time.years > 0
      ? [
          {
            label: time.years === 1 ? t.timer.year : t.timer.years,
            value: String(time.years),
          },
        ]
      : []),
    { label: time.days === 1 ? t.timer.day : t.timer.days, value: String(time.days) },
    { label: t.timer.hours, value: padTwoDigits(time.hours) },
    { label: t.timer.minutes, value: padTwoDigits(time.minutes) },
    { label: t.timer.seconds, value: padTwoDigits(time.seconds) },
  ];

  const locale = lang === 'vi' ? 'vi-VN' : 'en-US';

  return (
    <section
      id="anniversary"
      className="section banner-section"
      aria-labelledby="anniversary-heading"
    >
      <img
        src={resolveMediaUrl(config.media.timerBanner)}
        alt=""
        aria-hidden="true"
        className="banner-section__bg"
        loading="lazy"
        decoding="async"
      />
      <div className="container banner-section__inner">
        <h2 id="anniversary-heading" className="anniversary__heading">
          {heading}
        </h2>

        {time.mode === 'anniversary' && (
          <p className="anniversary__summary">
            {t.timer.daysTogether(
              time.totalDays.toLocaleString(locale),
              pickText(config.event.dateDisplay),
            )}
          </p>
        )}

        <ul className="timer-grid" aria-live="off">
          {units.map((unit) => (
            <li key={unit.label} className="timer-unit">
              <span className="timer-unit__value">{unit.value}</span>
              <span className="timer-unit__label">{unit.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
