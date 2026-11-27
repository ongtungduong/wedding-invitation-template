import { Globe, Menu, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';
import { calculateWeddingTime } from '../utils/time';

interface NavbarProps {
  config: WeddingConfig;
}

export function Navbar({ config }: NavbarProps) {
  const { lang, setLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState('home');

  const timerMode = calculateWeddingTime(config.event.weddingDateIso).mode;

  const navItems = useMemo(() => {
    const items: { id: string; label: string }[] = [{ id: 'home', label: t.nav.home }];

    if (config.features.showInvitationCard && config.families) {
      items.push({ id: 'invitation', label: t.nav.invitation });
    }
    items.push({ id: 'couple', label: t.nav.couple });

    if (config.features.showAnniversary) {
      items.push({
        id: 'anniversary',
        label: timerMode === 'anniversary' ? t.nav.anniversary : t.nav.countdown,
      });
    }
    if (config.features.showStory) {
      items.push({ id: 'story', label: t.nav.story });
    }
    if (config.features.showSchedule && config.schedule?.items.length) {
      items.push({ id: 'schedule', label: t.nav.schedule });
    }
    if (config.features.showGallery && config.gallery.length > 0) {
      items.push({ id: 'gallery', label: t.nav.gallery });
    }
    if (config.features.showLocations && config.locations.length > 0) {
      items.push({ id: 'whenwhere', label: t.nav.locations });
    }
    if (config.features.showGift && config.gift.accounts.length > 0) {
      items.push({ id: 'gift', label: t.nav.gift });
    }
    if (config.features.showRsvp) {
      items.push({ id: 'rsvp', label: t.nav.rsvp });
    }

    return items;
  }, [config, t, timerMode]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 48);

      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (y / docHeight) * 100)));
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const elements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.4] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [navItems]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`top-nav${scrolled || menuOpen ? ' top-nav--scrolled' : ''}`}>
      <div className="top-nav__inner">
        <a href="#home" className="top-nav__brand" onClick={closeMenu}>
          <span className="top-nav__names">
            {config.couple.brideShort} &amp; {config.couple.groomShort}
          </span>
          <span className="top-nav__date">{config.event.dateShort}</span>
        </a>

        <nav className="top-nav__links" aria-label={t.nav.mainNavLabel}>
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`top-nav__link${
                    activeId === item.id ? ' top-nav__link--active' : ''
                  }`}
                  aria-current={activeId === item.id ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="top-nav__controls">
          {config.language.allowSwitch && (
            <div className="lang-switch" role="group" aria-label={t.nav.switchLang}>
              <Globe size={13} className="lang-switch__icon" aria-hidden="true" />
              <button
                type="button"
                className={`lang-switch__btn${
                  lang === 'vi' ? ' lang-switch__btn--active' : ''
                }`}
                aria-pressed={lang === 'vi'}
                onClick={() => setLang('vi')}
              >
                VI
              </button>
              <button
                type="button"
                className={`lang-switch__btn${
                  lang === 'en' ? ' lang-switch__btn--active' : ''
                }`}
                aria-pressed={lang === 'en'}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>
          )}

          <button
            type="button"
            className="top-nav__toggle"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Reading progress hairline */}
      <div className="top-nav__progress-track" aria-hidden="true">
        <div
          className="top-nav__progress-bar"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div id="mobile-nav-drawer" className="mobile-drawer">
          <nav aria-label={t.nav.mainNavLabel}>
            <ul>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`mobile-drawer__link${
                      activeId === item.id ? ' mobile-drawer__link--active' : ''
                    }`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
