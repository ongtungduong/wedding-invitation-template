import { ArrowLeft, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';

interface InviteToolProps {
  config: WeddingConfig;
}

export function InviteTool({ config }: InviteToolProps) {
  const { t } = useLanguage();
  const [rawNames, setRawNames] = useState('Anh Hùng & Gia đình\nChị Lan Phương');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const baseUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    return url.toString();
  }, []);

  const guestLinks = useMemo(() => {
    return rawNames
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((name) => {
        const url = new URL(baseUrl);
        url.searchParams.set('guest', name);
        return { name, url: url.toString() };
      });
  }, [rawNames, baseUrl]);

  const copySingle = async (idx: number, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(idx);
      window.setTimeout(() => setCopiedIndex(null), 1800);
    } catch {
      setCopiedIndex(null);
    }
  };

  const copyAllLinks = async () => {
    const text = guestLinks.map((item) => `${item.name}: ${item.url}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      window.setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      setCopiedAll(false);
    }
  };

  return (
    <main className="invite-tool-page">
      <div className="invite-tool-card">
        <a href={baseUrl} className="invite-tool-back">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>{t.inviteTool.backToCard}</span>
        </a>

        <span className="invite-tool-badge">
          <Sparkles size={14} aria-hidden="true" />
          <span>{t.inviteTool.badge}</span>
        </span>

        <h1>{t.inviteTool.title}</h1>
        <p className="invite-tool-desc">
          {config.couple.brideShort} &amp; {config.couple.groomShort} —{' '}
          {t.inviteTool.description}
        </p>

        <div className="form-field">
          <label htmlFor="guest-names-input">{t.inviteTool.inputLabel}</label>
          <textarea
            id="guest-names-input"
            rows={5}
            placeholder={t.inviteTool.inputPlaceholder}
            value={rawNames}
            onChange={(e) => setRawNames(e.target.value)}
          />
        </div>

        {guestLinks.length === 0 ? (
          <p className="invite-tool-empty">{t.inviteTool.emptyState}</p>
        ) : (
          <>
            <div className="invite-tool-toolbar">
              <button type="button" className="btn-primary" onClick={copyAllLinks}>
                {copiedAll ? (
                  <Check size={16} aria-hidden="true" />
                ) : (
                  <Copy size={16} aria-hidden="true" />
                )}
                <span>{copiedAll ? t.inviteTool.copiedAll : t.inviteTool.copyAll}</span>
              </button>
            </div>

            <ul className="invite-tool-list">
              {guestLinks.map((item, idx) => (
                <li key={`${item.name}-${idx}`} className="invite-tool-row">
                  <div className="invite-tool-row__info">
                    <strong>{item.name}</strong>
                    <code>{item.url}</code>
                  </div>
                  <div className="invite-tool-row__actions">
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => copySingle(idx, item.url)}
                    >
                      {copiedIndex === idx ? (
                        <Check size={14} aria-hidden="true" />
                      ) : (
                        <Copy size={14} aria-hidden="true" />
                      )}
                      <span>
                        {copiedIndex === idx
                          ? t.inviteTool.copied
                          : t.inviteTool.copySingle}
                      </span>
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                    >
                      <ExternalLink size={14} aria-hidden="true" />
                      <span>{t.inviteTool.openPreview}</span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
