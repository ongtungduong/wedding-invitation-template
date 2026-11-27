import { describe, expect, it } from 'vitest';
import { buildGoogleCalendarUrl, buildIcsContent } from './calendar';
import { parseGuestNameFromSearch } from './guest';
import { resolveGiftQrUrl } from './vietqr';

describe('calendar utilities', () => {
  const sampleEvent = {
    title: 'Minh Anh & Quốc Bảo Wedding',
    startIso: '2027-03-20T11:00:00+07:00',
    endIso: '2027-03-20T14:00:00+07:00',
    location: 'Hanoi, Vietnam',
    description: 'Welcome, friends; see you soon!',
  };

  it('builds a valid Google Calendar template URL in UTC', () => {
    const url = buildGoogleCalendarUrl(sampleEvent);
    expect(url).toContain('https://calendar.google.com/calendar/render?');
    expect(url).toContain('dates=20270320T040000Z%2F20270320T070000Z');
    expect(url).toContain('action=TEMPLATE');
  });

  it('generates RFC 5545 compliant ICS content with escaped punctuation', () => {
    const ics = buildIcsContent(sampleEvent, new Date('2026-11-27T00:00:00Z'));
    expect(ics).toContain('BEGIN:VCALENDAR\r\n');
    expect(ics).toContain('DTSTART:20270320T040000Z\r\n');
    expect(ics).toContain('DTEND:20270320T070000Z\r\n');
    expect(ics).toContain('LOCATION:Hanoi\\, Vietnam\r\n');
    expect(ics).toContain('DESCRIPTION:Welcome\\, friends\\; see you soon!\r\n');
    expect(ics).toContain('END:VCALENDAR\r\n');
  });
});

describe('guest personalization utility', () => {
  it('parses and sanitizes ?guest= and ?to= query params', () => {
    expect(parseGuestNameFromSearch('?guest=Anh+H%C3%B9ng')).toBe('Anh Hùng');
    expect(parseGuestNameFromSearch('?to=%20%20Ch%E1%BB%8B%20Lan%0A%09')).toBe('Chị Lan');
    expect(parseGuestNameFromSearch('')).toBeNull();
  });

  it('truncates overly long guest names to 80 characters', () => {
    const longName = 'A'.repeat(120);
    expect(parseGuestNameFromSearch(`?guest=${longName}`)?.length).toBe(80);
  });
});

describe('vietqr utility', () => {
  const resolveAsset = (p: string) => `/${p}`;

  it('uses local qrImage when useVietQr is false', () => {
    const url = resolveGiftQrUrl(
      {
        id: 'bride',
        label: 'Bride',
        bankName: 'Vietcombank',
        bankCode: 'VCB',
        accountNumber: '0123456789',
        accountHolder: 'NGUYEN MINH ANH',
        qrImage: 'media/qr/bride-qr.svg',
        useVietQr: false,
      },
      resolveAsset,
    );
    expect(url).toBe('/media/qr/bride-qr.svg');
  });

  it('builds dynamic img.vietqr.io URL when useVietQr is true', () => {
    const url = resolveGiftQrUrl(
      {
        id: 'bride',
        label: 'Bride',
        bankName: 'Vietcombank',
        bankCode: 'VCB',
        accountNumber: '0123 456 789',
        accountHolder: 'NGUYEN MINH ANH',
        useVietQr: true,
      },
      resolveAsset,
    );
    expect(url).toBe(
      'https://img.vietqr.io/image/VCB-0123456789-compact2.png?accountName=NGUYEN+MINH+ANH',
    );
  });
});
