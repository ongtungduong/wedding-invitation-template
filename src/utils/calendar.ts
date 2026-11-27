export interface CalendarEventInput {
  title: string;
  startIso: string;
  endIso?: string;
  location: string;
  description: string;
}

const DEFAULT_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours fallback

function formatIcsUtc(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    'T',
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    'Z',
  ].join('');
}

function escapeIcsValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function resolveRange(startIso: string, endIso?: string): { start: Date; end: Date } {
  const start = new Date(startIso);
  const parsedEnd = endIso ? new Date(endIso) : null;
  const end =
    parsedEnd && !Number.isNaN(parsedEnd.getTime()) && parsedEnd > start
      ? parsedEnd
      : new Date(start.getTime() + DEFAULT_DURATION_MS);

  return { start, end };
}

export function buildGoogleCalendarUrl(event: CalendarEventInput): string {
  const { start, end } = resolveRange(event.startIso, event.endIso);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatIcsUtc(start)}/${formatIcsUtc(end)}`,
    location: event.location,
    details: event.description,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsContent(
  event: CalendarEventInput,
  now: Date = new Date(),
): string {
  const { start, end } = resolveRange(event.startIso, event.endIso);
  const uid = `${start.getTime()}-wedding-invitation@template`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation Template//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatIcsUtc(now)}`,
    `DTSTART:${formatIcsUtc(start)}`,
    `DTEND:${formatIcsUtc(end)}`,
    `SUMMARY:${escapeIcsValue(event.title)}`,
    `LOCATION:${escapeIcsValue(event.location)}`,
    `DESCRIPTION:${escapeIcsValue(event.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function downloadIcsFile(
  event: CalendarEventInput,
  filename = 'wedding.ics',
): void {
  const content = buildIcsContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
