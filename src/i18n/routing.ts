// We're importing tools from the `next-intl` library to help manage
// our website's languages and URLs.
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

/**
 * Here, we set up the main rules for our website's internationalization (i18n).
 * This tells `next-intl` which languages we support and how to handle URLs.
 */
export const routing = defineRouting({
  // We're telling it not to save the user's language in a cookie.
  localeCookie: false,

  // These are the languages our website supports: English and Indonesian.
  locales: ["en", "id"],

  // If we can't figure out the user's preferred language, we'll show them the English version.
  defaultLocale: "en",

  // This is where we can translate URLs. For example, `/about` in English
  // could be `/tentang` in Indonesian. We've kept the homepage the same for all languages.
  pathnames: {
    "/": "/",

    // Example of a translated path:
    // "/services/[serviceSlug]": {
    //   en: "/services/[serviceSlug]",
    //   id: "/layanan/[serviceSlug]",
    // },
  },
});

/**
 * Now we create special navigation tools (like `Link` and `useRouter`)
 * that automatically understand our language rules. Always import these
 * from this file instead of from 'next/navigation' to make sure your
 * links and redirects work correctly with different languages.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

/**
 * This creates a handy TypeScript type called `Locale`.
 * It automatically represents our supported languages ("en" | "id").
 * This helps prevent typos and bugs in our code when we work with locales.
 */
export type Locale = (typeof routing.locales)[number];
