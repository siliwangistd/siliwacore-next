/**
 * @file src/app/not-found.tsx (or similar)
 * @summary Renders the customizable 404 "Not Found" page.
 * @description
 * This is the Next.js Server Component that handles rendering the 404 page.
 *
 * Its primary job is to fetch the content for the 404 page (like "Page not
 * found, check your URL") and the global site data (for the header/footer)
 * from TinaCMS.
 *
 * !! KEY ARCHITECTURE !!
 * This page has a critical resilience feature: It will *never* 500.
 * If the TinaCMS data fetching fails for *any* reason (e.g., server is down,
 * or the 'notFound' content is not created for a locale), it catches the
 * error and renders a simple, static `FallbackNotFound` component.
 * This ensures a 404 page always serves a 404 and not a 500.
 */

import client from "@/tina/__generated__/client";
import { getLocale } from "next-intl/server";
import { warn, error as logError } from "console";

import PageLayout from "@/src/components/layouts/page.layout";
import NotFoundTitle from "@/src/components/helpers/notFoundTitle.helper";

/**
 * @component FallbackNotFound
 * @description
 * A hard-coded, static 404 page.
 * This is the "lifesaver" component. It has zero dependencies and cannot fail.
 * It's rendered *only* if the main `NotF` component fails to fetch
 * its content from TinaCMS.
 *
 * FUTURE DEV: If you want to style this, you can, but keep it simple
 * and dependency-free. Do not add data fetching here.
 */
const FallbackNotFound = () => (
  <div
    style={{ padding: "4rem", textAlign: "center", fontFamily: "sans-serif" }}
  >
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

/**
 * @component NotFoundLocale
 * @description
 * The main async Server Component for the 404 page.
 * It fetches the locale and then gets the `notFound` and `global` content
 * from TinaCMS.
 *
 * @returns {Promise<JSX.Element>} A JSX element (either the CMS-driven
 * layout or the fallback).
 */
const NotFoundLocale = async () => {
  const locale = await getLocale();

  try {
    // --- STEP 1: Data Fetching ---
    // Fetch the 404 content and global content (for header/footer)
    // at the same time using Promise.all for parallel execution.
    const [pageRes, globalRes] = await Promise.all([
      client.queries.page({
        relativePath: `${locale}/_404.mdx`,
      }),
      client.queries.global({
        relativePath: `${locale}/_index.mdx`,
      }),
    ]);

    // --- STEP 2: Validation ---
    // After fetching, we must check if the data *actually* exists.
    // If an editor forgets to create the 'notFound' page for the 'id' locale,
    // this check will fail and prevent a crash.
    const notFoundData = pageRes.data;
    const globalData = globalRes.data.global;

    if (!notFoundData || !globalData) {
      // Log this problem for debugging.
      warn(
        `[404 Page] CMS content for 'notFound' or 'global' is missing for locale: ${locale}`
      );
      // Render the safe fallback instead of crashing.
      return <FallbackNotFound />;
    }

    // --- STEP 3: Success ---
    // Pass the full, original Tina responses (not just the data)
    // to the layout. The `NotFoundLayout` (a Client Component)
    // needs the full `query`, `variables`, and `data` objects
    // to power the `useTina` hook for live preview.
    return (
      <>
        <NotFoundTitle title={`${notFoundData?.page.title} | Siliwacore`} />
        <PageLayout initialPageData={pageRes} initialGlobalData={globalRes} />
      </>
    );
  } catch (error) {
    // --- STEP 4: Critical Error Handling ---
    // This `catch` block handles *any* other error (e.g., Tina server
    // is down, network issue, bad query).
    // We log the error for debugging but *still* show the safe fallback.
    logError("[404 Page] Critical error fetching data:", error);
    return <FallbackNotFound />;
  }
};

export default NotFoundLocale;
