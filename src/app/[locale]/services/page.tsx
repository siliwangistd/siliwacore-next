import type { Metadata } from "next";
import client from "@/tina/__generated__/client";

import PageLayout from "@/components/layouts/page.layout";
import { ServiceConnection } from "@/tina/__generated__/types";
import createSlugMap from "@/src/components/helpers/createSlugMap.helper";
import { warn } from "console";

type ServicesPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;

  const pageRes = await client.queries.page({
    relativePath: `${locale}/_services.mdx`,
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

const ServicesPage = async (props: ServicesPageProps) => {
  const { locale } = await props.params;

  let pageRes, globalRes, slugMap;

  try {
    // --- Step 1: Fetch only the page and global data ---
    // (Note: I corrected your globalRes path from _index.mdx to .mdx)
    [pageRes, globalRes] = await Promise.all([
      client.queries.page({
        relativePath: `${locale}/_services.mdx`,
      }),
      client.queries.global({
        relativePath: `${locale}/_index.mdx`,
      }),
    ]);

    const translationKey = pageRes.data.page.translationKey;
    if (translationKey) {
      slugMap = await createSlugMap("page", translationKey);
    }

    // --- Step 2: Check if the page needs services data ---
    const hasServiceList = pageRes.data.page.blocks?.some(
      (block) => block?.__typename === "PageBlocksServiceList"
    );

    // --- Step 3: Fetch services ONLY if the block exists ---
    const servicePromise = hasServiceList
      ? client.queries.serviceConnection({
          filter: {
            draft: {
              eq: false,
            },
          },
        })
      : Promise.resolve({ data: null });

    const [serviceRes] = await Promise.all([servicePromise]);

    const filteredServiceEdges = (
      serviceRes?.data?.serviceConnection?.edges || []
    ).filter((edge) =>
      edge?.node?._sys.path.startsWith(`src/content/services/${locale}/`)
    );

    return (
      <PageLayout
        initialPageData={pageRes}
        initialGlobalData={globalRes}
        initialServicesData={{
          data: {
            ...serviceRes?.data?.serviceConnection,
            edges: filteredServiceEdges,
          } as ServiceConnection,
        }}
        initialSlugMap={slugMap}
      />
    );
  } catch (error) {
    warn("Error fetching data for ServicesPage:", error);
    return null;
  }
};

export default ServicesPage;
