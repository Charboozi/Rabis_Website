// next-intl.config.ts
import { getRequestConfig, type RequestConfig } from "next-intl/server";

const LOCALES = ["en", "sv"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "en";

function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

export default getRequestConfig(async ({ locale = DEFAULT_LOCALE }) => {
  const effectiveLocale: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;

  const messages = (await import(`./src/i18n/${effectiveLocale}.json`)).default;

  // locale is guaranteed string (Locale), satisfying RequestConfig
  return {
    locale: effectiveLocale,
    messages
  } satisfies RequestConfig;
});
