import type { Metadata } from "next";
import { error as logError } from "console";
import client from "@/tina/__generated__/client";
import { ServiceConnection } from "@/tina/__generated__/types";

import PageLayout from "@/components/layouts/page.layout";
import createSlugMap from "@/src/components/helpers/createSlugMap.helper";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";

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

  if (!page || !global) {
    return {
      title: "Page Not Found",
      description: "The requested content could not be found.",
    };
  }

  const seo = page.seo;
  const siteName = global?.siteInfo?.siteName || "Siliwacore";
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

const HomePage = async (props: HomePageProps) => {
  const { locale } = await props.params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  let slugMap;

  try {
    const [pageRes, globalRes] = await Promise.all([
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

    const hasServiceList = pageRes.data.page.blocks?.some(
      (block) => block?.__typename === "PageBlocksServiceList"
    );

    const servicePromise = hasServiceList
      ? client.queries.serviceConnection({
          filter: {
            draft: {
              eq: false,
            },
            locale: {
              eq: locale,
            },
          },
        })
      : Promise.resolve({ data: null });

    const [serviceRes] = await Promise.all([servicePromise]);

    const filteredServiceEdges =
      serviceRes?.data?.serviceConnection?.edges || [];

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
    return notFound();
  }
};

export default HomePage;
