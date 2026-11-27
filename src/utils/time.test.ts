import { describe, expect, it } from 'vitest';
import { calculateWeddingTime, padTwoDigits } from './time';

describe('calculateWeddingTime', () => {
  const weddingIso = '2024-02-25T13:00:00+07:00';

  it('computes anniversary elapsed years, days, hours, minutes, and seconds after wedding date', () => {
    const now = new Date('2026-02-28T15:30:45+07:00');
    const result = calculateWeddingTime(weddingIso, now);

    expect(result.mode).toBe('anniversary');
    expect(result.years).toBe(2);
    expect(result.days).toBe(3);
    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(45);
    expect(result.totalDays).toBe(734);
  });

  it('handles leap year boundary accurately before second anniversary', () => {
    const now = new Date('2025-02-25T12:59:59+07:00');
    const result = calculateWeddingTime(weddingIso, now);

    expect(result.mode).toBe('anniversary');
    expect(result.years).toBe(0);
    expect(result.days).toBe(365);
    expect(result.hours).toBe(23);
    expect(result.minutes).toBe(59);
    expect(result.seconds).toBe(59);
  });

  it('switches to countdown mode when wedding date is in the future', () => {
    const now = new Date('2024-02-24T12:00:00+07:00');
    const result = calculateWeddingTime(weddingIso, now);

    expect(result.mode).toBe('countdown');
    expect(result.years).toBe(0);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it('pads single digits safely', () => {
    expect(padTwoDigits(4)).toBe('04');
    expect(padTwoDigits(12)).toBe('12');
    expect(padTwoDigits(-3)).toBe('00');
  });
});
