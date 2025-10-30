import type { Metadata } from "next";
import { error as logError } from "console";
import { notFound } from "next/navigation";
import client from "@/tina/__generated__/client";
import { ServiceConnection } from "@/tina/__generated__/types";

import PageLayout from "@/components/layouts/page.layout";
import createSlugMap from "@/src/components/helpers/createSlugMap.helper";
import { routing } from "@/src/i18n/routing";

/**
 * Defines the shape of the 'params' prop passed to the page from the file system.
 * e.g., /en/some-slug -> { locale: 'en', slug: 'some-slug' }
 */
type RegularPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * generateMetadata (Next.js App Router feature)
 *
 * This function runs on the server to generate the page's <head> metadata.
 * It's separate from the `RegularPage` component so Next.js can stream the UI faster.
 *
 * @param {RegularPageProps} props - The same params the page component receives.
 * @returns {Promise<Metadata>} - The metadata object for Next.js.
 */
export async function generateMetadata({
  params,
}: RegularPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const pageRes = await client.queries.page({
    relativePath: `${locale}/${slug}.mdx`,
  });

  // Safely get data. `page` might be undefined if not found.
  const page = pageRes.data.page;

  // A good fallback for SEO if the page data is missing.
  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested content could not be found.",
    };
  }

  // Construct the page title, using site name and page-specific SEO fields.

  const seo = page.seo;
  const pageTitle = seo?.metaTitle || page.title;
  const pageDescription = seo?.metaDescription || "";
  const pageImage = seo?.ogImage || null;

  const keywords =
    seo?.keywords?.filter((k): k is string => typeof k === "string") || [];

  return {
    // --- Main Meta ---
    title: page.seo?.metaTitle || page.title,
    description: pageDescription,
    keywords: keywords,

    // --- Open Graph (for social sharing) ---
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: pageImage ? [pageImage] : [],
    },

    // --- Twitter Card ---
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: pageImage ? [pageImage] : [],
    },

    // --- Other SEO Fields ---
    alternates: {
      canonical: seo?.canonical || undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  };
}

/**
 * RegularPage (Next.js Server Component)
 *
 * This component fetches all data required for the page.
 * It follows a specific "conditional fetch" pattern:
 * 1. Fetch main page/global data.
 * 2. Check if a specific block (`ServiceList`) exists.
 * 3. *Only if* it exists, make a second request to fetch services.
 *
 * This avoids over-fetching service data on pages that don't need it.
 */
const RegularPage = async (props: RegularPageProps) => {
  // Get the current locale from the URL.
  // Note: `await` is not needed on `props.params` in the App Router.
  const { locale, slug } = await props.params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  let slugMap;

  try {
    // --- Step 1: Fetch critical page and global data ---
    // These are required for *every* page. Fetched in parallel.
    const [pageRes, globalRes] = await Promise.all([
      client.queries.page({
        relativePath: `${locale}/${slug}.mdx`,
      }),
      client.queries.global({
        relativePath: `${locale}/_index.mdx`,
      }),
    ]);

    const translationKey = pageRes.data.page.translationKey;
    if (translationKey) {
      slugMap = await createSlugMap("page", translationKey);
    }

    // --- Step 2: Check if the 'ServiceList' block is used ---
    // We check the page's block data to decide if we need more data.
    const hasServiceList = pageRes.data.page.blocks?.some(
      (block) => block?.__typename === "PageBlocksServiceList"
    );

    // --- Step 3: Conditionally create a promise for services ---
    // This is the core of the optimization.
    // If `hasServiceList` is true, we create a real data-fetching promise.
    // If false, we create a "fake" promise that instantly resolves to `null`.
    // This lets us use the same `Promise.all` logic in Step 4 either way.
    const servicePromise = hasServiceList
      ? client.queries.serviceConnection({
          // THIS IS THE NEW, EFFICIENT PART
          filter: {
            draft: {
              eq: false,
            },
            // Filter by the `locale` field at the database level
            locale: {
              eq: locale,
            },
          },
        })
      : Promise.resolve({ data: null }); // The "fake" promise

    // --- Step 4: Wait for the conditional promise ---
    // This `await` will either get the service data or the `null` value.
    const [serviceRes] = await Promise.all([servicePromise]);

    // --- Step 5: Filter services by locale (The "Constraint") ---
    const filteredServiceEdges =
      serviceRes?.data?.serviceConnection?.edges || [];

    // --- Step 6: Render the layout ---
    // We pass all the data (page, global, and the processed services)
    // down to the `PageLayout` Client Component, which will handle `useTina`
    // and rendering the actual HTML.
    return (
      <PageLayout
        initialPageData={pageRes} // Pass the full Tina response for `useTina`
        initialGlobalData={globalRes} // Pass the full Tina response for `useTina`
        initialServicesData={{
          // We build a `ServiceConnection` object manually
          // with our `filteredServiceEdges`.
          data: {
            ...serviceRes?.data?.serviceConnection,
            edges: filteredServiceEdges,
          } as ServiceConnection,
        }}
        initialSlugMap={slugMap}
      />
    );
  } catch (error) {
    return notFound();
  }
};

export default RegularPage;
