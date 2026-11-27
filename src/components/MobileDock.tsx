import { Check, Gift, HeartHandshake, MapPin, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';

interface MobileDockProps {
  config: WeddingConfig;
}

export function MobileDock({ config }: MobileDockProps) {
  const { t, pickText } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 360);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: pickText(config.seo.title),
      text: pickText(config.seo.description),
      url: window.location.href,
    };

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      setShared(false);
    }
  };

  return (
    <nav
      className={`mobile-dock${visible ? ' mobile-dock--visible' : ''}`}
      aria-label="Quick actions"
    >
      {config.features.showLocations && (
        <a href="#whenwhere" className="mobile-dock__item">
          <MapPin size={18} aria-hidden="true" />
          <span>{t.dock.locations}</span>
        </a>
      )}

      {config.features.showGift && (
        <a href="#gift" className="mobile-dock__item">
          <Gift size={18} aria-hidden="true" />
          <span>{t.dock.gift}</span>
        </a>
      )}

      {config.features.showRsvp && (
        <a href="#rsvp" className="mobile-dock__item">
          <HeartHandshake size={18} aria-hidden="true" />
          <span>{t.dock.rsvp}</span>
        </a>
      )}

      <button type="button" className="mobile-dock__item" onClick={handleShare}>
        {shared ? (
          <Check size={18} aria-hidden="true" />
        ) : (
          <Share2 size={18} aria-hidden="true" />
        )}
        <span>{shared ? t.dock.copiedLink : t.dock.share}</span>
      </button>
    </nav>
  );
}
