import { resolveMediaUrl } from '../config/loadConfig';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';

interface FooterProps {
  config: WeddingConfig;
}

export function Footer({ config }: FooterProps) {
  const { pickText } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container">
        <a href="#home" className="site-footer__brand">
          <img
            src={resolveMediaUrl(config.media.logo)}
            alt={`${config.couple.brideShort} & ${config.couple.groomShort}`}
            width={180}
            height={76}
            className="site-footer__logo"
            loading="lazy"
            decoding="async"
          />
          <span className="site-footer__names">
            {config.couple.brideFull} &amp; {config.couple.groomFull}
          </span>
        </a>
        <p className="site-footer__date">
          {pickText(config.event.dateDisplay)} &mdash; {pickText(config.event.city)}
        </p>
      </div>
    </footer>
  );
}
