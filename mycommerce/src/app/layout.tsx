import "./globals.css";
import { readPrefs } from "@/lib/geo";
import { NextIntlClientProvider } from "next-intl";
import en from "@/i18n/en.json";
import sv from "@/i18n/sv.json";
import Header from "@/components/Header";

export const metadata = { title: "MyCommerce", description: "Global shop" };

// Server Component is fine; just make it async to await readPrefs()
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const prefs = await readPrefs();               // <-- await
  const messages = prefs.locale === "sv" ? sv : en;

  return (
    <html lang={prefs.locale}>
      <body className="min-h-dvh bg-white text-gray-900 antialiased">
        <NextIntlClientProvider locale={prefs.locale} messages={messages}>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
