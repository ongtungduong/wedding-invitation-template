import { resolveMediaUrl } from '../config/loadConfig';
import type { WeddingConfig } from '../config/schema';
import { useLanguage } from '../i18n/useLanguage';
import { Reveal } from './Reveal';

interface StoryProps {
  config: WeddingConfig;
}

export function Story({ config }: StoryProps) {
  const { pickText } = useLanguage();
  const { story, couple, media } = config;

  return (
    <section id="story" className="section" aria-labelledby="story-heading">
      <div className="container">
        <div className="story-grid">
          <Reveal>
            <div className="story-media">
              <img
                src={resolveMediaUrl(media.story)}
                alt={`${couple.brideFull} & ${couple.groomFull}`}
                width={900}
                height={1200}
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="story-content">
              <span className="section-eyebrow">{pickText(story.eyebrow)}</span>
              <h2 id="story-heading" className="section-title">
                {pickText(story.title)}
              </h2>

              {story.paragraphs.map((paragraph, index) => (
                <p key={index}>{pickText(paragraph)}</p>
              ))}

              <h3 className="story-content__highlight">
                {pickText(story.highlightHeading)}
              </h3>
              <p>{pickText(story.closingParagraph)}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
