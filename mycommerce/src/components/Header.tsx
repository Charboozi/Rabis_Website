// src/components/Header.tsx
"use client";
import { useTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [country, setCountry] = useState("SE");
  const [currency, setCurrency] = useState("SEK");
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/prefs", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        const p = json.prefs ?? {};
        if (p.country) setCountry(p.country);
        if (p.currency) setCurrency(p.currency);
        if (p.locale) setLocale(p.locale);
      } catch {
        // ignore (keep defaults)
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const res = await fetch("/api/prefs", { method: "POST", body: fd });
      if (!res.ok) { alert("Save failed"); return; }
      router.refresh();           // re-render RSC with new cookie
    });
  }

  const countries = ["SE","NO","DK","FI","DE","FR","US","CA","GB","AU","NL","BE","ES","IT","PL","JP","SG","CN","IN","BR"];
  const currencies = ["SEK","EUR","USD","GBP"];

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="/" className="text-xl font-semibold">MyCommerce</a>
        <form onSubmit={save} className="flex items-center gap-2 text-sm">
          <label className="hidden md:block">{t("site.country")}:</label>
          <select name="country" value={country} onChange={e=>setCountry(e.target.value)} className="rounded border px-2 py-1">
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="hidden md:block">{t("site.currency")}:</label>
          <select name="currency" value={currency} onChange={e=>setCurrency(e.target.value)} className="rounded border px-2 py-1">
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="locale" value={locale} onChange={e=>setLocale(e.target.value)} className="rounded border px-2 py-1">
            <option value="en">EN</option>
            <option value="sv">SV</option>
          </select>
          <button type="submit" disabled={pending} className="rounded bg-black px-3 py-1 text-white disabled:opacity-50">
            {pending ? "…" : "Save"}
          </button>
        </form>
        <nav className="text-sm">
          <a className="hover:underline" href="/cart">{t("nav.cart")}</a>
        </nav>
      </div>
    </header>
  );
}
