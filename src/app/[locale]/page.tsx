import type { Metadata } from "next";
import client from "@/tina/__generated__/client";
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

  const [pageRes, globalRes] = await Promise.all([
    client.queries.page({
      relativePath: `${locale}/_index.mdx`,
    }),
    client.queries.global({
      relativePath: `${locale}/_index.mdx`,
    }),
  ]);

  return <PageLayout initialPageData={pageRes} initialGlobalData={globalRes} />;
};

export default HomePage;
