import { z } from 'zod';

export type Language = 'vi' | 'en';
export type ThemePresetId =
  'classic-gold' | 'romantic-rose' | 'sage-green' | 'traditional-red';
export type GalleryCategory = 'all' | 'ceremony' | 'party';

export const localizedTextSchema = z.union([
  z.string().min(1),
  z.object({
    vi: z.string().min(1),
    en: z.string().min(1),
  }),
]);

export type LocalizedText = z.infer<typeof localizedTextSchema>;

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a 6-digit hex code like #BD945A');

const safeHttpUrlSchema = z
  .string()
  .url()
  .refine(
    (value) => {
      try {
        const parsed = new URL(value);
        return parsed.protocol === 'https:' || parsed.protocol === 'http:';
      } catch {
        return false;
      }
    },
    { message: 'URL must use http:// or https:// protocol' },
  );

const isoDateStringSchema = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Must be a valid ISO 8601 date string (e.g. 2027-03-20T11:00:00+07:00)',
  });

export const themePresetSchema = z.enum([
  'classic-gold',
  'romantic-rose',
  'sage-green',
  'traditional-red',
]);

export const familySideSchema = z.object({
  label: localizedTextSchema,
  father: z.string().min(1),
  mother: z.string().min(1),
  address: z.string().min(1),
});

export const scheduleItemSchema = z.object({
  time: z.string().min(1),
  title: localizedTextSchema,
  description: localizedTextSchema,
});

export const dressCodeColorSchema = z.object({
  hex: hexColorSchema,
  name: localizedTextSchema,
});

export const wishItemSchema = z.object({
  id: z.string().min(1),
  author: z.string().min(1),
  relation: localizedTextSchema.optional(),
  message: localizedTextSchema,
});

export const giftAccountSchema = z.object({
  id: z.string().min(1),
  label: localizedTextSchema,
  bankName: z.string().min(1),
  bankCode: z.string().min(1),
  accountNumber: z.string().min(1),
  accountHolder: z.string().min(1),
  qrImage: z.string().optional(),
  useVietQr: z.boolean().optional().default(false),
});

export const locationSchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  time: z.string().optional(),
  startIso: isoDateStringSchema.optional(),
  endIso: isoDateStringSchema.optional(),
  address: z.string().min(1),
  mapUrl: safeHttpUrlSchema,
  image: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const galleryPhotoSchema = z.object({
  id: z.string().min(1),
  src: z.string().min(1),
  caption: localizedTextSchema,
  category: z.enum(['ceremony', 'party']),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const milestoneSchema = z.object({
  step: z.string().min(1),
  title: localizedTextSchema,
  date: z.string().min(1),
});

export const weddingConfigSchema = z.object({
  $schema: z.string().optional(),
  seo: z.object({
    title: localizedTextSchema,
    description: localizedTextSchema,
    ogImage: z.string().min(1),
    robots: z.string().optional().default('index, follow'),
  }),
  language: z.object({
    default: z.enum(['vi', 'en']),
    allowSwitch: z.boolean(),
  }),
  theme: z.object({
    preset: themePresetSchema,
    customColors: z
      .object({
        accent: hexColorSchema.optional(),
        accentText: hexColorSchema.optional(),
        bgBlush: hexColorSchema.optional(),
        bgSidebar: hexColorSchema.optional(),
      })
      .optional()
      .default({}),
  }),
  features: z.object({
    showEnvelopeIntro: z.boolean().optional().default(true),
    showInvitationCard: z.boolean().optional().default(true),
    showAnniversary: z.boolean(),
    showStory: z.boolean(),
    showMilestones: z.boolean(),
    showSchedule: z.boolean().optional().default(true),
    showGallery: z.boolean(),
    showLocations: z.boolean(),
    showGift: z.boolean(),
    showRsvp: z.boolean(),
    showWishesWall: z.boolean().optional().default(true),
    showCalendar: z.boolean(),
    showGuestPersonalization: z.boolean(),
    showMobileDock: z.boolean().optional().default(true),
    showMusic: z.boolean(),
  }),
  couple: z.object({
    brideShort: z.string().min(1),
    groomShort: z.string().min(1),
    brideFull: z.string().min(1),
    groomFull: z.string().min(1),
    brideBio: localizedTextSchema,
    groomBio: localizedTextSchema,
  }),
  families: z
    .object({
      announcement: localizedTextSchema,
      brideSide: familySideSchema,
      groomSide: familySideSchema,
    })
    .optional(),
  event: z.object({
    weddingDateIso: isoDateStringSchema,
    weddingEndIso: isoDateStringSchema.optional(),
    dateShort: z.string().min(1),
    dayOfWeek: localizedTextSchema.optional(),
    dateDisplay: localizedTextSchema,
    lunarDate: localizedTextSchema.optional(),
    city: localizedTextSchema,
    calendarTitle: localizedTextSchema,
    calendarLocation: z.string().min(1),
    calendarDescription: localizedTextSchema,
  }),
  media: z.object({
    logo: z.string().min(1),
    hero: z.string().min(1),
    bride: z.string().min(1),
    groom: z.string().min(1),
    story: z.string().min(1),
    timerBanner: z.string().min(1),
    thankYouBanner: z.string().min(1),
  }),
  music: z
    .object({
      src: z.string(),
      title: localizedTextSchema,
    })
    .optional(),
  story: z.object({
    eyebrow: localizedTextSchema,
    title: localizedTextSchema,
    paragraphs: z.array(localizedTextSchema).min(1),
    highlightHeading: localizedTextSchema,
    closingParagraph: localizedTextSchema,
  }),
  milestones: z.array(milestoneSchema),
  schedule: z
    .object({
      items: z.array(scheduleItemSchema),
      dressCode: z
        .object({
          note: localizedTextSchema,
          colors: z.array(dressCodeColorSchema),
        })
        .optional(),
    })
    .optional(),
  gallery: z.array(galleryPhotoSchema),
  locations: z.array(locationSchema),
  gift: z.object({
    note: localizedTextSchema,
    accounts: z.array(giftAccountSchema),
  }),
  rsvp: z.object({
    endpoint: z.union([z.literal(''), safeHttpUrlSchema]),
    note: localizedTextSchema,
  }),
  wishes: z.array(wishItemSchema).optional().default([]),
  thankYou: z.object({
    message: localizedTextSchema,
  }),
});

export type WeddingConfig = z.infer<typeof weddingConfigSchema>;
export type GiftAccount = z.infer<typeof giftAccountSchema>;
export type LocationItem = z.infer<typeof locationSchema>;
export type GalleryPhoto = z.infer<typeof galleryPhotoSchema>;
export type MilestoneItem = z.infer<typeof milestoneSchema>;
export type WishItem = z.infer<typeof wishItemSchema>;

export function resolveLocalizedText(text: LocalizedText, lang: Language): string {
  return typeof text === 'string' ? text : text[lang];
}
