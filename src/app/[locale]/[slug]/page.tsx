import { Metadata } from "next";
import { notFound } from "next/navigation";
import client from "@/tina/__generated__/client";

import PageLayout from "@/components/layouts/page.layout";
import { warn } from "console";
import createSlugMap from "@/src/components/helpers/createSlugMap.helper";

type HomePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const pageRes = await client.queries.page({
    relativePath: `${locale}/${slug}.mdx`,
  });

  const page = pageRes.data.page;

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    openGraph: {
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription || "",
      images: page.seo?.ogImage ? [page.seo.ogImage] : [],
    },
  };
}

const HomePage = async (props: HomePageProps) => {
  const { params } = props;
  const { locale, slug } = await params;

  let pageRes, globalRes, slugMap;

  try {
    // Fetch both queries at the same time for better performance
    [pageRes, globalRes] = await Promise.all([
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

    if (!pageRes.data.page) {
      notFound(); // 👈 Trigger 404 if no page data
    }

    return (
      <PageLayout
        initialPageData={pageRes}
        initialGlobalData={globalRes}
        initialSlugMap={slugMap}
      />
    );
  } catch (error) {
    warn("Error fetching page or global data:", error);
    notFound(); // 👈 Trigger 404 on any fetch error
  }
};

export default HomePage;
