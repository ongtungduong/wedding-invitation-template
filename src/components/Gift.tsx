import { Check, Copy, Gift as GiftIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { resolveMediaUrl } from '../config/loadConfig';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';
import { resolveGiftQrUrl } from '../utils/vietqr';

interface GiftProps {
  config: WeddingConfig;
}

export function Gift({ config }: GiftProps) {
  const { t, pickText } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = async (id: string, accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedId(id);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard API may be unavailable on non-HTTPS contexts
      setCopiedId(null);
    }
  };

  return (
    <section id="gift" className="section" aria-labelledby="gift-heading">
      <div className="container">
        <div className="section-heading section-heading--center">
          <span className="section-eyebrow">{t.gift.eyebrow}</span>
          <h2 id="gift-heading" className="section-title">
            {t.gift.title}
          </h2>
          <p className="section-lead">{pickText(config.gift.note)}</p>
        </div>

        <div className="gift-grid">
          {config.gift.accounts.map((account) => {
            const label = pickText(account.label);
            const qrUrl = resolveGiftQrUrl(account, resolveMediaUrl);
            const isCopied = copiedId === account.id;

            return (
              <article key={account.id} className="gift-card">
                <div className="gift-card__header">
                  <GiftIcon size={20} className="gift-card__icon" aria-hidden="true" />
                  <h3 className="gift-card__title">{label}</h3>
                </div>

                {qrUrl && (
                  <div className="gift-card__qr">
                    <img
                      src={qrUrl}
                      alt={`${t.gift.qrAlt} — ${label}`}
                      width={220}
                      height={220}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                <dl className="gift-card__details">
                  <div>
                    <dt>{account.bankName}</dt>
                    <dd className="gift-card__account">{account.accountNumber}</dd>
                  </div>
                  <div>
                    <dt>{t.gift.accountHolderLabel}</dt>
                    <dd>{account.accountHolder}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleCopy(account.id, account.accountNumber)}
                >
                  {isCopied ? (
                    <>
                      <Check size={16} aria-hidden="true" />
                      <span>{t.gift.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} aria-hidden="true" />
                      <span>{t.gift.copyNumber}</span>
                    </>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
