import rawConfig from '../../wedding.config.json';
import { weddingConfigSchema, type WeddingConfig } from './schema';

export function parseWeddingConfig(input: unknown): WeddingConfig {
  const result = weddingConfigSchema.safeParse(input);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid wedding.config.json:\n${details}`);
  }

  return result.data;
}

export const weddingConfig: WeddingConfig = parseWeddingConfig(rawConfig);

/**
 * Resolves relative media paths (e.g. "media/hero.svg") against Vite's BASE_URL
 * so assets work identically on root domains and subpath deploys (e.g. GitHub Pages).
 */
export function resolveMediaUrl(assetPath: string): string {
  if (/^https?:\/\//i.test(assetPath) || assetPath.startsWith('data:')) {
    return assetPath;
  }

  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = assetPath.replace(/^\/+/, '');
  return `${normalizedBase}${cleanPath}`;
}
