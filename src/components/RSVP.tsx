import { Heart, MessageCircleHeart, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { WeddingConfig, WishItem } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';
import { Reveal } from './Reveal';

interface RsvpProps {
  config: WeddingConfig;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'preview' | 'error';

export function RSVP({ config }: RsvpProps) {
  const { t, pickText } = useLanguage();
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guests, setGuests] = useState('1');
  const [side, setSide] = useState<'bride' | 'groom' | 'both'>('both');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [liveWishes, setLiveWishes] = useState<WishItem[]>(() => config.wishes ?? []);

  const appendLiveWish = (author: string, wishText: string) => {
    const trimmed = wishText.trim();
    if (!trimmed) return;

    setLiveWishes((prev) => [
      {
        id: `live-${Date.now()}`,
        author,
        relation: t.rsvp.justSentLabel,
        message: trimmed,
      },
      ...prev,
    ]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (honeypot.trim().length > 0) {
      setStatus('success');
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError(t.rsvp.nameRequired);
      return;
    }

    const endpoint = config.rsvp.endpoint.trim();
    if (!endpoint) {
      appendLiveWish(trimmedName, message);
      setStatus('preview');
      setName('');
      setGuests('1');
      setMessage('');
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          attending: attending === 'yes',
          guests: attending === 'yes' ? Number(guests) || 1 : 0,
          side,
          message: message.trim(),
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      appendLiveWish(trimmedName, message);
      setStatus('success');
      setName('');
      setGuests('1');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  const showWishesWall = config.features.showWishesWall && liveWishes.length > 0;

  return (
    <section id="rsvp" className="section section--blush" aria-labelledby="rsvp-heading">
      <div className="container">
        <Reveal>
          <div className="section-heading section-heading--center">
            <span className="section-eyebrow">{t.rsvp.eyebrow}</span>
            <h2 id="rsvp-heading" className="section-title">
              {t.rsvp.title}
            </h2>
            <p className="section-lead">{pickText(config.rsvp.note)}</p>
          </div>
        </Reveal>

        <div className={`rsvp-layout${showWishesWall ? ' rsvp-layout--split' : ''}`}>
          <Reveal>
            <div className="rsvp-card">
              <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="rsvp-website">Website</label>
                  <input
                    id="rsvp-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="rsvp-name">{t.rsvp.nameLabel}</label>
                  <input
                    id="rsvp-name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder={t.rsvp.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="rsvp-attending">{t.rsvp.attendingLabel}</label>
                    <select
                      id="rsvp-attending"
                      name="attending"
                      value={attending}
                      onChange={(e) => setAttending(e.target.value as 'yes' | 'no')}
                    >
                      <option value="yes">{t.rsvp.attendingYes}</option>
                      <option value="no">{t.rsvp.attendingNo}</option>
                    </select>
                  </div>

                  {attending === 'yes' && (
                    <div className="form-field">
                      <label htmlFor="rsvp-guests">{t.rsvp.guestsLabel}</label>
                      <input
                        id="rsvp-guests"
                        name="guests"
                        type="number"
                        min={1}
                        max={10}
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="form-field">
                    <label htmlFor="rsvp-side">{t.rsvp.sideLabel}</label>
                    <select
                      id="rsvp-side"
                      name="side"
                      value={side}
                      onChange={(e) =>
                        setSide(e.target.value as 'bride' | 'groom' | 'both')
                      }
                    >
                      <option value="bride">{t.rsvp.sideBride}</option>
                      <option value="groom">{t.rsvp.sideGroom}</option>
                      <option value="both">{t.rsvp.sideBoth}</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="rsvp-message">{t.rsvp.messageLabel}</label>
                  <textarea
                    id="rsvp-message"
                    name="message"
                    rows={4}
                    maxLength={500}
                    placeholder={t.rsvp.messagePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {validationError && (
                  <p className="form-alert form-alert--error" role="alert">
                    {validationError}
                  </p>
                )}

                {status === 'success' && (
                  <p className="form-alert form-alert--success" role="status">
                    {t.rsvp.successMessage}
                  </p>
                )}

                {status === 'preview' && (
                  <p className="form-alert form-alert--info" role="status">
                    {t.rsvp.previewMessage}
                  </p>
                )}

                {status === 'error' && (
                  <p className="form-alert form-alert--error" role="alert">
                    {t.rsvp.errorMessage}
                  </p>
                )}

                <div className="rsvp-form__actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={status === 'submitting'}
                  >
                    <Send size={16} aria-hidden="true" />
                    <span>
                      {status === 'submitting' ? t.rsvp.submitting : t.rsvp.submit}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </Reveal>

          {showWishesWall && (
            <Reveal delay={2}>
              <aside className="wishes-wall" aria-label={t.rsvp.wishesTitle}>
                <div className="wishes-wall__header">
                  <MessageCircleHeart
                    size={20}
                    className="wishes-wall__icon"
                    aria-hidden="true"
                  />
                  <h3>{t.rsvp.wishesTitle}</h3>
                </div>

                <ul className="wishes-list">
                  {liveWishes.map((wish) => (
                    <li key={wish.id} className="wish-card">
                      <div className="wish-card__top">
                        <strong>{wish.author}</strong>
                        {wish.relation && (
                          <span className="wish-card__relation">
                            <Heart size={11} aria-hidden="true" />
                            <span>{pickText(wish.relation)}</span>
                          </span>
                        )}
                      </div>
                      <p className="wish-card__text">{pickText(wish.message)}</p>
                    </li>
                  ))}
                </ul>
              </aside>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
