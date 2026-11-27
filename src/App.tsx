import { useEffect, useMemo, useState } from 'react';
import { weddingConfig as defaultConfig } from './config/loadConfig';
import type { WeddingConfig } from './config/schema';
import { applyThemeToDocument } from './config/themes';
import { LanguageProvider } from './i18n/LanguageContext';
import { useLanguage } from './i18n/useLanguage';
import { parseGuestNameFromSearch } from './utils/guest';
import { Anniversary } from './components/Anniversary';
import { Couple } from './components/Couple';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { Gift } from './components/Gift';
import { Header } from './components/Header';
import { InvitationCard } from './components/InvitationCard';
import { InviteTool } from './components/InviteTool';
import { MobileDock } from './components/MobileDock';
import { MusicPlayer } from './components/MusicPlayer';
import { Navbar } from './components/Navbar';
import { Organization } from './components/Organization';
import { RSVP } from './components/RSVP';
import { Schedule } from './components/Schedule';
import { SeeYou } from './components/SeeYou';
import { Story } from './components/Story';
import { Where } from './components/Where';

interface AppProps {
  config?: WeddingConfig;
}

const ENVELOPE_SESSION_KEY = 'wedding-envelope-opened';

function isInviteToolMode(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get('invite-tool') === '1';
}

function WeddingShell({ config }: { config: WeddingConfig }) {
  const { t } = useLanguage();
  const { features } = config;
  const inviteToolActive = isInviteToolMode();

  const [envelopeVisible, setEnvelopeVisible] = useState<boolean>(() => {
    if (inviteToolActive || !features.showEnvelopeIntro) return false;
    try {
      return sessionStorage.getItem(ENVELOPE_SESSION_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [musicTrigger, setMusicTrigger] = useState(0);

  const guestName = useMemo(() => {
    if (!features.showGuestPersonalization) return null;
    return parseGuestNameFromSearch(window.location.search);
  }, [features.showGuestPersonalization]);

  useEffect(() => {
    document.documentElement.dataset.theme = config.theme.preset;
    applyThemeToDocument(config.theme);
  }, [config.theme]);

  if (inviteToolActive) {
    return <InviteTool config={config} />;
  }

  const handleOpenEnvelope = () => {
    setEnvelopeVisible(false);
    setMusicTrigger((prev) => prev + 1);
    try {
      sessionStorage.setItem(ENVELOPE_SESSION_KEY, '1');
    } catch {
      // Ignore storage failures in private browsing
    }
  };

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        {t.skipToContent}
      </a>

      {envelopeVisible && (
        <EnvelopeIntro
          config={config}
          guestName={guestName}
          onOpen={handleOpenEnvelope}
        />
      )}

      <Navbar config={config} />

      <main id="main-content" className="site-main">
        <Header config={config} guestName={guestName} />
        {features.showInvitationCard && config.families && (
          <InvitationCard config={config} />
        )}
        <Couple config={config} />
        {features.showAnniversary && <Anniversary config={config} />}
        {features.showStory && <Story config={config} />}
        {features.showMilestones && config.milestones.length > 0 && (
          <Organization config={config} />
        )}
        {features.showSchedule && config.schedule && config.schedule.items.length > 0 && (
          <Schedule config={config} />
        )}
        {features.showGallery && config.gallery.length > 0 && <Gallery config={config} />}
        {features.showLocations && config.locations.length > 0 && (
          <Where config={config} />
        )}
        {features.showGift && config.gift.accounts.length > 0 && <Gift config={config} />}
        {features.showRsvp && <RSVP config={config} />}
        <SeeYou config={config} />
        <Footer config={config} />
      </main>

      {features.showMobileDock && <MobileDock config={config} />}
      {features.showMusic && config.music?.src && (
        <MusicPlayer config={config} autoStartTrigger={musicTrigger} />
      )}
    </div>
  );
}

export default function App({ config = defaultConfig }: AppProps) {
  return (
    <LanguageProvider defaultLang={config.language.default}>
      <WeddingShell config={config} />
    </LanguageProvider>
  );
}
