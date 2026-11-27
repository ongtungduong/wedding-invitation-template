const MAX_GUEST_NAME_LENGTH = 80;
const BIDI_OVERRIDE_REGEX = /[\u202A-\u202E\u2066-\u2069]/g;

function stripControlChars(input: string): string {
  let out = '';
  for (const ch of input) {
    const code = ch.charCodeAt(0);
    if (code >= 32 && code !== 127) {
      out += ch;
    } else {
      out += ' ';
    }
  }
  return out;
}

/**
 * Safely extracts and sanitizes a guest name from URL search params (?guest= or ?to=).
 * Rendered only via React text nodes to prevent XSS.
 */
export function parseGuestNameFromSearch(search: string): string | null {
  const params = new URLSearchParams(search);
  const raw = params.get('guest') ?? params.get('to');
  if (!raw) return null;

  const cleaned = stripControlChars(raw)
    .replace(BIDI_OVERRIDE_REGEX, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_GUEST_NAME_LENGTH);

  return cleaned.length > 0 ? cleaned : null;
}
