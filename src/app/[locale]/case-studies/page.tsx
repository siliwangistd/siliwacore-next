import type { Metadata } from "next";
import client from "@/tina/__generated__/client";

import PageLayout from "@/components/layouts/page.layout";
import { CaseStudyConnection } from "@/tina/__generated__/types";
import createSlugMap from "@/src/components/helpers/createSlugMap.helper";
import { warn } from "console";

type CaseStudiesPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: CaseStudiesPageProps): Promise<Metadata> {
  const { locale } = await params;

  const pageRes = await client.queries.page({
    relativePath: `${locale}/_case-studies.mdx`,
  });

  const page = pageRes.data.page;

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
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: pageImage ? [pageImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: pageImage ? [pageImage] : [],
    },
    alternates: {
      canonical: seo?.canonical || undefined,
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    },
  };
}

const CaseStudiesPage = async (props: CaseStudiesPageProps) => {
  const { locale } = await props.params;

  let pageRes, globalRes, slugMap;

  try {
    [pageRes, globalRes] = await Promise.all([
      client.queries.page({
        relativePath: `${locale}/_case-studies.mdx`,
      }),
      client.queries.global({
        relativePath: `${locale}/_index.mdx`,
      }),
    ]);

    const translationKey = pageRes.data.page.translationKey;
    if (translationKey) {
      slugMap = await createSlugMap("page", translationKey);
    }

    const hasCaseStudyList = pageRes.data.page.blocks?.some(
      (block) => block?.__typename === "PageBlocksCaseStudyList",
    );

    const caseStudyPromise = hasCaseStudyList
      ? client.queries.caseStudyConnection({
          filter: {
            draft: {
              eq: false,
            },
          },
        })
      : Promise.resolve({ data: null });

    const [caseStudyRes] = await Promise.all([caseStudyPromise]);

    const filteredCaseStudyEdges = (
      caseStudyRes?.data?.caseStudyConnection?.edges || []
    ).filter((edge) =>
      edge?.node?._sys.path.startsWith(`src/content/case-studies/${locale}/`),
    );

    return (
      <PageLayout
        initialPageData={pageRes}
        initialGlobalData={globalRes}
        initialCaseStudiesData={{
          data: {
            ...caseStudyRes?.data?.caseStudyConnection,
            edges: filteredCaseStudyEdges,
          } as CaseStudyConnection,
        }}
        initialSlugMap={slugMap}
      />
    );
  } catch (error) {
    warn("Error fetching data for CaseStudiesPage:", error);
    return null;
  }
};

export default CaseStudiesPage;
