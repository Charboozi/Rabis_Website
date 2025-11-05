import { cookies, headers } from "next/headers";
import {
  COUNTRY_TO_DEFAULT_CURRENCY,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  SupportedCountry,
  SupportedCurrency
} from "./currency";

export const PREFS_COOKIE = "prefs.v1";
export type Prefs = { country: SupportedCountry; currency: SupportedCurrency; locale: "en" | "sv" };

export async function readPrefs(): Promise<Prefs> {
  const jar = await cookies(); // <-- await here
  const raw = jar.get(PREFS_COOKIE)?.value;

  if (raw) {
    try {
      return JSON.parse(raw) as Prefs;
    } catch {}
  }

  const hdrs = await headers(); // <-- await here
  const ipCountry = (hdrs.get("x-vercel-ip-country") || hdrs.get("cf-ipcountry") || "SE") as SupportedCountry;
  const country = (ipCountry || DEFAULT_COUNTRY) as SupportedCountry;
  const currency = (COUNTRY_TO_DEFAULT_CURRENCY[country] || DEFAULT_CURRENCY) as SupportedCurrency;
  const locale: "en" | "sv" = country === "SE" ? "sv" : "en";

  return { country, currency, locale };
}
