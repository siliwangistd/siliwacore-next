// Import the main setup function for `next-intl` that runs on the server.
import { getRequestConfig } from "next-intl/server";
// Import our language rules (like which languages we support: "en", "id").
import { routing } from "./routing";

/**
 * This file configures how `next-intl` loads the correct translation messages
 * for each user request on the server. Think of it as the brain that decides
 * which dictionary (JSON file) to use based on the URL.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` is the language code from the URL, like "en" or "id".
  let locale = await requestLocale;

  // This is a safety check. If the URL contains a language we don't
  // support (e.g., "/fr/about-us"), or no language at all...
  if (!locale || !routing.locales.includes(locale as any)) {
    // ...we'll fall back to our default language (English).
    locale = routing.defaultLocale;
  }

  // We return the final language and load the corresponding translation file.
  return {
    // The language to use for this request.
    locale,
    // This dynamically imports the correct message file (e.g., `./locales/en.json`)
    // and makes the translations available throughout the server-side parts of our app.
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
