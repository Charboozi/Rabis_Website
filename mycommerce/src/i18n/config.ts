export const locales = ["en", "sv"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "en";
