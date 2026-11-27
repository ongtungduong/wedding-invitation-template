import type { ThemePresetId, WeddingConfig } from './schema';

export interface ThemePalette {
  accent: string;
  accentText: string;
  bgBlush: string;
  bgSidebar: string;
  border: string;
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePalette> = {
  'classic-gold': {
    accent: '#BD945A',
    accentText: '#8C6832',
    bgBlush: '#FAF8F7',
    bgSidebar: '#F6F1F0',
    border: '#ECE6E4',
  },
  'romantic-rose': {
    accent: '#C27D82',
    accentText: '#8E484E',
    bgBlush: '#FDF8F8',
    bgSidebar: '#F8ECEE',
    border: '#EEDEE0',
  },
  'sage-green': {
    accent: '#6D8B74',
    accentText: '#425E48',
    bgBlush: '#F7FAF7',
    bgSidebar: '#EDF3EE',
    border: '#DCE6DE',
  },
  'traditional-red': {
    accent: '#B03A3A',
    accentText: '#892222',
    bgBlush: '#FCF7F7',
    bgSidebar: '#F7EBEB',
    border: '#EEDBDB',
  },
};

export function resolveThemePalette(theme: WeddingConfig['theme']): ThemePalette {
  const base = THEME_PRESETS[theme.preset];
  const custom = theme.customColors ?? {};

  return {
    accent: custom.accent ?? base.accent,
    accentText: custom.accentText ?? base.accentText,
    bgBlush: custom.bgBlush ?? base.bgBlush,
    bgSidebar: custom.bgSidebar ?? base.bgSidebar,
    border: base.border,
  };
}

export function applyThemeToDocument(theme: WeddingConfig['theme']): void {
  const palette = resolveThemePalette(theme);
  const root = document.documentElement;

  root.style.setProperty('--color-accent', palette.accent);
  root.style.setProperty('--color-accent-text', palette.accentText);
  root.style.setProperty('--color-accent-soft', `${palette.accent}59`);
  root.style.setProperty('--color-bg-blush', palette.bgBlush);
  root.style.setProperty('--color-bg-sidebar', palette.bgSidebar);
  root.style.setProperty('--color-border', palette.border);
  root.style.setProperty('--focus-ring', `2px solid ${palette.accentText}`);
}
