import type { Metadata } from "next";
import client from "@/tina/__generated__/client";
import { notFound } from "next/navigation";

import PageLayout from "@/components/layouts/page.layout";

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

  try {
    const [pageRes, globalRes] = await Promise.all([
      client.queries.page({
        relativePath: `${locale}/_index.mdx`,
      }),
      client.queries.global({
        relativePath: `${locale}/_index.mdx`,
      }),
    ]);

    if (!pageRes.data.page) {
      notFound(); // 👈 Trigger 404 if no page data
    }

    return (
      <PageLayout initialPageData={pageRes} initialGlobalData={globalRes} />
    );
  } catch (error) {
    notFound(); // 👈 Trigger 404 on any fetch error
  }
};

export default HomePage;
