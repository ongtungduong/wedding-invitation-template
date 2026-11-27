export interface TimeBreakdown {
  mode: 'anniversary' | 'countdown';
  years: number;
  days: number;
  totalDays: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

/**
 * Computes exact elapsed time since weddingDateIso (anniversary mode)
 * or remaining time until weddingDateIso (countdown mode).
 * Uses calendar-aware year stepping so leap years remain accurate.
 */
export function calculateWeddingTime(
  weddingDateIso: string,
  nowDate: Date = new Date(),
): TimeBreakdown {
  const weddingDate = new Date(weddingDateIso);
  const weddingMs = weddingDate.getTime();
  const nowMs = nowDate.getTime();

  if (Number.isNaN(weddingMs) || Number.isNaN(nowMs)) {
    return {
      mode: 'anniversary',
      years: 0,
      days: 0,
      totalDays: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  if (nowMs < weddingMs) {
    const diff = weddingMs - nowMs;
    const totalDays = Math.floor(diff / MS_PER_DAY);
    const hours = Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR);
    const minutes = Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE);
    const seconds = Math.floor((diff % MS_PER_MINUTE) / MS_PER_SECOND);

    return {
      mode: 'countdown',
      years: 0,
      days: totalDays,
      totalDays,
      hours,
      minutes,
      seconds,
    };
  }

  // Anniversary mode: count full calendar years elapsed since wedding date
  let years = nowDate.getUTCFullYear() - weddingDate.getUTCFullYear();
  let lastAnniversary = addUtcYears(weddingDate, years);

  if (lastAnniversary.getTime() > nowMs) {
    years -= 1;
    lastAnniversary = addUtcYears(weddingDate, years);
  }

  const remainderMs = Math.max(0, nowMs - lastAnniversary.getTime());
  const totalDays = Math.floor((nowMs - weddingMs) / MS_PER_DAY);
  const days = Math.floor(remainderMs / MS_PER_DAY);
  const hours = Math.floor((remainderMs % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((remainderMs % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((remainderMs % MS_PER_MINUTE) / MS_PER_SECOND);

  return {
    mode: 'anniversary',
    years,
    days,
    totalDays,
    hours,
    minutes,
    seconds,
  };
}

function addUtcYears(base: Date, yearsToAdd: number): Date {
  const result = new Date(base.getTime());
  result.setUTCFullYear(base.getUTCFullYear() + yearsToAdd);
  return result;
}

export function padTwoDigits(value: number): string {
  return String(Math.max(0, value)).padStart(2, '0');
}
