import { Metadata } from "next";
import { notFound } from "next/navigation";
import client from "@/tina/__generated__/client";

import CaseStudyLayout from "@/src/components/layouts/caseStudy.layout";
import { warn } from "console";
import createSlugMap from "@/src/components/helpers/createSlugMap.helper";

type CaseStudyPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const pageRes = await client.queries.caseStudy({
    relativePath: `${locale}/${slug}.mdx`,
  });

  const page = pageRes.data.caseStudy;

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

const CaseStudyPage = async (props: CaseStudyPageProps) => {
  const { params } = props;
  const { locale, slug } = await params;

  let slugMap, caseStudyRes, globalRes;

  try {
    [caseStudyRes, globalRes] = await Promise.all([
      client.queries.caseStudy({
        relativePath: `${locale}/${slug}.mdx`,
      }),
      client.queries.global({
        relativePath: `${locale}/_index.mdx`,
      }),
    ]);

    const translationKey = caseStudyRes.data.caseStudy.translationKey;
    if (translationKey) {
      slugMap = await createSlugMap("caseStudy", translationKey);
    }

    if (!caseStudyRes.data.caseStudy) {
      notFound();
    }

    return (
      <CaseStudyLayout
        initialCaseStudyData={caseStudyRes}
        initialGlobalData={globalRes}
        initialSlugMap={slugMap}
      />
    );
  } catch (error) {
    warn("Error fetching page or global data:", error);
    notFound();
  }
};

export default CaseStudyPage;
