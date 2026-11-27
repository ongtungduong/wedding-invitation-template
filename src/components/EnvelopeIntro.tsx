import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';

interface EnvelopeIntroProps {
  config: WeddingConfig;
  guestName: string | null;
  onOpen: () => void;
}

export function EnvelopeIntro({ config, guestName, onOpen }: EnvelopeIntroProps) {
  const { t, pickText } = useLanguage();
  const [opening, setOpening] = useState(false);

  const initials = `${config.couple.brideShort.trim().charAt(0)}&${config.couple.groomShort.trim().charAt(0)}`;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleTriggerOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => {
      onOpen();
    }, 650);
  };

  return (
    <div
      className={`envelope-overlay${opening ? ' envelope-overlay--opening' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.envelope.subtitle}
    >
      <div className="envelope-card">
        <div className="envelope-flap" aria-hidden="true" />

        <div className="envelope-body">
          <p className="envelope-kicker">{t.envelope.subtitle}</p>

          <h2 className="envelope-names">
            <span>{config.couple.brideShort}</span>
            <span className="envelope-amp">&amp;</span>
            <span>{config.couple.groomShort}</span>
          </h2>

          <p className="envelope-date">
            {pickText(config.event.dateDisplay)} &mdash; {pickText(config.event.city)}
          </p>

          {guestName && (
            <div className="envelope-guest">
              <span className="envelope-guest__prefix">{t.envelope.guestPrefix}</span>
              <strong className="envelope-guest__name">{guestName}</strong>
            </div>
          )}

          <button
            type="button"
            className="wax-seal-btn"
            onClick={handleTriggerOpen}
            aria-label={t.envelope.openButton}
          >
            <span className="wax-seal">
              <Heart size={14} className="wax-seal__heart" aria-hidden="true" />
              <span className="wax-seal__initials">{initials}</span>
            </span>
            <span className="wax-seal-btn__label">{t.envelope.openButton}</span>
          </button>

          <p className="envelope-hint">{t.envelope.openHint}</p>
        </div>
      </div>
    </div>
  );
}
