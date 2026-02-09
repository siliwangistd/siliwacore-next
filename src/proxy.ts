import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing"; // Adjust path if needed

/**
 * This middleware handles internationalized routing.
 * It detects the user's locale and redirects to the appropriate
 * prefixed path (e.g., `/en/about`).
 */
export default createMiddleware(routing);

export const config = {
  // A list of all paths that should be internationalized.
  // This matcher avoids running the middleware on static files.
  matcher: ["/", "/(en|id)/:path*"],
};
