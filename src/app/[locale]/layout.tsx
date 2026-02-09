import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Metadata } from "next";

import { routing } from "@/i18n/routing"; // Your i18n routing config
import { localizedMetadata } from "@/src/i18n/metadata";

/**
 * @file src/app/[locale]/layout.tsx (Assumed Path)
 * @summary Defines the root layout structure for all localized pages.
 * @description
 * This component wraps all pages under a specific locale (e.g., /en, /id).
 * It is responsible for:
 * 1. Generating locale-specific <head> metadata.
 * 2. Fetching translation messages (e.g., en.json).
 * 3. Providing the messages and locale to Client Components via `NextIntlClientProvider`.
 * 4. Rendering the root <html> and <body> tags for the page.
 */

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * generateMetadata
 *
 * This Next.js function generates the base <head> metadata for the site.
 * It's dynamic, meaning it runs for each locale.
 *
 * @param {object} props - Contains the `params` promise.
 * @returns {Promise<Metadata>} The metadata object used by Next.js.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "id" }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const metadata = localizedMetadata[locale] || localizedMetadata.en;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    title: {
      template: metadata.title.template, // e.g., "%s | Siliwacore"
      default: metadata.title.default, // e.g., "Siliwacore - A Starter template"
    },
    description: metadata.description,
  };
}

/**
 * LocaleLayout
 *
 * This is the main Server Component for the layout. It's async
 * because it needs to `await` the locale and the translation messages.
 */
const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
