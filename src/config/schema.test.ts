import { describe, expect, it } from 'vitest';
import rawConfig from '../../wedding.config.json';
import { parseWeddingConfig } from './loadConfig';

describe('weddingConfigSchema', () => {
  it('validates the bundled sample wedding.config.json successfully', () => {
    const config = parseWeddingConfig(rawConfig);
    expect(config.couple.brideShort).toBe('Minh Anh');
    expect(config.theme.preset).toBe('classic-gold');
    expect(config.language.default).toBe('vi');
  });

  it('rejects dangerous javascript: URLs in mapUrl or rsvp.endpoint', () => {
    const malicious = structuredClone(rawConfig);
    malicious.locations[0].mapUrl = 'javascript:alert(1)';
    expect(() => parseWeddingConfig(malicious)).toThrow(/Invalid wedding\.config\.json/);

    const maliciousRsvp = structuredClone(rawConfig);
    maliciousRsvp.rsvp.endpoint = 'javascript:fetch("https://evil.test")';
    expect(() => parseWeddingConfig(maliciousRsvp)).toThrow(
      /Invalid wedding\.config\.json/,
    );
  });

  it('rejects invalid ISO wedding date or invalid hex custom color', () => {
    const badDate = structuredClone(rawConfig);
    badDate.event.weddingDateIso = 'not-a-date';
    expect(() => parseWeddingConfig(badDate)).toThrow(/weddingDateIso/);

    const badColor = structuredClone(rawConfig);
    badColor.theme.customColors = { accent: 'red' } as never;
    expect(() => parseWeddingConfig(badColor)).toThrow(/customColors/);
  });
});
