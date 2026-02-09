// We're importing a special function from the `next-intl` library
// that helps create navigation tools aware of different languages.
import { createNavigation } from "next-intl/navigation";

// We're also importing our website's routing rules. This file defines
// how URLs might change between languages (e.g., `/about` in English
// could be `/tentang-kami` in Indonesian).
import { routing } from "./routing";

/**
 * Here, we create and export our own navigation tools.
 * These are special versions of the standard Next.js navigation functions
 * that automatically handle language prefixes in URLs (like `/en/` or `/id/`).
 *
 * So, whenever you need to create a link or navigate between pages,
 * you should import them from this file instead of from 'next/navigation'.
 */
export const {
  // Use this `Link` component to create links between pages.
  // It automatically adds the current language to the URL.
  Link,

  // A function to get the current page's path.
  getPathname,

  // A function to send users to a different page.
  redirect,

  // A hook to get the current path name inside a component.
  // It smartly removes the language part (e.g., shows `/blog` instead of `/en/blog`).
  usePathname,

  // A hook for navigating between pages programmatically (e.g., after a form submission).
  useRouter,
} = createNavigation(routing);
