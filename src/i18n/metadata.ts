import site from "@/src/config/site.json";

/**
 * This file contains the default, localized metadata for the site.
 * It's used in the root layout to provide default titles and descriptions
 * for each language, which can be overridden by individual pages.
 */
export const localizedMetadata = {
  en: {
    title: {
      template: "%s | " + site.name,
      default: site.name,
    },
    description: site.description,
  },
  id: {
    title: {
      template: "%s | " + site.name,
      default: site.name,
    },
    description: site.description,
  },
};
