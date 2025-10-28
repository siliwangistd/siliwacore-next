import type { Metadata } from "next";
import client from "@/tina/__generated__/client";

import PageLayout from "@/components/layouts/page.layout";
import { ServiceConnection } from "@/tina/__generated__/types";
import createSlugMap from "@/src/components/helpers/createSlugMap.helper";
import { warn } from "console";

type HomePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  const [pageRes, globalRes] = await Promise.all([
    client.queries.page({
      relativePath: `${locale}/_index.mdx`,
    }),
    client.queries.global({
      relativePath: `${locale}/_index.mdx`,
    }),
  ]);

  const page = pageRes.data.page;
  const global = globalRes.data.global;
  const siteName = global?.siteInfo?.siteName || "Siliwacore";
  const pageTitle = page.seo?.metaTitle || page.title;

  return {
    title: {
      absolute: `${siteName}: ${pageTitle}`,
    },
    description: page.seo?.metaDescription,
    openGraph: {
      title: pageTitle,
      description: page.seo?.metaDescription || "",
      images: page.seo?.ogImage ? [page.seo.ogImage] : [],
    },
  };
}

const HomePage = async (props: HomePageProps) => {
  const { locale } = await props.params;

  let pageRes, globalRes, slugMap;

  try {
    // --- Step 1: Fetch only the page and global data ---
    // (Note: I corrected your globalRes path from _index.mdx to .mdx)
    [pageRes, globalRes] = await Promise.all([
      client.queries.page({
        relativePath: `${locale}/_index.mdx`,
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
    warn("Error fetching data for HomePage:", error);
    return null;
  }
};

export default HomePage;
