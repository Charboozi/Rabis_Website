export type SupportedCurrency = "SEK" | "EUR" | "USD" | "GBP";
export type SupportedCountry =
  | "SE" | "NO" | "DK" | "FI" | "DE" | "FR" | "US" | "CA" | "GB" | "AU"
  | "NL" | "BE" | "ES" | "IT" | "PL" | "JP" | "SG" | "CN" | "IN" | "BR";

export const DEFAULT_COUNTRY: SupportedCountry = "SE";
export const DEFAULT_CURRENCY: SupportedCurrency = "SEK";

export const COUNTRY_TO_DEFAULT_CURRENCY: Partial<Record<SupportedCountry, SupportedCurrency>> = {
  SE: "SEK", NO: "EUR", DK: "EUR", FI: "EUR",
  DE: "EUR", FR: "EUR", NL: "EUR", BE: "EUR", ES: "EUR", IT: "EUR", PL: "EUR",
  GB: "GBP",
  US: "USD", CA: "USD", AU: "USD",
  JP: "USD", SG: "USD", CN: "USD", IN: "USD", BR: "USD",
};

export function formatMoney(minor: number, currency: SupportedCurrency, locale: string) {
  const value = minor / 100;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
}
