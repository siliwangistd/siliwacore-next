import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing"; // Your i18n routing config
import { getMessages } from "next-intl/server";
import { Metadata } from "next";
import { localizedMetadata } from "@/src/i18n/metadata";

// Define the props, including `children` and the `locale` from the URL.
type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "id" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const metadata = localizedMetadata[locale] || localizedMetadata.en;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),

    // ✅ This is the default template for all regular pages
    title: {
      template: metadata.title.template, // e.g., "%s | Siliwacore"
      default: metadata.title.default, // e.g., "Siliwacore - A Starter template for Next.js apps"
    },
    description: metadata.description,
  };
}

/**
 * This layout wraps all pages and provides the language context.
 * It's an async component so it can fetch translation messages.
 */
const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params;
  // A safety check: if the URL has an unsupported language, show a 404 page.
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // `useMessages` grabs the correct translation file (e.g., en.json) for the locale.
  const messages = await getMessages();

  return (
    // Set the `lang` attribute on the HTML tag for SEO and accessibility.
    <html lang={locale}>
      <body>
        {/*
          This provider makes the language and translations available
          to all Client Components throughout the app.
        */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Render Navbar, Footer, or other shared UI here */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
