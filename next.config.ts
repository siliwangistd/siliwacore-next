// next.config.ts

// Import the next-intl plugin function
import createNextIntlPlugin from "next-intl/plugin";

// Import the `NextConfig` type from 'next' for type-checking
import type { NextConfig } from "next";

// Initialize the next-intl plugin. The `./src/i18n` path should point
// to your main i18n configuration file.
const withNextIntl = createNextIntlPlugin("./src/i18n/index.ts");

/**
 * The main Next.js configuration object.
 * By applying the `NextConfig` type, we get autocompletion and
 * error-checking for all available options.
 */
const nextConfig: NextConfig = {};

// Wrap the configuration with the next-intl plugin and export it.
export default withNextIntl(nextConfig);
